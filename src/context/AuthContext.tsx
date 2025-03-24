import { createContext } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: object) => void;
    register: (user: object) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);