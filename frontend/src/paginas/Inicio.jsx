import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import './Inicio.css' 

export default function Inicio() {
  const [protectoras, setProtectoras] = useState([])
  const [proximosEventos, setProximosEventos] = useState([])

  useEffect(() => {
    // 1. Carga de protectoras
    api.get('/protectoras')
      .then(res => setProtectoras(res.data))
      .catch(err => console.error("Error al cargar protectoras", err))

    // 2. Carga de eventos 
    api.get('/eventos')
      .then(res => {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0); 
        
        const futuros = res.data.filter(evento => new Date(evento.fecha) >= hoy)
        setProximosEventos(futuros.slice(0, 3))
      })
      .catch(err => console.error("Error al cargar eventos próximos", err))
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }} className="animate__animated animate__fadeIn">
      
      {/* SECCIÓN BIENVENIDA / HERO */}
      <div style={{ textAlign: 'center', marginBottom: '50px', padding: '40px 20px', backgroundColor: '#f8f9fa', borderRadius: '20px' }}>
        <h1 style={{ color: '#6f42c1', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '10px' }}>🐾 Bienvenido a Huellitas</h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem', margin: '0' }}>Encuentra a tu compañero ideal y apoya a las protectoras locales.</p>
      </div>

      {/* APARTADO: PRÓXIMOS EVENTOS */}
      <div style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold' }}>
            Próximos{' '}
            <Link to="/eventos" className="link-eventos-titulo" style={{ color: '#6f42c1', textDecoration: 'none' }} title="Ir al calendario">
              Eventos 📅
            </Link>
          </h2>
          <Link to="/eventos" style={{ 
            color: '#6f42c1', border: '1px solid #6f42c1', padding: '8px 16px', 
            borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' 
          }}>
            Ver todo el calendario →
          </Link>
        </div>

        {proximosEventos.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #ddd' }}>
            <p style={{ color: '#888', margin: 0, fontStyle: 'italic' }}>No hay eventos programados para las próximas fechas.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {proximosEventos.map(evento => (
              <div key={evento.id} className="tarjeta-evento-home" style={{ 
                backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '15px', 
                overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
              }}>
                
                {/* Cabecera / Imagen con Control de Errores Integrado */}
                <div style={{ height: '160px', width: '100%', overflow: 'hidden', backgroundColor: '#f3f0fc' }}>
                  <img 
                    src={evento.imagen_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'} 
                    alt={evento.titulo} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'; 
                    }}
                  />
                </div>
                
                {/* Cuerpo de la tarjeta */}
                <div style={{ padding: '20px', flexGrow: 1 }}>
                  <span style={{ 
                    display: 'inline-block', backgroundColor: '#f3f0fc', color: '#6f42c1', 
                    fontWeight: 'bold', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '8px', marginBottom: '10px' 
                  }}>
                    {new Date(evento.fecha).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                  </span>
                  <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333' }}>{evento.titulo}</h4>
                  <p style={{ 
                    color: '#666', fontSize: '0.9rem', margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                  }}>{evento.descripcion}</p>
                </div>

                {/* Pie de la tarjeta */}
                <div style={{ padding: '0 20px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#555', fontWeight: '600' }}>📍 {evento.ubicacion}</small>
                  
                  {/* ACTUALIZADO: Enlace definitivo absoluto */}
                  <Link to={`/ver-evento/${evento.id}`} style={{ 
                    backgroundColor: '#6f42c1', color: '#fff', padding: '6px 14px', 
                    borderRadius: '20px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' 
                  }}>
                    Ver más
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr style={{ border: '0', height: '1px', backgroundColor: '#eee', margin: '40px 0' }} />

      {/* SECCIÓN: PROTECTORAS COLABORADORAS */}
      <div>
        <h2 style={{ marginBottom: '30px', fontWeight: 'bold' }}>Protectoras Colaboradoras</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {protectoras.map(p => (
            <Link to={`/protectora/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                border: '1px solid #ddd', borderRadius: '15px', overflow: 'hidden',
                backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{ height: '150px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>🏢</span> 
                  )}
                </div>
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{p.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.8rem', margin: '2px 0' }}>📍 {p.direccion || 'Sin dirección'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .link-eventos-titulo:hover { text-decoration: underline !important; }
        .tarjeta-evento-home { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .tarjeta-evento-home:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(111,66,193,0.12) !important; }
      `}</style>

    </div>
  )
}