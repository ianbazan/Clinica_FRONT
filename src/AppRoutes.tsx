// AppRoutes.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoute';
import RegistroCita from './pages/RegistroCita';
import HistorialClinico from './pages/HistorialClinico';
import GestorEmpleados from './pages/GestorEmpleados';
import GestionTerapias from './pages/GestionTerapias';
import Calendario from './pages/Calendario';
import { AuthProvider, useAuth } from './auth/mockAuth';
import BannerCarousel from './components/BannerCarousel';

const Nav = () => {
  const { role, loginAs, logout } = useAuth();
  return (
    <header className="app-header">
      <nav className="app-nav">
        <div className="app-nav-left">
          <Link to="/">Inicio</Link>
          <Link to="/registro">Registro cita </Link>
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
  );
};

export default function AppRoutes() {
  const [activeImage, setActiveImage] = useState(null);

  const homeBlocks = [
    { title: "Tipos de Autocuidado", url: "https://i.pinimg.com/736x/fa/41/66/fa4166b28395fae3f8589b2f24cc1812.jpg" },
    { title: "Ques es Salud Mental?", url: "https://i.pinimg.com/736x/e8/0e/dc/e80edc3bfc6b2665b12cf98a7775390e.jpg" },
    { title: "Juntos por un bien", url: "https://i.pinimg.com/736x/81/11/1f/81111fabb273dc4ecb43b79690feadd0.jpg" },
    { title: "Siempre Importa", url: "https://i.pinimg.com/736x/35/0d/bb/350dbb83264f3b9c583ad4a5c4207310.jpg" }
  ];

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Nav />
          <main className="app-main">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="home-container">
                    <h1 className="home-title">
                      BIENVENIDO AL SISTEMA WEB DE GESTIÓN DE ATENCIONES<br/>CLÍNICA PSICOLOGICO NIÑOS FELICES
                    </h1>

                    <BannerCarousel />

                    <p className="home-subtitle">
                      Un espacio donde cada avance florece y cada sonrisa cuenta.
                    </p>

                    <div className="home-blocks">
                      {homeBlocks.map((block, i) => (
                        <div
                          key={i}
                          className="home-box"
                          onClick={() => setActiveImage(block.url)}
                          style={{ cursor: "pointer" }}
                        >
                          {block.title}
                        </div>
                      ))}
                    </div>

                    {/* Modal para mostrar la imagen */}
                    {activeImage && (
                      <div
                        className="modal-overlay"
                        onClick={() => setActiveImage(null)}
                        style={{
                          position: "fixed",
                          inset: 0,
                          background: "rgba(0,0,0,0.6)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1000
                        }}
                      >
                        <img
                          src={activeImage}
                          alt="Referencia"
                          style={{ maxHeight: "80%", maxWidth: "80%", borderRadius: "12px" }}
                        />
                      </div>
                    )}
                  </div>
                }
              />

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
  );
}
