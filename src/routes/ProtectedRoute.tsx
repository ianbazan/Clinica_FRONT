import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/mockAuth'

const ProtectedRoute: React.FC<{ allowedRoles: string[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { role } = useAuth()
  if (!role) return <Navigate to="/" replace />
  if (!allowedRoles.includes(role)) return <div style={{ padding: 16 }}>No autorizado para ver esta página.</div>
  return <>{children}</>
}

export default ProtectedRoute
