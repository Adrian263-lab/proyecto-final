import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function EditarEvento() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState({ 
        titulo: '', 
        fecha: '', 
        descripcion: '', 
        ubicacion: '' 
    });

    // Cargar los datos del evento al montar el componente
    useEffect(() => {
        api.get(`/eventos/${id}`)
            .then(res => setEvento(res.data))
            .catch(err => console.error("Error al cargar evento:", err));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/eventos/${id}`, evento);
            Swal.fire({
                title: '¡Actualizado!',
                text: 'El evento se ha modificado correctamente.',
                icon: 'success',
                confirmButtonColor: '#6f42c1' // Integrado con tu morado corporativo
            });
            navigate('/panel-protectora');
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el evento.',
                icon: 'error',
                confirmButtonColor: '#6f42c1'
            });
        }
    };

    return (
        // Añadida tu clase nativa de animación global y margen inferior de seguridad
        <div className="container mt-5 mb-5 animate-up">
            {/* Unificado el estilo de la cabecera con el ecosistema de la app */}
            <h2 className="fw-bold text-huellitas mb-4">📅 Editar Evento</h2>
            
            {/* Aplicada tu clase de tarjeta corporativa para unificar sombras y comportamiento */}
            <form onSubmit={handleUpdate} className="card card-huellitas p-4 bg-white">
                <div className="mb-3">
                    <label className="fw-bold mb-2">Título del evento</label>
                    <input className="form-control rounded-pill" value={evento.titulo} onChange={e => setEvento({...evento, titulo: e.target.value})} required />
                </div>
                
                <div className="mb-3">
                    <label className="fw-bold mb-2">Fecha y hora</label>
                    <input type="datetime-local" className="form-control rounded-pill" value={evento.fecha ? evento.fecha.slice(0, 16) : ''} onChange={e => setEvento({...evento, fecha: e.target.value})} required />
                </div>

                <div className="mb-3">
                    <label className="fw-bold mb-2">Ubicación</label>
                    <input className="form-control rounded-pill" value={evento.ubicacion} onChange={e => setEvento({...evento, ubicacion: e.target.value})} required />
                </div>

                <div className="mb-4">
                    <label className="fw-bold mb-2">Descripción</label>
                    {/* El textarea mantiene bordes redondeados consistentes con los inputs */}
                    <textarea className="form-control rounded-4" rows="4" value={evento.descripcion} onChange={e => setEvento({...evento, descripcion: e.target.value})} required></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light border rounded-pill px-4" onClick={() => navigate('/panel-protectora')}>Cancelar</button>
                    {/* Botón oficial .btn-huellitas: recupera el degradado naranja dinámico y la sombra */}
                    <button type="submit" className="btn btn-huellitas text-white px-4">Guardar Cambios</button>
                </div>
            </form>
        </div>
    );
}