import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente EditarEvento
 * Permite modificar los detalles de un evento existente.
 * Gestiona la hidratación asíncrona de datos, la previsualización de imágenes (BLOB)
 * y el envío de actualizaciones mediante "Method Spoofing" para compatibilidad con Laravel.
 */
function EditarEvento() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estado estructurado para los datos del evento
    const [evento, setEvento] = useState({ 
        titulo: '', fecha: '', descripcion: '', ubicacion: '', imagen_url: '' 
    });
    
    // Estados para la gestión de la nueva imagen de reemplazo
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(null);

    /**
     * Efecto de hidratación.
     * Recupera los datos originales del evento de forma asíncrona mediante async/await.
     */
    useEffect(() => {
        const cargarEvento = async () => {
            try {
                const res = await api.get(`/eventos/${id}`);
                setEvento(res.data);
            } catch (err) {
                console.error("Fallo de red al recuperar los datos del evento:", err);
                Swal.fire('Error', 'No se pudo cargar la información del evento.', 'error');
                navigate('/panel-protectora');
            }
        };

        cargarEvento();
    }, [id, navigate]);

    /**
     * Prevención de Fugas de Memoria (Memory Leaks):
     * Libera el bloque de RAM asignado al ObjectURL temporal cuando el componente
     * se desmonta o cuando cambia el archivo de previsualización.
     */
    useEffect(() => {
        return () => {
            if (vistaPrevia) {
                URL.revokeObjectURL(vistaPrevia);
            }
        };
    }, [vistaPrevia]);

    /**
     * Interceptor del input file.
     * Captura el archivo binario y genera la previsualización local en caliente.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setNuevaImagen(file);
            setVistaPrevia(URL.createObjectURL(file));
        }
    };

    /**
     * Interceptor de actualización.
     * Empaqueta los datos en FormData y emula el verbo PUT.
     */
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // METHOD SPOOFING: Requerido por Laravel para interceptar payloads multipart 
        // bajo una semántica de actualización (PUT/PATCH).
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
            console.error("Error al sincronizar los cambios del evento:", error);
            Swal.fire('Error', 'No se pudo actualizar el evento. Revisa los campos.', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5 animate-up">
            <h2 className="fw-bold text-huellitas mb-4">📅 Editar Evento</h2>
            
            <form onSubmit={handleUpdate} className="card card-huellitas p-4 bg-white shadow-sm border-0 rounded-4">
                
                {/* Contenedor de persistencia visual de la imagen */}
                <div className="mb-4 text-center">
                    <p className="fw-bold mb-2 text-dark">Imagen del evento:</p>
                    <img 
                        src={vistaPrevia || `${evento.imagen_url}?t=${new Date().getTime()}`} 
                        alt="Previsualización promocional del evento" 
                        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '15px' }} 
                        className="border shadow-sm"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="cambiar_imagen" className="fw-bold mb-2 text-dark">Cambiar Imagen:</label>
                    <input 
                        id="cambiar_imagen"
                        type="file" 
                        className="form-control rounded-pill" 
                        onChange={handleFileChange} 
                        accept="image/*"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="titulo" className="fw-bold mb-2 text-dark">Título del evento</label>
                    <input 
                        id="titulo"
                        className="form-control rounded-pill px-3" 
                        value={evento.titulo} 
                        onChange={e => setEvento({...evento, titulo: e.target.value})} 
                        required 
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="fecha" className="fw-bold mb-2 text-dark">Fecha y hora</label>
                    <input 
                        id="fecha"
                        type="datetime-local" 
                        className="form-control rounded-pill px-3" 
                        value={evento.fecha ? evento.fecha.slice(0, 16) : ''} 
                        onChange={e => setEvento({...evento, fecha: e.target.value})} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="ubicacion" className="fw-bold mb-2 text-dark">Ubicación</label>
                    <input 
                        id="ubicacion"
                        className="form-control rounded-pill px-3" 
                        value={evento.ubicacion} 
                        onChange={e => setEvento({...evento, ubicacion: e.target.value})} 
                        required 
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="descripcion" className="fw-bold mb-2 text-dark">Descripción</label>
                    <textarea 
                        id="descripcion"
                        className="form-control rounded-4 p-3" 
                        rows="4" 
                        value={evento.descripcion} 
                        onChange={e => setEvento({...evento, descripcion: e.target.value})} 
                        required
                    ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                    <button type="button" className="btn btn-light border rounded-pill px-4 fw-bold" onClick={() => navigate('/panel-protectora')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-huellitas text-white rounded-pill px-4 fw-bold shadow-sm">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditarEvento;