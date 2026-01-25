import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

const NoteBox = ({ children }: { children?: ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })
  const containerRectRef = useRef<DOMRect | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const posRef = useRef<{ left: number; top: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const STORAGE_KEY = 'notebox_position'

  // compute container rect (prefer .app-main) and init position
  useEffect(() => {
    const updateContainerRect = () => {
      const el = document.querySelector('.app-main') as HTMLElement | null
      containerRectRef.current = el ? el.getBoundingClientRect() : document.body.getBoundingClientRect()
    }
    updateContainerRect()
    const onResize = () => {
      updateContainerRect()
      // if user hasn't moved the note, reinitialize its position
      if (!pos) {
        const width = ref.current?.offsetWidth ?? 200
        const container = containerRectRef.current
        const left = container ? Math.max(container.left + 16, container.right - width - 16) : Math.max(16, window.innerWidth - width - 24)
        const top = container ? container.top + 24 : 80
        setPos({ left, top })
        posRef.current = { left, top }
      }
    }
    window.addEventListener('resize', onResize)
    // initial position
    // try restore from storage first
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { left: number; top: number } | null
        if (parsed) {
          const container = containerRectRef.current
          const width = ref.current?.offsetWidth ?? 200
          const height = ref.current?.offsetHeight ?? 50
          const minLeft = container ? container.left + 8 : 8
          const maxLeft = container ? Math.max(container.left + 8, container.right - width - 8) : Math.max(8, window.innerWidth - width - 8)
          const minTop = container ? container.top + 8 : 8
          const maxTop = container ? Math.max(container.top + 8, container.bottom - height - 8) : Math.max(8, window.innerHeight - height - 8)
          const left = Math.min(Math.max(minLeft, parsed.left), maxLeft)
          const top = Math.min(Math.max(minTop, parsed.top), maxTop)
          setPos({ left, top })
          posRef.current = { left, top }
        }
      }
    } catch {}
    if (!pos) onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [pos])

  // global pointer handlers
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      const width = ref.current?.offsetWidth ?? 200
      const height = ref.current?.offsetHeight ?? 50
      const container = containerRectRef.current
      const minLeft = container ? container.left + 8 : 8
      const maxLeft = container ? Math.max(container.left + 8, container.right - width - 8) : Math.max(8, window.innerWidth - width - 8)
      const minTop = container ? container.top + 8 : 8
      const maxTop = container ? Math.max(container.top + 8, container.bottom - height - 8) : Math.max(8, window.innerHeight - height - 8)
      const left = Math.min(Math.max(minLeft, e.clientX - offsetRef.current.x), maxLeft)
      const top = Math.min(Math.max(minTop, e.clientY - offsetRef.current.y), maxTop)
      setPos({ left, top })
      posRef.current = { left, top }
    }
    const onPointerUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false
        setIsDragging(false)
        // restore possible inline user-select
        try { if (ref.current) ref.current.style.userSelect = '' } catch {}
        // release pointer capture if we stored an id
        try {
          const id = (offsetRef as any).pointerId as number | undefined
          if (id && ref.current?.releasePointerCapture) ref.current.releasePointerCapture(id)
        } catch {}
        // persist last position
        try {
          if (posRef.current) localStorage.setItem(STORAGE_KEY, JSON.stringify(posRef.current))
        } catch {}
      }
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    // store pointer offset
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    // store pointerId for later release
    ;(offsetRef as any).pointerId = e.pointerId
    draggingRef.current = true
    setIsDragging(true)
    // prevent text selection immediately (React state is async)
    try { if (ref.current) ref.current.style.userSelect = 'none' } catch {}
    try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId) } catch {}
    e.preventDefault()
  }

  const style: React.CSSProperties | undefined = pos
    ? { position: 'fixed', left: pos.left, top: pos.top, right: 'auto', zIndex: 1200 }
    : undefined

  const node = (
    <div
      ref={ref}
      className={`note-floating ${isDragging ? 'dragging' : ''}`}
      role="note"
      onPointerDown={handlePointerDown}
      style={style}
    >
      {children}
    </div>
  )

  if (typeof document === 'undefined') return node
  return createPortal(node, document.body)
}

export default NoteBox
