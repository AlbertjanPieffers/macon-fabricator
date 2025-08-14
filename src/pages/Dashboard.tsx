import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface MachineStatus {
  state: string;
  progressPct: number;
  currentProduct: string;
}

export const Dashboard = () => {
  const [machineStatus, setMachineStatus] = useState<MachineStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachineStatus = async () => {
      try {
        const { apiClient } = await import('@/lib/api');
        const status = await apiClient.getMachineStatus();
        setMachineStatus({
          state: status.state,
          progressPct: status.progressPct,
          currentProduct: status.currentProduct
        });
      } catch (error) {
        console.error('Failed to fetch machine status:', error);
        // Fallback to mock data
        setMachineStatus({
          state: 'Unknown',
          progressPct: 0,
          currentProduct: 'None'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMachineStatus();
  }, []);

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'Running': return 'bg-green-500';
      case 'Idle': return 'bg-yellow-500';
      case 'Error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-card rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">MACON Office Interface - Machine Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Machine Progress Card */}
        <Card className="bg-card border-border rounded-2xl shadow-lg col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Activity className="h-5 w-5 text-primary" />
              Machine Progress
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Current production status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(machineStatus?.state || '')}`}></div>
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                    {machineStatus?.state || 'Unknown'}
                  </Badge>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-primary">{machineStatus?.progressPct || 0}%</p>
              </div>
            </div>
            
            <Progress value={machineStatus?.progressPct || 0} className="h-3" />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Product</p>
              <p className="font-medium text-card-foreground">{machineStatus?.currentProduct || 'None'}</p>
              <p className="text-xs text-muted-foreground">ETA: ~45 minutes</p>
            </div>
          </CardContent>
        </Card>

        {/* Queue Length */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Queue Length
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">7</p>
              <p className="text-sm text-muted-foreground">Batches waiting</p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Parts */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <CheckCircle className="h-5 w-5 text-primary" />
              Today's Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">142</p>
              <p className="text-sm text-muted-foreground">Parts completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <AlertCircle className="h-5 w-5 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">PLC Connection</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-card-foreground">Connected</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">File Bridge</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-card-foreground">Online</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Database</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-card-foreground">Connected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};