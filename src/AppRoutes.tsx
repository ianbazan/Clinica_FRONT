import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import RegistroCita from './pages/RegistroCita'
import HistorialClinico from './pages/HistorialClinico'
import GestorEmpleados from './pages/GestorEmpleados'
import GestionTerapias from './pages/GestionTerapias'
import Calendario from './pages/Calendario'
import { AuthProvider, useAuth } from './auth/mockAuth'

const Nav: React.FC = () => {
  const { role, loginAs, logout } = useAuth()
  return (
    <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/">Inicio</Link>
        <Link to="/registro">Registro cita</Link>
        <Link to="/historial">Historial clínico</Link>
        <Link to="/empleados">Gestor empleados</Link>
        <Link to="/terapias">Gestión terapias</Link>
        <Link to="/calendario">Calendario</Link>
        <div style={{ marginLeft: 'auto' }}>
          Rol: <strong>{role ?? 'ninguno'}</strong>
          <button style={{ marginLeft: 8 }} onClick={() => loginAs('Admin')}>Admin</button>
          <button style={{ marginLeft: 8 }} onClick={() => loginAs('Psicologo')}>Psicologo</button>
          <button style={{ marginLeft: 8 }} onClick={() => loginAs('Operadora')}>Operadora</button>
          <button style={{ marginLeft: 8 }} onClick={() => logout()}>Salir</button>
        </div>
      </nav>
    </header>
  )
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <main style={{ padding: 12 }}>
          <Routes>
            <Route path="/" element={<div>Bienvenido a la app de Clínica</div>} />
            <Route path="/registro" element={<ProtectedRoute allowedRoles={["Admin","Operadora"]}><RegistroCita /></ProtectedRoute>} />
            <Route path="/historial" element={<ProtectedRoute allowedRoles={["Admin","Psicologo"]}><HistorialClinico /></ProtectedRoute>} />
            <Route path="/empleados" element={<ProtectedRoute allowedRoles={["Admin"]}><GestorEmpleados /></ProtectedRoute>} />
            <Route path="/terapias" element={<ProtectedRoute allowedRoles={["Admin","Operadora"]}><GestionTerapias /></ProtectedRoute>} />
            <Route path="/calendario" element={<ProtectedRoute allowedRoles={["Admin","Psicologo","Operadora"]}><Calendario /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}
