import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importación de activos para marcadores Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Configuración del icono predeterminado para el marcador.
 */
const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

/**
 * Componente MapaUbicacion: renderiza un mapa estático centrado en una ubicación específica.
 * @param {number|string} latitud - Coordenada de latitud.
 * @param {number|string} longitud - Coordenada de longitud.
 * @param {string} nombre - Nombre descriptivo para el popup.
 */
export default function MapaUbicacion({ latitud, longitud, nombre }) {
    // Retorno nulo si no existen coordenadas válidas
    if (!latitud || !longitud) return null;

    const posicion = [parseFloat(latitud), parseFloat(longitud)];

    return (
        <div 
            className="mt-4" 
            style={{ 
                height: '250px', 
                width: '100%', 
                borderRadius: '1rem', 
                overflow: 'hidden', 
                border: '1px solid #dee2e6' 
            }}
        >
            <MapContainer 
                center={posicion} 
                zoom={15} 
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <Marker position={posicion} icon={iconoDefecto}>
                    <Popup className="fw-bold text-huellitas">
                        {nombre || 'Nuestra ubicación'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}