import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Inicio.css' // Opcional para tus estilos personalizados

export default function Inicio() {
  const [protectoras, setProtectoras] = useState([])
  const [eventos, setEventos] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())

  useEffect(() => {
    // Carga de protectoras
    api.get('/protectoras')
      .then(res => setProtectoras(res.data))
      .catch(err => console.error("Error al cargar protectoras", err))

    // Carga de eventos
    api.get('/eventos')
      .then(res => setEventos(res.data))
      .catch(err => console.error("Error al cargar eventos", err))
  }, [])

  // Función para marcar visualmente los días que tienen eventos
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const tieneEvento = eventos.some(e => 
        new Date(e.fecha).toDateString() === date.toDateString()
      )
      return tieneEvento ? 'dia-resaltado' : null
    }
  }

  // Filtrar eventos del día seleccionado
  const eventosDelDia = eventos.filter(e => 
    new Date(e.fecha).toDateString() === fechaSeleccionada.toDateString()
  )

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '40px', flexDirection: 'row', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: PROTECTORAS */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{ marginBottom: '30px' }}>Protectoras Colaboradoras</h2>
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
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{p.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.8rem', margin: '2px 0' }}>📍 {p.direccion || 'Sin dirección'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: CALENDARIO */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ marginBottom: '30px' }}>Calendario</h2>
          <div style={{ 
            backgroundColor: '#fff', padding: '20px', borderRadius: '15px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #ddd' 
          }}>
            <Calendar 
              onChange={setFechaSeleccionada} 
              value={fechaSeleccionada}
              tileClassName={tileClassName}
              locale="es-ES"
            />

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '1rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                Eventos el {fechaSeleccionada.toLocaleDateString()}
              </h4>
              {eventosDelDia.length > 0 ? (
                eventosDelDia.map(e => (
                  <div key={e.id} style={{ 
                    padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '8px', 
                    marginBottom: '10px', borderLeft: '4px solid #007bff' 
                  }}>
                    <strong style={{ display: 'block' }}>{e.titulo}</strong>
                    <small style={{ color: '#555' }}>📍 {e.ubicacion}</small>
                    <p style={{ margin: '5px 0 0', fontSize: '0.9rem' }}>{e.descripcion}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No hay eventos programados.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}