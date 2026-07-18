import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ServicesCatalog } from './components/ServicesCatalog';
import { ServiceDetails } from './components/ServiceDetails';
import { LoginRegister } from './components/LoginRegister';
import { CustomerDashboard } from './components/CustomerDashboard';
import { OrganiserDashboard } from './components/OrganiserDashboard';
import { 
  Home as HomeIcon, 
  Compass, 
  ClipboardList, 
  Bell, 
  User as UserIcon 
} from 'lucide-react';
import { ServiceCategory, UserRole } from './types';

function MainAppContent() {
  const { currentUser } = useApp();
  
  // Custom router state
  const [view, setViewInternal] = useState<string>('landing');
  const [viewParams, setViewParams] = useState<any>({});

  // Navigation controller with page transition support
  const setView = (newView: string, extraParams: any = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewInternal(newView);
    setViewParams(extraParams);
  };

  // Sync back to top on load
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  const renderActiveView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage setView={setView} />;
      case 'services':
        return (
          <ServicesCatalog 
            initialCategory={viewParams?.category as ServiceCategory} 
            setView={setView} 
          />
        );
      case 'service-details':
        return (
          <ServiceDetails 
            serviceId={viewParams?.serviceId || 's-org-1'} 
            setView={setView} 
          />
        );
      case 'login':
        return (
          <LoginRegister 
            initialIsRegister={false}
            forceRole={viewParams?.forceRole as UserRole}
            redirectTo={viewParams?.redirectTo}
            redirectServiceId={viewParams?.redirectServiceId}
            setView={setView} 
          />
        );
      case 'register':
        return (
          <LoginRegister 
            initialIsRegister={true}
            forceRole={viewParams?.forceRole as UserRole}
            redirectTo={viewParams?.redirectTo}
            redirectServiceId={viewParams?.redirectServiceId}
            setView={setView} 
          />
        );
      case 'customer-dashboard':
        return <CustomerDashboard setView={setView} />;
      case 'organiser-dashboard':
        return <OrganiserDashboard setView={setView} />;
      default:
        return <LandingPage setView={setView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-maroon-black text-maroon-100 pb-16 md:pb-0">
      {/* Top sticky Navbar */}
      <Navbar currentView={view} setView={setView} />

      {/* Primary viewport */}
      <div className="flex-grow animate-fade-in">
        {renderActiveView()}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (md:hidden) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-maroon-black/95 backdrop-blur-md border-t border-maroon-border/80 z-40 px-6 py-2.5 flex items-center justify-between shadow-2xl">
        {/* Home */}
        <button 
          onClick={() => setView('landing')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'landing' ? 'text-gold-400 font-bold' : 'text-maroon-400'}`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight">Home</span>
        </button>

        {/* Categories/Services */}
        <button 
          onClick={() => setView('services')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'services' ? 'text-gold-400 font-bold' : 'text-maroon-400'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight">Services</span>
        </button>

        {/* Dashboard Bookings/Orders */}
        <button 
          onClick={() => {
            if (currentUser) {
              setView(currentUser.role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard');
            } else {
              setView('login', { redirectTo: 'services' });
            }
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${['customer-dashboard', 'organiser-dashboard'].includes(view) ? 'text-gold-400 font-bold' : 'text-maroon-400'}`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight">Orders</span>
        </button>

        {/* Account Profile */}
        <button 
          onClick={() => {
            if (currentUser) {
              setView(currentUser.role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard');
            } else {
              setView('login');
            }
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'login' ? 'text-gold-400 font-bold' : 'text-maroon-400'}`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px] font-mono tracking-tight">Account</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
