import type { ReactNode } from 'react'

const NoteBox = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="note-floating" role="note">
      {children}
    </div>
  )
}

export default NoteBox
