import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente EditarAnimal: gestiona la modificación de los datos de un animal registrado.
 * Implementa previsualización de imágenes y envío de datos mediante multipart/form-data.
 */
export default function EditarAnimal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [preview, setPreview] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [especies, setEspecies] = useState([]);
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        estado: '',
        raza: '',
        sexo: 'Macho',
        descripcion: '',
        especie_id: ''
    });

    // Carga inicial de especies y datos del animal a editar
    useEffect(() => {
        api.get('/especies').then(res => setEspecies(res.data)).catch(console.error);

        api.get(`/animales/${id}`)
            .then(res => {
                setFormData({
                    nombre: res.data.nombre,
                    estado: res.data.estado,
                    raza: res.data.raza || '',
                    sexo: res.data.sexo || 'Macho',
                    descripcion: res.data.descripcion || '',
                    especie_id: res.data.especie_id
                });
                setPreview(res.data.imagen_url);
            })
            .catch(() => {
                Swal.fire('Error', 'No se pudo obtener el animal', 'error');
                navigate('/panel-protectora');
            });
    }, [id, navigate]);

    // Maneja la selección de archivo y actualización de previsualización local
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArchivo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Envía la actualización al servidor
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        const data = new FormData();
        // Laravel requiere este campo para emular el método PUT en formularios multipart
        data.append('_method', 'PUT'); 
        data.append('nombre', formData.nombre);
        data.append('estado', formData.estado);
        data.append('raza', formData.raza);
        data.append('sexo', formData.sexo);
        data.append('descripcion', formData.descripcion);
        data.append('especie_id', formData.especie_id);
        
        if (archivo) data.append('imagen', archivo);

        try {
            await api.post(`/animales/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('¡Éxito!', 'Animal actualizado correctamente', 'success');
            navigate('/panel-protectora');
        } catch (error) {
            console.error("Error detallado:", error.response?.data);
            Swal.fire('Error', 'No se pudo actualizar. Revisa la consola.', 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5 animate-up">
            <div className="card card-huellitas border-0 overflow-hidden">
                
                {/* Cabecera del formulario */}
                <div className="p-4" style={{ backgroundColor: 'var(--huellitas-purple-light)' }}>
                    <h2 className="mb-0 fw-bold text-huellitas text-center">Editar Peludito</h2>
                </div>
                
                <div className="card-body p-5">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Columna de imagen */}
                            <div className="col-md-4 text-center mb-4">
                                <img 
                                    src={preview || '/placeholder.png'} 
                                    className="img-fluid rounded-4 mb-3 shadow-sm border" 
                                    alt="Previa" 
                                    style={{maxHeight: '300px', objectFit: 'cover', width: '100%'}} 
                                />
                                <input type="file" className="form-control rounded-pill" onChange={handleFileChange} accept="image/*" />
                            </div>

                            {/* Columna de campos de formulario */}
                            <div className="col-md-8">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <label className="form-label fw-bold text-dark">Nombre</label>
                                        <input type="text" className="form-control rounded-pill px-3" value={formData.nombre} required
                                            onChange={e => setFormData({...formData, nombre: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-dark">Especie</label>
                                        <select className="form-select rounded-pill px-3" value={formData.especie_id} required
                                            onChange={e => setFormData({...formData, especie_id: e.target.value})}>
                                            <option value="">Seleccione...</option>
                                            {especies.map(esp => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-dark">Estado</label>
                                        <select className="form-select rounded-pill px-3" value={formData.estado}
                                            onChange={e => setFormData({...formData, estado: e.target.value})}>
                                            <option value="En adopción">En adopción</option>
                                            <option value="Adoptado">Adoptado</option>
                                            <option value="Urgente">Urgente</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-dark">Sexo</label>
                                        <select className="form-select rounded-pill px-3" value={formData.sexo}
                                            onChange={e => setFormData({...formData, sexo: e.target.value})}>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-dark">Raza</label>
                                        <input type="text" className="form-control rounded-pill px-3" value={formData.raza}
                                            onChange={e => setFormData({...formData, raza: e.target.value})} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-bold text-dark">Descripción</label>
                                        <textarea className="form-control rounded-4 p-3" rows="4" value={formData.descripcion}
                                            onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                                    </div>
                                </div>
                                
                                {/* Botón de acción */}
                                <div className="mt-5 text-end">
                                    <button type="submit" disabled={cargando} className="btn btn-huellitas px-5 py-2 shadow-sm">
                                        {cargando ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}