import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">System configuration and environment information</p>
      </div>

      <Card className="bg-card border-border rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-card-foreground">API Base URL</span>
              <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                {import.meta.env.VITE_API_BASE || 'http://localhost:8080'}
              </code>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-card-foreground">Supabase URL</span>
              <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
              </code>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-card-foreground">Environment</span>
              <Badge variant="secondary">
                {import.meta.env.MODE || 'development'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg border border-border">
              <span className="text-sm font-medium text-card-foreground">Project Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Configuration values are read-only. Contact system administrator to modify settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};