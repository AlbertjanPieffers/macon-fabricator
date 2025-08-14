import axios from 'axios';
import { FileEntry } from '../types';

class FileBridgeService {
  private baseUrl: string;
  private timeout: number = 10000;

  constructor() {
    this.baseUrl = process.env.FILE_BRIDGE_BASE || '';
    if (!this.baseUrl) {
      console.warn('FILE_BRIDGE_BASE not configured');
    }
  }

  async listFiles(sub: string = 'Products'): Promise<FileEntry[]> {
    if (!this.baseUrl) {
      throw new Error('File bridge not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/list`, {
        params: { sub },
        timeout: this.timeout
      });

      return response.data?.files || [];
    } catch (error) {
      console.error(`Failed to list files from ${sub}:`, error);
      throw new Error('bridge_down');
    }
  }

  async downloadFile(path: string): Promise<NodeJS.ReadableStream> {
    if (!this.baseUrl) {
      throw new Error('File bridge not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/download`, {
        params: { path },
        responseType: 'stream',
        timeout: this.timeout
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to download file ${path}:`, error);
      throw new Error('bridge_down');
    }
  }
}

export const fileBridgeService = new FileBridgeService();