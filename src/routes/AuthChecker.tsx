import React from 'react';
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext)!;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated && location.pathname === "/login") {
            navigate("/contatos");
        }
        // else if (!isAuthenticated && location.pathname !== "/login") {
        //   navigate("/login");
        // }
    }, [isAuthenticated, location.pathname, navigate]);

    return <>{children}</>;
};

export default AuthChecker;