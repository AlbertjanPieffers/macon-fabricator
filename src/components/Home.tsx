import { Plus, Upload, Send, Clock, Package, Activity, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useBatches } from '@/hooks/useBatches';
import { useMachines } from '@/hooks/useMachines';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HomeProps {
  onNavigate: (view: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: batches, isLoading: batchesLoading } = useBatches();
  const { data: machines, isLoading: machinesLoading } = useMachines();
  const [isPushing, setIsPushing] = useState(false);
  const { toast } = useToast();

  // Calculate stats from real data
  const stats = [
    { 
      label: 'Total Products', 
      value: productsLoading ? '...' : products?.length.toString() || '0', 
      icon: Package, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Active Batches', 
      value: batchesLoading ? '...' : batches?.filter(b => b.status === 'Running').length.toString() || '0', 
      icon: Activity, 
      color: 'text-green-600' 
    },
    { 
      label: 'Queue Length', 
      value: batchesLoading ? '...' : batches?.filter(b => b.status === 'Queued').length.toString() || '0', 
      icon: Clock, 
      color: 'text-orange-600' 
    },
  ];

  // Get recent products (last 5)
  const recentProducts = products?.slice(-5).reverse() || [];

  // Get recent batches (last 5)
  const recentBatches = batches?.slice(-5).reverse() || [];

  const handlePushToPLC = async () => {
    setIsPushing(true);
    try {
      // Simulate PLC push operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "Current batch pushed to PLC successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to push to PLC. Please check connection.",
        variant: "destructive",
      });
    } finally {
      setIsPushing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'text-green-600 bg-green-100';
      case 'Queued': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-blue-600 bg-blue-100';
      case 'Error': return 'text-red-600 bg-red-100';
      case 'Paused': return 'text-orange-600 bg-orange-100';
      case 'Draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="container">
      {/* Quick Actions */}
      <div className="panel">
        <h2>Quick Actions</h2>
        <div className="grid">
          <Button 
            className="btn primary h-16 gap-3 text-left justify-start"
            onClick={() => onNavigate('products')}
          >
            <Plus className="w-6 h-6" />
            <div>
              <div className="font-medium">New Product</div>
              <div className="text-xs opacity-80">Create or import</div>
            </div>
          </Button>
          <Button 
            className="btn h-16 gap-3 text-left justify-start"
            onClick={() => onNavigate('batches')}
          >
            <Package className="w-6 h-6" />
            <div>
              <div className="font-medium">New Batch</div>
              <div className="text-xs opacity-60">Build production list</div>
            </div>
          </Button>
          <Button 
            className="btn h-16 gap-3 text-left justify-start"
            onClick={handlePushToPLC}
            disabled={isPushing}
          >
            <Send className="w-6 h-6 text-orange-600" />
            <div>
              <div className="font-medium">{isPushing ? 'Pushing...' : 'Push to PLC'}</div>
              <div className="text-xs opacity-60">Sync current batch</div>
            </div>
          </Button>
        </div>
      </div>

      <div className="row">
        {/* Stats */}
        <div className="toolbox">
          {stats.map((stat) => (
            <div key={stat.label} className="panel">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Products */}
        <div className="panel" style={{ flex: 1 }}>
          <h2>Recent Products</h2>
          <div className="space-y-3">
            {productsLoading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : recentProducts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No products yet</div>
            ) : (
              recentProducts.map((product) => (
                <div key={product.id} className="table-wrap">
                  <div className="flex justify-between items-start p-3">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.profile} • {product.length_mm}mm</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(product.updated_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="btn w-full mt-2"
              onClick={() => onNavigate('products')}
            >
              View All Products
            </Button>
          </div>
        </div>

        {/* Recent Batches */}
        <div className="panel" style={{ flex: 1 }}>
          <h2>Recent Batches</h2>
          <div className="space-y-3">
            {batchesLoading ? (
              <div className="text-center py-4">Loading batches...</div>
            ) : recentBatches.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No batches yet</div>
            ) : (
              recentBatches.map((batch) => (
                <div key={batch.id} className="table-wrap">
                  <div className="flex justify-between items-start p-3">
                    <div>
                      <p className="font-medium text-sm">{batch.name}</p>
                      <p className="text-xs text-muted-foreground">Priority {batch.priority}</p>
                    </div>
                    <div className="text-right">
                      <span className={`chip ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(batch.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="btn w-full mt-2"
              onClick={() => onNavigate('batches')}
            >
              View All Batches
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};