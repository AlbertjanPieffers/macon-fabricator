import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ProductProfile = 'IPE240' | 'IPE300' | 'HEB200' | 'HEB300' | 'L80x80' | 'L100x100';
export type ProductStatus = 'Draft' | 'Ready' | 'Processing' | 'Complete';

export interface Product {
  id: string;
  product_id: string;
  name: string;
  profile: ProductProfile;
  length_mm: number;
  status: ProductStatus;
  priority: number;
  data3?: string;
  data5?: string;
  data6?: string;
  estimated_cut_time_seconds?: number;
  operations_count: number;
  nc_file_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductOperation {
  id: string;
  product_id: string;
  operation_type: string;
  position_mm: number;
  size_value?: number;
  angle_value?: number;
  operation_order: number;
  created_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create product: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};

export const useProductOperations = (productId: string) => {
  return useQuery({
    queryKey: ['product-operations', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_operations')
        .select('*')
        .eq('product_id', productId)
        .order('operation_order');
      
      if (error) throw error;
      return data as ProductOperation[];
    },
    enabled: !!productId
  });
};