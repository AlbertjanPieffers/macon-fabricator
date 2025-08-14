import { Settings, Database, Cpu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Header = ({ onNavigate, currentView }: HeaderProps) => {
  const { user, signOut } = useAuth();
  
  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'products', label: 'Product Creator', icon: null },
    { id: 'batches', label: 'Batch Editor', icon: null },
    { id: 'machine', label: 'Machine Overview', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="app-header">
      <div className="brand">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">M</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">MACON Desktop</h1>
        
        <nav className="flex items-center gap-1 ml-8">
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

      <div className="actions">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          PLC Connected
        </div>
        
        <div className="flex items-center gap-2 text-sm mr-4">
          <User className="w-4 h-4" />
          <span className="text-muted-foreground">{user?.email}</span>
        </div>
        
        <Button variant="outline" size="sm" className="btn gap-2">
          <Database className="w-4 h-4" />
          Backup
        </Button>
        
        <Button variant="outline" size="sm" className="btn gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};