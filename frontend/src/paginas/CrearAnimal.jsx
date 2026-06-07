import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

// El componente CrearAnimal proporciona un formulario completo para que las protectoras puedan registrar nuevos animales en el sistema, incluyendo la carga de una imagen y la selección de su especie.
function CrearAnimal() {
    const navigate = useNavigate();
    const [especies, setEspecies] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    
    // Estado unificado del formulario. Facilita la escalabilidad si se añaden más campos.
    const [formData, setFormData] = useState({
        nombre: '',
        especie_id: '',
        estado: 'En adopción',
        raza: '',
        sexo: 'Macho',
        descripcion: '',
    });

    // Carga inicial del catálogo de especies desde el backend. Se ejecuta una sola vez al montar el componente.
    useEffect(() => {
        const cargarEspecies = async () => {
            try {
                const res = await api.get('/especies');
                setEspecies(res.data);
            } catch (error) {
                console.error("Fallo al inicializar el catálogo de especies:", error);
            }
        };

        cargarEspecies();
    }, []);

    // Limpieza de blobs temporales para evitar fugas de memoria. Se ejecuta al desmontar el componente o al cambiar el archivo/previsualización.
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // Manejo del evento de selección de archivo. Se valida que el archivo sea una imagen antes de procesarlo.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        // Validación preventiva en el frontend para evitar fallos de ejecución
        if (file && file.type.startsWith('image/')) {
            setImagen(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Función asíncrona para manejar el envío del formulario. Utiliza FormData para enviar datos mixtos al backend.
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Construcción de FormData para enviar tanto campos de texto como archivos en una sola petición multipart/form-data
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('especie_id', formData.especie_id);
        data.append('estado', formData.estado);
        data.append('raza', formData.raza);
        data.append('sexo', formData.sexo);
        data.append('descripcion', formData.descripcion);
        
        // Adjuntar la imagen solo si el usuario ha seleccionado una
        if (imagen) {
            data.append('imagen', imagen);
        }

        try {
            await api.post('/animales', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            await Swal.fire({
                title: '¡Añadido!',
                text: 'El animal ya está en el sistema.',
                icon: 'success',
                confirmButtonColor: '#6f42c1'
            });
            
            navigate('/panel-protectora');
        } catch (error) {
            // Manejo defensivo de la respuesta de error de Laravel
            const errorMessage = error.response?.data?.message || 'Error de comunicación con el servidor';
            
            // Extracción y aplanado de los errores de validación de Laravel (Form Request)
            const validationErrors = error.response?.data?.errors 
                ? Object.values(error.response.data.errors).flat().join('\n') 
                : '';
            
            Swal.fire({
                title: 'Error al registrar',
                text: validationErrors || errorMessage,
                icon: 'error',
                confirmButtonColor: '#6f42c1'
            });
        }
    };

    return (
        <div className="container mt-5 mb-5" aria-labelledby="titulo-crear-animal">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 p-4 rounded-4">
                        <h2 id="titulo-crear-animal" className="fw-bold text-center mb-4 text-huellitas">
                            🐾 Registrar nuevo animal
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="row g-3">
                            
                            
                            <div className="col-12 text-center mb-3">
                                <div 
                                    className="mx-auto rounded-circle overflow-hidden position-relative shadow-sm" 
                                    style={{ width: '150px', height: '150px', border: '3px dashed #6f42c1', backgroundColor: '#f8f9fa' }}
                                >
                                    {preview ? (
                                        <img src={preview} className="w-100 h-100 object-fit-cover" alt="Previsualización del animal" />
                                    ) : (
                                        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                                            <i className="bi bi-camera fs-3"></i>
                                            <span className="small">Sin foto</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                                <input 
                                    type="text" 
                                    id="nombre"
                                    className="form-control" 
                                    required 
                                    value={formData.nombre}
                                    onChange={e => setFormData({...formData, nombre: e.target.value})} 
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="especie" className="form-label fw-bold">Especie</label>
                                <select 
                                    id="especie"
                                    className="form-select" 
                                    required 
                                    value={formData.especie_id}
                                    onChange={e => setFormData({...formData, especie_id: e.target.value})}
                                >
                                    <option value="" disabled>Selecciona...</option>
                                    {especies.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="sexo" className="form-label fw-bold">Sexo</label>
                                <select 
                                    id="sexo"
                                    className="form-select" 
                                    value={formData.sexo}
                                    onChange={e => setFormData({...formData, sexo: e.target.value})}
                                >
                                    <option value="Macho">Macho</option>
                                    <option value="Hembra">Hembra</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="estado" className="form-label fw-bold">Estado</label>
                                <select 
                                    id="estado"
                                    className="form-select" 
                                    value={formData.estado}
                                    onChange={e => setFormData({...formData, estado: e.target.value})}
                                >
                                    <option value="En adopción">En adopción</option>
                                    <option value="Reservado">Reservado</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label htmlFor="raza" className="form-label fw-bold">Raza (Opcional)</label>
                                <input 
                                    type="text" 
                                    id="raza"
                                    className="form-control" 
                                    value={formData.raza}
                                    onChange={e => setFormData({...formData, raza: e.target.value})} 
                                />
                            </div>

                            <div className="col-12">
                                <label htmlFor="descripcion" className="form-label fw-bold">Descripción</label>
                                <textarea 
                                    id="descripcion"
                                    className="form-control" 
                                    rows="4" 
                                    value={formData.descripcion}
                                    onChange={e => setFormData({...formData, descripcion: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="col-12">
                                <label htmlFor="imagen" className="form-label fw-bold">Foto del animal</label>
                                <input 
                                    type="file" 
                                    id="imagen"
                                    className="form-control" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                />
                            </div>

                            <div className="col-12 mt-4 pt-3 border-top">
                                <button type="submit" className="btn btn-huellitas w-100 rounded-pill py-2 fw-bold text-white fs-5">
                                    Guardar Animal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default CrearAnimal;