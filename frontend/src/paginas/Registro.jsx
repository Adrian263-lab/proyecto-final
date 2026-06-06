import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente Registro
 * Interfaz pública para la creación de nuevas cuentas en la plataforma.
 * Gestiona el enrutamiento condicional basado en el rol (particular vs protectora)
 * y la comunicación asíncrona con el backend.
 */
function Registro() {
  const [rol, setRol] = useState('particular');
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    cif: '', 
    direccion: '', 
    telefono: '' 
  });
  
  const navigate = useNavigate();

  /**
   * Actualiza el estado local del formulario de manera dinámica.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Intercepta el evento de envío, procesa la carga útil y maneja 
   * el flujo de respuestas y errores del servidor.
   */
  const manejarRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Envío del payload combinado con el rol seleccionado
      await api.post('/register', { ...formData, rol });

      // Feedback visual diferenciado por el flujo de negocio de cada rol
      if (rol === 'protectora') {
        await Swal.fire({
          title: '¡Solicitud enviada! 🏢🐾',
          text: 'Tu cuenta de protectora está pendiente de validación por el administrador. Una vez tu solicitud sea aceptada, te llegará un correo de verificación para poder activar tu acceso.',
          icon: 'info',
          confirmButtonColor: '#6f42c1',
          confirmButtonText: 'Entendido'
        });
      } else {
        await Swal.fire({
          title: '¡Casi listo! 🐾',
          text: 'Registro completado con éxito. Por favor, revisa tu bandeja de entrada y verifica tu email para poder iniciar sesión.',
          icon: 'success',
          confirmButtonColor: '#6f42c1',
          confirmButtonText: 'Ir al Login'
        });
      }

      // Redirección segura borrando el registro previo del historial
      navigate('/login', { replace: true });
      
    } catch (err) {
      const erroresLaravel = err.response?.data?.errors;
      let mensajeError = 'Por favor, revisa que los datos sean correctos o que el email no esté ya registrado.';

      // Extracción específica de errores de validación de contraseña
      if (erroresLaravel && erroresLaravel.password) {
        mensajeError = erroresLaravel.password.join(' ');
      }

      Swal.fire({
        title: 'Error en el registro',
        text: mensajeError,
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card card-huellitas shadow-lg p-4 border-0 rounded-4">
            <h2 className="fw-bold text-center mb-4 text-dark">
              Registro de {rol === 'particular' ? 'Usuario' : 'Protectora'}
            </h2>

            {/* Selectores de Rol (Tabs de UI) */}
            <div className="d-flex mb-4 p-1 bg-light rounded-pill shadow-sm" role="group" aria-label="Selección de tipo de cuenta">
              <button
                type="button"
                onClick={() => setRol('particular')}
                disabled={cargando}
                className={`btn flex-grow-1 rounded-pill py-2 border-0 transition-hover ${rol === 'particular' ? 'bg-white shadow-sm fw-bold text-dark' : 'text-muted'}`}
                aria-pressed={rol === 'particular'}
              >
                Particular
              </button>
              <button
                type="button"
                onClick={() => setRol('protectora')}
                disabled={cargando}
                className={`btn flex-grow-1 rounded-pill py-2 border-0 transition-hover ${rol === 'protectora' ? 'bg-success text-white fw-bold shadow-sm' : 'text-muted'}`}
                aria-pressed={rol === 'protectora'}
              >
                Protectora
              </button>
            </div>

            <form onSubmit={manejarRegistro}>
              <div className="mb-3">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Nombre completo o Entidad" 
                  className="form-control rounded-pill px-3 py-2"
                  value={formData.name}
                  onChange={handleChange} 
                  required 
                  disabled={cargando}
                />
              </div>
              <div className="mb-3">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Correo electrónico" 
                  className="form-control rounded-pill px-3 py-2"
                  value={formData.email}
                  onChange={handleChange} 
                  required 
                  disabled={cargando}
                />
              </div>
              <div className="mb-3">
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Contraseña" 
                  className="form-control rounded-pill px-3 py-2"
                  value={formData.password}
                  onChange={handleChange} 
                  required 
                  disabled={cargando}
                />
              </div>

              {/* Campos condicionales exclusivos para el rol de protectora */}
              {rol === 'protectora' && (
                <div className="animate__animated animate__fadeIn">
                  <div className="mb-3">
                    <input 
                      type="text" 
                      name="cif" 
                      placeholder="CIF de la entidad" 
                      className="form-control rounded-pill px-3 py-2"
                      value={formData.cif}
                      onChange={handleChange} 
                      required 
                      disabled={cargando}
                    />
                  </div>
                  <div className="mb-3">
                    <input 
                      type="text" 
                      name="direccion" 
                      placeholder="Dirección física completa" 
                      className="form-control rounded-pill px-3 py-2"
                      value={formData.direccion}
                      onChange={handleChange} 
                      required 
                      disabled={cargando}
                    />
                  </div>
                  <div className="mb-3">
                    <input 
                      type="tel" 
                      name="telefono" 
                      placeholder="Teléfono de contacto" 
                      className="form-control rounded-pill px-3 py-2"
                      value={formData.telefono}
                      onChange={handleChange} 
                      required 
                      disabled={cargando}
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-dark w-100 rounded-pill py-3 mt-3 fw-bold shadow-sm"
                disabled={cargando}
              >
                {cargando ? 'Procesando registro...' : 'Registrarme'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="small text-muted mb-0">
                ¿Ya tienes cuenta? <Link to="/login" className="text-huellitas fw-bold text-decoration-none">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;