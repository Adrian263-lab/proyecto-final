import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importación de iconos de Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración del icono por defecto
const iconoDefecto = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

export default function MapaProtectoras() {
    const [protectoras, setProtectoras] = useState([]);
    const navigate = useNavigate();
    
    // 📍 Centro de España para que el mapa abra viendo todo el país
    const posicionCentral = [40.4637, -3.7492]; 

    useEffect(() => {
        api.get('/protectoras')
            .then(res => {
                // Filtramos para asegurar que solo intentamos mapear protectoras con coordenadas reales
                const conCoordenadas = res.data.filter(p => p.latitud && p.longitud);
                setProtectoras(conCoordenadas);
            })
            .catch(err => console.error("Error cargando mapa:", err));
    }, []);

    return (
        <div className="card border-0 p-3 rounded-4 bg-white shadow-sm mb-5">
            <h3 className="fw-bold text-huellitas mb-3">📍 Encuentra protectoras cercanas</h3>
            
            <div style={{ height: '450px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                <MapContainer 
                    center={posicionCentral} 
                    zoom={6} // Zoom 6 muestra toda España perfectamente
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {protectoras.map(p => (
                        <Marker 
                            key={p.id} 
                            position={[parseFloat(p.latitud), parseFloat(p.longitud)]}
                            icon={iconoDefecto}
                        >
                            <Popup>
                                <div className="text-center p-1">
                                    <h6 className="fw-bold text-huellitas m-0 mb-1">{p.name}</h6>
                                    <p className="text-muted small mb-2">{p.direccion || 'Sin dirección indicada'}</p>
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