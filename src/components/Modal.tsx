import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  open: boolean
  title?: string
  onClose: () => void
  children?: React.ReactNode
}

export default function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200000,
  }

  const contentStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 700,
    maxHeight: '90%',
    overflow: 'auto',
    padding: 16,
    boxShadow: '0 10px 30px rgba(2,6,23,0.12)',
  }
  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleOverlayClick = () => {
    onClose()
  }

  const modal = (
    <div
      className="modal-overlay"
      style={overlayStyle}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
        ref={contentRef}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">Cerrar</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body)
  }

  return modal
}
