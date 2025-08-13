import { useState } from 'react';
import { Save, Upload, RotateCcw, Grid, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductPreview } from '@/components/ProductPreview';
import { useCreateProduct, useUpdateProduct, type ProductProfile, type ProductStatus } from '@/hooks/useProducts';

export const ProductCreator = () => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const [selectedProfile, setSelectedProfile] = useState<ProductProfile>('IPE240');
  const [productData, setProductData] = useState({
    product_id: 'P001',
    name: 'New Product',
    data3: '',
    length_mm: '6000',
    data5: '',
    data6: '',
    status: 'Draft' as ProductStatus,
    priority: '1',
    profile: 'IPE240' as ProductProfile,
  });

  const profiles: ProductProfile[] = ['IPE240', 'IPE300', 'HEB200', 'HEB300', 'L80x80', 'L100x100'];

  const updateField = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await createProduct.mutateAsync({
        product_id: productData.product_id,
        name: productData.name,
        profile: selectedProfile,
        length_mm: parseInt(productData.length_mm),
        status: productData.status,
        priority: parseInt(productData.priority),
        data3: productData.data3,
        data5: productData.data5,
        data6: productData.data6,
        operations_count: 0,
        nc_file_generated: false,
      });
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="macon-toolbar">
        <div className="flex items-center gap-4">
          <Button className="gap-2" onClick={handleSave} disabled={createProduct.isPending}>
            <Save className="w-4 h-4" />
            {createProduct.isPending ? 'Saving...' : 'Save Product'}
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import DSTV/NC
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Status: <span className="macon-status-badge macon-status-running">Editing</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Panel - Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_id">Product ID</Label>
                  <Input
                    id="product_id"
                    value={productData.product_id}
                    onChange={(e) => updateField('product_id', e.target.value)}
                    className="macon-input"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="macon-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profile">Profile</Label>
                  <Select value={selectedProfile} onValueChange={(value: ProductProfile) => setSelectedProfile(value)}>
                    <SelectTrigger className="macon-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map(profile => (
                        <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="length_mm">Length (mm)</Label>
                  <Input
                    id="length_mm"
                    type="number"
                    value={productData.length_mm}
                    onChange={(e) => updateField('length_mm', e.target.value)}
                    className="macon-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Data */}
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Process Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={productData.status} onValueChange={(value: ProductStatus) => updateField('status', value)}>
                    <SelectTrigger className="macon-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={productData.priority}
                    onChange={(e) => updateField('priority', e.target.value)}
                    className="macon-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="data3">Data3</Label>
                  <Input
                    id="data3"
                    value={productData.data3}
                    onChange={(e) => updateField('data3', e.target.value)}
                    className="macon-input"
                  />
                </div>
                <div>
                  <Label htmlFor="data5">Data5</Label>
                  <Input
                    id="data5"
                    value={productData.data5}
                    onChange={(e) => updateField('data5', e.target.value)}
                    className="macon-input"
                  />
                </div>
                <div>
                  <Label htmlFor="data6">Data6</Label>
                  <Input
                    id="data6"
                    value={productData.data6}
                    onChange={(e) => updateField('data6', e.target.value)}
                    className="macon-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operations */}
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Hole ⌀16mm</p>
                    <p className="text-xs text-muted-foreground">Position: 500mm from start</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Cut 45° angle</p>
                    <p className="text-xs text-muted-foreground">End processing</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">+ Add Operation</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Product Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductPreview
                profile={selectedProfile}
                length={productData.length_mm}
                operations={[
                  { type: 'Hole ⌀16mm', position: 500, size: 16 },
                  { type: 'Cut 45° angle', position: parseInt(productData.length_mm) - 100, angle: 45 }
                ]}
              />
            </CardContent>
          </Card>

          {/* Properties */}
          <Card className="macon-card">
            <CardHeader>
              <CardTitle>Calculated Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Length:</span>
                <span className="font-medium">{productData.length_mm}mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. Cut Time:</span>
                <span className="font-medium">4m 30s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Operations:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">NC File:</span>
                <span className="font-medium text-primary">Generated</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};