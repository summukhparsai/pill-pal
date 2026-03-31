import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { startOfDay, endOfDay, format } from 'date-fns';

type ReminderLog = Tables<'reminder_logs'>;

export function useReminderLogs(dateRange?: { start: Date; end: Date }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logsQuery = useQuery({
    queryKey: ['reminder_logs', user?.id, dateRange?.start?.toISOString(), dateRange?.end?.toISOString()],
    queryFn: async () => {
      let query = supabase.from('reminder_logs').select('*, medicines(name, dosage)').order('scheduled_time', { ascending: false });
      if (dateRange) {
        query = query.gte('scheduled_time', startOfDay(dateRange.start).toISOString())
          .lte('scheduled_time', endOfDay(dateRange.end).toISOString());
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateLogStatus = useMutation({
    mutationFn: async ({ id, status, snoozedUntil }: { id: string; status: string; snoozedUntil?: string }) => {
      const updates: any = { status };
      if (status === 'taken') updates.taken_at = new Date().toISOString();
      if (snoozedUntil) updates.snoozed_until = snoozedUntil;
      const { error } = await supabase.from('reminder_logs').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder_logs'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const createLog = useMutation({
    mutationFn: async (log: { medicine_id: string; scheduled_time: string }) => {
      const { error } = await supabase.from('reminder_logs').insert({
        ...log,
        user_id: user!.id,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminder_logs'] }),
  });

  return { logs: logsQuery.data ?? [], isLoading: logsQuery.isLoading, updateLogStatus, createLog };
}
