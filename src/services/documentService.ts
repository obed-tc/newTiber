import { supabase } from "@/lib/supabase";

export interface DocumentData {
  workspace_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_size: number;
  tipo_documento: string;
  estado: "Activo" | "Inactivo" | "Vencido";
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
}

export interface CustomAttributeValue {
  documento_id: string;
  atributo_id: string;
  valor: string;
}

export const documentService = {
  async uploadFile(file: File, workspaceId: string, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${workspaceId}/${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    return data.path;
  },

  async createDocument(documentData: DocumentData): Promise<any> {
    const { data, error } = await supabase
      .from('documentos')
      .insert(documentData)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async saveCustomAttributes(attributes: CustomAttributeValue[]): Promise<void> {
    if (attributes.length === 0) return;

    const { error } = await supabase
      .from('valores_atributos')
      .insert(attributes);

    if (error) throw error;
  },

  async getDocumentsByWorkspace(workspaceId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('documentos')
      .select(`
        *,
        valores_atributos (
          id,
          atributo_id,
          valor,
          atributos_personalizados (
            id,
            nombre,
            tipo
          )
        )
      `)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async downloadDocument(filePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (error) throw error;

    return data;
  },

  async getDocumentUrl(filePath: string): Promise<string> {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async updateDocument(documentId: string, updates: Partial<DocumentData>): Promise<any> {
    const { data, error } = await supabase
      .from('documentos')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async deleteDocument(documentId: string, filePath: string): Promise<void> {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;
  },

  async getDocumentStats(workspaceId: string): Promise<any> {
    const { data, error } = await supabase
      .from('documentos')
      .select('estado, valor_titulo, fecha_vencimiento')
      .eq('workspace_id', workspaceId);

    if (error) throw error;

    const stats = {
      totalDocuments: data.length,
      activeDocuments: data.filter(d => d.estado === 'Activo').length,
      inactiveDocuments: data.filter(d => d.estado === 'Inactivo').length,
      expiredDocuments: data.filter(d => d.estado === 'Vencido').length,
      expiringDocuments: 0,
      totalValue: data.reduce((sum, d) => sum + (d.valor_titulo || 0), 0),
    };

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    stats.expiringDocuments = data.filter(d => {
      if (!d.fecha_vencimiento) return false;
      const vencimiento = new Date(d.fecha_vencimiento);
      return vencimiento >= today && vencimiento <= thirtyDaysFromNow;
    }).length;

    return stats;
  }
};
