import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución al problema clásico de rutas de assets de Leaflet en empaquetadores (Vite/Webpack)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Configuración global del icono de Leaflet.
 * Sobrescribo los valores por defecto para asegurar que los marcadores se rendericen
 * correctamente en producción, evitando enlaces rotos a las imágenes por defecto.
 */
const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

/**
 * Componente MapaProtectoras
 * Integra Leaflet para la geolocalización visual de las entidades registradas.
 * Implementa carga asíncrona de datos y sanitización preventiva de coordenadas.
 */
export default function MapaProtectoras() {
    const [protectoras, setProtectoras] = useState([]);
    const navigate = useNavigate();
    
    // Fijo las coordenadas iniciales en el centro geográfico del país para una vista global inicial
    const posicionCentral = [40.4637, -3.7492]; 

    useEffect(() => {
        /**
         * Función asíncrona interna para la obtención de datos geográficos.
         * Mantiene el flujo de control lineal y facilita el debug de red.
         */
        const cargarProtectoras = async () => {
            try {
                const res = await api.get('/protectoras');
                
                // Sanitización de datos (Defensive Programming): 
                // Filtro estrictamente las entidades que poseen un par de coordenadas válido.
                // Esto previene excepciones fatales en el renderizado del MapContainer si la BD devuelve valores nulos.
                const conCoordenadas = res.data.filter(p => p.latitud && p.longitud);
                
                setProtectoras(conCoordenadas);
            } catch (error) {
                console.error("Error crítico al cargar las coordenadas para el mapa:", error);
            }
        };

        cargarProtectoras();
    }, []);

    return (
        <div className="card border-0 p-3 rounded-4 bg-white shadow-sm mb-5">
            <h3 className="fw-bold text-huellitas mb-3">📍 Encuentra protectoras cercanas</h3>
            
            <div style={{ height: '450px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                <MapContainer 
                    center={posicionCentral} 
                    zoom={6} 
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    {/* Capa base del mapa utilizando el proveedor gratuito y open-source de OpenStreetMap */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Mapeo dinámico de marcadores */}
                    {protectoras.map(p => (
                        <Marker 
                            key={p.id} 
                            // Casting explícito a Float para asegurar que Leaflet interprete las coordenadas correctamente
                            // independientemente del tipo de dato que devuelva el parser JSON de la API.
                            position={[parseFloat(p.latitud), parseFloat(p.longitud)]}
                            icon={iconoDefecto}
                        >
                            <Popup>
                                <div className="text-center p-1">
                                    <h6 className="fw-bold text-huellitas m-0 mb-1">{p.name}</h6>
                                    <p className="text-muted small mb-2">
                                        {p.direccion || 'Sin dirección indicada'}
                                    </p>
                                    <button 
                                        onClick={() => navigate(`/protectora/${p.id}`)}
                                        className="btn btn-sm btn-huellitas text-white rounded-pill px-3 py-1"
                                    >
                                        Ver Protectora 🐾
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}