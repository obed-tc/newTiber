import { useState, useEffect } from "react";

export interface CustomAttribute {
  id: string;
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

// This would be replaced with actual API calls in a real implementation
const STORAGE_KEY = "tiverdocs_custom_attributes";
const DOC_ATTRIBUTES_KEY = "tiverdocs_document_attributes";

export const useCustomAttributes = () => {
  const [attributes, setAttributes] = useState<CustomAttribute[]>([]);
  const [documentAttributes, setDocumentAttributes] = useState<Record<string, DocumentAttributeValue[]>>({});

  useEffect(() => {
    // Load attributes from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAttributes(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading custom attributes:", error);
      }
    }

    // Load document attributes from localStorage
    const storedDocAttrs = localStorage.getItem(DOC_ATTRIBUTES_KEY);
    if (storedDocAttrs) {
      try {
        setDocumentAttributes(JSON.parse(storedDocAttrs));
      } catch (error) {
        console.error("Error loading document attributes:", error);
      }
    }
  }, []);

  const saveAttributes = (newAttributes: CustomAttribute[]) => {
    setAttributes(newAttributes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAttributes));
  };

  const saveDocumentAttributes = (documentId: string, attrs: DocumentAttributeValue[]) => {
    const updated = { ...documentAttributes, [documentId]: attrs };
    setDocumentAttributes(updated);
    localStorage.setItem(DOC_ATTRIBUTES_KEY, JSON.stringify(updated));
  };

  const getAttributesForDocumentType = (documentType: string): CustomAttribute[] => {
    return attributes.filter(attr => attr.documentTypes.includes(documentType));
  };

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