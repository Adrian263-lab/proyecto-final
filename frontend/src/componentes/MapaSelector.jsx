import { useState, useEffect } from 'react';
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

// Subcomponente que detecta los clics en el mapa
function CapturarClics({ setPosicion, onLocationSelect }) {
    useMapEvents({
        click(e) {
            const nuevaPos = [e.latlng.lat, e.latlng.lng];
            setPosicion(nuevaPos); // Mueve la chincheta
            onLocationSelect(e.latlng.lat, e.latlng.lng); // Envía los datos al formulario padre
        },
    });
    return null;
}

export default function MapaSelector({ latitudInicial, longitudInicial, onLocationSelect }) {
    // Por defecto centramos en España (o donde quieras) si no tiene coordenadas
    const centroPorDefecto = [40.4168, -3.7038]; 
    
    const [posicion, setPosicion] = useState(
        latitudInicial && longitudInicial 
        ? [parseFloat(latitudInicial), parseFloat(longitudInicial)] 
        : null
    );

    return (
        <div className="mb-4">
            <label className="form-label fw-bold text-huellitas">📍 Haz clic en el mapa para marcar tu ubicación exacta</label>
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
            {posicion && (
                <small className="text-success mt-1 d-block">
                    ✓ Ubicación capturada correctamente.
                </small>
            )}
        </div>
    );
}