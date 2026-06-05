import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './contexto/AuthContext.jsx'; // Importación corregida
import Navbar from './componentes/Navbar.jsx';
import Footer from './componentes/Footer.jsx';
import Inicio from './paginas/Inicio.jsx';
import Login from './paginas/Login.jsx';
import Registro from './paginas/Registro.jsx';
import PanelAdmin from './paginas/PanelAdmin.jsx';
import PanelProtectora from './paginas/PanelProtectora.jsx';
import PanelUsuario from './paginas/PanelUsuario.jsx';
import CrearAnimal from './paginas/CrearAnimal.jsx'; 
import DetalleProtectora from './paginas/DetalleProtectora.jsx';
import DetalleAnimal from './paginas/DetalleAnimal.jsx';
import EditarAnimal from './paginas/EditarAnimal.jsx';
import CrearEvento from './paginas/CrearEvento.jsx';
import EditarEvento from './paginas/EditarEvento.jsx'; 
import EventoDetalle from './paginas/EventoDetalle.jsx';
import CalendarioEvento from './paginas/CalendarioEvento.jsx'; 
import GestionUsuarios from './paginas/GestionUsuarios.jsx'; 
import PanelApadrinamientos from './paginas/PanelApadrinamientos.jsx';
import PanelNotificaciones from './paginas/PanelNotificaciones.jsx';

// Importamos la página de edición de perfil de la protectora
import EditarPerfilProtectora from './paginas/EditarPerfilProtectora.jsx';

/**
 * Componente de orden superior (HOC) 'RutaProtegida'.
 * Implementa el patrón de diseño "Guard" para la navegación del lado del cliente.
 * Intercepta el renderizado de los componentes secundarios basándose en la capa de sesión.
 * * @param {Object} props - Propiedades inyectadas por React Router.
 * @param {JSX.Element} props.children - El componente a renderizar si se supera la validación.
 * @param {string} [props.rolRequerido] - (Opcional) Implementación de RBAC estricto.
 */
function RutaProtegida({ children, rolRequerido }) {
  const { user, loading } = useAuth();

  // Prevención de Flash de Redirección (FOUC de sesión): 
  // Evita expulsar al usuario mientras el contexto aún está hidratando el token desde LocalStorage.
  if (loading) {
    return <div className="text-center mt-5" aria-live="polite">Cargando contexto de seguridad...</div>;
  }
  
  // Capa 1: Validación de Autenticación (AuthN)
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Capa 2: Validación de Autorización (AuthZ - RBAC)
  if (rolRequerido && user.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  // Si ambas capas se superan, se renderiza el componente destino
  return children;
}

/**
 * Componente principal de la aplicación (Entry Point).
 * Establece la topología de la interfaz y el árbol de enrutamiento estático.
 */
function App() {
  return (
    // Proveedor de contexto global inyectado en la raíz de la app
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 container mt-4">
          <Routes>
            {/* ==========================================
                ZONA PUBLICA (Acceso sin restricciones)
               ========================================== */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/protectora/:id" element={<DetalleProtectora />} />
            <Route path="/animal/:id" element={<DetalleAnimal />} />
            <Route path="/evento-detalle/:id" element={<EventoDetalle />} />
            <Route path="/calendario" element={<CalendarioEvento />} />

            {/* ==========================================
                ZONA PRIVADA: Administración
               ========================================== */}
            <Route path="/admin" element={
              <RutaProtegida rolRequerido="admin">
                <PanelAdmin />
              </RutaProtegida>
            } />
            <Route path="/admin/usuarios" element={
              <RutaProtegida rolRequerido="admin">
                <GestionUsuarios />
              </RutaProtegida>
            } />

            {/* ==========================================
                ZONA PRIVADA: Entidades Protectoras
               ========================================== */}
            <Route path="/panel-protectora" element={
              <RutaProtegida rolRequerido="protectora">
                <PanelProtectora />
              </RutaProtegida>
            } />
            <Route path="/panel-protectora/editar-perfil" element={
              <RutaProtegida rolRequerido="protectora">
                <EditarPerfilProtectora />
              </RutaProtegida>
            } />
            <Route path="/nuevo-animal" element={
              <RutaProtegida rolRequerido="protectora">
                <CrearAnimal />
              </RutaProtegida>
            } />
            <Route path="/editar-animal/:id" element={
              <RutaProtegida rolRequerido="protectora">
                <EditarAnimal />
              </RutaProtegida>
            } />
            <Route path="/nuevo-evento" element={
              <RutaProtegida rolRequerido="protectora">
                <CrearEvento />
              </RutaProtegida>
            } />
            <Route path="/editar-evento/:id" element={
              <RutaProtegida rolRequerido="protectora">
                <EditarEvento />
              </RutaProtegida>
            } />

            {/* ==========================================
                ZONA PRIVADA: Acceso Común Autenticado
               ========================================== */}
            <Route path="/mis-apadrinamientos" element={
              <RutaProtegida>
                <PanelApadrinamientos />
              </RutaProtegida>
            } />
            <Route path="/notificaciones" element={
              <RutaProtegida>
                <PanelNotificaciones />
              </RutaProtegida>
            } />
            
            {/* ==========================================
                ZONA PRIVADA: Usuarios Base
               ========================================== */}
            <Route path="/panel-usuario" element={
              <RutaProtegida rolRequerido="particular">
                <PanelUsuario />
              </RutaProtegida>
            } />

            {/* ==========================================
                RUTAS FALLBACK (Manejo de Errores 404 en SPA)
               ========================================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;