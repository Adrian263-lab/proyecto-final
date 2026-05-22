import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../contexto/AuthContext";
import api from '../api/axios';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); 
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        if (user) {
            api.get('/notificaciones')
                .then(res => setNotificaciones(res.data))
                .catch(err => console.error("Error cargando notificaciones:", err));
        }
    }, [user, location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold text-huellitas fs-3" to="/">🐾 Huellitas</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
                                        <Link className="nav-link fw-semibold" to="/mis-apadrinamientos">Mis Apadrinamientos</Link>
                                    </li>
                                )}

                                {/* NOTIFICACIONES */}
                                <li className="nav-item ms-lg-2 position-relative">
                                    <Link className="nav-link fw-semibold" to="/notificaciones">
                                        Notificaciones <i className="bi bi-bell-fill text-warning"></i>
                                        {notificaciones.length > 0 && (
                                            <span 
                                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                                                style={{ fontSize: '0.65rem', padding: '0.4em 0.6em' }}
                                            >
                                                {notificaciones.length > 9 ? '9+' : notificaciones.length}
                                            </span>
                                        )}
                                    </Link>
                                </li>

                                {user.rol === 'admin' && (
                                    <li className="nav-item ms-lg-3">
                                        <Link className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" to="/admin">⚙️ Panel Admin</Link>
                                    </li>
                                )}

                                {user.rol === 'protectora' && (
                                    <li className="nav-item ms-lg-3">
                                        <Link className="btn btn-sm btn-huellitas text-white rounded-pill px-3 fw-bold shadow-sm" to="/panel-protectora">🏠 Mi Protectora</Link>
                                    </li>
                                )}

                                {/* ENLACE AL PANEL SEGÚN EL ROL */}
                                <li className="nav-item ms-lg-3">
                                    <Link 
                                        to={user.rol === 'protectora' ? "/panel-protectora" : "/panel-usuario"} 
                                        className="nav-link text-dark text-decoration-none"
                                    >
                                        Hola, <span className="text-huellitas fw-bold">{user.name}</span>
                                    </Link>
                                </li>

                                <li className="nav-item ms-lg-2">
                                    <button onClick={handleLogout} className="btn btn-light btn-sm rounded-pill px-3 border">Salir</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link fw-semibold" to="/login">Iniciar sesión</Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <Link className="btn btn-huellitas text-white rounded-pill px-4" to="/registro">Registro</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <style>{`.text-huellitas { color: #6f42c1; } .btn-huellitas { background-color: #6f42c1; }`}</style>
        </nav>
    );
}