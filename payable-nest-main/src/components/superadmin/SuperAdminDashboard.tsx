import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";

const mockData = {
  totalWorkspaces: 12,
  activeWorkspaces: 10,
  totalUsers: 156,
  totalDocuments: 45890,
  expiredDocuments: 234,
  expiringThisMonth: 1850,
  totalValue: 95750000000, // 95.75 mil millones COP
  monthlyGrowth: 18.5
};

const recentActivity = [
  {
    id: 1,
    action: "Nuevo workspace creado",
    workspace: "Banco Regional S.A.",
    timestamp: "Hace 2 horas",
    type: "workspace"
  },
  {
    id: 2,
    action: "Usuario administrador agregado",
    workspace: "Cooperativa del Valle",
    timestamp: "Hace 4 horas",
    type: "user"
  },
  {
    id: 3,
    action: "Carga masiva de documentos",
    workspace: "Financiera Capital",
    timestamp: "Hace 6 horas",
    type: "document"
  },
  {
    id: 4,
    action: "Workspace desactivado",
    workspace: "Empresa Demo S.A.S.",
    timestamp: "Hace 1 día",
    type: "workspace"
  }
];

export const SuperAdminDashboard = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspaces Totales</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalWorkspaces}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-success border-success">
                {mockData.activeWorkspaces} activos
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              Distribuidos en {mockData.activeWorkspaces} workspaces
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Totales</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.totalDocuments)}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+{mockData.monthlyGrowth}%</span>
              <span className="text-muted-foreground">este mes</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              En documentos activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y estado del sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>Documentos que requieren atención</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-destructive rounded-full"></div>
                <span className="text-sm">Documentos vencidos</span>
              </div>
              <Badge variant="destructive">{formatNumber(mockData.expiredDocuments)}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-warning rounded-full"></div>
                <span className="text-sm">Vencen este mes</span>
              </div>
              <Badge variant="outline" className="text-warning border-warning">
                {formatNumber(mockData.expiringThisMonth)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span className="text-sm">Sistema operativo</span>
              </div>
              <Badge variant="outline" className="text-success border-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Normal
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'workspace' ? 'bg-primary' :
                    activity.type === 'user' ? 'bg-success' : 'bg-warning'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.workspace}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};