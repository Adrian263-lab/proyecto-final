import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/AuthContext.jsx';
import Navbar from './componentes/Navbar.jsx';
import Footer from './componentes/Footer.jsx'; // Importamos el footer
import Inicio from './paginas/Inicio.jsx';
import Login from './paginas/Login.jsx';
import Registro from './paginas/Registro.jsx';
import PanelAdmin from './paginas/PanelAdmin.jsx';
import PanelProtectora from './paginas/PanelProtectora.jsx';
import CrearAnimal from './paginas/CrearAnimal.jsx'; 
import DetalleProtectora from './paginas/DetalleProtectora.jsx';
import DetalleAnimal from './paginas/DetalleAnimal.jsx';
import EditarAnimal from './paginas/EditarAnimal.jsx';
import CrearEvento from './componentes/CrearEvento.jsx'; 
import EditarEvento from './paginas/EditarEvento.jsx'; 
import EventoDetalle from './paginas/EventoDetalle.jsx';
import CalendarioEvento from './paginas/CalendarioEvento.jsx'; 
import GestionUsuarios from './paginas/GestionUsuarios.jsx'; 
import PanelApadrinamientos from './paginas/PanelApadrinamientos.jsx';
import PanelNotificaciones from './paginas/PanelNotificaciones.jsx';

/**
 * Componente para proteger rutas según el estado de autenticación y el rol.
 */
const RutaProtegida = ({ children, rolRequerido }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (rolRequerido && user.rol !== rolRequerido) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 container mt-4">
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/protectora/:id" element={<DetalleProtectora />} />
            <Route path="/animal/:id" element={<DetalleAnimal />} />
            <Route path="/evento-detalle/:id" element={<EventoDetalle />} />
            <Route path="/calendario" element={<CalendarioEvento />} />

            {/* RUTAS PRIVADAS (Solo Admin) */}
            <Route path="/admin" element={<RutaProtegida rolRequerido="admin"><PanelAdmin /></RutaProtegida>} />
            <Route path="/admin/usuarios" element={<RutaProtegida rolRequerido="admin"><GestionUsuarios /></RutaProtegida>} />

            {/* RUTAS PRIVADAS (Solo Protectoras) */}
            <Route path="/panel-protectora" element={<RutaProtegida rolRequerido="protectora"><PanelProtectora /></RutaProtegida>} />
            <Route path="/nuevo-animal" element={<RutaProtegida rolRequerido="protectora"><CrearAnimal /></RutaProtegida>} />
            <Route path="/editar-animal/:id" element={<RutaProtegida rolRequerido="protectora"><EditarAnimal /></RutaProtegida>} />
            <Route path="/nuevo-evento" element={<RutaProtegida rolRequerido="protectora"><CrearEvento /></RutaProtegida>} />
            <Route path="/editar-evento/:id" element={<RutaProtegida rolRequerido="protectora"><EditarEvento /></RutaProtegida>} />

            {/* RUTAS PRIVADAS (Usuarios Logueados) */}
            <Route path="/mis-apadrinamientos" element={<RutaProtegida><PanelApadrinamientos /></RutaProtegida>} />
            <Route path="/notificaciones" element={<RutaProtegida><PanelNotificaciones /></RutaProtegida>} />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;