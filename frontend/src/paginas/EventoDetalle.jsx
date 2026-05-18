import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // O usar fetch nativo si lo prefieres

function EventoDetalle() {
  const { id } = useParams(); // Extrae el ID de la URL
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Reemplaza con la URL real de tu API de Laravel
    axios.get(`http://tu-vps-ip/api/eventos/${id}`)
      .then(response => {
        setEvento(response.data);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al traer los detalles del evento:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <div className="text-center p-10 text-xl font-semibold">Cargando detalles del evento...</div>;
  }

  if (!evento) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-red-500 font-semibold">El evento no existe.</p>
        <Link to="/" className="text-blue-500 underline mt-4 inline-block">Volver a la Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-[#6366f1] font-semibold hover:underline mb-6 inline-block">
        ← Volver al calendario
      </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {evento.imagen_url && (
          <img 
            src={evento.imagen_url} 
            alt={evento.titulo} 
            className="w-full h-96 object-cover"
          />
        )}
        
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
              🗓️ {new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
            </span>
            <span className="text-gray-600 font-medium">📍 {evento.ubicacion}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{evento.titulo}</h1>
          
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            {evento.descripcion}
          </p>

          <div className="border-t pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Organizado por:</p>
              {/* Si tu API incluye la relación con el usuario/protectora */}
              <p className="font-semibold text-gray-700">{evento.user?.name || "Protectora Colaboradora"}</p>
            </div>
            
            <button className="bg-[#6366f1] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4f46e5] shadow-lg shadow-indigo-100 transition-all">
              Inscribirme / Contactar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoDetalle;