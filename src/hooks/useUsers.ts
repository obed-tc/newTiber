import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/services/activityService';

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
        description: error.message || 'No se pudieron cargar los usuarios',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    full_name: string;
    email: string;
    password: string;
    rol: UserRole;
    workspaceIds: string[];
  }) => {
    try {
      // 1. Crear usuario en Supabase Auth (esto crea automáticamente el registro en usuarios via trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            rol: userData.rol
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario de autenticación');

      // 2. Actualizar el registro que se creó automáticamente con los datos completos
      const { data: updatedUser, error: updateError } = await supabase
        .from('usuarios')
        .update({
          full_name: userData.full_name,
          email: userData.email,
          rol: userData.rol,
          estado: 'Activo'
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (updateError) {
        // Si falla la actualización, eliminar el usuario de auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw updateError;
      }

      // 3. Asignar workspaces
      if (userData.workspaceIds.length > 0) {
        const userWorkspaces = userData.workspaceIds.map(workspaceId => ({
          user_id: authData.user.id,
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

      await logActivity({
        accion: 'Usuario creado',
        entidad_tipo: 'usuario',
        entidad_nombre: userData.full_name,
        entidad_id: authData.user.id
      });

      toast({
        title: 'Usuario creado',
        description: `${userData.full_name} ha sido creado exitosamente`
      });

      return updatedUser;
    } catch (error: any) {
      toast({
        title: 'Error al crear usuario',
        description: error.message || 'No se pudo crear el usuario',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: {
    full_name: string;
    email: string;
    rol: UserRole;
    workspaceIds: string[];
    password?: string;
  }) => {
    try {
      // 1. Actualizar datos básicos del usuario
      const { error: userError } = await supabase
        .from('usuarios')
        .update({
          full_name: updates.full_name,
          email: updates.email,
          rol: updates.rol
        })
        .eq('id', userId);

      if (userError) throw userError;

      // 2. Actualizar contraseña si se proporciona
      if (updates.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          userId,
          { password: updates.password }
        );

        if (passwordError) throw passwordError;
      }

      // 3. Actualizar workspaces
      // Primero eliminar todas las asignaciones existentes
      const { error: deleteError } = await supabase
        .from('user_workspaces')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Luego insertar las nuevas asignaciones
      if (updates.workspaceIds.length > 0) {
        const userWorkspaces = updates.workspaceIds.map(workspaceId => ({
          user_id: userId,
          workspace_id: workspaceId,
          rol: updates.rol,
          estado: 'Activo'
        }));

        const { error: workspaceError } = await supabase
          .from('user_workspaces')
          .insert(userWorkspaces);

        if (workspaceError) throw workspaceError;
      }

      await fetchUsers();

      await logActivity({
        accion: 'Usuario actualizado',
        entidad_tipo: 'usuario',
        entidad_nombre: updates.full_name,
        entidad_id: userId
      });

      toast({
        title: 'Usuario actualizado',
        description: `${updates.full_name} ha sido actualizado exitosamente`
      });
    } catch (error: any) {
      toast({
        title: 'Error al actualizar usuario',
        description: error.message || 'No se pudo actualizar el usuario',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);

      // 1. Eliminar de la tabla usuarios (esto también eliminará user_workspaces por CASCADE)
      const { error: dbError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userId);

      if (dbError) throw dbError;

      // 2. Eliminar del sistema de autenticación
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.warn('Error al eliminar usuario de auth:', authError.message);
      }

      await fetchUsers();

      if (user) {
        await logActivity({
          accion: 'Usuario eliminado',
          entidad_tipo: 'usuario',
          entidad_nombre: user.full_name,
          entidad_id: userId
        });
      }

      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el usuario',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ estado: newStatus })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();

      const user = users.find(u => u.id === userId);
      if (user) {
        await logActivity({
          accion: `Usuario ${newStatus === 'Activo' ? 'activado' : 'desactivado'}`,
          entidad_tipo: 'usuario',
          entidad_nombre: user.full_name,
          entidad_id: userId
        });
      }

      toast({
        title: 'Estado actualizado',
        description: `El usuario ha sido ${newStatus === 'Activo' ? 'activado' : 'desactivado'}`
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo cambiar el estado del usuario',
        variant: 'destructive'
      });
      throw error;
    }
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
        description: error.message || 'No se pudo agregar el usuario al workspace',
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
        description: error.message || 'No se pudo remover el usuario del workspace',
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