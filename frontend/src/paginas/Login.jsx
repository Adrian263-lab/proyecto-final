import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../contexto/AuthContext";

/**
 * Componente Login
 * Punto de entrada seguro para los usuarios registrados.
 * Gestiona la autenticación, prevención de múltiples envíos y enrutamiento 
 * basado en el control de acceso por roles (RBAC).
 */
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false); // Bloqueo de UI para UX y Seguridad
    
    const { login } = useAuth();
    const navigate = useNavigate();

    /**
     * Interceptor del envío del formulario.
     * Implementa async/await puro para el control de flujo y manejo defensivo de errores HTTP.
     */
    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setCargando(true); // Bloqueamos el botón para evitar saturar la API (Double-Submit)

        try {
            const user = await login(email, password);
            
            // Enrutamiento condicional post-login (RBAC)
            // Se utiliza 'replace: true' para destruir la ruta '/login' del historial del navegador
            if (user.rol === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
            
        } catch (err) {
            // Delegación de errores: Evaluamos los códigos HTTP devueltos por el backend
            if (err.response && err.response.status === 403) {
                // 403 Forbidden: Cuenta existente pero no validada/autorizada
                setError(err.response.data.message);
            } else if (err.response && err.response.status === 401) {
                // 401 Unauthorized: Credenciales erróneas
                setError("Credenciales incorrectas. Inténtalo de nuevo.");
            } else {
                // Fallback para errores 500 o caídas de red
                setError("Error de conexión con el servidor. Inténtalo más tarde.");
            }
        } finally {
            setCargando(false); // Siempre liberamos la UI, falle o acierte la petición
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    {/* Tarjeta de inicio de sesión con estilos corporativos */}
                    <div className="card card-huellitas shadow-lg p-4 border-0 rounded-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-huellitas">¡Hola de nuevo!</h2>
                            <p className="text-muted">Inicia sesión para continuar</p>
                        </div>

                        {/* Visualización condicional de errores con ARIA para accesibilidad */}
                        {error && (
                            <div className="alert alert-danger border-0 small fw-bold mb-4 rounded-3" role="alert" aria-live="assertive">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={manejarSubmit}>
                            <div className="mb-3">
                                <label htmlFor="emailInput" className="form-label fw-bold small">Email</label>
                                <input 
                                    id="emailInput"
                                    type="email" 
                                    className="form-control rounded-pill px-3 py-2" 
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                    disabled={cargando}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="passwordInput" className="form-label fw-bold small">Contraseña</label>
                                <input 
                                    id="passwordInput"
                                    type="password" 
                                    className="form-control rounded-pill px-3 py-2" 
                                    placeholder="********"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    disabled={cargando}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-huellitas w-100 py-2 rounded-pill fw-bold shadow-sm text-white"
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> Autenticando...</>
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="small text-muted">
                                ¿No tienes cuenta? <Link to="/registro" className="text-huellitas fw-bold text-decoration-none">Regístrate</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;