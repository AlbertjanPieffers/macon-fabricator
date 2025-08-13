import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type BatchStatus = 'Draft' | 'Queued' | 'Running' | 'Paused' | 'Completed' | 'Error';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Batch {
  id: string;
  batch_id: string;
  name: string;
  status: BatchStatus;
  priority: PriorityLevel;
  operator_name: string;
  start_time?: string;
  estimated_completion_time?: string;
  progress_percentage: number;
  total_parts: number;
  completed_parts: number;
  efficiency_percentage: number;
  quality_score_percentage: number;
  created_at: string;
  updated_at: string;
}

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Batch[];
    }
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (batchData: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('batches')
        .insert([batchData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast({
        title: "Success",
        description: "Batch created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create batch: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Batch> }) => {
      const { data, error } = await supabase
        .from('batches')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast({
        title: "Success",
        description: "Batch updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update batch: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};