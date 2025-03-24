import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "@/context/AuthProvider";
import { AuthContext } from "@/context/AuthContext";
import Login from '@/pages/Login';
import Contacts from '@/pages/Contacts';
import AuthChecker from './AuthChecker';

// Componente para proteger as rotas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext)!;
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function Rotation() {
    return (
        <AuthProvider>
            <Router>
                <AuthChecker>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/contatos" element={
                            <PrivateRoute>
                                <Contacts />
                            </PrivateRoute>
                        }
                        />
                        <Route path="*" element={<Navigate to={"/login"} />} />
                    </Routes>
                </AuthChecker>
            </Router>
        </AuthProvider>
    );
}
