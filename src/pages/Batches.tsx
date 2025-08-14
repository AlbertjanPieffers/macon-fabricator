import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layers, Plus, Minus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  Name?: string;
  FileName?: string;
  Profile?: string;
  Length?: number;
}

interface BatchItem {
  productId: string;
  product: Product;
  count: number;
}

interface Batch {
  _id?: string;
  index?: number;
  Data1?: string; // BatchID
  Data2: string;  // Batch name
  Data3: string;  // Products string
  Data8?: string; // Status
  Data9?: string; // Priority
}

export const Batches = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchName, setBatchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasOfficeRole, setHasOfficeRole] = useState(false);

  useEffect(() => {
    checkUserRole();
    loadMockData();
  }, [user]);

  const checkUserRole = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const roles = data?.map(r => r.role) || [];
      setHasOfficeRole(roles.includes('office' as any));
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const loadMockData = () => {
    // Mock data - will be replaced with API calls
    setTimeout(() => {
      setProducts([
        { _id: '1', Name: 'IPE200-Beam-A', Profile: 'IPE200', Length: 3000 },
        { _id: '2', Name: 'HEA300-Column', Profile: 'HEA300', Length: 4500 },
        { _id: '3', Name: 'UPN120-Support', Profile: 'UPN120', Length: 1200 },
        { _id: '4', Name: 'L90x90-Angle', Profile: 'L90x90', Length: 2000 },
      ]);
      
      setBatches([
        { _id: '1', Data2: 'Morning Batch', Data3: '1x2,2x1', Data8: 'Waiting', Data9: 'High' },
        { _id: '2', Data2: 'Afternoon Batch', Data3: '3x3,4x1', Data8: 'Running', Data9: 'Medium' },
      ]);
      
      setLoading(false);
    }, 1000);
  };

  const addToBatch = (product: Product) => {
    const existingItem = batchItems.find(item => item.productId === product._id);
    
    if (existingItem) {
      setBatchItems(prev => prev.map(item =>
        item.productId === product._id
          ? { ...item, count: item.count + 1 }
          : item
      ));
    } else {
      setBatchItems(prev => [...prev, { productId: product._id, product, count: 1 }]);
    }
  };

  const updateItemCount = (productId: string, delta: number) => {
    setBatchItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newCount = item.count + delta;
        return newCount > 0 ? { ...item, count: newCount } : item;
      }
      return item;
    }).filter(item => item.count > 0));
  };

  const saveBatch = () => {
    if (!batchName || batchItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a batch name and add at least one product",
        variant: "destructive",
      });
      return;
    }

    // Create Data3 string: "productId1xcount1,productId2xcount2,..."
    const data3 = batchItems.map(item => `${item.productId}x${item.count}`).join(',');

    // Mock save - will be replaced with API call
    const newBatch: Batch = {
      Data2: batchName,
      Data3: data3,
      Data8: 'Waiting',
      Data9: 'Medium'
    };

    console.log('Saving batch:', newBatch);
    
    toast({
      title: "Batch Saved",
      description: `Batch "${batchName}" has been created successfully`,
    });

    // Reset form
    setBatchName('');
    setBatchItems([]);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Running': return 'bg-green-500';
      case 'Waiting': return 'bg-yellow-500';
      case 'Done': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-card rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-card rounded-2xl"></div>
            <div className="h-96 bg-card rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Batches</h1>
        <p className="text-muted-foreground">Create and manage production batches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Selection */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-card-foreground">Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/5">
                  <div>
                    <p className="font-medium text-card-foreground">{product.Name}</p>
                    <p className="text-sm text-muted-foreground">{product.Profile} • {product.Length}mm</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToBatch(product)}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Batch Builder */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Layers className="h-5 w-5 text-primary" />
              Batch Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Batch Name</label>
              <Input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="Enter batch name..."
                className="mt-1 bg-background border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">Products</label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {batchItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No products added yet</p>
                ) : (
                  batchItems.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-2 rounded border border-border">
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{item.product.Name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.Profile}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemCount(item.productId, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-card-foreground min-w-[2rem] text-center">{item.count}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItemCount(item.productId, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {hasOfficeRole ? (
              <Button
                onClick={saveBatch}
                disabled={!batchName || batchItems.length === 0}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Batch
              </Button>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  You need the "office" role to save batches
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Batches */}
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Existing Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 border-border hover:bg-muted/10">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Products</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch._id} className="border-border hover:bg-muted/5">
                    <TableCell className="font-medium text-card-foreground">
                      {batch.Data2}
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {batch.Data3}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getStatusColor(batch.Data8)} text-white`}>
                        {batch.Data8 || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {batch.Data9 || 'Medium'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
