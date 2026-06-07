import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

// El componente GestionLogo permite a los usuarios subir y gestionar su imagen de perfil (logo) de manera intuitiva y eficiente.
function GestionLogo() {
  const { user, setUser } = useAuth();
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(user?.logo_url);
  const [cargando, setCargando] = useState(false);

 // Limpieza de blobs temporales para evitar fugas de memoria. Se ejecuta al desmontar el componente o al cambiar el archivo/previsualización.
  useEffect(() => {
    return () => {
      if (archivo && preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [archivo, preview]);

 // Manejo del evento de selección de archivo. Se valida que el archivo sea una imagen antes de procesarlo.
  const alSeleccionarArchivo = (e) => {
    const file = e.target.files[0];
    
    // Validación preventiva en frontend para evitar procesar archivos no válidos
    if (file && file.type.startsWith('image/')) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Función asíncrona para subir la imagen al servidor. Implementa manejo de estado para UX y feedback visual.
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

      // Actualización del contexto de autenticación con la nueva información del usuario tras una respuesta exitosa.
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


export default GestionLogo;