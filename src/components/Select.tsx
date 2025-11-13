import React from 'react'
import './Select.css'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode
  className?: string
}

export default function Select({ children, className = '', ...rest }: Props) {
  return (
    <div className={`custom-select ${className}`.trim()}>
      <select {...rest}>{children}</select>
    </div>
  )
}
