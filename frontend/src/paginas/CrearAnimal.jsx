import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function CrearAnimal() {
    const navigate = useNavigate();
    const [especies, setEspecies] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    
    // Estado único para todo el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        especie_id: '',
        estado: 'En adopción',
        raza: '',
        sexo: 'Macho',
        descripcion: '',
    });

    useEffect(() => {
        api.get('/especies')
            .then(res => setEspecies(res.data))
            .catch(err => console.error("Error cargando especies", err));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Creamos FormData para enviar archivos y datos al mismo tiempo
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('especie_id', formData.especie_id);
        data.append('estado', formData.estado);
        data.append('raza', formData.raza);
        data.append('sexo', formData.sexo);
        data.append('descripcion', formData.descripcion);
        
        if (imagen) {
            data.append('imagen', imagen);
        }

        try {
            await api.post('/animales', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            await Swal.fire({
                title: '¡Añadido!',
                text: 'El peludito ya está en el sistema.',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });
            navigate('/panel-protectora');
        } catch (error) {
            // Depuración: Mostramos qué campo falló exactamente
            const errorMessage = error.response?.data?.message || 'Error desconocido';
            const validationErrors = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join('\n') 
                : '';
            
            Swal.fire({
                title: 'Error al guardar',
                text: validationErrors || errorMessage,
                icon: 'error',
                confirmButtonColor: '#6f42c1'
            });
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 p-4">
                        <h2 className="fw-bold text-center mb-4">🐾 Registrar nuevo animal</h2>
                        
                        <form onSubmit={handleSubmit} className="row g-3">
                            {/* Preview */}
                            <div className="col-12 text-center mb-3">
                                <div className="mx-auto rounded-circle overflow-hidden" style={{ width: '150px', height: '150px', border: '2px dashed #6f42c1' }}>
                                    {preview ? <img src={preview} className="w-100 h-100 object-fit-cover" /> : <p className="pt-5 text-muted">Sin foto</p>}
                                </div>
                            </div>

                            {/* Campos */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Nombre</label>
                                <input type="text" className="form-control" required 
                                    onChange={e => setFormData({...formData, nombre: e.target.value})} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Especie</label>
                                <select className="form-select" required 
                                    onChange={e => setFormData({...formData, especie_id: e.target.value})}>
                                    <option value="">Selecciona...</option>
                                    {especies.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Sexo</label>
                                <select className="form-select" onChange={e => setFormData({...formData, sexo: e.target.value})}>
                                    <option value="Macho">Macho</option>
                                    <option value="Hembra">Hembra</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Estado</label>
                                <select className="form-select" onChange={e => setFormData({...formData, estado: e.target.value})}>
                                    <option value="En adopción">En adopción</option>
                                    <option value="Urgente">Urgente</option>
                                    <option value="Reservado">Reservado</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">Descripción</label>
                                <textarea className="form-control" rows="3" onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold">Foto</label>
                                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                            </div>

                            <div className="col-12 mt-4">
                                <button type="submit" className="btn w-100 text-white" style={{backgroundColor: '#6f42c1'}}>Guardar Peludito</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}