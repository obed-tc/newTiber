import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService, DocumentData, CustomAttributeValue } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';

export interface DocumentWithAttributes {
  id: string;
  workspace_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_size: number;
  tipo_documento: string;
  estado: "Activo" | "Inactivo" | "Vencido";
  created_at: string;
  updated_at: string;
  nombre_deudor?: string;
  nombre_codeudor?: string;
  id_deudor?: string;
  id_codeudor?: string;
  fecha_vencimiento?: string;
  valor_titulo?: number;
  proceso?: string;
  subproceso?: string;
  nombre_del_titulo?: string;
  fecha_firma_title?: string;
  fecha_caducidad?: string;
  fecha_construccion?: string;
  tasa_interes?: number;
  plazo_credito?: number;
  ciudad_expedicion?: string;
  moneda?: string;
  lugar_pago?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  tipo_persona?: string;
  genero?: string;
  estado_civil?: string;
  nivel_educativo?: string;
  ocupacion?: string;
  actividad_economica?: string;
  ingresos_mensuales?: number;
  patrimonio?: number;
  experiencia_crediticia?: string;
  scoring?: number;
  garantia?: string;
  valor_garantia?: number;
  observaciones?: string;
  etapa_cobranza?: string;
  dias_mora?: number;
  valor_mora?: number;
  gestor_asignado?: string;
  fecha_ultima_gestion?: string;
  resultado_ultima_gestion?: string;
  proxima_accion?: string;
  fecha_proxima_accion?: string;
  valores_atributos?: Array<{
    id: string;
    atributo_id: string;
    valor: string;
    atributos_personalizados: {
      id: string;
      nombre: string;
      tipo: string;
    };
  }>;
}

export interface UploadDocumentParams {
  file: File;
  workspaceId: string;
  userId: string;
  documentData: Partial<DocumentData>;
  customAttributes?: Array<{
    atributo_id: string;
    valor: string;
  }>;
}

export const useDocuments = (workspaceId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: documents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: () => workspaceId ? documentService.getDocumentsByWorkspace(workspaceId) : Promise.resolve([]),
    enabled: !!workspaceId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, workspaceId, userId, documentData, customAttributes }: UploadDocumentParams) => {
      const filePath = await documentService.uploadFile(file, workspaceId, userId);

      const fullDocumentData: DocumentData = {
        workspace_id: workspaceId,
        uploaded_by: userId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        tipo_documento: documentData.tipo_documento || '',
        estado: documentData.estado || 'Activo',
        ...documentData,
      };

      const createdDocument = await documentService.createDocument(fullDocumentData);

      if (customAttributes && customAttributes.length > 0) {
        const attributesWithDocId = customAttributes.map(attr => ({
          documento_id: createdDocument.id,
          atributo_id: attr.atributo_id,
          valor: attr.valor,
        }));

        await documentService.saveCustomAttributes(attributesWithDocId);
      }

      return createdDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] });
      toast({
        title: "Documento subido",
        description: "El documento se ha cargado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo subir el documento.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ documentId, updates }: { documentId: string; updates: Partial<DocumentData> }) =>
      documentService.updateDocument(documentId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] });
      toast({
        title: "Documento actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el documento.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ documentId, filePath }: { documentId: string; filePath: string }) =>
      documentService.deleteDocument(documentId, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] });
      toast({
        title: "Documento eliminado",
        description: "El documento se ha eliminado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el documento.",
        variant: "destructive",
      });
    },
  });

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const blob = await documentService.downloadDocument(filePath);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Descarga iniciada",
        description: `Descargando ${fileName}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo descargar el documento.",
        variant: "destructive",
      });
    }
  };

  return {
    documents: documents as DocumentWithAttributes[],
    isLoading,
    error,
    refetch,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    updateDocument: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    downloadDocument,
  };
};

export const useDocumentStats = (workspaceId?: string) => {
  const { toast } = useToast();

  const {
    data: stats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['documentStats', workspaceId],
    queryFn: () => workspaceId ? documentService.getDocumentStats(workspaceId) : Promise.resolve(null),
    enabled: !!workspaceId,
  });

  return {
    stats,
    isLoading,
    error
  };
};
