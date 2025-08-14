import axios from 'axios';
import { MachineStatus, MachineEvent } from '../types';

class PLCBridgeService {
  private baseUrl: string;
  private timeout: number = 5000;

  constructor() {
    this.baseUrl = process.env.PLC_BRIDGE_BASE || '';
    if (!this.baseUrl) {
      console.warn('PLC_BRIDGE_BASE not configured');
    }
  }

  private async readSymbol(symbol: string): Promise<string> {
    if (!this.baseUrl) {
      throw new Error('PLC bridge not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/read`, {
        params: { symbol },
        timeout: this.timeout
      });
      
      return response.data?.value || '';
    } catch (error) {
      console.error(`Failed to read PLC symbol ${symbol}:`, error);
      throw new Error('bridge_down');
    }
  }

  async getMachineStatus(): Promise<MachineStatus> {
    try {
      const [state, progressPct, currentProduct] = await Promise.all([
        this.readSymbol('MAIN.MachineState'),
        this.readSymbol('MAIN.ProgressPct'),
        this.readSymbol('MAIN.CurrentProduct')
      ]);

      return {
        state: state || 'Unknown',
        progressPct: parseFloat(progressPct) || 0,
        currentProduct: currentProduct || 'None'
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'bridge_down') {
        throw error;
      }
      throw new Error('bridge_down');
    }
  }

  async getMachineEvents(): Promise<MachineEvent[]> {
    // Placeholder - return empty array for now
    // In the future, this could read from PLC event logs
    return [];
  }
}

export const plcBridgeService = new PLCBridgeService();