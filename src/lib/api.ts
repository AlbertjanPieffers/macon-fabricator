import { supabase } from '@/integrations/supabase/client';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Products API
  async getProducts(query?: string, profile?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (profile) params.append('profile', profile);
    
    const queryString = params.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  // Batches API
  async getBatches(): Promise<any[]> {
    return this.request('/batches');
  }

  async createBatch(batch: any) {
    return this.request('/batches', {
      method: 'POST',
      body: JSON.stringify(batch),
    });
  }

  async updateBatch(index: number, updates: any) {
    return this.request(`/batches/${index}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Machine API
  async getMachineStatus(): Promise<{ state: string; progressPct: number; currentProduct: string }> {
    return this.request('/machine/status');
  }

  async getMachineEvents(): Promise<Array<{ id: string; timestamp: string; level: 'info' | 'warning' | 'error'; message: string; source: string }>> {
    return this.request('/machine/events');
  }

  // Files API
  async listFiles(sub: string = 'Products') {
    return this.request(`/files/list?sub=${encodeURIComponent(sub)}`);
  }

  async downloadFile(path: string): Promise<Blob> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE}/files/download?path=${encodeURIComponent(path)}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();