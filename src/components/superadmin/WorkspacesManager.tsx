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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Power, Users, Calendar, Loader as Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export const WorkspacesManager = () => {
  const { workspaces, loading, createWorkspace, toggleWorkspaceStatus, deleteWorkspace } = useWorkspaces();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    client_id: ""
  });

  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter(workspace =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workspace.description && workspace.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [workspaces, searchTerm]);

  const handleCreateWorkspace = async () => {
    if (!newWorkspace.name) {
      return;
    }

    try {
      await createWorkspace({
        name: newWorkspace.name,
        client_id: newWorkspace.client_id || undefined,
        description: newWorkspace.description || undefined
      });

      setNewWorkspace({ name: "", description: "", client_id: "" });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleToggleStatus = async (workspaceId: string, currentStatus: 'Activo' | 'Inactivo') => {
    try {
      await toggleWorkspaceStatus(workspaceId, currentStatus);
    } catch (error) {
      console.error('Error toggling workspace status:', error);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await deleteWorkspace(workspaceId);
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  if (loading) {
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
              <CardTitle>Gestión de Workspaces</CardTitle>
              <CardDescription>
                Administra las empresas cliente y sus configuraciones
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Workspace
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workspace</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkspaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No se encontraron workspaces
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkspaces.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{workspace.name}</div>
                        {workspace.description && (
                          <div className="text-sm text-muted-foreground">
                            {workspace.description}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          ID: {workspace.id.substring(0, 8)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={workspace.estado === "Activo" ? "default" : "secondary"}>
                        {workspace.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {workspace.user_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(workspace.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(workspace.last_activity_at)}
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
                          <DropdownMenuItem onClick={() => handleToggleStatus(workspace.id, workspace.estado)}>
                            <Power className="mr-2 h-4 w-4" />
                            {workspace.estado === "Activo" ? "Desactivar" : "Activar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteWorkspace(workspace.id)}
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
            <DialogTitle>Crear Nuevo Workspace</DialogTitle>
            <DialogDescription>
              Configura una nueva empresa cliente en el sistema
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Workspace *</Label>
              <Input
                id="name"
                value={newWorkspace.name}
                onChange={(e) => setNewWorkspace({...newWorkspace, name: e.target.value})}
                placeholder="Ej: Banco Regional S.A."
              />
            </div>

            <div>
              <Label htmlFor="client_id">Client ID</Label>
              <Input
                id="client_id"
                value={newWorkspace.client_id}
                onChange={(e) => setNewWorkspace({...newWorkspace, client_id: e.target.value})}
                placeholder="Ej: banco_regional"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional: Identificador personalizado para el cliente
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({...newWorkspace, description: e.target.value})}
                placeholder="Descripción de la empresa..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateWorkspace}>
              Crear Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
