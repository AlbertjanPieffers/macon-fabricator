import { useState, useEffect } from 'react';
import { Save, TestTube, FolderOpen, Database, Download, Upload, Wifi, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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

  const [connectionStates, setConnectionStates] = useState({
    plc: 'disconnected', // connected, disconnected, testing
    database: 'connected' // connected, disconnected, testing
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('maconSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('maconSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setHasUnsavedChanges(false);
      toast({
        title: "Settings Saved",
        description: "All settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testPLCConnection = async () => {
    setConnectionStates(prev => ({ ...prev, plc: 'testing' }));
    try {
      // Simulate PLC connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isConnected = Math.random() > 0.3; // 70% success rate
      
      setConnectionStates(prev => ({ 
        ...prev, 
        plc: isConnected ? 'connected' : 'disconnected' 
      }));
      
      toast({
        title: isConnected ? "PLC Connected" : "PLC Connection Failed",
        description: isConnected 
          ? `Successfully connected to PLC at ${settings.plcNetId}` 
          : "Could not establish connection to PLC. Check network settings.",
        variant: isConnected ? "default" : "destructive",
      });
    } catch (error) {
      setConnectionStates(prev => ({ ...prev, plc: 'disconnected' }));
      toast({
        title: "Connection Test Failed",
        description: "An error occurred while testing PLC connection.",
        variant: "destructive",
      });
    }
  };

  const testDatabaseConnection = async () => {
    setConnectionStates(prev => ({ ...prev, database: 'testing' }));
    try {
      // Simulate database connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isConnected = Math.random() > 0.2; // 80% success rate
      
      setConnectionStates(prev => ({ 
        ...prev, 
        database: isConnected ? 'connected' : 'disconnected' 
      }));
      
      toast({
        title: isConnected ? "Database Connected" : "Database Connection Failed",
        description: isConnected 
          ? "Successfully connected to database" 
          : "Could not establish connection to database. Check URI and credentials.",
        variant: isConnected ? "default" : "destructive",
      });
    } catch (error) {
      setConnectionStates(prev => ({ ...prev, database: 'disconnected' }));
      toast({
        title: "Connection Test Failed",
        description: "An error occurred while testing database connection.",
        variant: "destructive",
      });
    }
  };

  const runBackup = async () => {
    try {
      toast({
        title: "Backup Started",
        description: "Database backup is in progress...",
      });
      
      // Simulate backup operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Backup Complete",
        description: `Database backed up to ${settings.backupPath}`,
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create backup. Please check backup path and permissions.",
        variant: "destructive",
      });
    }
  };

  const runRestore = () => {
    // In a real app, this would open a file picker
    toast({
      title: "Restore Function",
      description: "Please select a backup file to restore from.",
    });
  };

  const browsePath = (pathType: string) => {
    // In a real app, this would open a folder picker
    toast({
      title: "Browse Folder",
      description: `Select ${pathType} folder location.`,
    });
  };

  const getConnectionBadge = (state: string) => {
    switch (state) {
      case 'connected':
        return <Badge variant="secondary" className="gap-1"><Check className="w-3 h-3" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive" className="gap-1"><X className="w-3 h-3" />Disconnected</Badge>;
      case 'testing':
        return <Badge variant="outline" className="gap-1">Testing...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container">
      <div className="panel">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600">Unsaved Changes</Badge>
            )}
            <Button 
              className="btn primary gap-2" 
              onClick={saveSettings}
              disabled={isSaving || !hasUnsavedChanges}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* File Paths */}
        <div className="panel" style={{ flex: 1 }}>
          <h2><FolderOpen className="w-5 h-5 inline mr-2" />File Paths</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="productsPath">Products Folder</Label>
              <div className="flex gap-2">
                <Input
                  id="productsPath"
                  value={settings.productsPath}
                  onChange={(e) => updateSetting('productsPath', e.target.value)}
                  className="macon-input"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="btn"
                  onClick={() => browsePath('Products')}
                >
                  Browse
                </Button>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  className="btn"
                  onClick={() => browsePath('NC Export')}
                >
                  Browse
                </Button>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  className="btn"
                  onClick={() => browsePath('Backup')}
                >
                  Browse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PLC Connection */}
        <div className="panel" style={{ flex: 1 }}>
          <h2>
            <Wifi className="w-5 h-5 inline mr-2" />
            PLC Connection
            {getConnectionBadge(connectionStates.plc)}
          </h2>
          <div className="space-y-4">
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
              className="btn w-full gap-2"
              onClick={testPLCConnection}
              disabled={connectionStates.plc === 'testing'}
            >
              <TestTube className="w-4 h-4" />
              {connectionStates.plc === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Database */}
        <div className="panel" style={{ flex: 1 }}>
          <h2>
            <Database className="w-5 h-5 inline mr-2" />
            Database
            {getConnectionBadge(connectionStates.database)}
          </h2>
          <div className="space-y-4">
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
                className="btn w-full gap-2"
                onClick={testDatabaseConnection}
                disabled={connectionStates.database === 'testing'}
              >
                <TestTube className="w-4 h-4" />
                {connectionStates.database === 'testing' ? 'Testing...' : 'Test Connection'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="btn gap-2"
                  onClick={runBackup}
                >
                  <Download className="w-4 h-4" />
                  Backup Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="btn gap-2"
                  onClick={runRestore}
                >
                  <Upload className="w-4 h-4" />
                  Restore
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="panel" style={{ flex: 1 }}>
          <h2>Application Settings</h2>
          <div className="space-y-4">
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
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="panel">
        <h2>System Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Version</p>
            <p className="font-medium">MACON Desktop v1.0.0</p>
          </div>
          <div>
            <p className="text-muted-foreground">Database</p>
            <p className="font-medium">Supabase PostgreSQL</p>
          </div>
          <div>
            <p className="text-muted-foreground">Frontend</p>
            <p className="font-medium">React + TypeScript</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Update</p>
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};