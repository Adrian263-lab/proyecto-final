import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración del icono por defecto de Leaflet. Esto es necesario debido a cómo Leaflet maneja los recursos de los marcadores.
const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// El componente MapaUbicacion muestra un mapa estático con la ubicación de una entidad utilizando las coordenadas proporcionadas.
function MapaUbicacion({ latitud, longitud, nombre }) {
    // Validación temprana: Si no hay coordenadas, no renderizamos el mapa para evitar errores de Leaflet y mejorar la UX.
    if (!latitud || !longitud) return null;

    // Conversión de coordenadas a formato numérico para asegurar compatibilidad con Leaflet. Esto es crucial si los datos vienen como strings desde el backend.
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
            aria-label={`Mapa mostrando la ubicación de ${nombre || 'la entidad'}`}
        >
            <MapContainer 
                center={posicion} 
                zoom={15} 
                
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

export default MapaUbicacion;