import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Icono de la chincheta
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Subcomponente que detecta los clics en el mapa y busca la dirección
function CapturarClics({ setPosicion, onLocationSelect }) {
    useMapEvents({
        async click(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // 1. Movemos la chincheta visualmente al instante
            setPosicion([lat, lng]); 

            try {
                // 2. Llamamos a la API gratuita de OpenStreetMap (Nominatim)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                const data = await response.json();
                
                let direccionTextual = '';

                if (data && data.address) {
                    // Intentamos construir una dirección lógica
                    const calle = data.address.road || data.address.pedestrian || '';
                    const numero = data.address.house_number || '';
                    const ciudad = data.address.city || data.address.town || data.address.village || '';
                    
                    if (calle) {
                        direccionTextual = `${calle} ${numero}, ${ciudad}`.trim();
                        // Limpiamos comas al final por si no había número
                        direccionTextual = direccionTextual.replace(/(^,)|(,$)/g, ""); 
                    } else {
                        // Si falla la estructura, damos el nombre genérico que nos da la API
                        direccionTextual = data.display_name;
                    }
                }

                // 3. Enviamos Lat, Lng Y la Dirección al componente Padre
                onLocationSelect(lat, lng, direccionTextual);

            } catch (error) {
                console.error("Error obteniendo la dirección:", error);
                // Si la API falla (ej. sin internet), enviamos solo las coordenadas para no bloquear
                onLocationSelect(lat, lng, null);
            }
        },
    });
    return null;
}

export default function MapaSelector({ latitudInicial, longitudInicial, onLocationSelect }) {
    // Por defecto centramos en España si no tiene coordenadas previas
    const centroPorDefecto = [40.4168, -3.7038]; 
    
    const [posicion, setPosicion] = useState(
        latitudInicial && longitudInicial 
        ? [parseFloat(latitudInicial), parseFloat(longitudInicial)] 
        : null
    );

    return (
        <div className="mb-4">
            {/* Texto simplificado */}
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