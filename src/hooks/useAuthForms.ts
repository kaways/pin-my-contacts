import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { LoginFormValues, RegisterFormValues } from "../types/auth";

export const useAuthForms = () => {
  const { login, register } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);
    navigate("/contatos");
  };

  const handleRegister = async (values: RegisterFormValues) => {
    await register(values);
  };

  return {
    handleLogin,
    handleRegister,
  };
};