import { Link } from 'react-router-dom';

/**
 * Componente ProtectoraCard
 * Actúa como "Dumb Component" (Componente de Presentación) para listar entidades.
 * Implementa programación defensiva para la carga de assets y fallbacks de texto.
 */
function ProtectoraCard({ protectora }) {

  // Saneamiento de capa 1: Validación inicial de la URL contra valores nulos o placeholders temporales.
  const imagenSaneada = !protectora.logo_url || protectora.logo_url.includes('loremflickr.com')
    ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop'
    : protectora.logo_url;

  /**
   * Saneamiento de capa 2 (Defensa en tiempo de ejecución):
   * Si la URL en base de datos es válida (ej. termina en .jpg) pero el servidor externo
   * ha borrado la imagen o está caído, el navegador disparará este evento.
   * Esto evita el clásico icono de "imagen rota" que arruina el diseño del catálogo.
   */
  const manejarErrorImagen = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop';
    // Se anula el listener para prevenir un bucle infinito si el fallback también fallase
    e.target.onerror = null; 
  };

  return (
    <Link 
        to={`/protectora/${protectora.id}`} 
        style={styles.card} 
        className="card-hover-effect"
        aria-label={`Ver perfil y animales de la protectora ${protectora.name}`}
    >
      <div style={styles.imageContainer}>
        <img
          src={imagenSaneada}
          alt={`Logotipo corporativo de ${protectora.name}`}
          style={styles.logo}
          onError={manejarErrorImagen}
        />
      </div>
      <h3 style={styles.title}>{protectora.name}</h3>
      
      {/* Operadores Short-Circuit para garantizar consistencia visual si faltan datos */}
      <p style={styles.text}>📍 {protectora.direccion || 'Dirección no disponible'}</p>
      <p style={styles.text}>📞 {protectora.telefono || 'Sin teléfono'}</p>
    </Link>
  );
}

/**
 * Optimización de Rendimiento (Memory Allocation):
 * Al declarar el objeto 'styles' fuera de la función del componente, 
 * React no tiene que volver a crear estas referencias en memoria 
 * cada vez que el componente se renderiza.
 */
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

export default ProtectoraCard;