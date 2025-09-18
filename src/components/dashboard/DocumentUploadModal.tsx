import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCustomAttributes, DocumentAttributeValue } from "@/hooks/useCustomAttributes";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, attributes: DocumentAttributeValue[], documentType: string) => void;
}

export const DocumentUploadModal = ({ isOpen, onClose, onUpload }: DocumentUploadModalProps) => {
  const { toast } = useToast();
  const { getAttributesForDocumentType } = useCustomAttributes();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [attributeValues, setAttributeValues] = useState<Record<string, string | number>>({});
  
  const documentTypes = ["Pagaré", "Solicitud de crédito", "Consentimiento informado"];
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
    setAttributeValues({}); // Reset attribute values when document type changes
  };
  
  const handleAttributeChange = (attributeId: string, value: string | number) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeId]: value
    }));
  };
  
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Selecciona un archivo para subir.",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentType) {
      toast({
        title: "Error",
        description: "Selecciona el tipo de documento.",
        variant: "destructive"
      });
      return;
    }
    
    // Convert attribute values to the expected format
    const documentAttributes: DocumentAttributeValue[] = Object.entries(attributeValues).map(([attributeId, value]) => ({
      attributeId,
      value
    }));
    
    onUpload(selectedFile, documentAttributes, documentType);
    
    // Reset form
    setSelectedFile(null);
    setDocumentType("");
    setAttributeValues({});
    
    toast({
      title: "Documento subido",
      description: "El documento se ha subido correctamente con sus atributos.",
    });
    
    onClose();
  };
  
  const customAttributes = documentType ? getAttributesForDocumentType(documentType) : [];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Documento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* File Upload */}
          <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                {selectedFile ? (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="ml-auto h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Arrastra tu archivo aquí</p>
                      <p className="text-xs text-muted-foreground">o haz clic para seleccionar</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx"
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Document Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Documento</Label>
            <Select value={documentType} onValueChange={handleDocumentTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Custom Attributes */}
          {customAttributes.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Atributos del Documento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customAttributes.map((attribute) => (
                  <div key={attribute.id} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {attribute.label}
                      {attribute.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    
                    {attribute.type === "text" && (
                      <Input
                        placeholder={`Ingresa ${attribute.label.toLowerCase()}`}
                        value={attributeValues[attribute.id] || ""}
                        onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
                      />
                    )}
                    
                    {attribute.type === "number" && (
                      <Input
                        type="number"
                        placeholder={`Ingresa ${attribute.label.toLowerCase()}`}
                        value={attributeValues[attribute.id] || ""}
                        onChange={(e) => handleAttributeChange(attribute.id, parseFloat(e.target.value) || 0)}
                      />
                    )}
                    
                    {attribute.type === "date" && (
                      <Input
                        type="date"
                        value={attributeValues[attribute.id] || ""}
                        onChange={(e) => handleAttributeChange(attribute.id, e.target.value)}
                      />
                    )}
                    
                    {attribute.type === "select" && attribute.options && (
                      <Select 
                        value={attributeValues[attribute.id]?.toString() || ""} 
                        onValueChange={(value) => handleAttributeChange(attribute.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Selecciona ${attribute.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {attribute.options.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {documentType && customAttributes.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              No hay atributos personalizados configurados para este tipo de documento.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !documentType}
            className="bg-gradient-primary hover:opacity-90"
          >
            Subir Documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};