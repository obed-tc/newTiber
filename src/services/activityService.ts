import { supabase } from '@/lib/supabase';

interface LogActivityParams {
  accion: string;
  entidad_tipo?: string;
  entidad_nombre?: string;
  entidad_id?: string;
  metadata?: Record<string, any>;
}

export const logActivity = async ({
  accion,
  entidad_tipo,
  entidad_nombre,
  entidad_id,
  metadata
}: LogActivityParams): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('actividad_reciente')
      .insert({
        usuario_id: user?.id || null,
        accion,
        entidad_tipo: entidad_tipo || null,
        entidad_nombre: entidad_nombre || null,
        entidad_id: entidad_id || null,
        metadata: metadata || null
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error in logActivity:', error);
  }
};
