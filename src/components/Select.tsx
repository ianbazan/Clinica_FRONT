import type { SelectHTMLAttributes, ReactNode } from 'react'
import './Select.css'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode
  className?: string
}

export default function Select({ children, className = '', ...rest }: Props) {
  return (
    <div className={`custom-select ${className}`.trim()}>
      <select {...rest}>{children}</select>
    </div>
  )
}
