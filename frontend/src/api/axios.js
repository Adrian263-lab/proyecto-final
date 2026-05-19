import axios from 'axios';

const api = axios.create({
    // ¡CAMBIADO! Ahora apunta a tu servidor Nginx real en producción
    baseURL: 'http://82.223.122.129/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// El resto del código de los interceptores se queda exactamente igual...

// Añadimos el interceptor para enviar el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;