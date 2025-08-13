import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Machine {
  id: string;
  machine_name: string;
  machine_type: string;
  status: string;
  current_batch_id?: string;
  efficiency_percentage: number;
  uptime_hours: number;
  last_maintenance?: string;
  created_at: string;
  updated_at: string;
}

export const useMachines = () => {
  return useQuery({
    queryKey: ['machines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('machine_name');
      
      if (error) throw error;
      return data as Machine[];
    }
  });
};

export const useUpdateMachine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Machine> }) => {
      const { data, error } = await supabase
        .from('machines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Success",
        description: "Machine updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update machine: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};