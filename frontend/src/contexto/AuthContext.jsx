import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

/**
 * Contexto de Autenticación (AuthContext)
 * Actúa como "Single Source of Truth" (Única Fuente de Verdad) para el estado del usuario.
 * Gestiona la persistencia de la sesión y provee los métodos de acceso a toda la app.
 */
const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    
    // El estado 'loading' actúa como un bloqueo de seguridad visual.
    // Evita que React Router evalúe rutas protegidas y expulse al usuario antes de 
    // que el LocalStorage haya tenido tiempo de devolver el token.
    const [loading, setLoading] = useState(true);

    /**
     * Efecto de Hidratación de Sesión (Hydration):
     * Se ejecuta de forma síncrona visual al montar la aplicación. Reconstruye el estado 
     * global desde el LocalStorage para mantener la persistencia tras F5 / recargas.
     */
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Proceso de autenticación contra el backend.
     * Patrón de diseño: Delegación de Errores. 
     * Nota técnica: No incluimos un try/catch aquí intencionadamente. Dejamos que la Promesa 
     * fluya hacia el componente de UI (el formulario de Login), para que sea este quien 
     * capture el error y pinte alertas visuales según el código HTTP devuelto.
     */
    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        
        // Almacenamiento seguro del token JWT para las cabeceras de futuras peticiones
        localStorage.setItem('auth_token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        setUser(res.data.user);
        return res.data.user;
    };

    /**
     * Cierre de sesión y sanitización de almacenamiento.
     */
    const logout = () => {
        // Purga completa del LocalStorage para evitar fugas de información sensible (Data Leakage)
        localStorage.clear();
        setUser(null);
        
        // Se utiliza window.location.href en lugar del navigate de react-router para 
        // forzar un refresco completo del DOM y purgar cualquier estado residual en memoria.
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {/* Short-circuit rendering: La app no se pinta hasta validar la sesión */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

/**
 * Custom Hook 'useAuth'
 * Abstrae la lógica del useContext, facilitando una importación más limpia 
 * y directa en el resto de componentes de la aplicación.
 */
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;