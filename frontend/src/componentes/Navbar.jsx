import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexto/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold text-huellitas fs-3" to="/">
                    🐾 Huellitas
                </Link>

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
                                {/* BOTÓN PARA ADMINISTRADOR */}
                                {user.rol === 'admin' && (
                                    <li className="nav-item ms-lg-2">
                                        <Link className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" to="/admin">
                                            ⚙️ Panel Admin
                                        </Link>
                                    </li>
                                )}

                                {/* BOTÓN PARA PROTECTORA */}
                                {user.rol === 'protectora' && (
                                    <li className="nav-item ms-lg-2">
                                        <Link className="btn btn-sm btn-huellitas text-white rounded-pill px-3 fw-bold shadow-sm" to="/panel-protectora">
                                            🏠 Mi Protectora
                                        </Link>
                                    </li>
                                )}

                                <li className="nav-item ms-lg-3">
                                    <span className="nav-link text-dark">
                                        Hola, <span className="text-huellitas fw-bold">{user.name}</span>
                                    </span>
                                </li>

                                <li className="nav-item ms-lg-2">
                                    <button onClick={handleLogout} className="btn btn-light btn-sm rounded-pill px-3 border">
                                        Salir
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/* CAMBIADO: 'Entrar' por 'Iniciar sesión' */}
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link fw-semibold" to="/login">Iniciar sesión</Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <Link className="btn btn-huellitas text-white rounded-pill px-4" to="/registro">
                                        Registro
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}