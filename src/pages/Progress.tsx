import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, AlertCircle } from 'lucide-react';

interface MachineStatus {
  state: string;
  progressPct: number;
  currentProduct: string;
  timestamp?: string;
}

interface MachineEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export const Progress = () => {
  const [machineStatus, setMachineStatus] = useState<MachineStatus | null>(null);
  const [events, setEvents] = useState<MachineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { apiClient } = await import('@/lib/api');
        
        // Fetch machine status
        const status = await apiClient.getMachineStatus();
        setMachineStatus({
          state: status.state,
          progressPct: status.progressPct,
          currentProduct: status.currentProduct,
          timestamp: new Date().toISOString()
        });

        // Fetch machine events
        const events = await apiClient.getMachineEvents();
        setEvents(events);

      } catch (error) {
        console.error('Failed to fetch machine data:', error);
        
        // Fallback to mock data
        setMachineStatus({
          state: 'Unknown',
          progressPct: 0,
          currentProduct: 'None',
          timestamp: new Date().toISOString()
        });
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      case 'info': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-card rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-48 bg-card rounded-2xl"></div>
            <div className="h-96 bg-card rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Progress</h1>
        <p className="text-muted-foreground">Real-time machine status and event monitoring</p>
      </div>

      {/* Machine Status JSON Dump */}
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Activity className="h-5 w-5 text-primary" />
            Machine Status (Raw Data)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background border border-border rounded-lg p-4">
            <pre className="text-sm text-card-foreground overflow-x-auto">
              {JSON.stringify(machineStatus, null, 2)}
            </pre>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Data from: GET /machine/status
          </p>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Clock className="h-5 w-5 text-primary" />
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No events to display</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/5">
                  <div className={`p-2 rounded-full ${getEventLevelColor(event.level)} text-white shrink-0 mt-1`}>
                    {getEventLevelIcon(event.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-card-foreground font-medium">{event.message}</p>
                      <Badge variant="outline" className="shrink-0">
                        {event.source}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Data from: GET /machine/events
          </p>
        </CardContent>
      </Card>
    </div>
  );
};