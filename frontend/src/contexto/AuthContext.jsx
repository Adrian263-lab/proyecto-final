import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

/**
 * Contexto de Autenticación: gestiona el estado global del usuario, 
 * persistencia en LocalStorage y métodos de sesión.
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Inicialización del estado desde persistencia local
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Autentica al usuario, guarda el token y actualiza el estado global.
     */
    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('auth_token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data.user;
    };

    /**
     * Limpia la persistencia y restablece el estado de usuario.
     */
    const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para facilitar el acceso al contexto de autenticación.
 */
export const useAuth = () => useContext(AuthContext);