import { Activity, Cpu, Database, Clock, AlertTriangle, CheckCircle, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const MachineOverview = () => {
  const machineStatus = {
    connected: true,
    running: true,
    currentProduct: 'P001 - IPE240 Beam',
    currentBatch: 'B001 - Morning Production',
    progress: 65,
    lastSync: '2 minutes ago'
  };

  const plcVariables = [
    { name: 'MAIN.SelectedProductPath', value: '/MACON/Products/P001.nc', type: 'STRING' },
    { name: 'MAIN.SelectedBatch_Row', value: '1', type: 'INT' },
    { name: 'MAIN.MachineState', value: '3', type: 'INT' },
    { name: 'MAIN.CurrentPosition', value: '2450.5', type: 'REAL' },
    { name: 'MAIN.FeedRate', value: '8500', type: 'INT' },
    { name: 'MAIN.LastError', value: '0', type: 'INT' }
  ];

  const recentLogs = [
    { time: '14:32', level: 'INFO', message: 'Batch B001 started successfully' },
    { time: '14:30', level: 'INFO', message: 'Product P001 loaded to machine' },
    { time: '14:28', level: 'WARN', message: 'Feed rate adjusted to 8500 mm/min' },
    { time: '14:25', level: 'INFO', message: 'PLC connection established' },
    { time: '14:23', level: 'INFO', message: 'Database sync completed' }
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
    <div className="p-6 space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="macon-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">PLC Status</p>
              <p className="text-lg font-bold flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${machineStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {machineStatus.connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <Wifi className={getStatusColor(machineStatus.connected, machineStatus.running)} />
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Machine State</p>
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
            </div>
            <Cpu className={getStatusColor(machineStatus.connected, machineStatus.running)} />
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
              <p className="text-lg font-bold">{machineStatus.lastSync}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-lg font-bold">{machineStatus.progress}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Operation */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle>Current Operation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Product</p>
              <p className="text-lg font-semibold">{machineStatus.currentProduct}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Batch</p>
              <p className="text-lg font-semibold">{machineStatus.currentBatch}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${machineStatus.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{machineStatus.progress}% complete</p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Database className="w-4 h-4" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PLC Variables */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle>PLC Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plcVariables.map((variable, index) => (
                <div key={index} className="macon-grid-row p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm font-mono">{variable.name}</p>
                      <p className="text-xs text-muted-foreground">{variable.type}</p>
                    </div>
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {variable.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="macon-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <span className="text-xs text-muted-foreground font-mono">{log.time}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <p className="text-sm flex-1">{log.message}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border text-center">
            <Button variant="ghost" size="sm">View Full Log</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};