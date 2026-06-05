import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

/**
 * Componente GestionLogo
 * Encargado de la actualización de la imagen de perfil del usuario.
 * Implementa previsualización local, gestión de memoria y sincronización de estado global.
 */
export default function GestionLogo() {
  const { user, setUser } = useAuth();
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(user?.logo_url);
  const [cargando, setCargando] = useState(false);

  /**
   * Prevención de Memory Leaks:
   * Limpio la URL temporal de memoria cuando el componente se desmonta 
   * o cuando el archivo cambia, optimizando el rendimiento del navegador.
   */
  useEffect(() => {
    return () => {
      if (archivo && preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [archivo, preview]);

  /**
   * Captura el archivo seleccionado y genera un blob temporal para UX inmediata.
   */
  const alSeleccionarArchivo = (e) => {
    const file = e.target.files[0];
    
    // Validación preventiva en frontend para evitar procesar archivos no válidos
    if (file && file.type.startsWith('image/')) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Persistencia del logo mediante FormData para soportar subida de binarios (multipart/form-data).
   */
  const subirImagen = async () => {
    if (!archivo) return;
    
    // Bloqueo de UI para evitar múltiples peticiones concurrentes
    setCargando(true);

    const formData = new FormData();
    formData.append('logo', archivo);

    try {
      const res = await api.post('/perfil/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Sincronización del estado global (Context) y caché local (LocalStorage)
      // para que el logo se actualice instantáneamente en el navbar y otras vistas.
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setArchivo(null);
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Logo actualizado', 
        timer: 1500, 
        showConfirmButton: false 
      });
      
    } catch (error) {
      Swal.fire({
        title: 'Error', 
        text: 'No se pudo subir la imagen. Verifica el tamaño o formato.', 
        icon: 'error',
        confirmButtonColor: '#6f42c1'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
      <div className="text-center">
        <div className="position-relative d-inline-block mb-3">
          <img 
            src={preview || 'https://via.placeholder.com/150?text=LOGO'} 
            className="rounded-circle border border-4 border-huellitas shadow"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            alt={`Logo de perfil de ${user?.name || 'usuario'}`}
          />
          <label 
            htmlFor="input-logo" 
            className="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow" 
            style={{ cursor: 'pointer' }}
            aria-label="Seleccionar nueva imagen de perfil"
          >
            <i className="bi bi-camera-fill" aria-hidden="true"></i>
          </label>
          <input 
            type="file" 
            id="input-logo" 
            className="d-none" 
            accept="image/*" 
            onChange={alSeleccionarArchivo} 
          />
        </div>

        {archivo && (
          <div className="mt-2 animate__animated animate__fadeIn">
            <button 
              onClick={subirImagen} 
              disabled={cargando} 
              className="btn btn-huellitas rounded-pill px-4 me-2"
              aria-busy={cargando}
            >
              {cargando ? 'Guardando...' : 'Confirmar'}
            </button>
            <button 
              onClick={() => { 
                setArchivo(null); 
                setPreview(user?.logo_url); 
              }} 
              className="btn btn-light rounded-pill px-4"
              disabled={cargando}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}