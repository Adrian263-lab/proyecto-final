import { Link } from 'react-router-dom';

export default function ProtectoraCard({ protectora }) {
  return (
    <Link to={`/protectora/${protectora.id}`} style={styles.card}>
      <div style={styles.icon}>🏢</div>
      <h3 style={styles.title}>{protectora.name}</h3>
      <p style={styles.text}>📍 {protectora.direccion}</p>
      <p style={styles.text}>📞 {protectora.telefono}</p>
    </Link>
  );
}

const styles = {
  card: { 
    textDecoration: 'none', color: 'inherit', padding: '20px', 
    border: '1px solid #eee', borderRadius: '15px', textAlign: 'center',
    backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s'
  },
  icon: { fontSize: '3rem', marginBottom: '10px' },
  title: { margin: '10px 0', fontSize: '1.2rem' },
  text: { color: '#666', fontSize: '0.9rem', margin: '5px 0' }
};