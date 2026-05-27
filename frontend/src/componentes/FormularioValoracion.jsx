import { useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function FormularioValoracion({ protectoraId, onGuardar }) {
    const [puntuacion, setPuntuacion] = useState(5);
    const [comentario, setComentario] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/protectoras/${protectoraId}/valorar`, { puntuacion, comentario });
            Swal.fire('¡Gracias!', 'Tu valoración ha sido enviada.', 'success');
            setComentario('');
            onGuardar(); // Callback para refrescar la lista
        } catch (err) {
            Swal.fire('Error', 'No se pudo enviar la valoración.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-3 my-3 shadow-sm">
            <h5 className="fw-bold">Deja tu opinión</h5>
            <select className="form-select mb-2" value={puntuacion} onChange={(e) => setPuntuacion(e.target.value)}>
                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} estrellas</option>)}
            </select>
            <textarea className="form-control mb-2" placeholder="Tu comentario..." value={comentario} onChange={(e) => setComentario(e.target.value)} />
            <button type="submit" className="btn btn-huellitas">Enviar</button>
        </form>
    );
}