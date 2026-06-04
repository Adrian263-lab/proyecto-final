import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/AuthContext.jsx';
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

// 🚀 NUEVO: Importamos la página de edición de perfil de la protectora
import EditarPerfilProtectora from './paginas/EditarPerfilProtectora.jsx';

/**
 * Componente de orden superior (HOC) para la protección de rutas.
 * Restringe el acceso a los componentes secundarios evaluando el estado de autenticación y el rol del usuario.
 * * @param {Object} props - Propiedades del componente.
 * @param {JSX.Element} props.children - Componente subordinado que se renderizará si se cumplen los criterios.
 * @param {string} [props.rolRequerido] - Rol específico exigido para conceder el acceso.
 * @returns {JSX.Element} Componente autorizado o redirección condicional.
 */
const RutaProtegida = ({ children, rolRequerido }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (rolRequerido && user.rol !== rolRequerido) {
    return <Navigate to="/" />;
  }

  return children;
};

/**
 * Componente principal de la aplicación.
 * Define la estructura global del sitio, inicializa el proveedor de contexto de autenticación
 * y declara el árbol de enrutamiento del lado del cliente.
 */
function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 container mt-4">
          <Routes>
            {/* ==========================================
                RUTAS PÚBLICAS
               ========================================== */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/protectora/:id" element={<DetalleProtectora />} />
            <Route path="/animal/:id" element={<DetalleAnimal />} />
            <Route path="/evento-detalle/:id" element={<EventoDetalle />} />
            <Route path="/calendario" element={<CalendarioEvento />} />

            {/* ==========================================
                RUTAS PRIVADAS (Administración)
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
                RUTAS PRIVADAS (Gestión de Protectoras)
               ========================================== */}
            <Route path="/panel-protectora" element={
              <RutaProtegida rolRequerido="protectora">
                <PanelProtectora />
              </RutaProtegida>
            } />
            
            {/* 📍 NUEVA RUTA: Editar perfil y ubicación */}
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
                RUTAS PRIVADAS (Usuarios Autenticados Generales)
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
                RUTAS PRIVADAS (Solo Usuarios Particulares)
               ========================================== */}
            <Route path="/panel-usuario" element={
              <RutaProtegida rolRequerido="particular">
                <PanelUsuario />
              </RutaProtegida>
            } />

            {/* ==========================================
                MANEJO DE RUTAS NO DEFINIDAS
               ========================================== */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;