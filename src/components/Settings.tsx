import { useState } from 'react';
import { Save, TestTube, FolderOpen, Database, Download, Upload, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const Settings = () => {
  const [settings, setSettings] = useState({
    // Paths
    productsPath: 'C:\\MACON\\Products',
    ncExportPath: 'C:\\MACON\\NC_Export',
    backupPath: 'C:\\MACON\\Backups',
    
    // PLC Connection
    plcNetId: '192.168.1.100.1.1',
    plcPort: '851',
    plcTimeout: '5000',
    
    // Database
    mongoUri: 'mongodb://localhost:27017/MACON_Production',
    autoBackup: true,
    backupInterval: '24',
    
    // Preview Settings
    gridVisible: true,
    unitsMetric: true,
    autoSave: true,
    syncInterval: '30'
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const testPLCConnection = () => {
    // Simulate PLC connection test
    console.log('Testing PLC connection...');
  };

  const testDatabaseConnection = () => {
    // Simulate database connection test
    console.log('Testing database connection...');
  };

  const runBackup = () => {
    // Simulate backup operation
    console.log('Running backup...');
  };

  const runRestore = () => {
    // Simulate restore operation
    console.log('Running restore...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Paths */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              File Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productsPath">Products Folder</Label>
              <div className="flex gap-2">
                <Input
                  id="productsPath"
                  value={settings.productsPath}
                  onChange={(e) => updateSetting('productsPath', e.target.value)}
                  className="macon-input"
                />
                <Button variant="outline" size="sm">Browse</Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="ncExportPath">NC Export Path</Label>
              <div className="flex gap-2">
                <Input
                  id="ncExportPath"
                  value={settings.ncExportPath}
                  onChange={(e) => updateSetting('ncExportPath', e.target.value)}
                  className="macon-input"
                />
                <Button variant="outline" size="sm">Browse</Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="backupPath">Backup Folder</Label>
              <div className="flex gap-2">
                <Input
                  id="backupPath"
                  value={settings.backupPath}
                  onChange={(e) => updateSetting('backupPath', e.target.value)}
                  className="macon-input"
                />
                <Button variant="outline" size="sm">Browse</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PLC Connection */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              PLC Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="plcNetId">PLC NetID</Label>
              <Input
                id="plcNetId"
                value={settings.plcNetId}
                onChange={(e) => updateSetting('plcNetId', e.target.value)}
                className="macon-input"
                placeholder="192.168.1.100.1.1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plcPort">Port</Label>
                <Input
                  id="plcPort"
                  value={settings.plcPort}
                  onChange={(e) => updateSetting('plcPort', e.target.value)}
                  className="macon-input"
                />
              </div>
              <div>
                <Label htmlFor="plcTimeout">Timeout (ms)</Label>
                <Input
                  id="plcTimeout"
                  value={settings.plcTimeout}
                  onChange={(e) => updateSetting('plcTimeout', e.target.value)}
                  className="macon-input"
                />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={testPLCConnection}
            >
              <TestTube className="w-4 h-4" />
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mongoUri">MongoDB URI</Label>
              <Input
                id="mongoUri"
                value={settings.mongoUri}
                onChange={(e) => updateSetting('mongoUri', e.target.value)}
                className="macon-input"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup">Auto Backup</Label>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="backupInterval">Backup Interval (hours)</Label>
              <Input
                id="backupInterval"
                type="number"
                value={settings.backupInterval}
                onChange={(e) => updateSetting('backupInterval', e.target.value)}
                className="macon-input"
              />
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={testDatabaseConnection}
              >
                <TestTube className="w-4 h-4" />
                Test Connection
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={runBackup}
                >
                  <Download className="w-4 h-4" />
                  Backup Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={runRestore}
                >
                  <Upload className="w-4 h-4" />
                  Restore
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card className="macon-card">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="gridVisible">Show Grid in Previews</Label>
                <Switch
                  id="gridVisible"
                  checked={settings.gridVisible}
                  onCheckedChange={(checked) => updateSetting('gridVisible', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="unitsMetric">Use Metric Units</Label>
                <Switch
                  id="unitsMetric"
                  checked={settings.unitsMetric}
                  onCheckedChange={(checked) => updateSetting('unitsMetric', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">Auto Save</Label>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="syncInterval">Sync Interval (seconds)</Label>
              <Input
                id="syncInterval"
                type="number"
                value={settings.syncInterval}
                onChange={(e) => updateSetting('syncInterval', e.target.value)}
                className="macon-input"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="macon-card">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium">MACON Desktop v1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground">Database</p>
              <p className="font-medium">MongoDB 7.0.x</p>
            </div>
            <div>
              <p className="text-muted-foreground">Python Service</p>
              <p className="font-medium">MACONSync v2.1</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Update</p>
              <p className="font-medium">2024-01-15</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};