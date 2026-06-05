import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';

/**
 * Componente EditarAnimal
 * Permite la modificación de la ficha de un animal existente.
 * Implementa hidratación de estado asíncrona, previsualización de imágenes (BLOB)
 * y emulación de métodos HTTP para compatibilidad con Laravel.
 */
function EditarAnimal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [preview, setPreview] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [especies, setEspecies] = useState([]);
    
    // Estado unificado del formulario (Single Source of Truth local)
    const [formData, setFormData] = useState({
        nombre: '',
        estado: '',
        raza: '',
        sexo: 'Macho',
        descripcion: '',
        especie_id: ''
    });

    /**
     * Efecto de inicialización e hidratación.
     * Recupera el catálogo de especies y los datos persistidos del animal para rellenar el formulario.
     */
    useEffect(() => {
        const inicializarFormulario = async () => {
            try {
                // Peticiones paralelas asíncronas para mejorar el tiempo de carga
                const [resEspecies, resAnimal] = await Promise.all([
                    api.get('/especies'),
                    api.get(`/animales/${id}`)
                ]);

                setEspecies(resEspecies.data);
                
                // Hidratación del estado del formulario con los datos recibidos
                setFormData({
                    nombre: resAnimal.data.nombre,
                    estado: resAnimal.data.estado,
                    raza: resAnimal.data.raza || '',
                    sexo: resAnimal.data.sexo || 'Macho',
                    descripcion: resAnimal.data.descripcion || '',
                    especie_id: resAnimal.data.especie_id
                });
                
                // Previsualización inicial desde la URL alojada en el backend
                setPreview(resAnimal.data.imagen_url);
            } catch (error) {
                console.error("Error crítico durante la hidratación del componente:", error);
                Swal.fire('Error', 'No se pudo obtener la información del animal', 'error');
                navigate('/panel-protectora');
            }
        };

        inicializarFormulario();
    }, [id, navigate]);

    /**
     * Gestión proactiva de memoria para URLs locales creadas con URL.createObjectURL.
     */
    useEffect(() => {
        return () => {
            if (archivo && preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [archivo, preview]);

    /**
     * Interceptor del input file.
     * Crea un objeto BLOB en memoria para previsualizar la nueva imagen antes de subirla.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setArchivo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    /**
     * Interceptor de guardado.
     * Empaqueta el estado en FormData y aplica "Method Spoofing" para sortear
     * las limitaciones de los empaquetadores multipart de PHP.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        const data = new FormData();
        
        // METHOD SPOOFING: PHP (y por extensión Laravel) no procesa correctamente
        // peticiones multipart/form-data si el verbo HTTP es PUT o PATCH.
        // La solución arquitectónica es enviarlo vía POST, inyectando un campo oculto
        // _method con el verbo real deseado para que el framework lo interprete correctamente.
        data.append('_method', 'PUT'); 
        
        data.append('nombre', formData.nombre);
        data.append('estado', formData.estado);
        data.append('raza', formData.raza);
        data.append('sexo', formData.sexo);
        data.append('descripcion', formData.descripcion);
        data.append('especie_id', formData.especie_id);
        
        // Solo enviamos el archivo si el usuario ha seleccionado una nueva imagen
        if (archivo) {
            data.append('imagen', archivo);
        }

        try {
            await api.post(`/animales/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            Swal.fire('¡Éxito!', 'Ficha de animal actualizada correctamente', 'success');
            navigate('/panel-protectora');
        } catch (error) {
            console.error("Detalles del rechazo del backend:", error.response?.data);
            Swal.fire('Error', 'No se pudieron aplicar los cambios. Verifica los datos introducidos.', 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5 animate-up">
            <div className="card card-huellitas border-0 overflow-hidden shadow-sm">
                
                {/* Cabecera del formulario */}
                <div className="p-4 bg-huellitas-light">
                    <h2 className="mb-0 fw-bold text-huellitas text-center">Editar Ficha de Animal</h2>
                </div>
                
                <div className="card-body p-5">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Columna de imagen (Izquierda) */}
                            <div className="col-md-4 text-center mb-4 d-flex flex-column align-items-center">
                                <label htmlFor="foto_animal" className="form-label fw-bold visually-hidden">
                                    Actualizar fotografía
                                </label>
                                <img 
                                    src={preview || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop'} 
                                    className="img-fluid rounded-4 mb-3 shadow-sm border border-2 border-light" 
                                    alt="Previsualización de la foto del animal" 
                                    style={{maxHeight: '300px', objectFit: 'cover', width: '100%', maxWidth: '300px'}} 
                                />
                                <input 
                                    id="foto_animal"
                                    type="file" 
                                    className="form-control rounded-pill" 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    aria-describedby="fotoHelp"
                                />
                                <div id="fotoHelp" className="form-text mt-2 small">Selecciona una imagen clara y bien iluminada.</div>
                            </div>

                            {/* Columna de campos de formulario (Derecha) */}
                            <div className="col-md-8">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <label htmlFor="nombre" className="form-label fw-bold text-dark">Nombre</label>
                                        <input 
                                            id="nombre"
                                            type="text" 
                                            className="form-control rounded-pill px-3 py-2" 
                                            value={formData.nombre} 
                                            required
                                            onChange={e => setFormData({...formData, nombre: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="especie_id" className="form-label fw-bold text-dark">Especie</label>
                                        <select 
                                            id="especie_id"
                                            className="form-select rounded-pill px-3 py-2" 
                                            value={formData.especie_id} 
                                            required
                                            onChange={e => setFormData({...formData, especie_id: e.target.value})}
                                        >
                                            <option value="" disabled>Seleccione una especie...</option>
                                            {especies.map(esp => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="estado" className="form-label fw-bold text-dark">Estado</label>
                                        <select 
                                            id="estado"
                                            className="form-select rounded-pill px-3 py-2" 
                                            value={formData.estado}
                                            onChange={e => setFormData({...formData, estado: e.target.value})}
                                        >
                                            <option value="En adopción">En adopción</option>
                                            <option value="Adoptado">Adoptado</option>
                                            <option value="Urgente">Urgente</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="sexo" className="form-label fw-bold text-dark">Sexo</label>
                                        <select 
                                            id="sexo"
                                            className="form-select rounded-pill px-3 py-2" 
                                            value={formData.sexo}
                                            onChange={e => setFormData({...formData, sexo: e.target.value})}
                                        >
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="raza" className="form-label fw-bold text-dark">Raza</label>
                                        <input 
                                            id="raza"
                                            type="text" 
                                            className="form-control rounded-pill px-3 py-2" 
                                            value={formData.raza}
                                            onChange={e => setFormData({...formData, raza: e.target.value})} 
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="descripcion" className="form-label fw-bold text-dark">Descripción de carácter y necesidades</label>
                                        <textarea 
                                            id="descripcion"
                                            className="form-control rounded-4 p-3" 
                                            rows="5" 
                                            value={formData.descripcion}
                                            onChange={e => setFormData({...formData, descripcion: e.target.value})}
                                        ></textarea>
                                    </div>
                                </div>
                                
                                {/* Botón de acción */}
                                <div className="mt-5 text-end border-top pt-4">
                                    <button 
                                        type="button" 
                                        className="btn btn-light rounded-pill px-4 py-2 me-3 fw-bold border"
                                        onClick={() => navigate('/panel-protectora')}
                                        disabled={cargando}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={cargando} 
                                        className="btn btn-huellitas rounded-pill px-5 py-2 shadow-sm text-white fw-bold"
                                        aria-busy={cargando}
                                    >
                                        {cargando ? 'Sincronizando...' : 'Guardar Cambios'}
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

export default EditarAnimal;