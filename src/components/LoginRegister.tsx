import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Mail, Phone, Lock, User as UserIcon, AlertCircle, KeyRound, Sparkles, HelpCircle, X, CheckCircle } from 'lucide-react';

interface LoginRegisterProps {
  initialIsRegister?: boolean;
  forceRole?: UserRole;
  redirectTo?: string;
  redirectServiceId?: string;
  setView: (view: string, extraParams?: any) => void;
}

export const LoginRegister: React.FC<LoginRegisterProps> = ({ 
  initialIsRegister = false, 
  forceRole, 
  redirectTo,
  redirectServiceId,
  setView 
}) => {
  const { login, register } = useApp();

  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [role, setRole] = useState<UserRole>(forceRole || 'customer');
  const [name, setName] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (!name.trim() || !emailOrMobile.trim() || !password.trim()) {
        setErrorMsg('Please fill out all fields.');
        return;
      }
      
      const res = register(name, emailOrMobile, role, password);
      if (res.success) {
        // Successful registration, route appropriately
        if (redirectTo === 'service-details' && redirectServiceId) {
          setView('service-details', { serviceId: redirectServiceId });
        } else {
          setView(role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard');
        }
      } else {
        setErrorMsg(res.error || 'An error occurred during registration.');
      }
    } else {
      if (!emailOrMobile.trim() || !password.trim()) {
        setErrorMsg('Please enter both Email/Mobile and Password.');
        return;
      }

      const res = login(emailOrMobile, password);
      if (res.success) {
        // Find user to decide view
        // The AppContext updates currentUser, so we can route
        const savedUserStr = localStorage.getItem('em_current_user');
        const user = savedUserStr ? JSON.parse(savedUserStr) : null;
        
        if (user) {
          if (redirectTo === 'service-details' && redirectServiceId) {
            setView('service-details', { serviceId: redirectServiceId });
          } else {
            setView(user.role === 'customer' ? 'customer-dashboard' : 'organiser-dashboard');
          }
        } else {
          setView('landing');
        }
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-maroon-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-maroon-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-maroon-card border border-maroon-border rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 animate-slide-up">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-maroon-700 rounded-xl flex items-center justify-center border border-gold-500/20 mx-auto mb-3">
            <span className="text-gold-400 font-display font-bold text-lg">E</span>
          </div>
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            {isRegister ? 'Create Curation Account' : 'Partner Portal Login'}
          </h2>
          <p className="text-xs text-maroon-400 mt-1">
            {isRegister ? 'Gain access to premium catering, decor and coordination.' : 'Manage secure bookings and active event calendars.'}
          </p>
        </div>

        {/* Demo Credentials Warning Box */}
        {!isRegister && (
          <div className="mb-6 p-3.5 bg-maroon-black border border-maroon-border/80 rounded-xl text-[10px] md:text-xs text-maroon-300 space-y-1 font-mono">
            <p className="text-gold-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Preloaded Demo Accounts:
            </p>
            <p>• Customer: <span className="text-white">customer@gmail.com</span> / password</p>
            <p>• Organiser: <span className="text-white">organiser@gmail.com</span> / password</p>
          </div>
        )}

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/30 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration fields */}
          {isRegister && (
            <>
              {/* Role Toggle */}
              <div>
                <label className="block text-xs font-semibold text-maroon-300 mb-2">I want to join as a:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      role === 'customer'
                        ? 'bg-maroon-900 border-gold-500 text-gold-400 font-bold'
                        : 'bg-maroon-black border-maroon-border text-maroon-400 hover:border-maroon-700'
                    }`}
                  >
                    Customer (Hire Pros)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organiser')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      role === 'organiser'
                        ? 'bg-maroon-900 border-gold-500 text-gold-400 font-bold'
                        : 'bg-maroon-black border-maroon-border text-maroon-400 hover:border-maroon-700'
                    }`}
                  >
                    Organiser (Sell Services)
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-maroon-black border border-maroon-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email or Mobile */}
          <div>
            <label className="block text-xs font-semibold text-maroon-300 mb-1.5">
              Email Address / Mobile Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400" />
              <input
                type="text"
                required
                placeholder="e.g. customer@gmail.com or 9876543210"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                className="w-full bg-maroon-black border border-maroon-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-maroon-300">Security Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] text-maroon-400 hover:text-gold-400"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-maroon-black border border-maroon-border rounded-xl pl-11 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember_me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-gold-500 cursor-pointer rounded bg-maroon-black border-maroon-border"
            />
            <label htmlFor="remember_me" className="text-[10px] text-maroon-400 cursor-pointer select-none">
              Remember my session parameters
            </label>
          </div>

          {/* Submit Trigger Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
          >
            {isRegister ? 'Launch Account' : 'Secure Login'}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="border-t border-maroon-border/40 mt-6 pt-5 text-center">
          <p className="text-xs text-maroon-300">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg('');
              }}
              className="text-gold-400 hover:underline font-semibold"
            >
              {isRegister ? 'Login instead' : 'Sign up now'}
            </button>
          </p>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-maroon-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maroon-card border border-maroon-border w-full max-w-sm rounded-2xl shadow-2xl p-6 relative animate-slide-up text-center">
            
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-maroon-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 bg-maroon-900 rounded-full flex items-center justify-center text-gold-400 mx-auto mb-4 border border-maroon-850">
              <KeyRound className="w-5 h-5" />
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <h3 className="font-display font-bold text-white text-base">Reset Security Password</h3>
                  <p className="text-xs text-maroon-300 mt-1">
                    Enter your registered email address or mobile below. We will send you a secure OTP link.
                  </p>
                </div>

                <input
                  type="text"
                  required
                  placeholder="customer@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold-500"
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Send OTP Reset Link
                </button>
              </form>
            ) : (
              <div className="space-y-2 py-4 animate-fade-in text-maroon-300">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-white font-bold font-display text-sm">OTP Dispatched!</h4>
                <p className="text-xs leading-relaxed max-w-[280px] mx-auto">
                  A simulated password reset link has been dispatched to <span className="text-white font-semibold">{forgotEmail}</span>.
                </p>
                <p className="text-[10px] text-maroon-400">This popup will automatically dismiss shortly...</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
