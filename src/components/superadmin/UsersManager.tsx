import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockUsers = [
  {
    id: "1",
    name: "María González",
    email: "admin@empresaa.com",
    role: "admin",
    workspace: "Empresa A - Financiera",
    clientId: "client_a",
    status: "active",
    lastLogin: "2024-01-12",
    createdAt: "2023-01-15"
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "viewer@empresaa.com",
    role: "viewer",
    workspace: "Empresa A - Financiera",
    clientId: "client_a",
    status: "active",
    lastLogin: "2024-01-11",
    createdAt: "2023-02-10"
  },
  {
    id: "3",
    name: "Ana Pérez",
    email: "admin@empresab.com",
    role: "admin",
    workspace: "Empresa B - Cooperativa",
    clientId: "client_b",
    status: "active",
    lastLogin: "2024-01-10",
    createdAt: "2023-03-22"
  },
  {
    id: "4",
    name: "Luis Martín",
    email: "viewer@empresab.com",
    role: "viewer",
    workspace: "Empresa B - Cooperativa",
    clientId: "client_b",
    status: "inactive",
    lastLogin: "2023-12-15",
    createdAt: "2023-04-05"
  }
];

const mockWorkspaces = [
  { id: "client_a", name: "Empresa A - Financiera" },
  { id: "client_b", name: "Empresa B - Cooperativa" },
  { id: "client_c", name: "Banco Regional S.A." },
  { id: "client_d", name: "Financiera Capital" }
];

type User = typeof mockUsers[0];

export const UsersManager = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer",
    workspace: "",
    clientId: ""
  });
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorkspace = selectedWorkspace === "all" || user.clientId === selectedWorkspace;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    
    return matchesSearch && matchesWorkspace && matchesRole;
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.clientId) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive"
      });
      return;
    }

    const workspace = mockWorkspaces.find(w => w.id === newUser.clientId);
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as "admin" | "viewer",
      workspace: workspace?.name || "",
      clientId: newUser.clientId,
      status: "active",
      lastLogin: "-",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "viewer", workspace: "", clientId: "" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Usuario creado",
      description: `${user.name} ha sido creado exitosamente`
    });
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
    
    toast({
      title: `Usuario ${newStatus === "active" ? "activado" : "desactivado"}`,
      description: `${user.name} ha sido ${newStatus === "active" ? "activado" : "desactivado"}`
    });
  };

  const handleDeleteUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast({
      title: "Usuario eliminado",
      description: `${user.name} ha sido eliminado`
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "viewer":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === "-") return "-";
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra usuarios y sus permisos por workspace
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los workspaces</SelectItem>
                {mockWorkspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user.workspace}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {user.clientId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === "admin" ? "Administrador" : "Visualizador"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(user.lastLogin)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                          {user.status === "active" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear usuario */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Agrega un nuevo usuario a un workspace específico
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Ej: juan@empresa.com"
              />
            </div>
            
            <div>
              <Label htmlFor="workspace">Workspace *</Label>
              <Select 
                value={newUser.clientId} 
                onValueChange={(value) => {
                  const workspace = mockWorkspaces.find(w => w.id === value);
                  setNewUser({
                    ...newUser, 
                    clientId: value,
                    workspace: workspace?.name || ""
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un workspace" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="role">Rol *</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Crear Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};