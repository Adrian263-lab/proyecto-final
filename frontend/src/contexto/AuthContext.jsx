import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

// El contexto de autenticación centraliza la gestión del estado de sesión del usuario, proporcionando funciones para iniciar y cerrar sesión, así como un estado de carga para controlar el renderizado de la aplicación durante la hidratación de la sesión.
const AuthContext = createContext();
// El componente AuthProvider envuelve toda la aplicación, proporcionando acceso al estado de autenticación a través del contexto. Implementa un efecto de hidratación para reconstruir el estado desde el LocalStorage y funciones de login/logout que interactúan con el backend.
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    
        // Estado de carga para controlar el renderizado de la aplicación hasta que se valide la sesión del usuario.
    const [loading, setLoading] = useState(true);

   // useEffect para hidratar el estado de autenticación desde el LocalStorage al montar el componente. Esto permite mantener la sesión del usuario incluso después de recargar la página.
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Función de login que envía las credenciales al backend y, en caso de éxito, almacena el token y la información del usuario en el LocalStorage y actualiza el estado global.
    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        
        // Almacenamiento seguro del token JWT para las cabeceras de futuras peticiones
        localStorage.setItem('auth_token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        setUser(res.data.user);
        return res.data.user;
    };

    // Función de logout que limpia el LocalStorage y el estado global, y redirige al usuario a la página de login. Se utiliza un enfoque de purga completa para evitar cualquier fuga de información sensible.
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
            
            {!loading && children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);

export default AuthProvider;