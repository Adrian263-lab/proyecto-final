import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

export default function CrearAnimal() {
    const navigate = useNavigate();
    const [especies, setEspecies] = useState([]);
    const [imagen, setImagen] = useState(null); // Estado para el archivo binario
    const [preview, setPreview] = useState(null); // Estado para la vista previa visual
    
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

    // Manejar el cambio de imagen y generar vista previa
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setPreview(URL.createObjectURL(file)); // Crea una URL temporal para ver la foto
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // IMPORTANTE: Usamos FormData para enviar archivos al servidor
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('especie_id', formData.especie_id);
        data.append('estado', formData.estado);
        data.append('raza', formData.raza);
        data.append('sexo', formData.sexo);
        data.append('descripcion', formData.descripcion);
        
        if (imagen) {
            data.append('imagen', imagen); // El nombre 'imagen' debe coincidir con el del controlador Laravel
        }

        try {
            await api.post('/animales', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            Swal.fire({
                title: '¡Añadido!',
                text: 'El peludito ya está en el sistema.',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });
            
            navigate('/panel-protectora');
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el animal. Revisa que la imagen no sea demasiado pesada.', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 p-4 card-huellitas">
                        <h2 className="fw-bold text-huellitas mb-4 text-center">🐾 Registrar nuevo animal</h2>
                        
                        <form onSubmit={handleSubmit} className="row g-3">
                            {/* Vista previa de la imagen seleccionada */}
                            <div className="col-md-12 text-center mb-3">
                                <div className="mx-auto rounded-4 shadow-sm bg-light d-flex align-items-center justify-content-center overflow-hidden" 
                                     style={{ width: '200px', height: '200px', border: '2px dashed #dee2e6' }}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="img-fluid h-100 w-100" style={{objectFit: 'cover'}} />
                                    ) : (
                                        <span className="text-muted small">Sin foto seleccionada</span>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Nombre</label>
                                <input type="text" className="form-control rounded-pill shadow-sm" required
                                    onChange={e => setFormData({...formData, nombre: e.target.value})} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Especie</label>
                                <select className="form-select rounded-pill shadow-sm" required
                                    onChange={e => setFormData({...formData, especie_id: e.target.value})}>
                                    <option value="">Selecciona especie...</option>
                                    {especies.map(esp => (
                                        <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Sexo</label>
                                <select className="form-select rounded-pill shadow-sm" 
                                    onChange={e => setFormData({...formData, sexo: e.target.value})}>
                                    <option value="Macho">Macho</option>
                                    <option value="Hembra">Hembra</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold">Estado</label>
                                <select className="form-select rounded-pill shadow-sm"
                                    onChange={e => setFormData({...formData, estado: e.target.value})}>
                                    <option value="En adopción">En adopción</option>
                                    <option value="Urgente">Urgente</option>
                                    <option value="Reservado">Reservado</option>
                                    <option value="Adoptado">Adoptado</option>
                                </select>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-bold">Raza (opcional)</label>
                                <input type="text" className="form-control rounded-pill shadow-sm" 
                                    placeholder="Ej: Mestizo, Siamés..."
                                    onChange={e => setFormData({...formData, raza: e.target.value})} />
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-bold">Foto del animal</label>
                                <input type="file" className="form-control rounded-pill shadow-sm" 
                                    accept="image/*"
                                    onChange={handleImageChange} />
                                <div className="form-text small ps-2">Sube una foto clara del peludito para que lo encuentren pronto.</div>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-bold">Descripción / Historia</label>
                                <textarea className="form-control shadow-sm" rows="3" 
                                    placeholder="Cuenta su historia para enamorar a los adoptantes..."
                                    style={{borderRadius: '15px'}}
                                    onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                            </div>

                            <div className="col-12 d-flex gap-2 mt-4">
                                <button type="submit" className="btn btn-huellitas flex-grow-1 py-2 shadow">
                                    <i className="bi bi-cloud-arrow-up-fill me-2"></i>Guardar Peludito
                                </button>
                                <button type="button" className="btn btn-light rounded-pill px-4 border shadow-sm" 
                                    onClick={() => navigate('/panel-protectora')}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}