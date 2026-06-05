import { useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente FormularioValoracion: gestiona el envío de reseñas para una protectora específica.
 * @param {string|number} protectoraId - ID de la entidad a valorar.
 * @param {Function} onGuardar - Callback para actualización de estado del componente padre.
 */
export default function FormularioValoracion({ protectoraId, onGuardar }) {
    const [puntuacion, setPuntuacion] = useState(5);
    const [comentario, setComentario] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Envío de la valoración mediante endpoint específico
            await api.post(`/protectoras/${protectoraId}/valorar`, { 
                puntuacion, 
                comentario 
            });
            
            Swal.fire('¡Gracias!', 'Tu valoración ha sido enviada.', 'success');
            setComentario('');
            onGuardar();
        } catch (err) {
            Swal.fire('Error', 'No se pudo enviar la valoración.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-3 my-3 shadow-sm">
            <h5 className="fw-bold">Deja tu opinión</h5>
            
            <select 
                className="form-select mb-2" 
                value={puntuacion} 
                onChange={(e) => setPuntuacion(e.target.value)}
            >
                {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} estrellas</option>
                ))}
            </select>

            <textarea 
                className="form-control mb-2" 
                placeholder="Tu comentario..." 
                value={comentario} 
                onChange={(e) => setComentario(e.target.value)} 
            />
            
            <button type="submit" className="btn btn-huellitas">
                Enviar
            </button>
        </form>
    );
}