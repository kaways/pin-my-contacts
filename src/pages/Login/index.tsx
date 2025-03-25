import { AuthTabs } from "./AuthTabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuthForms } from "@/hooks/useAuthForms";

export const LoginPage = () => {
  const { handleLogin, handleRegister } = useAuthForms();

  return (
    <div className="mx-auto h-screen flex flex-col justify-center items-center">
      <AuthTabs
        loginForm={<LoginForm onSubmit={handleLogin} />}
        registerForm={<RegisterForm onSubmit={handleRegister} />}
      />
    </div>
  );
};

export default LoginPage;