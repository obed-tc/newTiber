import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Server, 
  Activity,
  HardDrive,
  Cpu,
  Calendar,
  DollarSign
} from "lucide-react";

const systemMetrics = {
  performance: {
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    responseTime: 120 // ms
  },
  database: {
    totalRecords: 45890,
    dailyInserts: 1247,
    queryPerformance: 95, // %
    connectionPool: 78 // %
  },
  traffic: {
    dailyRequests: 24567,
    peakHour: "14:00 - 15:00",
    errorRate: 0.2, // %
    uptime: 99.9 // %
  },
  business: {
    monthlyGrowth: 18.5,
    newWorkspaces: 3,
    newUsers: 42,
    processingVolume: 95750000000 // COP
  }
};

const workspaceStats = [
  {
    workspace: "Empresa A - Financiera",
    documents: 18900,
    users: 42,
    growth: 22.3,
    value: 35750000000
  },
  {
    workspace: "Banco Regional S.A.",
    documents: 12450,
    users: 25,
    growth: 18.7,
    value: 28900000000
  },
  {
    workspace: "Empresa B - Cooperativa",
    documents: 8750,
    users: 18,
    growth: 15.2,
    value: 18500000000
  },
  {
    workspace: "Financiera Capital",
    documents: 3200,
    users: 8,
    growth: -5.8,
    value: 8200000000
  }
];

export const SystemStats = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-destructive";
    if (percentage >= 60) return "text-warning";
    return "text-success";
  };

  const getPerformanceVariant = (percentage: number) => {
    if (percentage >= 80) return "destructive" as const;
    if (percentage >= 60) return "outline" as const;
    return "default" as const;
  };

  return (
    <div className="space-y-6">
      {/* Métricas de rendimiento del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.performance.cpuUsage}%</div>
            <Progress 
              value={systemMetrics.performance.cpuUsage} 
              className="mt-2"
            />
            <p className={`text-xs mt-1 ${getPerformanceColor(systemMetrics.performance.cpuUsage)}`}>
              Uso actual del procesador
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memoria RAM</CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.performance.memoryUsage}%</div>
            <Progress 
              value={systemMetrics.performance.memoryUsage} 
              className="mt-2"
            />
            <p className={`text-xs mt-1 ${getPerformanceColor(systemMetrics.performance.memoryUsage)}`}>
              Uso de memoria
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
            <HardDrive className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.performance.diskUsage}%</div>
            <Progress 
              value={systemMetrics.performance.diskUsage} 
              className="mt-2"
            />
            <p className={`text-xs mt-1 ${getPerformanceColor(systemMetrics.performance.diskUsage)}`}>
              Espacio utilizado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Respuesta</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.performance.responseTime}ms</div>
            <p className="text-xs text-success mt-1">
              Promedio en 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de base de datos y tráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Base de Datos
            </CardTitle>
            <CardDescription>Estado y rendimiento de la base de datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total de registros</span>
              <Badge variant="outline">{formatNumber(systemMetrics.database.totalRecords)}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Inserciones diarias</span>
              <Badge variant="default">{formatNumber(systemMetrics.database.dailyInserts)}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rendimiento consultas</span>
                <span className="text-sm font-medium">{systemMetrics.database.queryPerformance}%</span>
              </div>
              <Progress value={systemMetrics.database.queryPerformance} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pool de conexiones</span>
                <span className="text-sm font-medium">{systemMetrics.database.connectionPool}%</span>
              </div>
              <Progress value={systemMetrics.database.connectionPool} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Tráfico del Sistema
            </CardTitle>
            <CardDescription>Estadísticas de uso y disponibilidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Requests diarios</span>
              <Badge variant="outline">{formatNumber(systemMetrics.traffic.dailyRequests)}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Hora pico</span>
              <Badge variant="secondary">{systemMetrics.traffic.peakHour}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Tasa de errores</span>
              <Badge variant="outline" className="text-success border-success">
                {systemMetrics.traffic.errorRate}%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium text-success">{systemMetrics.traffic.uptime}%</span>
              </div>
              <Progress value={systemMetrics.traffic.uptime} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas por workspace */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Rendimiento por Workspace
          </CardTitle>
          <CardDescription>
            Métricas de documentos, usuarios y crecimiento por empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workspaceStats.map((workspace, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{workspace.workspace}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{formatNumber(workspace.documents)} docs</span>
                    <span>{workspace.users} usuarios</span>
                    <span>{formatCurrency(workspace.value)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {workspace.growth >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">+{workspace.growth}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      <span className="text-destructive font-medium">{workspace.growth}%</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de negocio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento Mensual</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+{systemMetrics.business.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              Comparado con el mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Workspaces</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.business.newWorkspaces}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.business.newUsers}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volumen Procesado</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(systemMetrics.business.processingVolume)}</div>
            <p className="text-xs text-muted-foreground">
              Total en documentos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};