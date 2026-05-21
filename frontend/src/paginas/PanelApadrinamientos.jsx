import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function PanelApadrinamientos() {
  const [apadrinamientos, setApadrinamientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarApadrinamientos();
  }, []);

  const cargarApadrinamientos = async () => {
    try {
      const response = await api.get('/mis-apadrinamientos');
      setApadrinamientos(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar apadrinamientos:", error);
      Swal.fire('Error', 'No se pudieron cargar tus apadrinamientos.', 'error');
      setCargando(false);
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
      <h2 className="mb-4 fw-bold" style={{ color: '#6f42c1' }}>💖 Mis Peluditos Apadrinados</h2>
      
      {apadrinamientos.length === 0 ? (
        <div className="alert alert-info bg-white border-0 shadow-sm rounded-4 p-5 text-center">
          <i className="bi bi-heart text-muted fs-1 mb-3 d-block"></i>
          <h4>Aún no estás apadrinando a ningún animal</h4>
          <p className="text-secondary mb-4">Ayuda a las protectoras apadrinando a un peludito mientras encuentra su hogar definitivo.</p>
          <Link to="/" className="btn btn-primary rounded-pill px-4" style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}>
            Explorar animales
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {apadrinamientos.map((item) => {
            const animal = item.animal;
            return (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img 
                      src={animal.imagen_url || 'https://via.placeholder.com/400x300?text=Sin+Foto'} 
                      alt={animal.nombre}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <span className={`position-absolute top-0 end-0 m-2 badge rounded-pill ${animal.estado === 'Adoptado' ? 'bg-success' : 'bg-info'}`}>
                      {animal.estado}
                    </span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{animal.nombre}</h5>
                    <p className="card-text text-muted small mb-2">
                      <i className="bi bi-house-heart me-1"></i> Protectora: <strong>{animal.user?.name || 'Desconocida'}</strong>
                    </p>
                    <p className="card-text text-muted small">
                      Apadrinado desde: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-top-0 pb-3">
                    <Link to={`/animal/${animal.id}`} className="btn btn-outline-secondary w-100 rounded-pill">
                      Ver ficha completa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}