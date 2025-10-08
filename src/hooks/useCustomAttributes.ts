import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Ajusta según tu cliente

export interface CustomAttribute {
  id: string; // UUID generado por la BD
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  documentTypes: string[];
  options?: string[];
  required: boolean;
}

export interface DocumentAttributeValue {
  attributeId: string;
  value: string | number;
}

// Hook mejorado para usar la base de datos
export const useCustomAttributes = () => {
  const [attributes, setAttributes] = useState<CustomAttribute[]>([]);
  const [documentAttributes, setDocumentAttributes] = useState<Record<string, DocumentAttributeValue[]>>({});

  // Cargar atributos desde la BD
  const loadAttributes = async () => {
    try {
      const { data, error } = await supabase
        .from("atributos_personalizados")
        .select("*");
      if (error) throw error;
      if (data) {
        // Mapear el campo 'nombre' a 'name' y 'tipo' a 'type'
        const mapped: CustomAttribute[] = data.map((attr) => ({
          id: attr.id,
          name: attr.nombre,
          label: attr.nombre, // o usar otro campo si lo tienes para label
          type: attr.tipo,
          documentTypes: attr.tipos_documento || [],
          options: attr.opciones || [],
          required: attr.requerido || false,
        }));
        setAttributes(mapped);
      }
    } catch (error) {
      console.error("Error loading custom attributes from DB:", error);
    }
  };

  // Cargar valores de atributos de documentos
  const loadDocumentAttributes = async () => {
    try {
      const { data, error } = await supabase
        .from("valores_atributos")
        .select("*");
      if (error) throw error;

      if (data) {
        const mapped: Record<string, DocumentAttributeValue[]> = {};
        data.forEach((item) => {
          if (!mapped[item.documento_id]) mapped[item.documento_id] = [];
          mapped[item.documento_id].push({
            attributeId: item.atributo_id,
            value: item.valor
          });
        });
        setDocumentAttributes(mapped);
      }
    } catch (error) {
      console.error("Error loading document attributes:", error);
    }
  };

  useEffect(() => {
    loadAttributes();
    loadDocumentAttributes();
  }, []);

  // Guardar atributos personalizados en la BD
  const saveAttributes = async (newAttributes: Omit<CustomAttribute, "id">[]) => {
    try {
      const { data, error } = await supabase
        .from("atributos_personalizados")
        .upsert(
          newAttributes.map(attr => ({
            nombre: attr.name,
            tipo: attr.type,
            tipos_documento: attr.documentTypes,
            opciones: attr.options || [],
            requerido: attr.required
          })),
          { onConflict: "nombre" } // campo único para upsert
        );

      if (error) throw error;
      // Recargar la lista desde la BD para asegurar que tenemos los IDs correctos
      await loadAttributes();
    } catch (error) {
      console.error("Error saving custom attributes to DB:", error);
    }
  };

  // Guardar valores de atributos de un documento
  const saveDocumentAttributes = async (documentId: string, attrs: DocumentAttributeValue[]) => {
    try {
      // Primero elimina los anteriores valores de ese documento para no duplicar
      const { error: deleteError } = await supabase
        .from("valores_atributos")
        .delete()
        .eq("documento_id", documentId);
      if (deleteError) throw deleteError;

      // Inserta los nuevos valores
      const { error: insertError } = await supabase
        .from("valores_atributos")
        .insert(
          attrs.map(a => ({
            documento_id: documentId,
            atributo_id: a.attributeId,
            valor: a.value.toString()
          }))
        );
      if (insertError) throw insertError;

      // Actualiza estado local
      setDocumentAttributes(prev => ({
        ...prev,
        [documentId]: attrs
      }));
    } catch (error) {
      console.error("Error saving document attributes:", error);
    }
  };

  // Filtrar atributos por tipo de documento
  const getAttributesForDocumentType = (documentType: string): CustomAttribute[] => {
    return attributes.filter(attr => attr.documentTypes.includes(documentType));
  };

  // Obtener atributos de un documento específico
  const getDocumentAttributes = (documentId: string): DocumentAttributeValue[] => {
    return documentAttributes[documentId] || [];
  };

  return {
    attributes,
    saveAttributes,
    getAttributesForDocumentType,
    documentAttributes,
    saveDocumentAttributes,
    getDocumentAttributes
  };
};
