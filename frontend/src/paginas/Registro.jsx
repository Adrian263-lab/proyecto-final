import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function Registro() {
  const [rol, setRol] = useState('particular');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', cif: '', direccion: '', telefono: '' });
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', { ...formData, rol });
      
      // 🚀 MENSAJES DE ÉXITO RECONFIGURADOS SEGÚN EL ROL
      if (rol === 'protectora') {
        await Swal.fire({
          title: '¡Solicitud enviada! 🏢🐾',
          text: 'Tu cuenta de protectora está pendiente de validación por el administrador. Una vez tu solicitud sea aceptada, te llegará un correo de verificación para poder activar tu acceso.',
          icon: 'info',
          confirmButtonColor: '#6f42c1', // Morado corporativo de Huellitas
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
      
      navigate('/login');
    } catch (err) {
      Swal.fire({
        title: 'Error en el registro',
        text: err.response?.data?.message || 'Por favor, revisa que el email no esté ya registrado.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card card-huellitas shadow-lg p-4 border-0">
            <h2 className="fw-bold text-center mb-4">Registro de {rol === 'particular' ? 'Usuario' : 'Protectora'}</h2>
            
            {/* TABS DE SELECCIÓN DE ROL */}
            <div className="d-flex mb-4 p-1 bg-light rounded-pill">
              <button 
                type="button"
                onClick={() => setRol('particular')} 
                className={`btn flex-grow-1 rounded-pill py-2 border-0 ${rol === 'particular' ? 'bg-white shadow-sm fw-bold' : 'text-muted'}`}
              >
                Particular
              </button>
              <button 
                type="button"
                onClick={() => setRol('protectora')} 
                className={`btn flex-grow-1 rounded-pill py-2 border-0 ${rol === 'protectora' ? 'bg-success text-white fw-bold shadow-sm' : 'text-muted'}`}
              >
                Protectora
              </button>
            </div>

            <form onSubmit={manejarRegistro}>
              <div className="mb-3">
                <input type="text" placeholder="Nombre" className="form-control rounded-pill px-3" 
                  onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="mb-3">
                <input type="email" placeholder="Email" className="form-control rounded-pill px-3" 
                  onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="mb-3">
                <input type="password" placeholder="Contraseña" className="form-control rounded-pill px-3" 
                  onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>

              {rol === 'protectora' && (
                <div className="animate__animated animate__fadeIn">
                  <div className="mb-3">
                    <input type="text" placeholder="CIF" className="form-control rounded-pill px-3" 
                      onChange={e => setFormData({...formData, cif: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <input type="text" placeholder="Dirección" className="form-control rounded-pill px-3" 
                      onChange={e => setFormData({...formData, direccion: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <input type="text" placeholder="Teléfono" className="form-control rounded-pill px-3" 
                      onChange={e => setFormData({...formData, telefono: e.target.value})} required />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-dark w-100 rounded-pill py-3 mt-3 fw-bold">
                Registrarme
              </button>
            </form>
            
            <div className="text-center mt-3">
               <p className="small text-muted">¿Ya tienes cuenta? <a href="/login" className="text-huellitas fw-bold text-decoration-none">Inicia sesión</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}