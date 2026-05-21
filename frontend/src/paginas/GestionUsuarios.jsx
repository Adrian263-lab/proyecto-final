import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      // ✅ AÑADIDO: el prefijo /admin a la ruta
      const response = await api.get('/admin/usuarios');
      setUsuarios(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Swal.fire('Error', 'No se pudo cargar la lista de usuarios.', 'error');
      setCargando(false);
    }
  };

  const handleBorrarUsuario = async (id, nombre, rol) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar usuario?',
      html: `Estás a punto de borrar a <b>${nombre}</b> (${rol}).<br/>Se borrarán también todos sus eventos y animales. ¡Esta acción es irreversible!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, fulminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        // ✅ AÑADIDO: el prefijo /admin a la ruta
        await api.delete(`/admin/usuarios/${id}`);
        Swal.fire('¡Eliminado!', 'El usuario ha sido borrado del sistema.', 'success');
        // Quitamos al usuario borrado de la tabla sin recargar la página
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error al borrar:", error);
        Swal.fire('Error', 'No se pudo borrar el usuario.', 'error');
      }
    }
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" style={{ color: '#6f42c1' }}></div>
      </div>
    );
  }

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      {/* Navegación para volver al panel de admin principal */}
      <Link to="/admin" className="font-semibold hover:underline mb-4 inline-block fw-bold" style={{ color: '#6f42c1', textDecoration: 'none' }}>
        ← Volver al Panel Principal
      </Link>

      <div className="card shadow-sm border-0 rounded-4 mt-2">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <h3 className="mb-0 fw-bold text-dark">👥 Gestión Total de Usuarios</h3>
          <span className="badge px-3 py-2 fs-6 rounded-pill text-white" style={{ backgroundColor: '#6f42c1' }}>
            Total: {usuarios.length}
          </span>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Rol</th>
                  <th className="py-3">Estado</th>
                  <th className="px-4 py-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">No hay otros usuarios registrados en el sistema.</td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="px-4 py-3 fw-semibold">{usuario.name}</td>
                      <td className="py-3 text-secondary">{usuario.email}</td>
                      <td className="py-3">
                        <span className={`badge rounded-pill ${usuario.rol === 'protectora' ? 'bg-info text-white' : 'bg-secondary'}`}>
                          {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">
                        {usuario.rol === 'protectora' ? (
                          usuario.validado ? 
                            <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Aprobada</span> : 
                            <span className="text-warning small fw-bold"><i className="bi bi-clock-fill me-1"></i>Pendiente</span>
                        ) : (
                          <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Activo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button 
                          onClick={() => handleBorrarUsuario(usuario.id, usuario.name, usuario.rol)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold shadow-sm"
                        >
                          <i className="bi bi-trash-fill me-1"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}