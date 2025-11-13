import React, { createContext, useContext, useState } from 'react'

type Role = 'Admin' | 'Psicologo' | 'Operadora' | null

interface AuthContextValue {
  role: Role
  loginAs: (r: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('Admin')
  const loginAs = (r: Role) => setRole(r)
  const logout = () => setRole(null)
  return <AuthContext.Provider value={{ role, loginAs, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthProvider
