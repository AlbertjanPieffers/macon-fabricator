import { Activity, Cpu, Database, Clock, AlertTriangle, CheckCircle, Wifi, Thermometer, Gauge, Zap, Settings, TrendingUp, BarChart3, Users, Calendar, FileText, Download, RefreshCw, Play, Pause, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useMachines } from '@/hooks/useMachines';
import { useBatches } from '@/hooks/useBatches';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const MachineOverview = () => {
  const { data: machines, isLoading: machinesLoading } = useMachines();
  const { data: batches, isLoading: batchesLoading } = useBatches();
  const { data: products, isLoading: productsLoading } = useProducts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Get current machine data (first machine or create mock data)
  const currentMachine = machines?.[0] || {
    machine_name: 'MACON CNC-01',
    status: 'Running',
    efficiency_percentage: 92.5,
    uptime_hours: 987.5,
    machine_type: 'CNC Plasma Cutter'
  };

  // Get current batch (running batch)
  const currentBatch = batches?.find(b => b.status === 'Running') || null;
  const currentProduct = currentBatch ? products?.find(p => p.id === currentBatch.id) : null;

  const machineStatus = {
    connected: true,
    running: currentMachine.status === 'Running',
    currentProduct: currentProduct ? `${currentProduct.product_id} - ${currentProduct.name}` : 'No active product',
    currentBatch: currentBatch ? `${currentBatch.batch_id} - ${currentBatch.name}` : 'No active batch',
    progress: currentBatch?.progress_percentage || 0,
    lastSync: '2 minutes ago',
    temperature: 45.2,
    pressure: 6.8,
    vibration: 0.3,
    powerConsumption: 15.7,
    efficiency: currentMachine.efficiency_percentage || 92.5,
    uptime: Math.round((currentMachine.uptime_hours || 987.5) / 10),
    cycleTime: 125,
    totalPartsToday: currentBatch?.completed_parts || 247,
    estimatedCompletion: currentBatch?.estimated_completion_time
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Status Refreshed",
        description: "Machine status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh machine status",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Machine performance report is being generated...",
    });
  };

  const handleMachineControl = (action: 'start' | 'pause' | 'stop') => {
    toast({
      title: "Machine Control",
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} command sent to machine`,
    });
  };

  const plcVariables = [
    { name: 'MAIN.SelectedProductPath', value: '/MACON/Products/P001.nc', type: 'STRING' },
    { name: 'MAIN.SelectedBatch_Row', value: '1', type: 'INT' },
    { name: 'MAIN.MachineState', value: '3', type: 'INT' },
    { name: 'MAIN.CurrentPosition', value: '2450.5', type: 'REAL' },
    { name: 'MAIN.FeedRate', value: '8500', type: 'INT' },
    { name: 'MAIN.LastError', value: '0', type: 'INT' }
  ];

  const performanceData = [
    { time: '08:00', efficiency: 89, parts: 15, temperature: 42 },
    { time: '09:00', efficiency: 92, parts: 18, temperature: 44 },
    { time: '10:00', efficiency: 95, parts: 22, temperature: 45 },
    { time: '11:00', efficiency: 91, parts: 19, temperature: 46 },
    { time: '12:00', efficiency: 88, parts: 16, temperature: 44 },
    { time: '13:00', efficiency: 93, parts: 21, temperature: 45 },
    { time: '14:00', efficiency: 96, parts: 24, temperature: 47 }
  ];

  const productionData = [
    { name: 'IPE240', value: 45, color: '#0077aa' },
    { name: 'IPE300', value: 30, color: '#005f8e' },
    { name: 'HEB200', value: 15, color: '#66b3d9' },
    { name: 'Others', value: 10, color: '#d0d3d6' }
  ];

  const recentLogs = [
    { time: '14:32', level: 'INFO', message: 'Batch B001 started successfully', operator: 'J.Smith' },
    { time: '14:30', level: 'INFO', message: 'Product P001 loaded to machine', operator: 'J.Smith' },
    { time: '14:28', level: 'WARN', message: 'Feed rate adjusted to 8500 mm/min', operator: 'Auto' },
    { time: '14:25', level: 'INFO', message: 'PLC connection established', operator: 'System' },
    { time: '14:23', level: 'INFO', message: 'Database sync completed', operator: 'System' },
    { time: '14:20', level: 'INFO', message: 'Quality check passed - Tolerance: ±0.1mm', operator: 'M.Johnson' },
    { time: '14:18', level: 'INFO', message: 'Tool change completed - T04 replaced', operator: 'J.Smith' }
  ];

  const getStatusColor = (connected: boolean, running: boolean) => {
    if (!connected) return 'text-red-500';
    if (running) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container">
      {/* Machine Control Header */}
      <div className="panel">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Machine Overview - {currentMachine.machine_name}</h1>
          <div className="flex gap-2">
            <Button 
              className="btn gap-2" 
              onClick={() => handleMachineControl('start')}
              disabled={machineStatus.running}
            >
              <Play className="w-4 h-4" />
              Start
            </Button>
            <Button 
              className="btn gap-2" 
              onClick={() => handleMachineControl('pause')}
              disabled={!machineStatus.running}
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
            <Button 
              className="btn danger gap-2" 
              onClick={() => handleMachineControl('stop')}
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
            <Button 
              className="btn gap-2" 
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Status Dashboard */}
      <div className="row">
        <div className="panel" style={{ flex: 1 }}>
          <h2><Wifi className="w-5 h-5 inline mr-2" />PLC Status</h2>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-lg font-bold flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${machineStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {machineStatus.connected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-sm text-muted-foreground">Last sync: {machineStatus.lastSync}</p>
            </div>
          </div>
        </div>

        <div className="panel" style={{ flex: 1 }}>
          <h2><Cpu className="w-5 h-5 inline mr-2" />Machine State</h2>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-lg font-bold flex items-center gap-2">
                {machineStatus.running ? (
                  <>
                    <Activity className="w-4 h-4 text-green-500" />
                    Running
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Idle
                  </>
                )}
              </p>
              <p className="text-sm text-muted-foreground">Efficiency: {machineStatus.efficiency}%</p>
            </div>
          </div>
        </div>

        <div className="panel" style={{ flex: 1 }}>
          <h2><Thermometer className="w-5 h-5 inline mr-2" />Temperature</h2>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-lg font-bold">{machineStatus.temperature}°C</p>
              <p className="text-sm text-muted-foreground">Normal range</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Operation */}
      <div className="panel">
        <h2><Settings className="w-5 h-5 inline mr-2" />Current Operation</h2>
        <div className="row">
          <div style={{ flex: 1 }}>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Product</p>
                <p className="text-lg font-semibold">{machineStatus.currentProduct}</p>
                {currentProduct && (
                  <span className="chip">{currentProduct.profile}</span>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Batch</p>
                <p className="text-lg font-semibold">{machineStatus.currentBatch}</p>
                {currentBatch && (
                  <span className="chip">Priority: {currentBatch.priority}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Batch Progress</p>
              <Progress value={machineStatus.progress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{machineStatus.progress}% complete</span>
                <span>Parts: {machineStatus.totalPartsToday}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Cycle Time</p>
                <p className="text-lg font-bold">{machineStatus.cycleTime}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-lg font-bold">{machineStatus.uptime}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex gap-2">
          <Button 
            className="btn gap-2" 
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
          >
            <Database className="w-4 h-4" />
            Refresh Status
          </Button>
          <Button 
            className="btn gap-2" 
            onClick={handleExportReport}
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="row">
        <div className="panel" style={{ flex: 1 }}>
          <h2><TrendingUp className="w-5 h-5 inline mr-2" />Efficiency Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#11182a', 
                  border: '1px solid #1f2a44',
                  borderRadius: '8px',
                  color: '#e7ecf3'
                }} 
              />
              <Line type="monotone" dataKey="efficiency" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ flex: 1 }}>
          <h2><BarChart3 className="w-5 h-5 inline mr-2" />Hourly Production</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#11182a', 
                  border: '1px solid #1f2a44',
                  borderRadius: '8px',
                  color: '#e7ecf3'
                }} 
              />
              <Bar dataKey="parts" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PLC Variables and Logs */}
      <div className="row">
        <div className="panel" style={{ flex: 1 }}>
          <h2><Cpu className="w-5 h-5 inline mr-2" />PLC Variables</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {plcVariables.map((variable, index) => (
                  <tr key={index}>
                    <td className="font-mono text-sm">{variable.name}</td>
                    <td className="text-xs text-muted-foreground">{variable.type}</td>
                    <td className="font-mono text-sm">{variable.value}</td>
                    <td>
                      <div className={`w-2 h-2 rounded-full ${index % 3 === 0 ? 'bg-green-500' : index % 2 === 0 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel" style={{ flex: 1 }}>
          <h2><Activity className="w-5 h-5 inline mr-2" />Recent Activity</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentLogs.map((log, index) => (
              <div key={index} className="table-wrap">
                <div className="flex items-start gap-3 p-3">
                  <span className="text-xs text-muted-foreground font-mono min-w-[3rem]">{log.time}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`chip ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-xs text-muted-foreground">{log.operator}</span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="panel">
        <h2><AlertTriangle className="w-5 h-5 inline mr-2" />System Status & Alerts</h2>
        <div className="row">
          <div className="group">
            <div className="flex items-center gap-3 p-3 bg-green-100 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">All Systems Operational</p>
                <p className="text-sm text-green-600">Last check: 2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Maintenance Due</p>
                <p className="text-sm text-yellow-600">Tool change in 50 cycles</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-100 border border-blue-200 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Backup Completed</p>
                <p className="text-sm text-blue-600">Last backup: Today 02:00</p>
              </div>
            </div>
          </div>

          <div className="group">
            <Button className="btn gap-2">
              <Settings className="w-4 h-4" />
              Maintenance
            </Button>
            <Button className="btn gap-2">
              <AlertTriangle className="w-4 h-4" />
              View Alerts
            </Button>
            <Button className="btn gap-2">
              <Database className="w-4 h-4" />
              System Log
            </Button>
            <Button className="btn gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};