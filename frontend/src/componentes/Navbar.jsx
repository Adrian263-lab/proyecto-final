import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../contexto/AuthContext";
import api from '../api/axios';

// El componente Navbar es la barra de navegación principal de la aplicación, adaptándose dinámicamente al estado de autenticación del usuario y proporcionando enlaces relevantes según su rol.
function Navbar() {
    // Consumo del estado global de autenticación
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Escuchar location nos permite reaccionar a cambios de ruta en la SPA
    const location = useLocation(); 
    const [notificaciones, setNotificaciones] = useState([]);

   // useEffect para cargar las notificaciones del usuario cada vez que cambia la ubicación o el estado de autenticación. Esto asegura que el contador de notificaciones esté siempre actualizado.
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

    // Manejo del evento de logout. Se invoca la función de logout del contexto y se redirige al usuario a la página de login.
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

                        
                        {user ? (
                          <>
                            
                            {user.rol === 'particular' && (
                                <li className="nav-item ms-lg-2">
                                    <Link className="nav-link fw-semibold" to="/mis-apadrinamientos">
                                        Mis Apadrinamientos
                                    </Link>
                                </li>
                            )}

                            
                            {user.rol !== 'admin' && (
                                <li className="nav-item ms-lg-2 position-relative">
                                    <Link className="nav-link fw-semibold" to="/notificaciones">
                                        Notificaciones <i className="bi bi-bell-fill text-warning" aria-hidden="true"></i>
                                        
                                        
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

                            
                            {user.rol === 'admin' && (
                                <li className="nav-item ms-lg-3">
                                    <Link className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" to="/admin">
                                        ⚙️ Panel Admin
                                    </Link>
                                </li>
                            )}

                            
                            {user.rol === 'protectora' && (
                                <li className="nav-item ms-lg-3">
                                    <Link className="btn btn-sm btn-huellitas py-2 text-white" to="/panel-protectora">
                                        🏠 Mi Protectora
                                    </Link>
                                </li>
                            )}

                            
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