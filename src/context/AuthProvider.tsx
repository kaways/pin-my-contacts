import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from './AuthContext'


interface AuthProviderProps {
    children: ReactNode;
}

interface UserInfo {
    email: string;
    password: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");

        if (currentUser) {
            setIsAuthenticated(true);
        }
    }, []);


    const login = (user: UserInfo) => {
        const accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
        const accountExists = accounts.some((account: { email: string; password: string }) => account.email === user.email && account.password === user.password);

        if (accountExists) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            setIsAuthenticated(true);
        } else {
            alert('Dados incorretos.');
            return;
        }
    };

    const register = (user: UserInfo) => {
        const accounts = JSON.parse(localStorage.getItem("accounts") || '[]');
        const emailExists = accounts.some((account: { email: string; }) => account.email === user.email);

        if (emailExists) {
            alert('Este email já está cadastrado.');
            return;
        }

        accounts.push(user);

        localStorage.setItem("accounts", JSON.stringify(accounts));
        localStorage.setItem('currentUser', JSON.stringify(user));
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("currentUser");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};