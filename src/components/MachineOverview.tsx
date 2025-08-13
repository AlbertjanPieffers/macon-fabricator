import { Activity, Cpu, Database, Clock, AlertTriangle, CheckCircle, Wifi, Thermometer, Gauge, Zap, Settings, TrendingUp, BarChart3, Users, Calendar, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const MachineOverview = () => {
  const machineStatus = {
    connected: true,
    running: true,
    currentProduct: 'P001 - IPE240 Beam',
    currentBatch: 'B001 - Morning Production',
    progress: 65,
    lastSync: '2 minutes ago',
    temperature: 45.2,
    pressure: 6.8,
    vibration: 0.3,
    powerConsumption: 15.7,
    efficiency: 92.5,
    uptime: 98.7,
    cycleTime: 125,
    totalPartsToday: 247
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
    <div className="p-6 space-y-6">
      {/* Main Status Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="macon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">PLC Status</p>
                <p className="text-lg font-bold flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${machineStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {machineStatus.connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
              <Wifi className={getStatusColor(machineStatus.connected, machineStatus.running)} />
            </div>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
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
            </div>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                <p className="text-lg font-bold">{machineStatus.temperature}°C</p>
              </div>
              <Thermometer className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-lg font-bold">{machineStatus.efficiency}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Power</p>
                <p className="text-lg font-bold">{machineStatus.powerConsumption} kW</p>
              </div>
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parts Today</p>
                <p className="text-lg font-bold">{machineStatus.totalPartsToday}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Efficiency Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px' 
                  }} 
                />
                <Line type="monotone" dataKey="efficiency" stroke="#0077aa" strokeWidth={2} dot={{ fill: '#0077aa' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Hourly Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="parts" fill="#0077aa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Product Mix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={productionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {productionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {productionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Operation */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Current Operation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Product</p>
                <p className="text-lg font-semibold">{machineStatus.currentProduct}</p>
                <Badge variant="outline" className="mt-1">IPE240</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Batch</p>
                <p className="text-lg font-semibold">{machineStatus.currentBatch}</p>
                <Badge variant="secondary" className="mt-1">Priority: High</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Batch Progress</p>
                <Progress value={machineStatus.progress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{machineStatus.progress}% complete</span>
                  <span>ETA: 45 min</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Cycle Time</p>
                  <p className="text-lg font-bold">{machineStatus.cycleTime}s</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                  <p className="text-lg font-bold">{machineStatus.uptime}%</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Database className="w-4 h-4" />
                  Refresh Status
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PLC Variables */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              PLC Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plcVariables.map((variable, index) => (
                <div key={index} className="macon-grid-row p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm font-mono">{variable.name}</p>
                      <p className="text-xs text-muted-foreground">{variable.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {variable.value}
                      </span>
                      <div className={`w-2 h-2 rounded-full mt-1 ml-auto ${index % 3 === 0 ? 'bg-green-500' : index % 2 === 0 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full">View All Variables</Button>
            </div>
          </CardContent>
        </Card>

        {/* Operator Information */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Operator Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Lead Operator</p>
                </div>
                <Badge variant="secondary" className="ml-auto">Active</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Shift Start</p>
                  <p className="font-bold">06:00</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Break Time</p>
                  <p className="font-bold">12:00</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Shift Progress</span>
                  <span className="text-sm font-bold">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <FileText className="w-4 h-4" />
                  Work Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </span>
              <Badge variant="outline">{recentLogs.length} events</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground font-mono min-w-[3rem]">{log.time}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      log.level === 'ERROR' ? 'bg-red-500' : 
                      log.level === 'WARN' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-xs text-muted-foreground">{log.operator}</span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">View Full Log</Button>
              <Button variant="outline" size="sm" className="flex-1">Export Log</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Alerts & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">All Systems Operational</p>
                    <p className="text-sm text-green-600">Last check: 2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">Maintenance Due</p>
                    <p className="text-sm text-yellow-600">Tool change in 50 cycles</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">Backup Completed</p>
                    <p className="text-sm text-blue-600">Last backup: Today 02:00</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Maintenance
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alerts
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};