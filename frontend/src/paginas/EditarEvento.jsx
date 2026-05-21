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
            Swal.fire('¡Actualizado!', 'El evento se ha modificado correctamente.', 'success');
            navigate('/panel-protectora');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el evento.', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-huellitas mb-4">Editar Evento</h2>
            
            <form onSubmit={handleUpdate} className="p-4 shadow-sm border-0 rounded-4 bg-white">
                <div className="mb-3">
                    <label className="fw-bold">Título del evento</label>
                    <input className="form-control rounded-pill" value={evento.titulo} onChange={e => setEvento({...evento, titulo: e.target.value})} required />
                </div>
                
                <div className="mb-3">
                    <label className="fw-bold">Fecha y hora</label>
                    <input type="datetime-local" className="form-control rounded-pill" value={evento.fecha ? evento.fecha.slice(0, 16) : ''} onChange={e => setEvento({...evento, fecha: e.target.value})} required />
                </div>

                <div className="mb-3">
                    <label className="fw-bold">Ubicación</label>
                    <input className="form-control rounded-pill" value={evento.ubicacion} onChange={e => setEvento({...evento, ubicacion: e.target.value})} required />
                </div>

                <div className="mb-4">
                    <label className="fw-bold">Descripción</label>
                    <textarea className="form-control rounded-3" rows="4" value={evento.descripcion} onChange={e => setEvento({...evento, descripcion: e.target.value})} required></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => navigate('/panel-protectora')}>Cancelar</button>
                    <button type="submit" className="btn btn-huellitas rounded-pill px-4">Guardar Cambios</button>
                </div>
            </form>

            <style>{`
                .text-huellitas { color: #6f42c1; }
                .btn-huellitas { background-color: #6f42c1; color: white; }
                .btn-huellitas:hover { background-color: #5a359d; color: white; }
            `}</style>
        </div>
    );
}