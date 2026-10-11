"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import {
    getItem,
    removeItem,
    setItem,
    KEY_ACCESS_TOKEN
} from "@/utils/localStorageManager";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] =
        useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = getItem(KEY_ACCESS_TOKEN);

        setIsAuthenticated(!!token);
        setLoading(false)
    }, []);

    const login = (token: string) => {
        setItem(KEY_ACCESS_TOKEN, token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeItem(KEY_ACCESS_TOKEN);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}