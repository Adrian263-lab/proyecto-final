import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/api', // Tu URL de Caddy o Backend original
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

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