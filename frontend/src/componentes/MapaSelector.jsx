import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Importación directa de los assets de Leaflet para prevenir errores 404 
// al compilar el proyecto para producción.
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

/**
 * Subcomponente CapturarClics
 * Escucha los eventos de clic sobre el canvas del mapa.
 * Implementa geocodificación inversa (Reverse Geocoding) consultando la API de Nominatim.
 */
function CapturarClics({ setPosicion, onLocationSelect }) {
    useMapEvents({
        async click(e) {
            // Destructuración de las coordenadas exactas del evento de Leaflet
            const { lat, lng } = e.latlng;
            
            // Actualización inmediata del estado local para mover el marcador visualmente (Feedback UI)
            setPosicion([lat, lng]); 

            try {
                // Consumo asíncrono de la API pública de Nominatim (OpenStreetMap)
                // Se solicita formato JSON y nivel de detalle 18 (calle/edificio)
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
                        // Formateo limpio: "Calle 123, Ciudad" eliminando comas huérfanas si faltan datos
                        direccionTextual = `${calle} ${numero}, ${ciudad}`.trim().replace(/(^,)|(,$)/g, "");
                    } else {
                        // Fallback a la dirección genérica formateada por Nominatim si no hay calle
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
    return null; // Este componente es lógico, no renderiza elementos visuales en el DOM
}

/**
 * Componente MapaSelector
 * Proporciona la interfaz interactiva para marcar ubicaciones durante el registro/edición.
 * * @param {number|string} latitudInicial - Coordenada X inicial (útil para edición).
 * @param {number|string} longitudInicial - Coordenada Y inicial (útil para edición).
 * @param {Function} onLocationSelect - Callback para propagar los datos seleccionados.
 */
function MapaSelector({ latitudInicial, longitudInicial, onLocationSelect }) {
    // Coordenadas por defecto (Centro de España) como fallback de UX si no hay ubicación previa
    const centroPorDefecto = [40.4168, -3.7038]; 
    
    // Inicialización del estado con casting a Float, previniendo errores de Leaflet
    // si el backend inyecta los valores como strings.
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
                    
                    {/* Inyección de la lógica de eventos de clic */}
                    <CapturarClics setPosicion={setPosicion} onLocationSelect={onLocationSelect} />
                    
                    {/* Renderizado condicional del marcador solo si existe una posición definida */}
                    {posicion && <Marker position={posicion} icon={iconoDefecto} />}
                </MapContainer>
            </div>
        </div>
    );
}

export default MapaSelector;