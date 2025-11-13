import React from 'react'

const NoteBox: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="note-floating" role="note">
      {children}
    </div>
  )
}

export default NoteBox
