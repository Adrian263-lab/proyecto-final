import { Link } from 'react-router-dom';

/**
 * Componente ProtectoraCard: muestra un resumen visual de una protectora.
 * Incluye lógica de validación para el logo y estilos base para la tarjeta.
 */
export default function ProtectoraCard({ protectora }) {

  // Validación de URL para evitar recursos externos no deseados o rotos
  const imagenSaneada = !protectora.logo_url || protectora.logo_url.includes('loremflickr.com')
    ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop'
    : protectora.logo_url;

  return (
    <Link to={`/protectora/${protectora.id}`} style={styles.card} className="card-hover-effect">
      <div style={styles.imageContainer}>
        <img
          src={imagenSaneada}
          alt={`Logo de ${protectora.name}`}
          style={styles.logo}
        />
      </div>
      <h3 style={styles.title}>{protectora.name}</h3>
      <p style={styles.text}>📍 {protectora.direccion || 'Dirección no disponible'}</p>
      <p style={styles.text}>📞 {protectora.telefono || 'Sin teléfono'}</p>
    </Link>
  );
}

const styles = {
  card: {
    textDecoration: 'none',
    color: 'inherit',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '15px',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    display: 'block'
  },
  imageContainer: {
    width: '80px',
    height: '80px',
    margin: '0 auto 15px auto',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid #6f42c1'
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  title: { margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold' },
  text: { color: '#666', fontSize: '0.9rem', margin: '5px 0' }
};