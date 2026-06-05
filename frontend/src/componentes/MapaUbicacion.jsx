import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importación directa de assets para evitar problemas de compilación en el bundler (Vite/Webpack)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Configuración del icono predeterminado.
 * Se sobrescribe el comportamiento por defecto de Leaflet para garantizar
 * la correcta resolución de las rutas de las imágenes en producción.
 */
const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

/**
 * Componente MapaUbicacion
 * Componente de presentación puro que renderiza un mapa estático.
 * Optimizado para ser incrustado en tarjetas de perfil (animales o protectoras).
 * * @param {number|string} latitud - Coordenada X.
 * @param {number|string} longitud - Coordenada Y.
 * @param {string} nombre - Texto a mostrar en el Popup descriptivo.
 */
function MapaUbicacion({ latitud, longitud, nombre }) {
    // Patrón Early Return: Programación defensiva.
    // Si la API no devuelve coordenadas (ej. perfil incompleto), el componente
    // se desmonta silenciosamente devolviendo null, evitando romper la UI (pantalla en blanco).
    if (!latitud || !longitud) return null;

    // Casting estricto a Float para asegurar la compatibilidad con el motor de Leaflet
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
                // Desactivar el scroll del ratón mejora enormemente la UX en móviles
                // y previene que la página se quede "atrapada" al hacer scroll sobre el mapa.
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