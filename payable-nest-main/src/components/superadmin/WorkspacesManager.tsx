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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Power, 
  Users, 
  FileText,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockWorkspaces = [
  {
    id: "client_a",
    name: "Empresa A - Financiera",
    description: "Entidad financiera especializada en créditos empresariales",
    status: "active",
    usersCount: 25,
    documentsCount: 12450,
    createdAt: "2023-01-15",
    lastActivity: "2024-01-12"
  },
  {
    id: "client_b", 
    name: "Empresa B - Cooperativa",
    description: "Cooperativa de ahorro y crédito regional",
    status: "active",
    usersCount: 18,
    documentsCount: 8750,
    createdAt: "2023-03-22",
    lastActivity: "2024-01-11"
  },
  {
    id: "client_c",
    name: "Banco Regional S.A.",
    description: "Banco comercial con enfoque en pymes",
    status: "active",
    usersCount: 42,
    documentsCount: 18900,
    createdAt: "2023-06-10",
    lastActivity: "2024-01-12"
  },
  {
    id: "client_d",
    name: "Financiera Capital",
    description: "Compañía de financiamiento comercial",
    status: "inactive",
    usersCount: 8,
    documentsCount: 3200,
    createdAt: "2023-08-05",
    lastActivity: "2023-12-20"
  }
];

type Workspace = typeof mockWorkspaces[0];

export const WorkspacesManager = () => {
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    clientId: ""
  });
  const { toast } = useToast();

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name || !newWorkspace.clientId) {
      toast({
        title: "Error",
        description: "Nombre y Client ID son requeridos",
        variant: "destructive"
      });
      return;
    }

    const workspace: Workspace = {
      id: newWorkspace.clientId,
      name: newWorkspace.name,
      description: newWorkspace.description,
      status: "active",
      usersCount: 0,
      documentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setWorkspaces([...workspaces, workspace]);
    setNewWorkspace({ name: "", description: "", clientId: "" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Workspace creado",
      description: `${workspace.name} ha sido creado exitosamente`
    });
  };

  const handleToggleStatus = (workspace: Workspace) => {
    const newStatus = workspace.status === "active" ? "inactive" : "active";
    setWorkspaces(workspaces.map(w => 
      w.id === workspace.id ? { ...w, status: newStatus } : w
    ));
    
    toast({
      title: `Workspace ${newStatus === "active" ? "activado" : "desactivado"}`,
      description: `${workspace.name} ha sido ${newStatus === "active" ? "activado" : "desactivado"}`
    });
  };

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setWorkspaces(workspaces.filter(w => w.id !== workspace.id));
    toast({
      title: "Workspace eliminado",
      description: `${workspace.name} ha sido eliminado`
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

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
                <TableHead>Documentos</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkspaces.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workspace.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {workspace.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {workspace.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={workspace.status === "active" ? "default" : "secondary"}>
                      {workspace.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {workspace.usersCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {workspace.documentsCount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {formatDate(workspace.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(workspace.lastActivity)}
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
                          setSelectedWorkspace(workspace);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(workspace)}>
                          <Power className="mr-2 h-4 w-4" />
                          {workspace.status === "active" ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteWorkspace(workspace)}
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

      {/* Dialog para crear workspace */}
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
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                value={newWorkspace.clientId}
                onChange={(e) => setNewWorkspace({...newWorkspace, clientId: e.target.value})}
                placeholder="Ej: banco_regional"
              />
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