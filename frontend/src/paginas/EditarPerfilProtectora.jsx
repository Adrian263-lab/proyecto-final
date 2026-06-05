import { useState, useEffect } from 'react';
import api from '../api/axios';
import MapaSelector from '../componentes/MapaSelector';
import Swal from 'sweetalert2';

/**
 * Componente EditarPerfilProtectora: Permite a las protectoras actualizar su perfil,
 * incluyendo datos básicos y su ubicación geográfica mediante un mapa interactivo.
 */
export default function EditarPerfilProtectora() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        direccion: '',
        telefono: '',
        descripcion: '',
        latitud: '',
        longitud: ''
    });

    /**
     * Carga los datos actuales del usuario autenticado al montar el componente.
     */
    useEffect(() => {
        api.get('/user') 
            .then(res => {
                setFormData({
                    name: res.data.name || '',
                    direccion: res.data.direccion || '',
                    telefono: res.data.telefono || '',
                    descripcion: res.data.descripcion || '',
                    latitud: res.data.latitud || '',
                    longitud: res.data.longitud || ''
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar perfil:", err);
                Swal.fire('Error', 'No se pudieron cargar los datos del perfil', 'error');
            });
    }, []);

    /**
     * Maneja el cambio de estado para los inputs de texto convencionales.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Callback para actualizar las coordenadas y la dirección textual recibidas desde el mapa.
     * @param {number} lat - Latitud seleccionada.
     * @param {number} lng - Longitud seleccionada.
     * @param {string} direccionTextual - Dirección resuelta por geocodificación inversa.
     */
    const handleLocationSelect = (lat, lng, direccionTextual) => {
        setFormData(prev => ({
            ...prev,
            latitud: lat,
            longitud: lng,
            // Sobreescribe la dirección solo si la API de geocodificación devolvió un valor válido
            ...(direccionTextual && { direccion: direccionTextual }) 
        }));
    };

    /**
     * Envía la actualización de perfil al servidor mediante petición PUT.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        
        api.put('/perfil-protectora', formData)
            .then(res => {
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Los datos de la protectora y la ubicación se guardaron correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#6f42c1'
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error');
            });
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container mt-5 mb-5 animate-up" style={{ maxWidth: '800px' }}>
            <div className="card card-huellitas border-0 p-4 rounded-4 bg-white shadow-sm">
                <h2 className="fw-bold text-huellitas mb-4">📝 Editar Perfil de la Protectora</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold text-dark">Nombre de la Protectora</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-control rounded-pill px-3" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold text-dark">Teléfono de Contacto</label>
                            <input 
                                type="text" 
                                name="telefono"
                                className="form-control rounded-pill px-3" 
                                value={formData.telefono} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold text-dark">Dirección Postal</label>
                            <input 
                                type="text" 
                                name="direccion"
                                className="form-control rounded-pill px-3 bg-light border-primary" 
                                value={formData.direccion} 
                                onChange={handleChange} 
                                placeholder="Utilice el mapa para seleccionar la ubicación"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold text-dark">Descripción / Historia</label>
                        <textarea 
                            name="descripcion"
                            className="form-control rounded-4 p-3" 
                            rows="4" 
                            value={formData.descripcion} 
                            onChange={handleChange}
                            placeholder="Cuéntale a la comunidad sobre vuestra labor..."
                        ></textarea>
                    </div>

                    {/* Selector de coordenadas mediante mapa */}
                    <div className="mb-5 border rounded-4 overflow-hidden shadow-sm">
                        <MapaSelector 
                            latitudInicial={formData.latitud} 
                            longitudInicial={formData.longitud}
                            onLocationSelect={handleLocationSelect} 
                        />
                    </div>

                    <button type="submit" className="btn btn-huellitas w-100 py-2 rounded-pill shadow-sm">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
}