import { Settings, Database, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Header = ({ onNavigate, currentView }: HeaderProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'products', label: 'Product Creator', icon: null },
    { id: 'batches', label: 'Batch Editor', icon: null },
    { id: 'machine', label: 'Machine Overview', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">MACON Desktop</h1>
          </div>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className="gap-2"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            PLC Connected
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Database className="w-4 h-4" />
            Backup
          </Button>
        </div>
      </div>
    </header>
  );
};