import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import officeBackground from "@/assets/office-background.jpg";
import tiverLogo from "@/assets/tiver-logo.png";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { RegisterRequestForm } from "./RegisterRequestForm";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
}

type ViewState = "login" | "forgot-password" | "register-request";

export const LoginForm = ({ onLogin, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (email: string) => {
    onForgotPassword();
  };

  const handleRegisterRequest = (data: any) => {
    // Handle register request submission
    console.log("Register request:", data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background image with overlay (desktop only) */}
      <div 
        className="hidden lg:flex lg:flex-1 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${officeBackground})` }}
      >
        <div className="absolute inset-0 bg-primary/25"></div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 lg:flex-1 bg-gradient-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-elevated">
              <img src={tiverLogo} alt="TIVER Logo" className="w-auto h-auto max-w-16 max-h-16 object-contain" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TiverDocs
            </h1>
            <p className="text-muted-foreground mt-2">
              Repositorio Seguro de Títulos Valor
            </p>
          </div>

          {currentView === "login" && (
            <>
              <Card className="shadow-elevated border-0 bg-gradient-card">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Accede a tu repositorio de documentos firmados electrónicamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Correo electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Contraseña
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setCurrentView("forgot-password")}
                        className="text-primary hover:text-primary/80 text-sm transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center mt-6 text-sm text-muted-foreground">
                ¿Eres una nueva empresa?{" "}
                <button 
                  onClick={() => setCurrentView("register-request")}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Solicita acceso
                </button>
              </div>
            </>
          )}

          {currentView === "forgot-password" && (
            <ForgotPasswordForm 
              onBack={() => setCurrentView("login")}
              onSubmit={handleForgotPassword}
            />
          )}

          {currentView === "register-request" && (
            <RegisterRequestForm 
              onBack={() => setCurrentView("login")}
              onSubmit={handleRegisterRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
};