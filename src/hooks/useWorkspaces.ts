import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type WorkspaceStatus = 'Activo' | 'Inactivo';

export interface Workspace {
  id: string;
  name: string;
  client_id: string | null;
  description: string | null;
  estado: WorkspaceStatus;
  created_at: string;
  last_activity_at: string | null;
  user_count: number;
}

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorkspaces(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch workspaces',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (workspaceData: {
    name: string;
    client_id?: string;
    description?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: workspaceData.name,
          client_id: workspaceData.client_id || null,
          description: workspaceData.description || null,
          estado: 'Activo',
          user_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      await fetchWorkspaces();

      toast({
        title: 'Workspace creado',
        description: `${workspaceData.name} ha sido creado exitosamente`
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create workspace',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>) => {
    try {
      const { error } = await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', workspaceId);

      if (error) throw error;

      await fetchWorkspaces();

      toast({
        title: 'Workspace actualizado',
        description: 'Los cambios han sido guardados'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update workspace',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);

      if (error) throw error;

      await fetchWorkspaces();

      toast({
        title: 'Workspace eliminado',
        description: 'El workspace ha sido eliminado exitosamente'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete workspace',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const toggleWorkspaceStatus = async (workspaceId: string, currentStatus: WorkspaceStatus) => {
    const newStatus: WorkspaceStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    await updateWorkspace(workspaceId, { estado: newStatus });
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    loading,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    toggleWorkspaceStatus
  };
};
