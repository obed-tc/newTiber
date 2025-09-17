import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Settings, User, Building2 } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role: "admin" | "viewer";
    workspace: string;
  };
  onLogout: () => void;
  onWorkspaceChange?: (workspace: string) => void;
}

export const DashboardHeader = ({ user, onLogout, onWorkspaceChange }: DashboardHeaderProps) => {
  // Workspaces disponibles (esto vendría de una API en implementación real)
  const availableWorkspaces = [
    "TiverDocs Platform",
    "Empresa A - Documentos",
    "Empresa B - Títulos Valor",
    "Cooperativa Rural",
    "Banco Central"
  ];

  const getRoleColor = (role: string) => {
    return role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";
  };

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "Administrador" : "Visualizador";
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TiverDocs</h1>
              <p className="text-sm text-muted-foreground">{user.workspace}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector de Workspace */}
          <div className="hidden lg:flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <Select value={user.workspace} onValueChange={onWorkspaceChange}>
              <SelectTrigger className="w-[200px] bg-background/50 border-border/50">
                <SelectValue placeholder="Seleccionar workspace" />
              </SelectTrigger>
              <SelectContent>
                {availableWorkspaces.map((workspace) => (
                  <SelectItem key={workspace} value={workspace}>
                    {workspace}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Badge variant="secondary" className={getRoleColor(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                    {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};