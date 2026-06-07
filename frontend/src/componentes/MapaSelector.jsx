import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración del icono por defecto de Leaflet. Esto es necesario debido a cómo Leaflet maneja los recursos de los marcadores.
const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Componente CapturarClics: Maneja la lógica de eventos de clic en el mapa para capturar coordenadas y resolver la dirección textual.
function CapturarClics({ setPosicion, onLocationSelect }) {
    useMapEvents({
        async click(e) {
            // Destructuración de las coordenadas exactas del evento de Leaflet
            const { lat, lng } = e.latlng;
            
            // Actualización inmediata del estado local para mover el marcador visualmente (Feedback UI)
            setPosicion([lat, lng]); 

            try {
                // Llamada a la API de Nominatim para geocodificación inversa, obteniendo una dirección legible a partir de las coordenadas.
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                );
                
                const data = await response.json();
                let direccionTextual = '';

                // Parsing defensivo: Las APIs geográficas no siempre devuelven todos los campos
                if (data?.address) {
                    const { road, pedestrian, house_number, city, town, village } = data.address;
                    
                    // Estrategia de fallback para construir la dirección más precisa posible
                    const calle = road || pedestrian || '';
                    const numero = house_number || '';
                    const ciudad = city || town || village || '';
                    
                    if (calle) {
                        
                        direccionTextual = `${calle} ${numero}, ${ciudad}`.trim().replace(/(^,)|(,$)/g, "");
                    } else {
                        
                        direccionTextual = data.display_name;
                    }
                }

                // Elevación del estado al componente padre
                onLocationSelect(lat, lng, direccionTextual);
            } catch (error) {
                console.error("Fallo en la resolución de geocodificación inversa:", error);
                // Si la API falla, devolvemos las coordenadas igualmente para no bloquear el registro
                onLocationSelect(lat, lng, null);
            }
        },
    });
    return null;
}

// El componente MapaSelector permite a los usuarios seleccionar una ubicación en el mapa, capturando tanto las coordenadas como la dirección textual mediante geocodificación inversa.
function MapaSelector({ latitudInicial, longitudInicial, onLocationSelect }) {
    // Coordenadas por defecto (Centro de España) como fallback de UX si no hay ubicación previa
    const centroPorDefecto = [40.4168, -3.7038]; 
    
    // Estado local para almacenar la posición seleccionada. Se inicializa con las coordenadas previas si están disponibles, o null para indicar que no hay selección.
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
                    // Zoom dinámico: más cerca si hay una posición exacta, más lejos para la vista nacional
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

export default MapaSelector;