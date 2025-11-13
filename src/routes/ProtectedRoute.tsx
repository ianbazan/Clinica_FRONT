import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/mockAuth'

const ProtectedRoute = ({ allowedRoles, children }: { allowedRoles: string[]; children: ReactNode }) => {
  const { role } = useAuth()
  if (!role) return <Navigate to="/" replace />
  if (!allowedRoles.includes(role)) return <div style={{ padding: 16 }}>No autorizado para ver esta página.</div>
  return <>{children}</>
}

export default ProtectedRoute
