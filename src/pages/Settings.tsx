import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Database, Globe, Shield } from 'lucide-react';

export const Settings = () => {
  const configValues = {
    // Frontend config (would be from env vars)
    frontend: {
      apiBase: 'https://api.macon-office.com',
      supabaseUrl: 'https://nerhxpfcccyggmmxdugc.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
    // Backend config (displayed for info only)
    backend: {
      port: '8080',
      mongoUri: 'mongodb://production-server:27017',
      mongoDb: 'MACON_Production',
      plcBridgeBase: 'http://192.168.1.100:5001',
      fileBridgeBase: 'http://192.168.1.100:5100',
      requiredRole: 'office',
    },
    // System info
    system: {
      environment: 'Production',
      version: '1.0.0',
      deployment: 'Lovable Cloud',
      lastUpdate: new Date().toLocaleDateString(),
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">System configuration and environment information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frontend Configuration */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Globe className="h-5 w-5 text-primary" />
              Frontend Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">API Base URL</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.frontend.apiBase}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Supabase URL</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.frontend.supabaseUrl}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Supabase Anon Key</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.frontend.supabaseAnonKey.substring(0, 20)}...
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backend Configuration */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Database className="h-5 w-5 text-primary" />
              Backend Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Server Port</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.backend.port}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">MongoDB URI</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.backend.mongoUri}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Database Name</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.backend.mongoDb}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">PLC Bridge</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.backend.plcBridgeBase}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">File Bridge</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm font-mono">
                  {configValues.backend.fileBridgeBase}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Security & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Required Role for Mutations</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                    {configValues.backend.requiredRole}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Authentication Method</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm">
                  Supabase JWT (JWKS validation)
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Network Access</label>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-card-foreground">API: Public HTTPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-card-foreground">PLC/Files: Private LAN/ZeroTier</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="bg-card border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <SettingsIcon className="h-5 w-5 text-primary" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Environment</label>
                <div className="mt-1">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {configValues.system.environment}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Version</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm">
                  {configValues.system.version}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deployment Platform</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm">
                  {configValues.system.deployment}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Update</label>
                <div className="mt-1 p-2 bg-background border border-border rounded text-card-foreground text-sm">
                  {configValues.system.lastUpdate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Read-only Notice */}
      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              <strong>Note:</strong> This is a read-only view of system configuration.
            </p>
            <p className="text-muted-foreground text-xs">
              Configuration changes must be made through environment variables and secrets management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};