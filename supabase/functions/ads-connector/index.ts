import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ADS Protocol Constants
const ADS_COMMAND = {
  READ: 2,
  WRITE: 3,
  READ_STATE: 4,
  WRITE_CONTROL: 5,
  ADD_NOTIFICATION: 6,
  DEL_NOTIFICATION: 7,
  NOTIFICATION: 8,
  READ_WRITE: 9
}

const ADS_STATE = {
  INVALID: 0,
  IDLE: 1,
  RESET: 2,
  INIT: 3,
  START: 4,
  RUN: 5,
  STOP: 6,
  SAVECFG: 7,
  LOADCFG: 8,
  POWERFAILURE: 9,
  POWERGOOD: 10,
  ERROR: 11,
  SHUTDOWN: 12,
  SUSPEND: 13,
  RESUME: 14,
  CONFIG: 15,
  RECONFIG: 16
}

interface ADSConnection {
  host: string
  port: number
  amsNetId: string
  amsPort: number
  connected: boolean
  socket?: Deno.TcpConn
}

class ADSClient {
  private connection: ADSConnection
  private invokeId: number = 0

  constructor(host: string, port: number = 48898, amsNetId: string, amsPort: number = 851) {
    this.connection = {
      host,
      port,
      amsNetId,
      amsPort,
      connected: false
    }
  }

  async connect(): Promise<void> {
    try {
      this.connection.socket = await Deno.connect({
        hostname: this.connection.host,
        port: this.connection.port
      })
      this.connection.connected = true
      console.log(`Connected to ADS server at ${this.connection.host}:${this.connection.port}`)
    } catch (error) {
      console.error('Failed to connect to ADS server:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection.socket) {
      this.connection.socket.close()
      this.connection.connected = false
      console.log('Disconnected from ADS server')
    }
  }

  private getNextInvokeId(): number {
    this.invokeId = (this.invokeId + 1) % 0xFFFFFFFF
    return this.invokeId
  }

  private createAMSHeader(command: number, dataLength: number): Uint8Array {
    const buffer = new ArrayBuffer(32)
    const view = new DataView(buffer)
    
    // Target AMS Net ID (6 bytes)
    const targetNetId = this.connection.amsNetId.split('.').map(x => parseInt(x))
    for (let i = 0; i < 6; i++) {
      view.setUint8(i, targetNetId[i])
    }
    
    // Target AMS Port (2 bytes)
    view.setUint16(6, this.connection.amsPort, true)
    
    // Source AMS Net ID (6 bytes) - use local machine
    for (let i = 8; i < 14; i++) {
      view.setUint8(i, 192) // Default to 192.168.1.1
    }
    view.setUint8(11, 168)
    view.setUint8(12, 1)
    view.setUint8(13, 100)
    
    // Source AMS Port (2 bytes)
    view.setUint16(14, 32905, true)
    
    // Command ID (2 bytes)
    view.setUint16(16, command, true)
    
    // State flags (2 bytes)
    view.setUint16(18, 4, true) // Request flag
    
    // Data length (4 bytes)
    view.setUint32(20, dataLength, true)
    
    // Error code (4 bytes)
    view.setUint32(24, 0, true)
    
    // Invoke ID (4 bytes)
    view.setUint32(28, this.getNextInvokeId(), true)
    
    return new Uint8Array(buffer)
  }

  async readState(): Promise<{ adsState: number, deviceState: number }> {
    if (!this.connection.connected || !this.connection.socket) {
      throw new Error('Not connected to ADS server')
    }

    const header = this.createAMSHeader(ADS_COMMAND.READ_STATE, 0)
    
    // Send request
    await this.connection.socket.write(header)
    
    // Read response
    const responseHeader = new Uint8Array(32)
    await this.connection.socket.read(responseHeader)
    
    const responseData = new Uint8Array(8)
    await this.connection.socket.read(responseData)
    
    const dataView = new DataView(responseData.buffer)
    return {
      adsState: dataView.getUint16(0, true),
      deviceState: dataView.getUint16(2, true)
    }
  }

  async readByName(variableName: string): Promise<any> {
    if (!this.connection.connected || !this.connection.socket) {
      throw new Error('Not connected to ADS server')
    }

    // Create read request data
    const nameBuffer = new TextEncoder().encode(variableName + '\0')
    const requestData = new ArrayBuffer(12 + nameBuffer.length)
    const requestView = new DataView(requestData)
    
    // Index Group (4 bytes) - Symbol by name
    requestView.setUint32(0, 0xF003, true)
    
    // Index Offset (4 bytes)
    requestView.setUint32(4, 0, true)
    
    // Read length (4 bytes) - Max 255 bytes for value
    requestView.setUint32(8, 255, true)
    
    // Variable name
    new Uint8Array(requestData, 12).set(nameBuffer)
    
    const header = this.createAMSHeader(ADS_COMMAND.READ, requestData.byteLength)
    
    // Send request
    await this.connection.socket.write(header)
    await this.connection.socket.write(new Uint8Array(requestData))
    
    // Read response header
    const responseHeader = new Uint8Array(32)
    await this.connection.socket.read(responseHeader)
    
    const headerView = new DataView(responseHeader.buffer)
    const dataLength = headerView.getUint32(20, true)
    const errorCode = headerView.getUint32(24, true)
    
    if (errorCode !== 0) {
      throw new Error(`ADS Error: ${errorCode}`)
    }
    
    // Read response data
    const responseData = new Uint8Array(dataLength)
    await this.connection.socket.read(responseData)
    
    // Parse the response (simplified - would need proper type handling)
    const decoder = new TextDecoder()
    return decoder.decode(responseData).replace(/\0/g, '')
  }

  async writeByName(variableName: string, value: any): Promise<void> {
    if (!this.connection.connected || !this.connection.socket) {
      throw new Error('Not connected to ADS server')
    }

    // Convert value to bytes (simplified)
    const valueBuffer = new TextEncoder().encode(value.toString())
    const nameBuffer = new TextEncoder().encode(variableName + '\0')
    
    const requestData = new ArrayBuffer(8 + nameBuffer.length + valueBuffer.length)
    const requestView = new DataView(requestData)
    
    // Index Group (4 bytes) - Symbol by name
    requestView.setUint32(0, 0xF003, true)
    
    // Index Offset (4 bytes)
    requestView.setUint32(4, 0, true)
    
    // Variable name
    new Uint8Array(requestData, 8).set(nameBuffer)
    
    // Value data
    new Uint8Array(requestData, 8 + nameBuffer.length).set(valueBuffer)
    
    const header = this.createAMSHeader(ADS_COMMAND.WRITE, requestData.byteLength)
    
    // Send request
    await this.connection.socket.write(header)
    await this.connection.socket.write(new Uint8Array(requestData))
    
    // Read response header
    const responseHeader = new Uint8Array(32)
    await this.connection.socket.read(responseHeader)
    
    const headerView = new DataView(responseHeader.buffer)
    const errorCode = headerView.getUint32(24, true)
    
    if (errorCode !== 0) {
      throw new Error(`ADS Write Error: ${errorCode}`)
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    
    // Get ADS connection parameters from environment or request
    const adsHost = data?.host || Deno.env.get('ADS_HOST') || '192.168.1.100'
    const adsPort = parseInt(data?.port || Deno.env.get('ADS_PORT') || '48898')
    const amsNetId = data?.amsNetId || Deno.env.get('AMS_NET_ID') || '192.168.1.100.1.1'
    const amsPort = parseInt(data?.amsPort || Deno.env.get('AMS_PORT') || '851')

    const adsClient = new ADSClient(adsHost, adsPort, amsNetId, amsPort)
    
    let result: any = {}

    try {
      await adsClient.connect()

      switch (action) {
        case 'getSystemState':
          const state = await adsClient.readState()
          result = {
            adsState: state.adsState,
            deviceState: state.deviceState,
            adsStateText: getAdsStateText(state.adsState),
            connected: true
          }
          break

        case 'readVariable':
          if (!data?.variableName) {
            throw new Error('Variable name required')
          }
          const value = await adsClient.readByName(data.variableName)
          result = { variableName: data.variableName, value }
          break

        case 'writeVariable':
          if (!data?.variableName || data?.value === undefined) {
            throw new Error('Variable name and value required')
          }
          await adsClient.writeByName(data.variableName, data.value)
          result = { success: true, message: 'Variable written successfully' }
          break

        case 'readMachineData':
          // Read multiple machine-related variables
          const machineData = {
            currentBatch: await adsClient.readByName('MAIN.CurrentBatch').catch(() => ''),
            machineStatus: await adsClient.readByName('MAIN.MachineStatus').catch(() => 'Unknown'),
            efficiency: await adsClient.readByName('MAIN.Efficiency').catch(() => 0),
            cycleTime: await adsClient.readByName('MAIN.CycleTime').catch(() => 0),
            partsProduced: await adsClient.readByName('MAIN.PartsProduced').catch(() => 0),
            alarms: await adsClient.readByName('MAIN.ActiveAlarms').catch(() => []),
            temperature: await adsClient.readByName('MAIN.Temperature').catch(() => 0),
            pressure: await adsClient.readByName('MAIN.Pressure').catch(() => 0)
          }
          result = machineData
          break

        case 'startBatch':
          if (!data?.batchId) {
            throw new Error('Batch ID required')
          }
          await adsClient.writeByName('MAIN.StartBatch', data.batchId)
          await adsClient.writeByName('MAIN.Command', 'START')
          result = { success: true, message: 'Batch started successfully' }
          break

        case 'stopBatch':
          await adsClient.writeByName('MAIN.Command', 'STOP')
          result = { success: true, message: 'Batch stopped successfully' }
          break

        case 'pauseBatch':
          await adsClient.writeByName('MAIN.Command', 'PAUSE')
          result = { success: true, message: 'Batch paused successfully' }
          break

        case 'resetMachine':
          await adsClient.writeByName('MAIN.Command', 'RESET')
          result = { success: true, message: 'Machine reset initiated' }
          break

        default:
          result = { error: 'Unknown action' }
      }

    } finally {
      await adsClient.disconnect()
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('ADS connector error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'ADS connection error', 
        details: error.message,
        connected: false
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function getAdsStateText(state: number): string {
  const stateNames: { [key: number]: string } = {
    0: 'Invalid',
    1: 'Idle',
    2: 'Reset',
    3: 'Init',
    4: 'Start',
    5: 'Run',
    6: 'Stop',
    7: 'SaveCfg',
    8: 'LoadCfg',
    9: 'PowerFailure',
    10: 'PowerGood',
    11: 'Error',
    12: 'Shutdown',
    13: 'Suspend',
    14: 'Resume',
    15: 'Config',
    16: 'Reconfig'
  }
  return stateNames[state] || 'Unknown'
}