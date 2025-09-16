import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, DollarSign, FileText, User, Building, Settings, X } from "lucide-react";
import { FilterConfig, FilterValue } from "./types";

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValue[]) => void;
  availableFilters: FilterConfig[];
  currentFilters: FilterValue[];
}

export const AdvancedFiltersModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  availableFilters,
  currentFilters
}: AdvancedFiltersModalProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>(currentFilters);

  const filterCategories = {
    general: availableFilters.filter(f => ["id", "nombreDeudor", "nombreCodeudor", "idDeudor", "idCodeudor", "tipoDocumento"].includes(f.field)),
    financiero: availableFilters.filter(f => ["valorTitulo", "tasaInteres", "plazoCredito", "ingresosMensuales", "patrimonio", "valorGarantia", "valorMora"].includes(f.field)),
    fechas: availableFilters.filter(f => ["fechaVencimiento", "fechaIngreso", "fechaFirmaTitle", "fechaCaducidad", "fechaConstruccion", "fechaUltimaGestion", "fechaProximaAccion"].includes(f.field)),
    personal: availableFilters.filter(f => ["tipoPersona", "genero", "estadoCivil", "nivelEducativo", "ocupacion", "actividadEconomica"].includes(f.field)),
    cobranza: availableFilters.filter(f => ["estado", "etapaCobranza", "diasMora", "gestorAsignado", "resultadoUltimaGestion", "proximaAccion"].includes(f.field)),
    ubicacion: availableFilters.filter(f => ["ciudad", "departamento", "ciudadExpedicion", "direccion"].includes(f.field))
  };

  const addFilter = (filterConfig: FilterConfig) => {
    const existingFilter = selectedFilters.find(f => f.field === filterConfig.field);
    if (existingFilter) return;

    const newFilter: FilterValue = {
      field: filterConfig.field,
      operator: filterConfig.type === "text" ? "contains" : "equals",
      value: "",
      label: filterConfig.label
    };

    setSelectedFilters([...selectedFilters, newFilter]);
  };

  const updateFilter = (index: number, updates: Partial<FilterValue>) => {
    const updated = [...selectedFilters];
    updated[index] = { ...updated[index], ...updates };
    setSelectedFilters(updated);
  };

  const removeFilter = (index: number) => {
    setSelectedFilters(selectedFilters.filter((_, i) => i !== index));
  };

  const renderFilterInput = (filter: FilterValue, index: number) => {
    const config = availableFilters.find(f => f.field === filter.field);
    if (!config) return null;

    switch (config.type) {
      case "text":
        return (
          <div className="grid grid-cols-3 gap-2">
            <Select value={filter.operator} onValueChange={(value) => updateFilter(index, { operator: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Contiene</SelectItem>
                <SelectItem value="equals">Igual a</SelectItem>
                <SelectItem value="startsWith">Comienza con</SelectItem>
                <SelectItem value="endsWith">Termina con</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Valor..."
              value={filter.value}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              className="col-span-2"
            />
          </div>
        );

      case "number":
        return (
          <div className="grid grid-cols-3 gap-2">
            <Select value={filter.operator} onValueChange={(value) => updateFilter(index, { operator: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Igual a</SelectItem>
                <SelectItem value="greaterThan">Mayor que</SelectItem>
                <SelectItem value="lessThan">Menor que</SelectItem>
                <SelectItem value="between">Entre</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Valor..."
              value={filter.value.toString()}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              className="col-span-2"
            />
          </div>
        );

      case "date":
        return (
          <div className="grid grid-cols-3 gap-2">
            <Select value={filter.operator} onValueChange={(value) => updateFilter(index, { operator: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">En fecha</SelectItem>
                <SelectItem value="before">Antes de</SelectItem>
                <SelectItem value="after">Después de</SelectItem>
                <SelectItem value="between">Entre fechas</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filter.value.toString()}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              className="col-span-2"
            />
          </div>
        );

      case "select":
        return (
          <Select value={filter.value.toString()} onValueChange={(value) => updateFilter(index, { value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  const handleApply = () => {
    const validFilters = selectedFilters.filter(f => f.value && f.value.toString().trim() !== "");
    onApplyFilters(validFilters);
    onClose();
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurar Filtros Avanzados
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Filters */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Label className="text-sm font-medium">Campos disponibles para filtrar</Label>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="financiero">Financiero</TabsTrigger>
                <TabsTrigger value="fechas">Fechas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {[...filterCategories.general, ...filterCategories.personal, ...filterCategories.ubicacion].map((filter) => (
                    <Button
                      key={filter.field}
                      variant="outline"
                      size="sm"
                      onClick={() => addFilter(filter)}
                      disabled={selectedFilters.some(f => f.field === filter.field)}
                      className="justify-start h-auto p-2 text-xs"
                    >
                      <User className="w-3 h-3 mr-1" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="financiero" className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {filterCategories.financiero.map((filter) => (
                    <Button
                      key={filter.field}
                      variant="outline"
                      size="sm"
                      onClick={() => addFilter(filter)}
                      disabled={selectedFilters.some(f => f.field === filter.field)}
                      className="justify-start h-auto p-2 text-xs"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="fechas" className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {[...filterCategories.fechas, ...filterCategories.cobranza].map((filter) => (
                    <Button
                      key={filter.field}
                      variant="outline"
                      size="sm"
                      onClick={() => addFilter(filter)}
                      disabled={selectedFilters.some(f => f.field === filter.field)}
                      className="justify-start h-auto p-2 text-xs"
                    >
                      <CalendarDays className="w-3 h-3 mr-1" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Selected Filters */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">
                Filtros activos ({selectedFilters.length})
              </Label>
              {selectedFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Limpiar todo
                </Button>
              )}
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {selectedFilters.map((filter, index) => (
                  <div key={`${filter.field}-${index}`} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {filter.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilter(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    {renderFilterInput(filter, index)}
                  </div>
                ))}

                {selectedFilters.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Selecciona campos de la izquierda para agregar filtros
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApply} disabled={selectedFilters.length === 0}>
            Aplicar Filtros ({selectedFilters.filter(f => f.value && f.value.toString().trim() !== "").length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};