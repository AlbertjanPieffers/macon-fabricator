import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { ProductCreator } from '@/components/ProductCreator';
import { BatchEditor } from '@/components/BatchEditor';
import { MachineOverview } from '@/components/MachineOverview';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading MACON Dash...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect happening
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'products':
        return <ProductCreator />;
      case 'batches':
        return <BatchEditor />;
      case 'machine':
        return <MachineOverview />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;