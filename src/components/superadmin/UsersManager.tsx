import { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, UserCheck, UserX, Filter, Loader as Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsers, UserRole } from "@/hooks/useUsers";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export const UsersManager = () => {
  const { users, loading: usersLoading, createUser, toggleUserStatus, deleteUser } = useUsers();
  const { workspaces, loading: workspacesLoading } = useWorkspaces();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    rol: "Visualizador" as UserRole,
    workspaceIds: [] as string[]
  });

  const flattenedUsers = useMemo(() => {
    return users.flatMap(user => {
      if (user.workspaces.length === 0) {
        return [{
          ...user,
          workspace_name: '-',
          workspace_id: null,
          workspace_rol: user.rol
        }];
      }
      return user.workspaces.map(ws => ({
        ...user,
        workspace_name: ws.workspace_name,
        workspace_id: ws.workspace_id,
        workspace_rol: ws.rol
      }));
    });
  }, [users]);

  const filteredUsers = useMemo(() => {
    return flattenedUsers.filter(user => {
      const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWorkspace = selectedWorkspace === "all" || user.workspace_id === selectedWorkspace;
      const matchesRole = selectedRole === "all" || user.workspace_rol === selectedRole;

      return matchesSearch && matchesWorkspace && matchesRole;
    });
  }, [flattenedUsers, searchTerm, selectedWorkspace, selectedRole]);

  const handleCreateUser = async () => {
    if (!newUser.full_name || !newUser.email || newUser.workspaceIds.length === 0) {
      return;
    }

    try {
      await createUser({
        full_name: newUser.full_name,
        email: newUser.email,
        rol: newUser.rol,
        workspaceIds: newUser.workspaceIds
      });

      setNewUser({
        full_name: "",
        email: "",
        rol: "Visualizador",
        workspaceIds: []
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleWorkspaceToggle = (workspaceId: string) => {
    const isSelected = newUser.workspaceIds.includes(workspaceId);

    if (isSelected) {
      setNewUser({
        ...newUser,
        workspaceIds: newUser.workspaceIds.filter(id => id !== workspaceId)
      });
    } else {
      setNewUser({
        ...newUser,
        workspaceIds: [...newUser.workspaceIds, workspaceId]
      });
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: 'Activo' | 'Inactivo') => {
    try {
      await toggleUserStatus(userId, currentStatus);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "destructive";
      case "Administrador":
        return "default";
      case "Visualizador":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  if (usersLoading || workspacesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Visualizador">Visualizador</SelectItem>
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={`${user.id}-${user.workspace_id || 'no-workspace'}`}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.workspace_name}</div>
                      {user.workspace_id && (
                        <div className="text-xs text-muted-foreground">
                          ID: {user.workspace_id.substring(0, 8)}...
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.workspace_rol)}>
                        {user.workspace_rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.estado === "Activo" ? "default" : "secondary"}>
                        {user.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(user.ultimo_acceso)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(user.created_at)}
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
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.estado)}>
                            {user.estado === "Activo" ? (
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
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Agrega un nuevo usuario y asígnalo a uno o más workspaces
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
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
              <Label htmlFor="workspaces">Workspaces *</Label>
              <div className="space-y-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={workspace.id}
                      checked={newUser.workspaceIds.includes(workspace.id)}
                      onCheckedChange={() => handleWorkspaceToggle(workspace.id)}
                    />
                    <Label
                      htmlFor={workspace.id}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {workspace.name}
                    </Label>
                  </div>
                ))}
              </div>
              {newUser.workspaceIds.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {newUser.workspaceIds.length} workspace(s) seleccionado(s)
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="rol">Rol *</Label>
              <Select
                value={newUser.rol}
                onValueChange={(value) => setNewUser({...newUser, rol: value as UserRole})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Visualizador">Visualizador</SelectItem>
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
