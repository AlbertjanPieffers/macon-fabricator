import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Play, Pause, RotateCcw, Upload, Download, Calendar, Clock, User, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBatches, useCreateBatch, useUpdateBatch, type BatchStatus, type PriorityLevel } from '@/hooks/useBatches';

export const BatchEditor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: batches = [], isLoading, error } = useBatches();
  const createBatch = useCreateBatch();
  const updateBatch = useUpdateBatch();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading batches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load batches</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: BatchStatus) => {
    switch (status) {
      case 'Running': return 'macon-status-running';
      case 'Queued': return 'macon-status-waiting';
      case 'Completed': return 'macon-status-complete';
      case 'Error': return 'macon-status-error';
      case 'Paused': return 'macon-status-waiting';
      default: return 'macon-status-waiting';
    }
  };

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High': 
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.operator_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="macon-toolbar">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-foreground">Batch Management</h1>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Batch
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Batch Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="macon-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                  <p className="text-2xl font-bold">{batches.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="macon-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Running</p>
                  <p className="text-2xl font-bold">{batches.filter(b => b.status === 'Running').length}</p>
                </div>
                <Play className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="macon-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Queued</p>
                  <p className="text-2xl font-bold">{batches.filter(b => b.status === 'Queued').length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="macon-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Efficiency</p>
                  <p className="text-2xl font-bold">
                    {batches.length > 0 ? (batches.reduce((sum, b) => sum + b.efficiency_percentage, 0) / batches.length).toFixed(1) : '0'}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Batch List */}
        <div className="space-y-4">
          {filteredBatches.map((batch) => (
            <Card key={batch.id} className="macon-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Batch Header */}
                  <div className="lg:col-span-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-lg">{batch.batch_id}</h3>
                        <p className="text-sm text-muted-foreground">{batch.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`macon-status-badge ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </Badge>
                      <Badge className={getPriorityColor(batch.priority)}>
                        {batch.priority}
                      </Badge>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{batch.operator_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(batch.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Metrics */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold">{batch.progress_percentage}%</span>
                      </div>
                      <Progress value={batch.progress_percentage} className="h-3" />
                      <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                        <span>{batch.completed_parts}/{batch.total_parts} parts</span>
                        <span>ETA: {batch.estimated_completion_time || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Products:</p>
                      <p>Batch #{batch.batch_id} - {batch.total_parts} total parts</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Start</span>
                        </div>
                        <p className="font-bold">{batch.start_time || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Efficiency</span>
                        </div>
                        <p className="font-bold">{batch.efficiency_percentage}%</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Quality</span>
                        </div>
                        <p className="font-bold">{batch.quality_score_percentage}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-1 flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};