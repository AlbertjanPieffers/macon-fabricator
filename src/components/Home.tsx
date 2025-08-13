import { Plus, Upload, Send, Clock, Package, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeProps {
  onNavigate: (view: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const recentProducts = [
    { id: 'P001', name: 'IPE240 Beam', profile: 'IPE240', length: 6000, updated: '2 hours ago' },
    { id: 'P002', name: 'HEB300 Column', profile: 'HEB300', length: 3500, updated: '4 hours ago' },
    { id: 'P003', name: 'L80x80 Angle', profile: 'L80x80', length: 2000, updated: '1 day ago' },
  ];

  const recentBatches = [
    { id: 'B001', name: 'Morning Production', products: 12, status: 'Running', priority: 1 },
    { id: 'B002', name: 'Afternoon Batch', products: 8, status: 'Waiting', priority: 2 },
    { id: 'B003', name: 'Express Orders', products: 5, status: 'Complete', priority: 3 },
  ];

  const stats = [
    { label: 'Total Products', value: '127', icon: Package, color: 'text-blue-600' },
    { label: 'Active Batches', value: '8', icon: Activity, color: 'text-green-600' },
    { label: 'Queue Length', value: '23', icon: Clock, color: 'text-orange-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Quick Actions */}
      <Card className="macon-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-16 gap-3 text-left justify-start"
              onClick={() => onNavigate('products')}
            >
              <Plus className="w-6 h-6" />
              <div>
                <div className="font-medium">New Product</div>
                <div className="text-xs text-primary-foreground/80">Create or import</div>
              </div>
            </Button>
            <Button 
              variant="secondary" 
              className="h-16 gap-3 text-left justify-start"
              onClick={() => onNavigate('batches')}
            >
              <Package className="w-6 h-6" />
              <div>
                <div className="font-medium">New Batch</div>
                <div className="text-xs text-secondary-foreground/60">Build production list</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 gap-3 text-left justify-start border-orange-200 hover:bg-orange-50"
            >
              <Send className="w-6 h-6 text-orange-600" />
              <div className="text-foreground">
                <div className="font-medium">Push to PLC</div>
                <div className="text-xs text-muted-foreground">Sync current batch</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="space-y-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="macon-card">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Products */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="macon-grid-row p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.profile} • {product.length}mm</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{product.updated}</span>
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => onNavigate('products')}
            >
              View All Products
            </Button>
          </CardContent>
        </Card>

        {/* Recent Batches */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Batches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBatches.map((batch) => (
              <div key={batch.id} className="macon-grid-row p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">{batch.products} products</p>
                  </div>
                  <div className="text-right">
                    <span className={`macon-status-badge macon-status-${batch.status.toLowerCase()}`}>
                      {batch.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">P{batch.priority}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => onNavigate('batches')}
            >
              View All Batches
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};