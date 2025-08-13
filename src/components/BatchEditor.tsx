import { useState } from 'react';
import { Save, Send, Plus, Trash2, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const BatchEditor = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [batchData, setBatchData] = useState({
    data1: 'B001',
    data2: 'New Batch',
    data8: 'Waiting',
    data9: '1'
  });

  const availableProducts = [
    { id: 'P001', name: 'IPE240 Beam', profile: 'IPE240', length: 6000, status: 'Ready' },
    { id: 'P002', name: 'HEB300 Column', profile: 'HEB300', length: 3500, status: 'Ready' },
    { id: 'P003', name: 'L80x80 Angle', profile: 'L80x80', length: 2000, status: 'Ready' },
    { id: 'P004', name: 'IPE240 Short', profile: 'IPE240', length: 2500, status: 'Ready' },
    { id: 'P005', name: 'HEB200 Beam', profile: 'HEB200', length: 4000, status: 'Draft' },
  ];

  const currentBatch = [
    { productId: 'P001', name: 'IPE240 Beam', count: 2, priority: 1 },
    { productId: 'P002', name: 'HEB300 Column', count: 1, priority: 2 },
    { productId: 'P003', name: 'L80x80 Angle', count: 4, priority: 3 },
  ];

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const generateData3 = () => {
    return currentBatch.map(item => `${item.productId}x${item.count}`).join(', ');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="macon-toolbar">
        <div className="flex items-center gap-4">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Batch
          </Button>
          <Button variant="outline" className="gap-2 border-orange-200 hover:bg-orange-50">
            <Send className="w-6 h-6 text-orange-600" />
            Push to PLC
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Batch
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Data3: <span className="font-mono text-xs">{generateData3()}</span>
          </div>
          <span className="macon-status-badge macon-status-waiting">
            {batchData.data8}
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Panel - Available Products */}
        <div className="space-y-4">
          <Card className="macon-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Available Products
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availableProducts.map((product) => (
                  <div 
                    key={product.id}
                    className={`macon-grid-row p-3 rounded-lg cursor-pointer ${
                      selectedProducts.includes(product.id) ? 'selected' : ''
                    }`}
                    onClick={() => toggleProductSelection(product.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.profile} • {product.length}mm
                        </p>
                      </div>
                      <span className={`macon-status-badge macon-status-${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  size="sm" 
                  className="w-full gap-2"
                  disabled={selectedProducts.length === 0}
                >
                  <Plus className="w-4 h-4" />
                  Add Selected to Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Panel - Current Batch */}
        <div className="space-y-4">
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Current Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentBatch.map((item, index) => (
                  <div key={item.productId} className="macon-grid-row p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary/10 text-primary text-xs font-bold rounded flex items-center justify-center">
                            {item.priority}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Quantity: {item.count}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentBatch.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-8 h-8 mx-auto mb-2 bg-muted rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <p className="text-sm">No products in batch</p>
                    <p className="text-xs">Select products from the left panel</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Batch Summary */}
          <Card className="macon-card">
            <CardHeader>
              <CardTitle className="text-lg">Batch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Products:</span>
                <span className="font-medium">{currentBatch.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Pieces:</span>
                <span className="font-medium">{currentBatch.reduce((sum, item) => sum + item.count, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Time:</span>
                <span className="font-medium">24m 15s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Priority:</span>
                <span className="font-medium">P{batchData.data9}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Batch Properties */}
        <div className="space-y-4">
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Batch Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batchId">Batch ID (Data1)</Label>
                <Input
                  id="batchId"
                  value={batchData.data1}
                  onChange={(e) => setBatchData(prev => ({ ...prev, data1: e.target.value }))}
                  className="macon-input"
                />
              </div>
              
              <div>
                <Label htmlFor="batchName">Name (Data2)</Label>
                <Input
                  id="batchName"
                  value={batchData.data2}
                  onChange={(e) => setBatchData(prev => ({ ...prev, data2: e.target.value }))}
                  className="macon-input"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status (Data8)</Label>
                <Select 
                  value={batchData.data8} 
                  onValueChange={(value) => setBatchData(prev => ({ ...prev, data8: value }))}
                >
                  <SelectTrigger className="macon-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Waiting">Waiting</SelectItem>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Running">Running</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority (Data9)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={batchData.data9}
                  onChange={(e) => setBatchData(prev => ({ ...prev, data9: e.target.value }))}
                  className="macon-input"
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <Label htmlFor="data3">Generated Data3</Label>
                <Input
                  id="data3"
                  value={generateData3()}
                  readOnly
                  className="macon-input font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from product selection
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Duplicate Batch
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Filter className="w-4 h-4" />
                Filter by Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-600" />
                Clear Batch
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};