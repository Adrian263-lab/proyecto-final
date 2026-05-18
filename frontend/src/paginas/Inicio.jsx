import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar' 
import 'react-calendar/dist/Calendar.css' 
import api from '../api/axios'
import './Inicio.css' 

export default function Inicio() {
  const [protectoras, setProtectoras] = useState([])
  const [proximosEventos, setProximosEventos] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

  useEffect(() => {
    // 1. Carga de protectoras
    api.get('/protectoras')
      .then(res => setProtectoras(res.data))
      .catch(err => console.error("Error al cargar protectoras", err))

    // 2. Carga de eventos próximos
    api.get('/eventos')
      .then(res => {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        
        const futuros = res.data.filter(evento => new Date(evento.fecha) >= hoy)
        setProximosEventos(futuros.slice(0, 3)) // Mostramos solo los 3 primeros en la Home
      })
      .catch(err => console.error("Error al cargar eventos próximos", err))
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }} className="animate__animated animate__fadeIn">
      
      {/* SECCIÓN BIENVENIDA / HERO */}
      <div style={{ textAlign: 'center', marginBottom: '50px', padding: '40px 20px', backgroundColor: '#f8f9fa', borderRadius: '20px' }}>
        <h1 style={{ color: '#6f42c1', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '10px' }}>🐾 Bienvenido a Huellitas</h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem', margin: '0' }}>Encuentra a tu compañero ideal y apoya a las protectoras locales.</p>
      </div>

      {/* TÍTULO DE LA SECCIÓN DE EVENTOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, fontWeight: 'bold' }}>Próximos Eventos y Agenda 📅</h2>
        <Link to="/calendario" style={{ 
          color: '#6f42c1', border: '1px solid #6f42c1', padding: '8px 16px', 
          borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' 
        }}>
          Ver todo el calendario →
        </Link>
      </div>

      {/* CONTENEDOR PRINCIPAL EN DOS COLUMNAS */}
      <div className="seccion-eventos-container" style={{ 
        display: 'grid', 
        gridTemplateColumns: '2.3fr 1.4fr', 
        gap: '30px',
        alignItems: 'start',
        marginBottom: '50px'
      }}>
        
        {/* COLUMNA IZQUIERDA: TARJETAS DE EVENTOS */}
        <div>
          {proximosEventos.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #ddd' }}>
              <p style={{ color: '#888', margin: 0, fontStyle: 'italic' }}>No hay eventos programados para las próximas fechas.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {proximosEventos.map(evento => (
                <div key={evento.id} className="tarjeta-evento-home" style={{ 
                  backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '15px', 
                  overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
                }}>
                  
                  <div style={{ height: '150px', width: '100%', overflow: 'hidden', backgroundColor: '#f3f0fc' }}>
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
                  
                  <div style={{ padding: '15px', flexGrow: 1 }}>
                    <span style={{ 
                      display: 'inline-block', backgroundColor: '#f3f0fc', color: '#6f42c1', 
                      fontWeight: 'bold', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', marginBottom: '8px' 
                    }}>
                      {new Date(evento.fecha).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    </span>
                    <h5 style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333' }}>{evento.titulo}</h5>
                    <p style={{ 
                      color: '#666', fontSize: '0.85rem', margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                    }}>{evento.descripcion}</p>
                  </div>

                  <div style={{ padding: '0 15px 15px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ color: '#555', fontWeight: '600', fontSize: '0.8rem' }}>📍 {evento.ubicacion}</small>
                    <Link to={`/evento-detalle/${evento.id}`} style={{ 
                      backgroundColor: '#6f42c1', color: '#fff', padding: '5px 12px', 
                      borderRadius: '20px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold' 
                    }}>
                      Ver más
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: WIDGET INTERACTIVO DE CALENDARIO */}
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '20px', 
          padding: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '20px', color: '#333', fontSize: '1.2rem' }}>
            Calendario de Eventos
          </h4>
          
          <div className="contenedor-calendario-personalizado" style={{ width: '100%' }}>
            <Calendar 
              onChange={setFechaSeleccionada} 
              value={fechaSeleccionada}
              locale="es-ES"
            />
          </div>
        </div>

      </div>

      <hr style={{ border: '0', height: '1px', backgroundColor: '#eee', margin: '40px 0' }} />

      {/* SECCIÓN: PROTECTORAS COLABORADORAS */}
      <div>
        <h2 style={{ marginBottom: '30px', fontWeight: 'bold' }}>Protectoras Colaboradoras</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {protectoras.map(p => (
            <Link to={`/protectora/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #ddd', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
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

      {/* Estilos adicionales integrados */}
      <style>{`
        .tarjeta-evento-home { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .tarjeta-evento-home:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(111,66,193,0.12) !important; }
        
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit !important;
        }
        .react-calendar__tile--active {
          background: #6f42c1 !important;
          color: white !important;
          border-radius: 8px;
        }
        .react-calendar__tile--now {
          background: #f3f0fc !important;
          color: #6f42c1 !important;
          font-weight: bold;
          border-radius: 8px;
        }
        
        @media (max-width: 992px) {
          .seccion-eventos-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  )
}