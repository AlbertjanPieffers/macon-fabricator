import { useState } from 'react';
import { Save, Upload, RotateCcw, Grid, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductPreview } from '@/components/ProductPreview';

export const ProductCreator = () => {
  const [selectedProfile, setSelectedProfile] = useState('IPE240');
  const [productData, setProductData] = useState({
    data1: 'P001',
    data2: 'New Product',
    data3: '',
    data4: '6000',
    data5: '',
    data6: '',
    data7: '',
    data8: 'Draft',
    data9: '1',
    data10: '',
    data11: '',
    data12: '',
    profile: 'IPE240',
    length: '6000'
  });

  const profiles = ['IPE240', 'IPE300', 'HEB200', 'HEB300', 'L80x80', 'L100x100'];

  const updateField = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="macon-toolbar">
        <div className="flex items-center gap-4">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Product
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
                  <Label htmlFor="data1">Product ID (Data1)</Label>
                  <Input
                    id="data1"
                    value={productData.data1}
                    onChange={(e) => updateField('data1', e.target.value)}
                    className="macon-input"
                  />
                </div>
                <div>
                  <Label htmlFor="data2">Name (Data2)</Label>
                  <Input
                    id="data2"
                    value={productData.data2}
                    onChange={(e) => updateField('data2', e.target.value)}
                    className="macon-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profile">Profile</Label>
                  <Select value={selectedProfile} onValueChange={setSelectedProfile}>
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
                  <Label htmlFor="length">Length (mm)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={productData.length}
                    onChange={(e) => updateField('length', e.target.value)}
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
                  <Label htmlFor="data8">Status (Data8)</Label>
                  <Select value={productData.data8} onValueChange={(value) => updateField('data8', value)}>
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
                  <Label htmlFor="data9">Priority (Data9)</Label>
                  <Input
                    id="data9"
                    type="number"
                    value={productData.data9}
                    onChange={(e) => updateField('data9', e.target.value)}
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
                length={productData.length}
                operations={[
                  { type: 'Hole ⌀16mm', position: 500, size: 16 },
                  { type: 'Cut 45° angle', position: parseInt(productData.length) - 100, angle: 45 }
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
                <span className="font-medium">{productData.length}mm</span>
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