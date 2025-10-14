import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export const SuperAdminDashboard = () => {
  const stats = useDashboardStats();

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

  if (stats.loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{stats.totalWorkspaces}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-success border-success">
                {stats.activeWorkspaces} activos
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
            <div className="text-2xl font-bold">{formatNumber(stats.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              Distribuidos en {stats.activeWorkspaces} workspaces
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Totales</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalDocuments)}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success">+{stats.monthlyGrowth.toFixed(1)}%</span>
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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
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
              <Badge variant="destructive">{formatNumber(stats.expiredDocuments)}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-warning rounded-full"></div>
                <span className="text-sm">Vencen este mes</span>
              </div>
              <Badge variant="outline" className="text-warning border-warning">
                {formatNumber(stats.expiringThisMonth)}
              </Badge>
            </div>
            
          </CardContent>
        </Card>

      </div>
    </div>
  );
};