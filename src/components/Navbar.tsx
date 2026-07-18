import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  Calendar, 
  Compass, 
  Heart, 
  ClipboardList, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: string, extraParams?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { currentUser, logout, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => currentUser && n.userId === currentUser.id && !n.read);

  const handleLogout = () => {
    logout();
    setView('landing');
    setShowMobileMenu(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-gold-400" />;
      case 'payment':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-maroon-400" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-maroon-black border-b border-maroon-border/80 backdrop-blur-md px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setView('landing')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-maroon-700 flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500 transition-colors">
            <span className="text-gold-400 font-display font-bold text-lg">iO</span>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              i<span className="text-gold-400">ORGANISE</span>
            </span>
            <p className="text-[9px] font-mono tracking-widest text-maroon-300 uppercase leading-none -mt-0.5">
              Premium Portal
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setView('landing')}
            className={`text-sm font-medium transition-colors ${currentView === 'landing' ? 'text-gold-400' : 'text-maroon-200 hover:text-gold-300'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('services')}
            className={`text-sm font-medium transition-colors ${currentView === 'services' ? 'text-gold-400' : 'text-maroon-200 hover:text-gold-300'}`}
          >
            Find Services
          </button>
          
          {currentUser && (
            <button 
              onClick={() => setView(currentUser.role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard')}
              className={`text-sm font-medium transition-colors ${['customer-dashboard', 'organiser-dashboard'].includes(currentView) ? 'text-gold-400' : 'text-maroon-200 hover:text-gold-300'}`}
            >
              Dashboard
            </button>
          )}
        </div>

        {/* Right Corner Buttons */}
        <div className="flex items-center gap-3 relative">
          {currentUser ? (
            <>
              {/* Notifications Panel Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-maroon-200 hover:text-gold-400 hover:bg-maroon-card/60 rounded-full transition-all relative border border-transparent hover:border-maroon-border"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gold-500 rounded-full animate-pulse border border-maroon-black" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-maroon-card border border-maroon-border rounded-xl shadow-xl z-50 overflow-hidden animate-slide-up">
                    <div className="p-3 bg-maroon-dark border-b border-maroon-border flex items-center justify-between">
                      <span className="text-xs font-semibold text-white tracking-wide uppercase">Notifications</span>
                      {unreadNotifs.length > 0 && (
                        <button 
                          onClick={markAllNotificationsRead}
                          className="text-[10px] text-gold-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                        <div className="p-6 text-center text-xs text-maroon-300 font-mono">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications
                          .filter(n => n.userId === currentUser.id)
                          .map((notif) => (
                            <div 
                              key={notif.id} 
                              onClick={() => {
                                markNotificationRead(notif.id);
                                if (currentUser.role === 'customer') {
                                  setView('customer-dashboard');
                                } else {
                                  setView('organiser-dashboard');
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-3 border-b border-maroon-border/40 hover:bg-maroon-dark/60 cursor-pointer flex gap-3 transition-colors ${!notif.read ? 'bg-maroon-950/25' : ''}`}
                            >
                              <div className="p-1.5 h-fit bg-maroon-black rounded-lg border border-maroon-border">
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                                <p className="text-[11px] text-maroon-300 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                                <p className="text-[9px] text-maroon-400 mt-1 font-mono">
                                  {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar / Quick Nav */}
              <div className="hidden md:flex items-center gap-3 pl-2 border-l border-maroon-border">
                <div 
                  onClick={() => setView(currentUser.role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard')}
                  className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 group"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover border border-gold-500/30 group-hover:border-gold-500 transition-colors referrer-policy='no-referrer'"
                  />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white max-w-[100px] truncate leading-tight">{currentUser.name}</p>
                    <p className="text-[9px] font-mono text-gold-400/80 capitalize">{currentUser.role}</p>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-maroon-300 hover:text-maroon-100 hover:bg-maroon-900/20 rounded-full transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setView('login')}
                className="px-4 py-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-500/60 rounded-lg transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => setView('register')}
                className="px-4 py-1.5 text-xs font-medium bg-maroon-700 hover:bg-maroon-600 text-white rounded-lg transition-all border border-maroon-600"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-maroon-200 hover:text-gold-400 rounded-lg transition-all"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden mt-3 pt-3 pb-2 border-t border-maroon-border/50 animate-fade-in flex flex-col gap-2">
          <button 
            onClick={() => { setView('landing'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentView === 'landing' ? 'bg-maroon-950/50 text-gold-400' : 'text-maroon-200'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setView('services'); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentView === 'services' ? 'bg-maroon-950/50 text-gold-400' : 'text-maroon-200'}`}
          >
            Find Services
          </button>

          {currentUser ? (
            <>
              <button 
                onClick={() => { setView(currentUser.role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard'); setShowMobileMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${['customer-dashboard', 'organiser-dashboard'].includes(currentView) ? 'bg-maroon-950/50 text-gold-400' : 'text-maroon-200'}`}
              >
                My Dashboard ({currentUser.role === 'customer' ? 'Customer' : 'Organiser'})
              </button>
              
              <div className="my-2 border-t border-maroon-border/30 pt-2 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full border border-gold-500/20"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-maroon-400 font-mono capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-maroon-400 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5 px-3 pt-2 mt-2 border-t border-maroon-border/30">
              <button 
                onClick={() => { setView('login'); setShowMobileMenu(false); }}
                className="flex-1 py-2 text-center rounded-lg text-xs font-medium text-gold-400 border border-gold-500/30"
              >
                Login
              </button>
              <button 
                onClick={() => { setView('register'); setShowMobileMenu(false); }}
                className="flex-1 py-2 text-center rounded-lg text-xs font-medium bg-maroon-700 text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
