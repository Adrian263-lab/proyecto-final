import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente GestionUsuarios
 * Panel de administración para la gestión centralizada de usuarios.
 * Implementa operaciones CRUD básicas y filtrado local para optimizar la interfaz.
 */
function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Efecto de inicialización: Recupera el listado de usuarios de forma asíncrona
  useEffect(() => {
    cargarUsuarios();
  }, []);

  /**
   * Obtiene el listado de usuarios mediante el servicio administrativo.
   */
  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/admin/usuarios');
      setUsuarios(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Fallo de red al recuperar el listado de usuarios:", error);
      Swal.fire('Error', 'No se pudo cargar la lista de usuarios desde el servidor.', 'error');
      setCargando(false);
    }
  };

  /**
   * Ejecuta la eliminación lógica/física de un usuario mediante una alerta de confirmación.
   * @param {number} id - ID único del usuario.
   * @param {string} nombre - Nombre del usuario para el feedback de confirmación.
   */
  const handleBorrarUsuario = async (id, nombre, rol) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar usuario?',
      html: `Estás a punto de borrar a <b>${nombre}</b> (${rol}).<br/>Se borrarán también todos sus eventos y animales asociados. ¡Esta acción es irreversible!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, borrar definitivamente',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/admin/usuarios/${id}`);
        Swal.fire('¡Eliminado!', 'El usuario ha sido borrado del sistema correctamente.', 'success');
        
        // Optimización: Eliminación local del elemento en el estado para evitar un re-render global
        setUsuarios(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error("Fallo al ejecutar la eliminación del usuario:", error);
        Swal.fire('Error', 'No se pudo borrar el usuario. Inténtalo de nuevo.', 'error');
      }
    }
  };

  // Renderizado condicional de estado de carga
  if (cargando) {
    return (
      <div className="d-flex justify-content-center mt-5" aria-label="Cargando listado de usuarios">
        <div className="spinner-border" style={{ color: '#6f42c1' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
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
                  <th scope="col" className="px-4 py-3">Nombre</th>
                  <th scope="col" className="py-3">Email</th>
                  <th scope="col" className="py-3">Rol</th>
                  <th scope="col" className="py-3">Estado</th>
                  <th scope="col" className="px-4 py-3 text-end">Acciones</th>
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

export default GestionUsuarios;