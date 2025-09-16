import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Search, 
  Filter, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  FilterX
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdvancedFiltersModal } from "./filters/AdvancedFiltersModal";
import { ActiveFilters } from "./filters/ActiveFilters";
import { documentFilterConfigs } from "./filters/filterConfigs";
import { FilterValue } from "./filters/types";

interface Document {
  id: string;
  nombreDeudor: string;
  nombreCodeudor: string;
  idDeudor: string;
  idCodeudor: string;
  fechaVencimiento: Date;
  valorTitulo: number;
  fechaIngreso: Date;
  proceso: string;
  subproceso: string;
  // Extended metadata fields
  tipoDocumento: string;
  nombreDelTitulo: string;
  fechaFirmaTitle: Date;
  fechaCaducidad: Date;
  fechaConstruccion: Date;
  tasaInteres: number;
  plazoCredito: number;
  ciudadExpedicion: string;
  moneda: string;
  lugarPago: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  tipoPersona: "Natural" | "Jurídica";
  genero?: "Masculino" | "Femenino";
  estadoCivil?: string;
  nivelEducativo?: string;
  ocupacion: string;
  actividadEconomica: string;
  ingresosMensuales: number;
  patrimonio: number;
  experienciaCrediticia: string;
  scoring: number;
  garantia: string;
  valorGarantia: number;
  observaciones: string;
  estado: "Activo" | "Inactivo" | "Vencido";
  etapaCobranza: string;
  diasMora: number;
  valorMora: number;
  gestorAsignado: string;
  fechaUltimaGestion: Date;
  resultadoUltimaGestion: string;
  proximaAccion: string;
  fechaProximaAccion: Date;
}

const mockDocuments: Document[] = [
  {
    id: "PAG-2024-001",
    nombreDeudor: "Juan Carlos Pérez",
    nombreCodeudor: "María González",
    idDeudor: "1234567890",
    idCodeudor: "0987654321",
    fechaVencimiento: new Date("2024-03-15"),
    valorTitulo: 15000000,
    fechaIngreso: new Date("2024-01-15"),
    proceso: "Crédito Personal",
    subproceso: "Aprobación",
    tipoDocumento: "Pagaré",
    nombreDelTitulo: "Pagaré de Crédito Personal",
    fechaFirmaTitle: new Date("2024-01-10"),
    fechaCaducidad: new Date("2025-03-15"),
    fechaConstruccion: new Date("2024-01-15"),
    tasaInteres: 18.5,
    plazoCredito: 12,
    ciudadExpedicion: "Bogotá",
    moneda: "COP",
    lugarPago: "Banco Central",
    telefono: "3001234567",
    email: "juan.perez@email.com",
    direccion: "Calle 123 #45-67",
    ciudad: "Bogotá",
    departamento: "Cundinamarca",
    tipoPersona: "Natural",
    genero: "Masculino",
    estadoCivil: "Casado",
    nivelEducativo: "Universitario",
    ocupacion: "Ingeniero",
    actividadEconomica: "Servicios profesionales",
    ingresosMensuales: 5000000,
    patrimonio: 150000000,
    experienciaCrediticia: "Buena",
    scoring: 750,
    garantia: "Hipotecaria",
    valorGarantia: 200000000,
    observaciones: "Cliente con buen historial",
    estado: "Activo",
    etapaCobranza: "Preventiva",
    diasMora: 0,
    valorMora: 0,
    gestorAsignado: "Ana García",
    fechaUltimaGestion: new Date("2024-01-20"),
    resultadoUltimaGestion: "Contacto exitoso",
    proximaAccion: "Seguimiento",
    fechaProximaAccion: new Date("2024-02-20")
  },
  {
    id: "PAG-2024-002",
    nombreDeudor: "Ana Sofía Rodríguez",
    nombreCodeudor: "Carlos Mendez",
    idDeudor: "2345678901",
    idCodeudor: "1098765432",
    fechaVencimiento: new Date("2024-12-20"),
    valorTitulo: 25000000,
    fechaIngreso: new Date("2024-01-20"),
    proceso: "Crédito Empresarial",
    subproceso: "Desembolso",
    tipoDocumento: "Solicitud de Crédito",
    nombreDelTitulo: "Solicitud Crédito Empresarial",
    fechaFirmaTitle: new Date("2024-01-18"),
    fechaCaducidad: new Date("2025-12-20"),
    fechaConstruccion: new Date("2024-01-20"),
    tasaInteres: 16.2,
    plazoCredito: 24,
    ciudadExpedicion: "Medellín",
    moneda: "COP",
    lugarPago: "Sucursal Medellín",
    telefono: "3009876543",
    email: "ana.rodriguez@empresa.com",
    direccion: "Carrera 70 #80-90",
    ciudad: "Medellín",
    departamento: "Antioquia",
    tipoPersona: "Jurídica",
    ocupacion: "Empresaria",
    actividadEconomica: "Comercio",
    ingresosMensuales: 12000000,
    patrimonio: 350000000,
    experienciaCrediticia: "Buena",
    scoring: 820,
    garantia: "Fiduciaria",
    valorGarantia: 400000000,
    observaciones: "Empresa con sólido respaldo",
    estado: "Activo",
    etapaCobranza: "Preventiva",
    diasMora: 0,
    valorMora: 0,
    gestorAsignado: "Carlos López",
    fechaUltimaGestion: new Date("2024-01-25"),
    resultadoUltimaGestion: "Documentos en orden",
    proximaAccion: "Desembolso",
    fechaProximaAccion: new Date("2024-02-01")
  },
  {
    id: "PAG-2024-003",
    nombreDeudor: "Roberto Silva",
    nombreCodeudor: "Elena Castro",
    idDeudor: "3456789012",
    idCodeudor: "2109876543",
    fechaVencimiento: new Date("2024-02-10"),
    valorTitulo: 8500000,
    fechaIngreso: new Date("2024-01-25"),
    proceso: "Microcrédito",
    subproceso: "Renovación",
    tipoDocumento: "Consentimiento Informado",
    nombreDelTitulo: "Microcrédito Rural",
    fechaFirmaTitle: new Date("2024-01-23"),
    fechaCaducidad: new Date("2024-08-10"),
    fechaConstruccion: new Date("2024-01-25"),
    tasaInteres: 22.8,
    plazoCredito: 6,
    ciudadExpedicion: "Cali",
    moneda: "COP",
    lugarPago: "Cooperativa Rural",
    telefono: "3205555555",
    email: "roberto.silva@rural.com",
    direccion: "Vereda El Progreso",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    tipoPersona: "Natural",
    genero: "Masculino",
    estadoCivil: "Unión Libre",
    nivelEducativo: "Secundaria",
    ocupacion: "Agricultor",
    actividadEconomica: "Agricultura",
    ingresosMensuales: 2500000,
    patrimonio: 45000000,
    experienciaCrediticia: "Regular",
    scoring: 650,
    garantia: "Codeudor",
    valorGarantia: 15000000,
    observaciones: "Renovación de microcrédito",
    estado: "Vencido",
    etapaCobranza: "Administrativa",
    diasMora: 15,
    valorMora: 450000,
    gestorAsignado: "María Fernández",
    fechaUltimaGestion: new Date("2024-02-08"),
    resultadoUltimaGestion: "Sin contacto",
    proximaAccion: "Llamada telefónica",
    fechaProximaAccion: new Date("2024-02-12")
  }
];

export const DocumentsTable = () => {
  const [documents] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processFilter, setProcessFilter] = useState("all");
  const [advancedFilters, setAdvancedFilters] = useState<FilterValue[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getDocumentStatus = (fechaVencimiento: Date) => {
    const today = new Date();
    const diffTime = fechaVencimiento.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "vencido";
    if (diffDays <= 30) return "por-vencer";
    return "vigente";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencido": return "bg-destructive/10 text-destructive";
      case "por-vencer": return "bg-warning/10 text-warning";
      case "vigente": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencido": return <AlertTriangle className="w-4 h-4" />;
      case "por-vencer": return <Clock className="w-4 h-4" />;
      case "vigente": return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vencido": return "Vencido";
      case "por-vencer": return "Por vencer";
      case "vigente": return "Vigente";
      default: return "Desconocido";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const applyAdvancedFilters = (document: Document) => {
    return advancedFilters.every(filter => {
      const fieldValue = document[filter.field as keyof Document];
      
      if (fieldValue === undefined || fieldValue === null) return false;
      
      const value = filter.value.toString().toLowerCase();
      const docValue = fieldValue.toString().toLowerCase();
      
      switch (filter.operator) {
        case "contains":
          return docValue.includes(value);
        case "equals":
          return docValue === value;
        case "startsWith":
          return docValue.startsWith(value);
        case "endsWith":
          return docValue.endsWith(value);
        case "greaterThan":
          return Number(fieldValue) > Number(filter.value);
        case "lessThan":
          return Number(fieldValue) < Number(filter.value);
        case "before":
          if (fieldValue instanceof Date) {
            return fieldValue < new Date(filter.value.toString());
          }
          return false;
        case "after":
          if (fieldValue instanceof Date) {
            return fieldValue > new Date(filter.value.toString());
          }
          return false;
        default:
          return true;
      }
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.nombreDeudor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.idDeudor.includes(searchTerm) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getDocumentStatus(doc.fechaVencimiento);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    
    const matchesProcess = processFilter === "all" || doc.proceso === processFilter;
    
    const matchesAdvancedFilters = applyAdvancedFilters(doc);
    
    return matchesSearch && matchesStatus && matchesProcess && matchesAdvancedFilters;
  });

  const handleDownload = (documentId: string) => {
    // Simular descarga
    console.log("Descargando documento:", documentId);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ID o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="vigente">Vigentes</SelectItem>
                <SelectItem value="por-vencer">Por vencer</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={processFilter} onValueChange={setProcessFilter}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Proceso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los procesos</SelectItem>
                <SelectItem value="Crédito Personal">Crédito Personal</SelectItem>
                <SelectItem value="Crédito Empresarial">Crédito Empresarial</SelectItem>
                <SelectItem value="Microcrédito">Microcrédito</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedFilters(true)}
              className="bg-background/50 relative"
            >
              <Settings className="w-4 h-4 mr-2" />
              Filtros Avanzados
              {advancedFilters.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                >
                  {advancedFilters.length}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      <ActiveFilters
        filters={advancedFilters}
        onRemoveFilter={(index) => {
          const updated = [...advancedFilters];
          updated.splice(index, 1);
          setAdvancedFilters(updated);
        }}
        onClearAll={() => setAdvancedFilters([])}
      />

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={setAdvancedFilters}
        availableFilters={documentFilterConfigs}
        currentFilters={advancedFilters}
      />

      {/* Tabla de documentos */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Documentos ({filteredDocuments.length})
            </CardTitle>
            <Button className="bg-gradient-primary">
              <Download className="w-4 h-4 mr-2" />
              Exportar selección
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>ID Documento</TableHead>
                  <TableHead>Deudor</TableHead>
                  <TableHead>Codeudor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Proceso</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const status = getDocumentStatus(doc.fechaVencimiento);
                  return (
                    <TableRow key={doc.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.nombreDeudor}</div>
                          <div className="text-sm text-muted-foreground">{doc.idDeudor}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.nombreCodeudor}</div>
                          <div className="text-sm text-muted-foreground">{doc.idCodeudor}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(doc.valorTitulo)}
                      </TableCell>
                      <TableCell>
                        {format(doc.fechaVencimiento, "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(status)}
                          {getStatusLabel(status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{doc.proceso}</div>
                          <div className="text-sm text-muted-foreground">{doc.subproceso}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc.id)}
                          className="bg-background/50 hover:bg-primary hover:text-primary-foreground"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};