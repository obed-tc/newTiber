import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'SuperAdmin' | 'Administrador' | 'Visualizador';
export type UserStatus = 'Activo' | 'Inactivo';

export interface User {
  id: string;
  full_name: string;
  email: string;
  rol: UserRole;
  estado: UserStatus;
  ultimo_acceso: string | null;
  created_at: string;
}

export interface UserWithWorkspaces extends User {
  workspaces: {
    workspace_id: string;
    workspace_name: string;
    rol: UserRole;
    estado: UserStatus;
  }[];
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithWorkspaces[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const usersWithWorkspaces: UserWithWorkspaces[] = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: workspacesData } = await supabase
            .from('user_workspaces')
            .select(`
              rol,
              estado,
              workspace_id,
              workspaces (
                id,
                name
              )
            `)
            .eq('user_id', user.id);

          return {
            ...user,
            workspaces: (workspacesData || []).map((uw: any) => ({
              workspace_id: uw.workspace_id,
              workspace_name: uw.workspaces?.name || '',
              rol: uw.rol,
              estado: uw.estado
            }))
          };
        })
      );

      setUsers(usersWithWorkspaces);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    full_name: string;
    email: string;
    rol: UserRole;
    workspaceIds: string[];
  }) => {
    try {
      const { data: newUser, error: userError } = await supabase
        .from('usuarios')
        .insert({
          full_name: userData.full_name,
          email: userData.email,
          rol: userData.rol,
          estado: 'Activo'
        })
        .select()
        .single();

      if (userError) throw userError;

      if (userData.workspaceIds.length > 0) {
        const userWorkspaces = userData.workspaceIds.map(workspaceId => ({
          user_id: newUser.id,
          workspace_id: workspaceId,
          rol: userData.rol,
          estado: 'Activo'
        }));

        const { error: workspaceError } = await supabase
          .from('user_workspaces')
          .insert(userWorkspaces);

        if (workspaceError) throw workspaceError;
      }

      await fetchUsers();

      toast({
        title: 'Usuario creado',
        description: `${userData.full_name} ha sido creado exitosamente`
      });

      return newUser;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();

      toast({
        title: 'Usuario actualizado',
        description: 'Los cambios han sido guardados'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();

      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    await updateUser(userId, { estado: newStatus });
  };

  const addUserToWorkspace = async (userId: string, workspaceId: string, rol: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_workspaces')
        .insert({
          user_id: userId,
          workspace_id: workspaceId,
          rol,
          estado: 'Activo'
        });

      if (error) throw error;

      await fetchUsers();

      toast({
        title: 'Usuario agregado',
        description: 'El usuario ha sido agregado al workspace'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add user to workspace',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const removeUserFromWorkspace = async (userId: string, workspaceId: string) => {
    try {
      const { error } = await supabase
        .from('user_workspaces')
        .delete()
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      await fetchUsers();

      toast({
        title: 'Usuario removido',
        description: 'El usuario ha sido removido del workspace'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove user from workspace',
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    addUserToWorkspace,
    removeUserFromWorkspace
  };
};
