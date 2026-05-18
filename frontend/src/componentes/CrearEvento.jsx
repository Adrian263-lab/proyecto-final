import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CrearEvento() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    imagen_url: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Enviamos a la ruta /eventos que definiste en Laravel
      await api.post('/eventos', formData);
      alert('¡Evento creado con éxito!');
      navigate('/'); // Redirigir al inicio para ver el calendario
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Publicar Nuevo Evento</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Título del Evento:</label>
          <input 
            type="text" name="titulo" required value={formData.titulo} onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            placeholder="Ej: Feria de Adopción"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
          <textarea 
            name="descripcion" required value={formData.descripcion} onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
            placeholder="Describe qué se hará en el evento..."
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Fecha y Hora:</label>
            <input 
              type="datetime-local" name="fecha" required value={formData.fecha} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Ubicación:</label>
            <input 
              type="text" name="ubicacion" required value={formData.ubicacion} onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Ej: Parque Central"
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>URL de Imagen (Opcional):</label>
          <input 
            type="url" name="imagen_url" value={formData.imagen_url} onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            placeholder="https://imagen.com/evento.jpg"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#28a745', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Publicando...' : 'Crear Evento'}
        </button>
      </form>
    </div>
  );
}