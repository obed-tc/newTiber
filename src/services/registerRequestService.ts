import { supabase } from '@/lib/supabase';

export interface RegisterRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface CreateRegisterRequestData {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  message?: string;
}

// Crear nueva solicitud de registro
export const createRegisterRequest = async (data: CreateRegisterRequestData): Promise<RegisterRequest> => {
  const { data: newRequest, error } = await supabase
    .from('register_requests')
    .insert({
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return newRequest;
};

// Obtener solicitudes pendientes
export const getPendingRegisterRequests = async (): Promise<RegisterRequest[]> => {
  const { data, error } = await supabase
    .from('register_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Aprobar solicitud
export const approveRegisterRequest = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('register_requests')
    .update({
      status: 'approved',
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};

// Rechazar solicitud
export const rejectRegisterRequest = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('register_requests')
    .update({
      status: 'rejected',
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
};
