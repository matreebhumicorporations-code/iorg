import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, PaymentMethod } from '../types';
import { 
  Home, 
  Compass, 
  Heart, 
  Calendar, 
  CreditCard, 
  Bell, 
  User, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText,
  DollarSign,
  PlusCircle,
  TrendingUp,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface CustomerDashboardProps {
  setView: (view: string, extraParams?: any) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ setView }) => {
  const { 
    currentUser, 
    bookings, 
    services, 
    notifications, 
    toggleSaveService, 
    payBooking, 
    addReview, 
    updateProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'saves' | 'payments' | 'notifications' | 'profile'>('home');
  
  // Review formulation states
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Payment states (for unpaid items)
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNo, setCardNo] = useState('');

  // Profile forms
  const [name, setName] = useState(currentUser?.name || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [password, setPassword] = useState('');

  // Invoice display state
  const [viewingInvoice, setViewingInvoice] = useState<Booking | null>(null);

  if (!currentUser) {
    return (
      <div className="p-16 text-center text-white font-sans bg-maroon-black">
        <p>Please log in to view your dashboard.</p>
        <button 
          onClick={() => setView('login')}
          className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold rounded-xl text-xs uppercase tracking-wider mt-4"
        >
          Login Now
        </button>
      </div>
    );
  }

  // Filter models for current customer
  const myBookings = bookings.filter((b) => b.customerId === currentUser.id);
  const mySavedServices = services.filter((s) => currentUser.savedServices.includes(s.id));
  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const myPaidBookings = myBookings.filter((b) => b.paymentStatus === 'paid');

  const totalSpent = myPaidBookings.reduce((sum, b) => sum + b.price, 0);
  const pendingOrders = myBookings.filter((b) => b.status === 'pending').length;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, mobile, email, address, password });
    alert('Profile updated successfully!');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking) return;
    addReview(reviewingBooking.serviceId, reviewRating, reviewComment);
    setReviewingBooking(null);
    setReviewComment('');
    setReviewRating(5);
    alert('Review posted successfully!');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBooking) return;
    payBooking(payingBooking.id, paymentMethod);
    setPayingBooking(null);
    setUpiId('');
    setCardNo('');
    alert('Payment accepted successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-green-500 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-red-500 px-2.5 py-1 bg-red-500/10 rounded-full border border-red-500/20">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-blue-400 px-2.5 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-gold-400 px-2.5 py-1 bg-gold-400/10 rounded-full border border-gold-400/20">
            <Clock className="w-3 h-3 text-gold-500 animate-pulse" /> Pending approval
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="text-[10px] font-mono text-green-500 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md">
            Paid
          </span>
        );
      case 'refunded':
        return (
          <span className="text-[10px] font-mono text-maroon-400 px-2 py-0.5 bg-maroon-900/10 border border-maroon-800 rounded-md">
            Refunded
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-gold-500 px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-md">
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-maroon-black text-maroon-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 bg-maroon-card border border-maroon-border p-6 rounded-2xl h-fit space-y-6">
          <div className="flex items-center gap-3 border-b border-maroon-border/50 pb-5">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-12 h-12 rounded-full object-cover border border-gold-500/30 referrer-policy='no-referrer'"
            />
            <div>
              <h3 className="font-display font-bold text-white text-sm tracking-tight leading-tight">{currentUser.name}</h3>
              <p className="text-[9px] font-mono text-gold-400 uppercase mt-0.5 tracking-wider">Premium Customer</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'home' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Home className="w-4 h-4" />
              Summary Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'bookings' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Bookings ({myBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('saves')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'saves' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Heart className="w-4 h-4" />
              Saved Services ({mySavedServices.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'payments' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Payments & Invoices
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'notifications' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Bell className="w-4 h-4" />
              Alerts & Notifications
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'profile' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              Manage Profile
            </button>
          </nav>

          <div className="border-t border-maroon-border/30 pt-6">
            <button 
              onClick={() => setView('services')}
              className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.01]"
            >
              Book New Service
            </button>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="lg:col-span-3 bg-maroon-card border border-maroon-border p-6 md:p-8 rounded-2xl min-h-[500px]">
          
          {/* TAB 1: SUMMARY HOME OVERVIEW */}
          {activeTab === 'home' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-maroon-border/40 pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white tracking-tight">Welcome, {currentUser.name}!</h2>
                  <p className="text-xs text-maroon-400">Manage and coordinate all your active event bookings, service escrows, and alerts.</p>
                </div>
                <div className="text-xs font-mono bg-maroon-black px-3.5 py-1.5 rounded-xl border border-maroon-border text-maroon-300">
                  Total Bookings: <span className="text-gold-400 font-bold">{myBookings.length}</span>
                </div>
              </div>

              {/* Stats Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 bg-maroon-black/40 border border-maroon-border/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Total Capital Spent</span>
                    <h3 className="font-display font-bold text-xl text-white mt-1">₹{totalSpent.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-maroon-black/40 border border-maroon-border/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Pending Approvals</span>
                    <h3 className="font-display font-bold text-xl text-gold-400 mt-1">{pendingOrders} requests</h3>
                  </div>
                  <div className="p-3 bg-gold-500/10 text-gold-500 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-maroon-black/40 border border-maroon-border/80 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Saved Services</span>
                    <h3 className="font-display font-bold text-xl text-white mt-1">{mySavedServices.length} saved</h3>
                  </div>
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                    <Heart className="w-5 h-5 fill-red-500/20" />
                  </div>
                </div>
              </div>

              {/* Active Bookings Timeline Panel */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Current Active Bookings</h3>
                {myBookings.length === 0 ? (
                  <div className="p-12 text-center bg-maroon-black/30 border border-maroon-border/60 rounded-xl">
                    <p className="text-xs text-maroon-400 font-mono">You don't have any bookings registered yet.</p>
                    <button 
                      onClick={() => setView('services')}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black text-xs font-bold rounded-lg uppercase tracking-wider"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="p-5 bg-maroon-black/50 border border-maroon-border/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold-500/20 transition-all">
                        <div className="flex gap-4">
                          <img 
                            src={b.coverImage} 
                            alt={b.serviceTitle} 
                            className="w-16 h-12 object-cover rounded-xl border border-maroon-border referrer-policy='no-referrer'"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">{b.serviceTitle}</h4>
                            <p className="text-[10px] text-gold-400/80 mt-0.5">Organiser: {b.providerName}</p>
                            <p className="text-[10px] text-maroon-400 font-mono mt-1">Date: {b.date}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-maroon-400 font-mono block">Cost amount</span>
                            <p className="text-xs font-bold text-white">₹{b.price.toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            {getStatusBadge(b.status)}
                            {getPaymentBadge(b.paymentStatus)}
                          </div>

                          {/* Instant Payment Trigger */}
                          {b.paymentStatus === 'unpaid' && b.status !== 'rejected' && (
                            <button 
                              onClick={() => setPayingBooking(b)}
                              className="px-3.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-maroon-black text-xs font-bold rounded-lg transition-all"
                            >
                              Pay Now
                            </button>
                          )}

                          {/* Write Review Trigger */}
                          {b.status === 'completed' && !b.reviewLeft && (
                            <button 
                              onClick={() => setReviewingBooking(b)}
                              className="px-3.5 py-1.5 bg-maroon-900 border border-maroon-800 text-gold-400 hover:text-white text-xs font-bold rounded-lg transition-all"
                            >
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Your Event Bookings</h2>
                <p className="text-xs text-maroon-400">Complete historical timeline and request approvals from service providers.</p>
              </div>

              {myBookings.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-xs text-maroon-400 font-mono">No bookings found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-5 bg-maroon-black/40 border border-maroon-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4">
                        <img 
                          src={b.coverImage} 
                          alt={b.serviceTitle} 
                          className="w-16 h-12 object-cover rounded-xl border border-maroon-border referrer-policy='no-referrer'"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{b.serviceTitle}</h4>
                          <p className="text-[10px] text-maroon-400 mt-0.5">By {b.providerName}</p>
                          <p className="text-[10px] text-gold-400 font-mono mt-1">Scheduled for: {b.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-maroon-400 font-mono block">Order Code</span>
                          <span className="text-xs font-mono text-white block">{b.id}</span>
                          <span className="text-xs font-bold text-white mt-1 block">₹{b.price.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                          {getStatusBadge(b.status)}
                          {getPaymentBadge(b.paymentStatus)}
                        </div>

                        <div className="flex flex-col gap-2">
                          {b.paymentStatus === 'unpaid' && b.status !== 'rejected' && (
                            <button 
                              onClick={() => setPayingBooking(b)}
                              className="px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-maroon-black text-xs font-bold rounded-lg transition-all"
                            >
                              Pay Now
                            </button>
                          )}
                          
                          {b.paymentStatus === 'paid' && (
                            <button 
                              onClick={() => setViewingInvoice(b)}
                              className="px-3 py-1.5 bg-maroon-card border border-maroon-border text-gold-400 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Invoice
                            </button>
                          )}

                          {b.status === 'completed' && !b.reviewLeft && (
                            <button 
                              onClick={() => setReviewingBooking(b)}
                              className="px-3 py-1.5 bg-maroon-900 border border-maroon-800 text-gold-400 hover:text-white text-xs font-bold rounded-lg transition-all"
                            >
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED SERVICES */}
          {activeTab === 'saves' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Saved Portfolios</h2>
                <p className="text-xs text-maroon-400">Boutiques and specialists bookmarked for your future occasions.</p>
              </div>

              {mySavedServices.length === 0 ? (
                <div className="p-16 text-center text-xs text-maroon-400 font-mono">
                  You haven't bookmarked any services yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {mySavedServices.map((service) => (
                    <div key={service.id} className="bg-maroon-black/40 border border-maroon-border rounded-xl overflow-hidden flex flex-col justify-between">
                      <div className="relative aspect-video bg-maroon-black">
                        <img 
                          src={service.coverImage} 
                          alt={service.title} 
                          className="w-full h-full object-cover referrer-policy='no-referrer'"
                        />
                        <button
                          onClick={() => toggleSaveService(service.id)}
                          className="absolute top-2.5 right-2.5 p-2 bg-maroon-black/80 text-red-500 rounded-full border border-maroon-border hover:bg-maroon-card transition-all"
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{service.title}</h4>
                        <p className="text-[10px] text-maroon-400">By {service.providerName}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-maroon-border/20">
                          <span className="text-xs font-bold text-white">₹{service.price.toLocaleString()}</span>
                          <button 
                            onClick={() => setView('service-details', { serviceId: service.id })}
                            className="px-3 py-1 bg-maroon-900 border border-maroon-800 text-gold-400 text-[10px] font-bold rounded-md"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PAYMENTS STATEMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Billing & Ledger Statements</h2>
                <p className="text-xs text-maroon-400">View payment receipts, refund status log, and escrow clearances.</p>
              </div>

              {myPaidBookings.length === 0 ? (
                <div className="p-16 text-center text-xs text-maroon-400 font-mono">
                  No payment histories found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-maroon-border text-maroon-400 font-mono uppercase text-[10px]">
                        <th className="py-3 px-2">Invoice Code</th>
                        <th className="py-3 px-2">Service Ordered</th>
                        <th className="py-3 px-2">Date Cleared</th>
                        <th className="py-3 px-2">Payment Method</th>
                        <th className="py-3 px-2 text-right">Amount Cleared</th>
                        <th className="py-3 px-2 text-center">Invoicing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPaidBookings.map((b) => (
                        <tr key={b.id} className="border-b border-maroon-border/40 hover:bg-maroon-black/30">
                          <td className="py-3.5 px-2 font-mono text-white">{b.paymentDetails?.invoiceNo || 'N/A'}</td>
                          <td className="py-3.5 px-2 font-semibold text-white">{b.serviceTitle}</td>
                          <td className="py-3.5 px-2 text-maroon-300">{b.paymentDetails?.date || 'N/A'}</td>
                          <td className="py-3.5 px-2 font-mono uppercase text-gold-400">{b.paymentMethod || 'N/A'}</td>
                          <td className="py-3.5 px-2 text-right font-bold text-white">₹{b.price.toLocaleString()}</td>
                          <td className="py-3.5 px-2 text-center">
                            <button 
                              onClick={() => setViewingInvoice(b)}
                              className="p-1.5 text-gold-400 hover:text-white bg-maroon-black border border-maroon-border rounded-lg inline-flex"
                              title="Download Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ALERTS & NOTIFICATIONS LOG */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">System Alerts Log</h2>
                <p className="text-xs text-maroon-400">Vitals log tracking booking updates, clearances, and invoice alerts.</p>
              </div>

              {myNotifications.length === 0 ? (
                <div className="p-16 text-center text-xs text-maroon-400 font-mono">
                  No notifications recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {myNotifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border rounded-xl flex items-start gap-3 transition-colors ${
                        n.read ? 'bg-maroon-black/20 border-maroon-border/40' : 'bg-maroon-950/20 border-maroon-border'
                      }`}
                    >
                      <div className="p-2 bg-maroon-black border border-maroon-border rounded-lg">
                        <Bell className="w-4 h-4 text-gold-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{n.title}</h4>
                        <p className="text-xs text-maroon-300 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-maroon-400 font-mono mt-2 block">
                          {new Date(n.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MANAGE PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Account Configuration</h2>
                <p className="text-xs text-maroon-400">Update your physical contact coordinates, notifications settings, and passwords.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Mobile Number</label>
                    <input 
                      type="text" 
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Physical Address Coordinates</label>
                  <textarea 
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Physical flat, block, tower details for custom catering and decoration consultations..."
                    className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Reset Security Password (Optional)</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new account password if you wish to reset..."
                    className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div className="pt-4 border-t border-maroon-border/30">
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.01]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: ESCROW SECURE PAYMENT GATEWAY POPUP */}
      {payingBooking && (
        <div className="fixed inset-0 bg-maroon-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maroon-card border border-maroon-border w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-slide-up">
            
            <button 
              onClick={() => setPayingBooking(null)}
              className="absolute top-4 right-4 text-maroon-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-maroon-border/40 mb-4">
              <h3 className="font-display font-bold text-white text-base">Escrow Secure Clearance</h3>
              <p className="text-[10px] text-maroon-400 font-mono mt-0.5">Order Ref: {payingBooking.id}</p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left">
              <div className="p-3 bg-maroon-black border border-maroon-border/60 rounded-xl space-y-1 text-xs">
                <p className="text-maroon-400 font-mono text-[10px]">Billing amount:</p>
                <p className="text-white font-bold text-base">₹{payingBooking.price.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white">Payment System</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['upi', 'card', 'netbanking', 'wallet'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-3 border rounded-xl text-xs font-mono uppercase text-center ${
                        paymentMethod === m
                          ? 'bg-maroon-900 border-gold-500 text-gold-400 font-bold'
                          : 'bg-maroon-black border-maroon-border text-maroon-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-[10px] font-semibold text-maroon-300 mb-1">Enter UPI VPA ID</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. user@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-maroon-300 mb-1">16-Digit Card Number</label>
                    <input 
                      type="text"
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      maxLength={19}
                      className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      required 
                      placeholder="MM/YY" 
                      maxLength={5}
                      className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-1.5 text-[11px] text-white font-mono text-center"
                    />
                    <input 
                      type="password" 
                      required 
                      placeholder="CVV" 
                      maxLength={3}
                      className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-1.5 text-[11px] text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Clear Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WRITE FEEDBACK REVIEW DIALOG */}
      {reviewingBooking && (
        <div className="fixed inset-0 bg-maroon-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maroon-card border border-maroon-border w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-slide-up">
            
            <button 
              onClick={() => setReviewingBooking(null)}
              className="absolute top-4 right-4 text-maroon-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-maroon-border/40 mb-4">
              <h3 className="font-display font-bold text-white text-base">Write Service Review</h3>
              <p className="text-[10px] text-maroon-400 font-mono mt-0.5">For order: {reviewingBooking.serviceTitle}</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
              {/* Star Selection */}
              <div>
                <label className="block text-xs font-semibold text-maroon-300 mb-2">Service Quality Rating</label>
                <div className="flex items-center gap-2 justify-center py-2 bg-maroon-black border border-maroon-border/60 rounded-xl">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewRating(stars)}
                      className="p-1 text-gold-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${stars <= reviewRating ? 'fill-gold-400 text-gold-400' : 'text-maroon-800'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Review Comment</label>
                <textarea 
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your experience with this service provider. Floral decors, catering delays, cameraman focus..."
                  className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/50 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Post Review & Rating
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE GENERATOR VIEW */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-maroon-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-maroon-card border border-maroon-border w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 relative animate-slide-up text-maroon-200">
            
            <button 
              onClick={() => setViewingInvoice(null)}
              className="absolute top-4 right-4 text-maroon-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* Visual Invoice Frame */}
            <div className="p-6 bg-white text-gray-900 rounded-xl shadow-inner font-sans" id="printable-invoice">
              
              {/* Invoice Header */}
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-5 mb-5">
                <div>
                  <h3 className="text-sm font-mono tracking-widest font-bold text-maroon-700 uppercase">IORGANISE LTD.</h3>
                  <p className="text-[10px] text-gray-400 leading-normal">Billing: support@iorganise.in</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-gray-900">RECEIPT INVOICE</h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">Invoice: {viewingInvoice.paymentDetails?.invoiceNo}</p>
                </div>
              </div>

              {/* Invoice Meta coordinates */}
              <div className="grid grid-cols-2 gap-4 text-[10px] border-b border-gray-100 pb-5 mb-5">
                <div>
                  <p className="text-gray-400 font-semibold uppercase">Invoice To:</p>
                  <p className="text-gray-900 font-bold mt-1">{viewingInvoice.customerName}</p>
                  <p className="text-gray-500">{viewingInvoice.customerEmail}</p>
                  <p className="text-gray-500">{viewingInvoice.customerMobile}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold uppercase text-right">Provider Details:</p>
                  <p className="text-gray-900 font-bold text-right mt-1">{viewingInvoice.providerName}</p>
                  <p className="text-gray-400 text-right font-mono mt-1">Ref Transaction ID:</p>
                  <p className="text-gray-900 text-right font-mono font-semibold">{viewingInvoice.paymentDetails?.txId}</p>
                  <p className="text-gray-400 text-right font-mono mt-0.5">Date Cleared: {viewingInvoice.paymentDetails?.date}</p>
                </div>
              </div>

              {/* Items listing */}
              <table className="w-full text-left text-xs mb-6">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-gray-400 uppercase text-[9px] font-bold">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Unit</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 text-gray-800">
                    <td className="py-3">
                      <p className="font-bold text-gray-900">{viewingInvoice.serviceTitle}</p>
                      <p className="text-[10px] text-gray-400 capitalize">Category: {viewingInvoice.serviceCategory} Service</p>
                    </td>
                    <td className="py-3 text-center text-gray-500">1</td>
                    <td className="py-3 text-right font-semibold text-gray-900">₹{viewingInvoice.price.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t-2 border-gray-100 pt-4 text-right flex flex-col items-end gap-1 text-xs">
                <div className="flex justify-between w-40 text-gray-500">
                  <span>Subtotal:</span>
                  <span>₹{viewingInvoice.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-40 text-gray-500 border-b border-gray-100 pb-2">
                  <span>Taxes (Included):</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between w-40 text-sm font-bold text-maroon-700 pt-2">
                  <span>Total Cleared:</span>
                  <span>₹{viewingInvoice.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Footnotes */}
              <div className="border-t border-gray-100 pt-5 mt-5 text-center text-[9px] text-gray-400">
                <p>This is a computer-generated transaction receipt issued securely via iORGANISE Escrow.</p>
                <p className="mt-0.5">Thank you for hosting with iORGANISE!</p>
              </div>

            </div>

            <button 
              onClick={() => {
                window.print();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-maroon-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all mt-6"
            >
              Print Receipt / Save PDF
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
