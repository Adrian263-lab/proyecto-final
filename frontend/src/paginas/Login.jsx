import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexto/AuthContext";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Para mostrar mensajes bonitos
    const { login } = useAuth();
    const navigate = useNavigate();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiamos errores previos

        try {
            const user = await login(email, password);
            
            // Redirección según rol
            if (user.rol === 'admin') navigate('/admin');
            else navigate('/');
            
        } catch (err) {
            // Capturamos el mensaje que viene del backend (AuthController)
            if (err.response && err.response.status === 403) {
                setError(err.response.data.message);
            } else {
                setError("Credenciales incorrectas. Inténtalo de nuevo.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    {/* Usamos la clase card-huellitas que creamos en App.css */}
                    <div className="card card-huellitas shadow-lg p-4 border-0">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-huellitas">¡Hola de nuevo!</h2>
                            <p className="text-muted">Inicia sesión para continuar</p>
                        </div>

                        {/* Mostrar error si existe */}
                        {error && (
                            <div className="alert alert-danger border-0 small fw-bold mb-4" role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={manejarSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control rounded-pill px-3" 
                                    placeholder="tu@email.com"
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="form-control rounded-pill px-3" 
                                    placeholder="********"
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>

                            <button type="submit" className="btn btn-huellitas w-100 py-2 shadow-sm">
                                Entrar
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="small text-muted">
                                ¿No tienes cuenta? <a href="/registro" className="text-huellitas fw-bold text-decoration-none">Regístrate</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}