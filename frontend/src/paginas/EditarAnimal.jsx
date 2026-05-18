import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function EditarAnimal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [preview, setPreview] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [especies, setEspecies] = useState([]);
    
    const [formData, setFormData] = useState({
        nombre: '',
        estado: '',
        raza: '',
        sexo: 'Macho',
        descripcion: '',
        especie_id: ''
    });

    useEffect(() => {
        // Cargar especies para el select
        api.get('/especies').then(res => setEspecies(res.data)).catch(console.error);

        // Cargar datos del animal
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArchivo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        const data = new FormData();
        data.append('_method', 'PUT'); // Truco para Laravel con multipart/form-data
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
        <div className="container py-5">
            <div className="card shadow-lg border-0 rounded-4">
                <div className="bg-primary p-4 text-white rounded-top-4">
                    <h2 className="mb-0">Editar Peludito</h2>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 text-center mb-4">
                                <img src={preview || '/placeholder.png'} className="img-fluid rounded-4 mb-3 shadow-sm" alt="Previa" style={{maxHeight: '300px', objectFit: 'cover'}} />
                                <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <div className="col-md-8">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-bold">Nombre</label>
                                        <input type="text" className="form-control" value={formData.nombre} required
                                            onChange={e => setFormData({...formData, nombre: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Especie</label>
                                        <select className="form-select" value={formData.especie_id} required
                                            onChange={e => setFormData({...formData, especie_id: e.target.value})}>
                                            <option value="">Seleccione...</option>
                                            {especies.map(esp => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Estado</label>
                                        <select className="form-select" value={formData.estado}
                                            onChange={e => setFormData({...formData, estado: e.target.value})}>
                                            <option value="En adopción">En adopción</option>
                                            <option value="Adoptado">Adoptado</option>
                                            <option value="Urgente">Urgente</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Sexo</label>
                                        <select className="form-select" value={formData.sexo}
                                            onChange={e => setFormData({...formData, sexo: e.target.value})}>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Raza</label>
                                        <input type="text" className="form-control" value={formData.raza}
                                            onChange={e => setFormData({...formData, raza: e.target.value})} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-bold">Descripción</label>
                                        <textarea className="form-control" rows="3" value={formData.descripcion}
                                            onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button type="submit" disabled={cargando} className="btn btn-primary px-5 rounded-pill shadow">
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