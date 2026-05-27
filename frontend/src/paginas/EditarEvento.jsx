import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function EditarEvento() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [evento, setEvento] = useState({ 
        titulo: '', fecha: '', descripcion: '', ubicacion: '', imagen_url: '' 
    });
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(null);

    useEffect(() => {
        api.get(`/eventos/${id}`)
            .then(res => setEvento(res.data))
            .catch(err => console.error("Error al cargar evento:", err));
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNuevaImagen(file);
            setVistaPrevia(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT'); 
        formData.append('titulo', evento.titulo);
        formData.append('fecha', evento.fecha);
        formData.append('descripcion', evento.descripcion);
        formData.append('ubicacion', evento.ubicacion);
        
        if (nuevaImagen) {
            formData.append('imagen', nuevaImagen);
        }

        try {
            await api.post(`/eventos/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await Swal.fire({
                title: '¡Actualizado!',
                text: 'El evento se ha modificado correctamente.',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });
            navigate('/panel-protectora');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el evento.', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5 animate-up">
            <h2 className="fw-bold text-huellitas mb-4">📅 Editar Evento</h2>
            
            <form onSubmit={handleUpdate} className="card card-huellitas p-4 bg-white">
                {/* Visualización de Imagen (Actual o Nueva Previa) */}
                <div className="mb-4 text-center">
                    <p className="fw-bold mb-2">Imagen del evento:</p>
                    <img 
                        src={vistaPrevia || `${evento.imagen_url}?t=${new Date().getTime()}`} 
                        alt="Evento" 
                        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '15px' }} 
                    />
                </div>

                <div className="mb-3">
                    <label className="fw-bold mb-2">Cambiar Imagen:</label>
                    <input 
                        type="file" 
                        className="form-control rounded-pill" 
                        onChange={handleFileChange} 
                    />
                </div>

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
                    <textarea className="form-control rounded-4" rows="4" value={evento.descripcion} onChange={e => setEvento({...evento, descripcion: e.target.value})} required></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light border rounded-pill px-4" onClick={() => navigate('/panel-protectora')}>Cancelar</button>
                    <button type="submit" className="btn btn-huellitas text-white px-4">Guardar Cambios</button>
                </div>
            </form>
        </div>
    );
}