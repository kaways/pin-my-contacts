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

    // Verifica se o usuário está logado ao carregar a aplicação
    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");

        console.log(currentUser)
        console.log(localStorage.getItem("accounts"))

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
        setIsAuthenticated(true);
    };

    // Função para fazer logout
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