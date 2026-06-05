import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../contexto/AuthContext";
import api from '../api/axios';

/**
 * Componente Navbar
 * Actúa como enrutador principal y gestor de contexto de sesión.
 * Implementa renderizado condicional basado en RBAC (Role-Based Access Control).
 */
function Navbar() {
    // Consumo del estado global de autenticación
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Escuchar location nos permite reaccionar a cambios de ruta en la SPA
    const location = useLocation(); 
    const [notificaciones, setNotificaciones] = useState([]);

    /**
     * Efecto secundario para mantener las notificaciones sincronizadas.
     * Al incluir 'location' en el array de dependencias, creamos un mecanismo de 
     * actualización pasiva: cada vez que el usuario navega a otra vista, 
     * refrescamos el contador sin necesidad de WebSockets.
     */
    useEffect(() => {
        const cargarNotificaciones = async () => {
            try {
                const res = await api.get('/notificaciones');
                setNotificaciones(res.data);
            } catch (err) {
                console.error("Fallo de red al sincronizar notificaciones:", err);
            }
        };

        // Solo lanzamos la petición si hay una sesión activa
        if (user) {
            cargarNotificaciones();
        }
    }, [user, location]);

    /**
     * Destruye la sesión de usuario y redirige al punto de entrada público.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3" aria-label="Navegación principal">
            <div className="container">
                <Link className="navbar-brand fw-bold text-huellitas fs-3" to="/">🐾 Huellitas</Link>

                <button 
                    className="navbar-toggler border-0" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Alternar navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/">Inicio</Link>
                        </li>

                        {/* Árbol de renderizado condicional según estado de autenticación */}
                        {user ? (
                          <>
                            {/* Accesos exclusivos para Rol: Particular */}
                            {user.rol === 'particular' && (
                                <li className="nav-item ms-lg-2">
                                    <Link className="nav-link fw-semibold" to="/mis-apadrinamientos">
                                        Mis Apadrinamientos
                                    </Link>
                                </li>
                            )}

                            {/* Sistema de notificaciones global (Excluye a los Administradores) */}
                            {user.rol !== 'admin' && (
                                <li className="nav-item ms-lg-2 position-relative">
                                    <Link className="nav-link fw-semibold" to="/notificaciones">
                                        Notificaciones <i className="bi bi-bell-fill text-warning" aria-hidden="true"></i>
                                        
                                        {/* Badge de notificaciones con clamping (límite visual 9+) */}
                                        {notificaciones.length > 0 && (
                                            <span 
                                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm" 
                                                style={{ fontSize: '0.65rem', padding: '0.4em 0.6em' }}
                                                aria-label={`${notificaciones.length} notificaciones sin leer`}
                                            >
                                                {notificaciones.length > 9 ? '9+' : notificaciones.length}
                                                <span className="visually-hidden">mensajes no leídos</span>
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            )}

                            {/* Accesos exclusivos para Rol: Admin */}
                            {user.rol === 'admin' && (
                                <li className="nav-item ms-lg-3">
                                    <Link className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" to="/admin">
                                        ⚙️ Panel Admin
                                    </Link>
                                </li>
                            )}

                            {/* Accesos exclusivos para Rol: Protectora */}
                            {user.rol === 'protectora' && (
                                <li className="nav-item ms-lg-3">
                                    <Link className="btn btn-sm btn-huellitas py-2 text-white" to="/panel-protectora">
                                        🏠 Mi Protectora
                                    </Link>
                                </li>
                            )}

                            {/* Perfil de usuario dinámico */}
                            <li className="nav-item ms-lg-3">
                                <Link 
                                    to={user.rol === 'protectora' ? "/panel-protectora" : "/panel-usuario"} 
                                    className="nav-link text-dark text-decoration-none"
                                >
                                    Hola, <span className="text-huellitas fw-bold">{user.name}</span>
                                </Link>
                            </li>

                            <li className="nav-item ms-lg-2">
                                <button 
                                    onClick={handleLogout} 
                                    className="btn btn-light btn-sm rounded-pill px-3 border text-dark fw-bold"
                                >
                                    Salir
                                </button>
                            </li>
                          </>
                        ) : (
                          /* Renderizado para usuarios anónimos (Guest) */
                          <>
                            <li className="nav-item ms-lg-3">
                                <Link className="nav-link fw-semibold" to="/login">Iniciar sesión</Link>
                            </li>
                            <li className="nav-item ms-lg-2">
                                <Link className="btn btn-huellitas py-2 text-white" to="/registro">Registro</Link>
                            </li>
                          </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;