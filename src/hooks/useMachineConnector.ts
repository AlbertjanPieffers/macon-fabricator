import { useMutation, useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface MachineConnectorData {
  action: string
  data?: any
}

export const useMachineConnector = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ action, data }: MachineConnectorData) => {
      const { data: result, error } = await supabase.functions.invoke('machine-connector', {
        body: { action, data }
      })

      if (error) throw error
      return result
    },
    onError: (error: any) => {
      toast({
        title: "Machine Connection Error",
        description: `Failed to connect to machine: ${error.message}`,
        variant: "destructive",
      })
    }
  })
}

// Specific hooks for different operations
export const useGetMachineProducts = () => {
  const connector = useMachineConnector()
  
  return useMutation({
    mutationFn: () => connector.mutateAsync({ action: 'getProducts' }),
  })
}

export const useGetMachineBatches = () => {
  const connector = useMachineConnector()
  
  return useMutation({
    mutationFn: () => connector.mutateAsync({ action: 'getBatches' }),
  })
}

export const useSyncProductToMachine = () => {
  const connector = useMachineConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (product: any) => connector.mutateAsync({ 
      action: 'syncProduct', 
      data: { product } 
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product synced to machine successfully",
      })
    }
  })
}

export const useSyncBatchToMachine = () => {
  const connector = useMachineConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (batch: any) => connector.mutateAsync({ 
      action: 'syncBatch', 
      data: { batch } 
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Batch synced to machine successfully",
      })
    }
  })
}

export const useUpdateMachineStatus = () => {
  const connector = useMachineConnector()
  
  return useMutation({
    mutationFn: ({ machineId, status, currentBatchId }: { 
      machineId: string
      status: string
      currentBatchId?: string 
    }) => connector.mutateAsync({ 
      action: 'updateMachineStatus', 
      data: { machineId, status, currentBatchId } 
    }),
  })
}