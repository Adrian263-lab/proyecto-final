import { useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente FormularioValoracion
 * Gestiona la captura de feedback de los usuarios hacia las protectoras.
 * Implementa manejo asíncrono lineal para la persistencia de datos.
 *
 * @param {string|number} protectoraId - ID de la entidad a valorar.
 * @param {Function} onGuardar - Callback para actualización de estado del componente padre.
 */
export default function FormularioValoracion({ protectoraId, onGuardar }) {
    // Inicialización de estados. Se establece 5 por defecto para optimizar la UX.
    const [puntuacion, setPuntuacion] = useState(5);
    const [comentario, setComentario] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Petición asíncrona lineal para persistir la valoración
            await api.post(`/protectoras/${protectoraId}/valorar`, { 
                puntuacion, 
                comentario 
            });
            
            Swal.fire({
                title: '¡Gracias!',
                text: 'Tu valoración ha sido enviada.',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });

            // Reseteo del formulario a su estado inicial tras una respuesta 2xx
            setComentario('');
            setPuntuacion(5);

            // Invocación defensiva del callback para refrescar la UI
            if (onGuardar) {
                onGuardar();
            }
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo enviar la valoración.',
                icon: 'error',
                confirmButtonColor: '#6f42c1'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-3 my-3 shadow-sm" aria-label="Formulario de valoración">
            <h5 className="fw-bold">Deja tu opinión</h5>
            
            <label htmlFor="puntuacion" className="form-label small visually-hidden">Calificación</label>
            <select 
                id="puntuacion"
                className="form-select mb-2" 
                value={puntuacion} 
                onChange={(e) => setPuntuacion(Number(e.target.value))}
            >
                {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} estrellas</option>
                ))}
            </select>

            <label htmlFor="comentario" className="form-label small visually-hidden">Comentario</label>
            <textarea 
                id="comentario"
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

export default FormularioValoracion;