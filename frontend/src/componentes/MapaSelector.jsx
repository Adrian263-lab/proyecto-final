import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Icono para el marcador
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

/**
 * Subcomponente CapturarClics: gestiona la lógica de selección de coordenadas
 * y la resolución de dirección inversa mediante la API de Nominatim.
 */
function CapturarClics({ setPosicion, onLocationSelect }) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosicion([lat, lng]); 

            try {
                // Petición a Nominatim para geocodificación inversa
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                );
                const data = await response.json();
                
                let direccionTextual = '';

                if (data?.address) {
                    const { road, pedestrian, house_number, city, town, village } = data.address;
                    const calle = road || pedestrian || '';
                    const numero = house_number || '';
                    const ciudad = city || town || village || '';
                    
                    if (calle) {
                        direccionTextual = `${calle} ${numero}, ${ciudad}`.trim().replace(/(^,)|(,$)/g, "");
                    } else {
                        direccionTextual = data.display_name;
                    }
                }

                onLocationSelect(lat, lng, direccionTextual);
            } catch (error) {
                console.error("Error al obtener la dirección:", error);
                onLocationSelect(lat, lng, null);
            }
        },
    });
    return null;
}

/**
 * Componente MapaSelector: proporciona una interfaz interactiva para marcar ubicaciones.
 * @param {number|string} latitudInicial - Latitud inicial.
 * @param {number|string} longitudInicial - Longitud inicial.
 * @param {Function} onLocationSelect - Callback que devuelve lat, lng y dirección.
 */
export default function MapaSelector({ latitudInicial, longitudInicial, onLocationSelect }) {
    const centroPorDefecto = [40.4168, -3.7038]; 
    
    const [posicion, setPosicion] = useState(
        latitudInicial && longitudInicial 
        ? [parseFloat(latitudInicial), parseFloat(longitudInicial)] 
        : null
    );

    return (
        <div className="mb-4">
            <label className="form-label fw-bold text-huellitas">
                📍 Haz clic en el mapa para marcar tu ubicación exacta
            </label>
            <div style={{ height: '300px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <MapContainer 
                    center={posicion || centroPorDefecto} 
                    zoom={posicion ? 13 : 5} 
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CapturarClics setPosicion={setPosicion} onLocationSelect={onLocationSelect} />
                    
                    {posicion && <Marker position={posicion} icon={iconoDefecto} />}
                </MapContainer>
            </div>
        </div>
    );
}