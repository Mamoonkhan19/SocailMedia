import React, { createContext, useEffect } from 'react'
import { currentUser } from '../appwrite/api';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
const INITIAL_USER_STATE = {
    id: "",
    bio: '',
    name: "",
    email: "",
    imageUrl: "",
    username: "",
}
const INITIAL_AUTH_STATE = {
    user: null,
    loading: true,
    isAuthenticated: false,
    setUser: () => { },
    setLoading: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false
}

const authContext = createContext(INITIAL_AUTH_STATE);
function AuthProvider({ children }) {
    const [user, setUser] = React.useState(INITIAL_USER_STATE);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const checkAuthUser = async () => {
        setLoading(true);
        try {
            const USER = await currentUser();
            if (!USER) throw new Error("No authenticated user found");
            setUser({
                id: USER.$id,
                bio: USER.bio,
                name: USER.name,
                email: USER.email,
                imageUrl: USER.imageUrl,
                username: USER.username,
            });
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const value = {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
        loading,
        setLoading,
    }
    useEffect(() => {
        const initAuth = async () => {
            const isAuthenticated = await checkAuthUser();
            // Redirect only if the user is not authenticated
            if (!isAuthenticated) {
                navigate("/sign-in");
            }
        };

        initAuth();
    }, []);
    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;
export const useUserContext = () => React.useContext(authContext);