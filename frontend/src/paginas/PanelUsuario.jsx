import { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../contexto/AuthContext';

export default function PanelUsuario() {
    const { user, updateUser } = useAuth();
    const [nombre, setNombre] = useState(user?.name || '');
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        // Cargar eventos a los que el usuario se ha inscrito
        api.get('/mis-eventos-inscritos')
            .then(res => setEventos(res.data))
            .catch(err => console.error("Error al cargar eventos:", err));
    }, []);

    const guardarPerfil = async (e) => {
        e.preventDefault();
        try {
            await api.put('/perfil/update', { name: nombre });
            updateUser({ ...user, name: nombre }); // Actualiza el contexto global
            Swal.fire('¡Éxito!', 'Perfil actualizado correctamente', 'success');
        } catch (err) { 
            Swal.fire('Error', 'No se pudo guardar el perfil', 'error'); 
        }
    };

    return (
        <div className="container mt-5 mb-5 animate-up">
            <h2 className="text-huellitas fw-bold mb-4">👤 Mi Perfil</h2>
            
            {/* Tarjeta de perfil estilizada con la clase del proyecto */}
            <div className="card card-huellitas p-4 mb-5 bg-white">
                <form onSubmit={guardarPerfil}>
                    <label className="fw-bold mb-2">Nombre Completo</label>
                    <div className="d-flex gap-2">
                        <input 
                            className="form-control rounded-pill" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                        />
                        {/* Sustituido por tu clase de botón dinámico */}
                        <button className="btn btn-huellitas text-white px-4">Guardar</button>
                    </div>
                </form>
            </div>

            <h3 className="text-huellitas fw-bold mb-4">📅 Mis Eventos Inscritos</h3>
            {eventos.length > 0 ? (
                <div className="row">
                    {eventos.map(e => (
                        <div key={e.id} className="col-md-4 mb-3">
                            {/* Aplicamos .card-huellitas para que tenga el efecto hover sorpresa y la elevación */}
                            <div className="card card-huellitas h-100">
                                <div className="card-body">
                                    <h5 className="fw-bold text-dark">{e.titulo}</h5>
                                    <p className="text-muted small">
                                        {new Date(e.fecha).toLocaleDateString()}
                                    </p>
                                    {/* Aprovechamos el badge-huellitas morado sutil para las ubicaciones */}
                                    <span className="badge badge-huellitas">
                                        📍 {e.ubicacion}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">No estás inscrito en ningún evento actualmente.</p>
            )}
        </div>
    );
}