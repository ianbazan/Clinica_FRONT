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
    <header className="app-header">
      <nav className="app-nav">
        <div className="app-nav-left">
          <Link to="/">Inicio</Link>
          <Link to="/registro">Registro cita</Link>
          <Link to="/historial">Historial clínico</Link>
          <Link to="/empleados">Gestor empleados</Link>
          <Link to="/terapias">Gestión terapias</Link>
          <Link to="/calendario">Calendario</Link>
        </div>
        <div className="app-nav-right">
          <span>Rol: <strong>{role ?? 'ninguno'}</strong></span>
          <button className="btn" onClick={() => loginAs('Admin')}>Admin</button>
          <button className="btn" onClick={() => loginAs('Psicologo')}>Psicologo</button>
          <button className="btn" onClick={() => loginAs('Operadora')}>Operadora</button>
          <button className="btn" onClick={() => logout()}>Salir</button>
        </div>
      </nav>
    </header>
  )
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Nav />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<div>BIENVENIDO AL SISTEMA DE GESTIÓN DE ATENCIONES - CLINICA NIÑOS FELICES</div>} />
              <Route path="/registro" element={<ProtectedRoute allowedRoles={["Admin","Operadora"]}><RegistroCita /></ProtectedRoute>} />
              <Route path="/historial" element={<ProtectedRoute allowedRoles={["Admin","Psicologo"]}><HistorialClinico /></ProtectedRoute>} />
              <Route path="/empleados" element={<ProtectedRoute allowedRoles={["Admin"]}><GestorEmpleados /></ProtectedRoute>} />
              <Route path="/terapias" element={<ProtectedRoute allowedRoles={["Admin","Operadora"]}><GestionTerapias /></ProtectedRoute>} />
              <Route path="/calendario" element={<ProtectedRoute allowedRoles={["Admin","Psicologo","Operadora"]}><Calendario /></ProtectedRoute>} />
            </Routes>
          </main>
          <footer className="app-footer">Clínica — © {new Date().getFullYear()}</footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
