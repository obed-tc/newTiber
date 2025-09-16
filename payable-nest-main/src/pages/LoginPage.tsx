import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    // Simulación de autenticación
    console.log("Intento de login:", { email, password });
    
    // Datos simulados de usuarios
    const mockUsers = {
      "superadmin@pagaresecure.com": {
        name: "Super Administrador",
        email: "superadmin@pagaresecure.com",
        role: "superadmin" as const,
        workspace: "PagareSecure Platform",
        clientId: "superadmin"
      },
      "admin@empresaa.com": {
        name: "María González",
        email: "admin@empresaa.com",
        role: "admin" as const,
        workspace: "Empresa A - Financiera",
        clientId: "client_a"
      },
      "viewer@empresaa.com": {
        name: "Carlos Rodríguez",
        email: "viewer@empresaa.com", 
        role: "viewer" as const,
        workspace: "Empresa A - Financiera",
        clientId: "client_a"
      },
      "admin@empresab.com": {
        name: "Ana Pérez",
        email: "admin@empresab.com",
        role: "admin" as const,
        workspace: "Empresa B - Cooperativa",
        clientId: "client_b"
      }
    };

    const user = mockUsers[email as keyof typeof mockUsers];
    
    const validPassword = (user?.role === "superadmin" && password === "super123") || 
                          (user?.role !== "superadmin" && password === "demo123");
    
    if (user && validPassword) {
      toast({
        title: "Bienvenido",
        description: `Acceso autorizado para ${user.workspace}`,
      });
      onLogin(user);
    } else {
      toast({
        title: "Error de autenticación",
        description: "Credenciales incorrectas. Usa demo123 para usuarios normales o super123 para superadmin.",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Recuperación de contraseña",
      description: "Se ha enviado un enlace de recuperación a tu correo electrónico.",
    });
  };

  return (
    <LoginForm 
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
    />
  );
};