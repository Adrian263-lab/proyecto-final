import { useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

export default function GestionLogo() {
  const { user, setUser } = useAuth();
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(user?.logo_url);
  const [cargando, setCargando] = useState(false);

  const alSeleccionarArchivo = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const subirImagen = async () => {
    if (!archivo) return;
    setCargando(true);

    const formData = new FormData();
    formData.append('logo', archivo);

    try {
      const res = await api.post('/perfil/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 1. Actualizar React
      setUser(res.data.user);
      // 2. Actualizar LocalStorage para que no se pierda al recargar
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setArchivo(null);
      Swal.fire({ icon: 'success', title: 'Logo actualizado', timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error(error.response?.data);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
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
          />
          <label htmlFor="input-logo" className="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow" style={{ cursor: 'pointer' }}>
            <i className="bi bi-camera-fill"></i>
          </label>
          <input type="file" id="input-logo" className="d-none" accept="image/*" onChange={alSeleccionarArchivo} />
        </div>

        {archivo && (
          <div className="mt-2 animate__animated animate__fadeIn">
            <button onClick={subirImagen} disabled={cargando} className="btn btn-huellitas rounded-pill px-4 me-2">
              {cargando ? 'Guardando...' : 'Confirmar'}
            </button>
            <button onClick={() => { setArchivo(null); setPreview(user?.logo_url); }} className="btn btn-light rounded-pill px-4">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}