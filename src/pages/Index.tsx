import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Batches } from '@/pages/Batches';
import { Progress } from '@/pages/Progress';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/Login';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground"></div>
          </div>
          <p className="text-muted-foreground">Loading MACON Office...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'batches':
        return <Batches />;
      case 'progress':
        return <Progress />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;