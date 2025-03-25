import { createContext } from "react";
interface UserInfo {
    email: string;
    password: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: UserInfo) => void;
    register: (user: UserInfo) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);