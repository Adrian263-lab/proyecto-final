import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function EditarEvento() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado para los campos de texto
    const [evento, setEvento] = useState({ 
        titulo: '', fecha: '', descripcion: '', ubicacion: '' 
    });
    // Estado específico para la nueva imagen
    const [nuevaImagen, setNuevaImagen] = useState(null);

    useEffect(() => {
        api.get(`/eventos/${id}`)
            .then(res => setEvento(res.data))
            .catch(err => console.error("Error al cargar evento:", err));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Usamos FormData para enviar texto + archivo simultáneamente
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Truco para que Laravel reconozca el PUT con archivos
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
            Swal.fire({
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
                {/* Imagen actual */}
                <div className="mb-3 text-center">
                    <p className="fw-bold">Imagen actual:</p>
                    <img src={evento.imagen_url} alt="Evento" style={{ width: '150px', borderRadius: '10px' }} />
                </div>

                {/* Input para nueva imagen */}
                <div className="mb-3">
                    <label className="fw-bold mb-2">Cambiar Imagen:</label>
                    <input 
                        type="file" 
                        className="form-control rounded-pill" 
                        onChange={e => setNuevaImagen(e.target.files[0])} 
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