import { useState } from 'react';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { ProductCreator } from '@/components/ProductCreator';
import { BatchEditor } from '@/components/BatchEditor';
import { MachineOverview } from '@/components/MachineOverview';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');

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