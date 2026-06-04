import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono por defecto de la chincheta
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

export default function MapaUbicacion({ latitud, longitud, nombre }) {
    // Si la protectora no tiene coordenadas guardadas, no mostramos el mapa
    if (!latitud || !longitud) return null;

    const posicion = [parseFloat(latitud), parseFloat(longitud)];

    return (
        <div className="mt-4" style={{ height: '250px', width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #dee2e6' }}>
            <MapContainer 
                center={posicion} 
                zoom={15} // Zoom más cercano para ver bien la calle
                scrollWheelZoom={false} // Desactivamos el scroll con la rueda para que no moleste al bajar la página
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