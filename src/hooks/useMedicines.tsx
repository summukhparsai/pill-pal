import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Medicine = Tables<'medicines'>;
type MedicineInsert = TablesInsert<'medicines'>;

export function useMedicines() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const medicinesQuery = useQuery({
    queryKey: ['medicines', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Medicine[];
    },
    enabled: !!user,
  });

  const addMedicine = useMutation({
    mutationFn: async (medicine: Omit<MedicineInsert, 'user_id'>) => {
      const { data, error } = await supabase
        .from('medicines')
        .insert({ ...medicine, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine added!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMedicine = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Medicine> & { id: string }) => {
      const { error } = await supabase.from('medicines').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine updated!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMedicine = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('medicines').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast.success('Medicine deleted');
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { medicines: medicinesQuery.data ?? [], isLoading: medicinesQuery.isLoading, addMedicine, updateMedicine, deleteMedicine };
}
