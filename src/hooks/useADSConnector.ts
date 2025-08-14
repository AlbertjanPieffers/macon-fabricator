import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface ADSConnectionConfig {
  host: string
  port?: number
  amsNetId: string
  amsPort?: number
}

export interface ADSRequest {
  action: string
  data?: any
}

export const useADSConnector = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ action, data }: ADSRequest) => {
      const { data: result, error } = await supabase.functions.invoke('ads-connector', {
        body: { action, data }
      })

      if (error) throw error
      return result
    },
    onError: (error: any) => {
      toast({
        title: "ADS Connection Error",
        description: `Failed to connect to PLC: ${error.message}`,
        variant: "destructive",
      })
    }
  })
}

// Specific hooks for different ADS operations
export const useGetSystemState = () => {
  const connector = useADSConnector()
  
  return useMutation({
    mutationFn: (config?: ADSConnectionConfig) => 
      connector.mutateAsync({ action: 'getSystemState', data: config }),
  })
}

export const useReadVariable = () => {
  const connector = useADSConnector()
  
  return useMutation({
    mutationFn: ({ variableName, config }: { variableName: string, config?: ADSConnectionConfig }) => 
      connector.mutateAsync({ 
        action: 'readVariable', 
        data: { variableName, ...config } 
      }),
  })
}

export const useWriteVariable = () => {
  const connector = useADSConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ variableName, value, config }: { 
      variableName: string, 
      value: any, 
      config?: ADSConnectionConfig 
    }) => connector.mutateAsync({ 
      action: 'writeVariable', 
      data: { variableName, value, ...config } 
    }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Variable written to PLC successfully",
      })
    }
  })
}

export const useGetMachineData = () => {
  const connector = useADSConnector()
  
  return useMutation({
    mutationFn: (config?: ADSConnectionConfig) => 
      connector.mutateAsync({ action: 'readMachineData', data: config }),
  })
}

export const useStartBatch = () => {
  const connector = useADSConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ batchId, config }: { batchId: string, config?: ADSConnectionConfig }) => 
      connector.mutateAsync({ 
        action: 'startBatch', 
        data: { batchId, ...config } 
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Batch started on machine",
      })
    }
  })
}

export const useStopBatch = () => {
  const connector = useADSConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (config?: ADSConnectionConfig) => 
      connector.mutateAsync({ action: 'stopBatch', data: config }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Batch stopped on machine",
      })
    }
  })
}

export const usePauseBatch = () => {
  const connector = useADSConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (config?: ADSConnectionConfig) => 
      connector.mutateAsync({ action: 'pauseBatch', data: config }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Batch paused on machine",
      })
    }
  })
}

export const useResetMachine = () => {
  const connector = useADSConnector()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: (config?: ADSConnectionConfig) => 
      connector.mutateAsync({ action: 'resetMachine', data: config }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Machine reset initiated",
      })
    }
  })
}