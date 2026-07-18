import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, Service, ServiceCategory } from '../types';
import { 
  Home, 
  Calendar, 
  PlusCircle, 
  Briefcase, 
  TrendingUp, 
  Star, 
  Bell, 
  User, 
  Layers, 
  Sparkles, 
  Utensils, 
  Camera, 
  Check, 
  X, 
  MapPin, 
  Clock, 
  Trash2, 
  FileText,
  DollarSign
} from 'lucide-react';

interface OrganiserDashboardProps {
  setView: (view: string, extraParams?: any) => void;
}

export const OrganiserDashboard: React.FC<OrganiserDashboardProps> = ({ setView }) => {
  const { 
    currentUser, 
    bookings, 
    services, 
    notifications, 
    addService, 
    deleteService, 
    acceptBooking, 
    rejectBooking, 
    completeBooking,
    updateCompanyProfile,
    updateProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'bookings' | 'earnings' | 'add-service' | 'profile'>('dashboard');

  // Form states for Add Service
  const [srvCategory, setSrvCategory] = useState<ServiceCategory>('organiser');
  const [srvTitle, setSrvTitle] = useState('');
  const [srvDescription, setSrvDescription] = useState('');
  const [srvPrice, setSrvPrice] = useState(0);
  const [srvPricingUnit, setSrvPricingUnit] = useState('per event');
  const [srvLocation, setSrvLocation] = useState('Mumbai, MH');
  const [srvExperience, setSrvExperience] = useState(5);
  const [srvCover, setSrvCover] = useState('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800');
  
  // Specs form lists
  const [specDecor, setSpecDecor] = useState('');
  const [specMenu, setSpecMenu] = useState('');
  const [specEquipment, setSpecEquipment] = useState('');
  const [specPackages, setSpecPackages] = useState('');

  // Form states for Company Profile
  const [compName, setCompName] = useState(currentUser?.companyProfile?.companyName || currentUser?.name || '');
  const [compDesc, setCompDesc] = useState(currentUser?.companyProfile?.description || '');
  const [compExp, setCompExp] = useState(currentUser?.companyProfile?.experience || 1);
  const [compAddr, setCompAddr] = useState(currentUser?.companyProfile?.address || '');

  // Form states for user profile
  const [uName, setUName] = useState(currentUser?.name || '');
  const [uMobile, setUMobile] = useState(currentUser?.mobile || '');
  const [uEmail, setUEmail] = useState(currentUser?.email || '');
  const [uAddr, setUAddr] = useState(currentUser?.address || '');

  if (!currentUser || currentUser.role !== 'organiser') {
    return (
      <div className="p-16 text-center text-white font-sans bg-maroon-black">
        <p>Please log in as an Organiser to view this dashboard.</p>
        <button 
          onClick={() => setView('login')}
          className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold rounded-xl text-xs uppercase tracking-wider mt-4"
        >
          Login Now
        </button>
      </div>
    );
  }

  // Filter listings & bookings specifically owned by this organizer
  const myServices = services.filter((s) => s.providerId === currentUser.id);
  const myBookings = bookings.filter((b) => b.providerId === currentUser.id);
  const myPaidBookings = myBookings.filter((b) => b.paymentStatus === 'paid');
  const pendingRequests = myBookings.filter((b) => b.status === 'pending');
  const activeBookings = myBookings.filter((b) => ['accepted', 'pending'].includes(b.status));

  // Earnings calculations
  const totalEarnings = myPaidBookings.reduce((sum, b) => sum + b.price, 0);
  const projectedEarnings = myBookings
    .filter((b) => b.status === 'accepted' && b.paymentStatus === 'unpaid')
    .reduce((sum, b) => sum + b.price, 0);

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitle || !srvDescription || !srvPrice) {
      alert('Please fill out all mandatory fields');
      return;
    }

    const specs: any = {};
    if (srvCategory === 'planner' && specDecor) {
      specs.decorOptions = specDecor.split(',').map(s => s.trim());
    }
    if (srvCategory === 'caterer' && specMenu) {
      specs.menuCategories = specMenu.split(',').map(s => s.trim());
    }
    if (srvCategory === 'cameraman' && specEquipment) {
      specs.cameraEquipment = specEquipment.split(',').map(s => s.trim());
    }
    if (specPackages) {
      specs.packagesIncluded = specPackages.split(',').map(s => s.trim());
    }

    addService({
      category: srvCategory,
      title: srvTitle,
      description: srvDescription,
      coverImage: srvCover,
      price: Number(srvPrice),
      pricingUnit: srvPricingUnit,
      experience: Number(srvExperience),
      location: srvLocation,
      availability: ['Monday', 'Friday', 'Saturday', 'Sunday'], // Default active days
      portfolio: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600'
      ],
      specs
    });

    // Reset fields
    setSrvTitle('');
    setSrvDescription('');
    setSrvPrice(0);
    setSpecDecor('');
    setSpecMenu('');
    setSpecEquipment('');
    setSpecPackages('');
    
    alert('Service launched successfully in active directory!');
    setActiveTab('services');
  };

  const handleCompanyProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile({
      companyName: compName,
      description: compDesc,
      experience: Number(compExp),
      address: compAddr,
    });
    alert('Company Profile Portfolio saved successfully!');
  };

  const handlePersonalProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: uName,
      mobile: uMobile,
      email: uEmail,
      address: uAddr,
    });
    alert('Personal Contact settings updated successfully!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="text-[10px] font-mono text-green-500 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-md">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[10px] font-mono text-red-500 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">
            Declined
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
            Concluded
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-gold-500 px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-md animate-pulse">
            Awaiting Action
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    const icons: any = {
      organiser: <Layers className="w-3 h-3 text-gold-400" />,
      planner: <Sparkles className="w-3 h-3 text-gold-400" />,
      caterer: <Utensils className="w-3 h-3 text-gold-400" />,
      cameraman: <Camera className="w-3 h-3 text-gold-400" />
    };
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-maroon-black px-2.5 py-1 rounded-full border border-maroon-border/80 text-maroon-300">
        {icons[category]}
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-maroon-black text-maroon-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 bg-maroon-card border border-maroon-border p-6 rounded-2xl h-fit space-y-6">
          <div className="flex items-center gap-3 border-b border-maroon-border/50 pb-5">
            <div className="w-12 h-12 bg-maroon-800 rounded-xl flex items-center justify-center font-display font-bold text-lg text-white">
              {currentUser.name[0]}
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm tracking-tight leading-tight truncate max-w-[150px]">{currentUser.name}</h3>
              <p className="text-[9px] font-mono text-gold-400 uppercase mt-0.5 tracking-wider">Corporate Partner</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'dashboard' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Home className="w-4 h-4" />
              Stats Dashboard
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'services' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Catalog Directory ({myServices.length})
            </button>
            <button
              onClick={() => setActiveTab('add-service')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'add-service' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Launch Service
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'bookings' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Booking Orders ({myBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'earnings' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Earnings Summary
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'profile' ? 'bg-maroon-900/40 text-gold-400 border border-gold-500/20' : 'text-maroon-300 hover:bg-maroon-black/40 hover:text-white border border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Settings
            </button>
          </nav>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="lg:col-span-3 bg-maroon-card border border-maroon-border p-6 md:p-8 rounded-2xl min-h-[500px]">
          
          {/* TAB 1: SUMMARY DASHBOARD STATS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-maroon-border/40 pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white tracking-tight">Organiser Command Center</h2>
                  <p className="text-xs text-maroon-400">Track company portfolio visits, project bookings, and ledger payouts.</p>
                </div>
                {currentUser.companyProfile && (
                  <div className="flex items-center gap-1.5 bg-maroon-black px-3.5 py-1.5 rounded-xl border border-maroon-border text-xs text-white">
                    <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span>Rating: {currentUser.companyProfile.rating} / 5.0</span>
                  </div>
                )}
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 bg-maroon-black/40 border border-maroon-border/85 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Net Settled Earnings</span>
                    <h3 className="font-display font-bold text-xl text-green-500 mt-1">₹{totalEarnings.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-maroon-black/40 border border-maroon-border/85 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Unpaid Contracts</span>
                    <h3 className="font-display font-bold text-xl text-gold-400 mt-1">₹{projectedEarnings.toLocaleString()}</h3>
                  </div>
                  <div className="p-3 bg-gold-500/10 text-gold-500 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-maroon-black/40 border border-maroon-border/85 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Awaiting Action</span>
                    <h3 className="font-display font-bold text-xl text-white mt-1">{pendingRequests.length} requests</h3>
                  </div>
                  <div className="p-3 bg-maroon-900/20 text-maroon-400 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Booking Request Actions Grid */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Urgent Booking Requests</h3>
                  {pendingRequests.length > 0 && (
                    <span className="px-2 py-0.5 bg-gold-500 text-maroon-black text-[9px] font-bold uppercase rounded font-mono">Action Required</span>
                  )}
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="p-12 text-center bg-maroon-black/30 border border-maroon-border/60 rounded-xl">
                    <p className="text-xs text-maroon-400 font-mono">You don't have any pending event requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((b) => (
                      <div key={b.id} className="p-5 bg-maroon-black/40 border border-maroon-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{b.serviceTitle}</h4>
                            {getCategoryBadge(b.serviceCategory)}
                          </div>
                          <p className="text-[10px] text-maroon-400 mt-1">Client: <span className="text-white font-semibold">{b.customerName}</span> ({b.customerMobile})</p>
                          <p className="text-[10px] text-gold-400 font-mono mt-1">Scheduled for: {b.date}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-maroon-400 block font-mono">Quoted Cost</span>
                            <span className="text-xs font-bold text-white">₹{b.price.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => acceptBooking(b.id)}
                            className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all"
                            title="Accept Booking"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => rejectBooking(b.id)}
                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                            title="Decline Booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE SERVICES DIRECTORY MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-maroon-border/40 pb-4 mb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white tracking-tight">Your Active Service Portfolio</h2>
                  <p className="text-xs text-maroon-400">Launch or remove listings and update customer specifications.</p>
                </div>
                <button
                  onClick={() => setActiveTab('add-service')}
                  className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Launch New Service
                </button>
              </div>

              {myServices.length === 0 ? (
                <div className="p-16 text-center text-xs text-maroon-400 font-mono">
                  You have not published any service listings yet. Click "Launch New Service" to start.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myServices.map((srv) => (
                    <div key={srv.id} className="p-4 bg-maroon-black/40 border border-maroon-border rounded-xl flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="aspect-video rounded-lg overflow-hidden bg-maroon-black border border-maroon-border/60">
                          <img 
                            src={srv.coverImage} 
                            alt={srv.title} 
                            className="w-full h-full object-cover referrer-policy='no-referrer'"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white line-clamp-1">{srv.title}</h4>
                            {getCategoryBadge(srv.category)}
                          </div>
                          <p className="text-xs font-bold text-gold-400 mt-2">
                            ₹{srv.price.toLocaleString()} <span className="text-[10px] text-maroon-400 font-normal">/ {srv.pricingUnit}</span>
                          </p>
                          <p className="text-xs text-maroon-400 line-clamp-2 mt-2 leading-relaxed">{srv.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-maroon-border/20 pt-3 mt-4">
                        <div className="flex items-center gap-1 text-[10px]">
                          <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                          <span className="text-white font-semibold">{srv.rating}</span>
                          <span className="text-maroon-400">({srv.reviews.length} reviews)</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this listing?')) {
                              deleteService(srv.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-500 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LAUNCH SERVICE FORM */}
          {activeTab === 'add-service' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Launch a New Event Service</h2>
                <p className="text-xs text-maroon-400">Specify details, pricing bounds, themes, equipment and publish to the marketplace.</p>
              </div>

              <form onSubmit={handleAddServiceSubmit} className="space-y-5 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Service Category</label>
                    <select
                      value={srvCategory}
                      onChange={(e) => setSrvCategory(e.target.value as ServiceCategory)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="organiser">Event Organiser</option>
                      <option value="planner">Event Planner (Decorations & Theme)</option>
                      <option value="caterer">Caterer (Cuisine & Buffets)</option>
                      <option value="cameraman">Cameraman & Cinematic Film</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Years of Professional Experience</label>
                    <input 
                      type="number" 
                      required
                      min={1}
                      max={40}
                      value={srvExperience}
                      onChange={(e) => setSrvExperience(Number(e.target.value))}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Listing Display Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Grand Luxury Floral Hall Decor"
                    value={srvTitle}
                    onChange={(e) => setSrvTitle(e.target.value)}
                    className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Detailed Description</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Detail your specializations, packages, past milestone works, active crew capacity, timelines, etc..."
                    value={srvDescription}
                    onChange={(e) => setSrvDescription(e.target.value)}
                    className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Base Quoted Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 85000"
                      value={srvPrice || ''}
                      onChange={(e) => setSrvPrice(Number(e.target.value))}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Pricing Unit</label>
                    <select
                      value={srvPricingUnit}
                      onChange={(e) => setSrvPricingUnit(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="per event">Per Event</option>
                      <option value="per day">Per Day</option>
                      <option value="per plate">Per Plate</option>
                      <option value="package">Bespoke Package</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Target Location</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mumbai, MH"
                      value={srvLocation}
                      onChange={(e) => setSrvLocation(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Category-specific specifications */}
                <div className="p-4 bg-maroon-black/40 border border-maroon-border/80 rounded-2xl space-y-4">
                  <p className="text-[10px] text-gold-400 font-mono uppercase tracking-wider">Configure Specific Parameters</p>
                  
                  {srvCategory === 'planner' && (
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Decor Themes Available (Comma Separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Bohemian Chic, Royal Maroon, Vintage Lights"
                        value={specDecor}
                        onChange={(e) => setSpecDecor(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  )}

                  {srvCategory === 'caterer' && (
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Menu Categories (Comma Separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Mughlai Starters, Pan Asian, Live Desert Stalls"
                        value={specMenu}
                        onChange={(e) => setSpecMenu(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  )}

                  {srvCategory === 'cameraman' && (
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Camera Hardware & Rig Assets (Comma Separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. RED Raptor, Arri Alexa, Sony FX3, DJI Mavic Pro 3"
                        value={specEquipment}
                        onChange={(e) => setSpecEquipment(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Included Packages (Comma Separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Logistics Coordinator, Stage Setup, High-Res Raw Files"
                      value={specPackages}
                      onChange={(e) => setSpecPackages(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-maroon-border/30">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Publish to Directory
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: BOOKING ORDERS CONTROL */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Booking Requests & Orders Log</h2>
                <p className="text-xs text-maroon-400">Track milestones, approve requests, and conclude service deliveries.</p>
              </div>

              {myBookings.length === 0 ? (
                <div className="p-16 text-center text-xs text-maroon-400 font-mono">
                  No booking orders recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-5 bg-maroon-black/40 border border-maroon-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{b.serviceTitle}</h4>
                          {getCategoryBadge(b.serviceCategory)}
                        </div>
                        <p className="text-[10px] text-maroon-400 mt-1">Client: <span className="text-white font-semibold">{b.customerName}</span> ({b.customerEmail})</p>
                        <p className="text-[10px] text-gold-400 font-mono mt-0.5">Event Date: {b.date}</p>
                        <p className="text-[10px] text-maroon-400 font-mono mt-0.5">Order Ref Code: {b.id}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-maroon-400 block font-mono">Contract Worth</span>
                          <span className="text-xs font-bold text-white block">₹{b.price.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col gap-1.5 items-end">
                          {getStatusBadge(b.status)}
                          <span className="text-[9px] font-mono text-gold-400 capitalize bg-maroon-black/60 px-2 py-0.5 rounded border border-maroon-border">
                            Paid Status: {b.paymentStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {b.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => acceptBooking(b.id)}
                                className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all"
                                title="Approve Request"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => rejectBooking(b.id)}
                                className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                                title="Decline Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {b.status === 'accepted' && (
                            <button 
                              onClick={() => {
                                if (confirm('Mark this event service as completed? This will trigger a feedback review request to the client.')) {
                                  completeBooking(b.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-green-600/30 hover:bg-green-600 text-green-400 hover:text-white text-[11px] font-bold rounded-lg transition-all"
                            >
                              Conclude Service
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

          {/* TAB 5: EARNINGS STATEMENT */}
          {activeTab === 'earnings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-border/40 pb-4 mb-4">
                <h2 className="font-display font-bold text-xl text-white tracking-tight">Earnings & Revenue Invoices</h2>
                <p className="text-xs text-maroon-400">Review payout ledger tables, escrow funds and projected receivables.</p>
              </div>

              {/* Earnings Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-maroon-black/40 border border-maroon-border/80 rounded-2xl">
                  <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Net Settled Assets</span>
                  <h3 className="font-display font-bold text-2xl text-green-500 mt-1">₹{totalEarnings.toLocaleString()}</h3>
                  <p className="text-[10px] text-maroon-400/80 mt-2">*This reflects cleared balances released by clients from escrow accounts.</p>
                </div>
                <div className="p-5 bg-maroon-black/40 border border-maroon-border/80 rounded-2xl">
                  <span className="text-[10px] text-maroon-400 uppercase tracking-wider font-mono">Projected Receivables</span>
                  <h3 className="font-display font-bold text-2xl text-gold-400 mt-1">₹{projectedEarnings.toLocaleString()}</h3>
                  <p className="text-[10px] text-maroon-400/80 mt-2">*Pending clearance contracts currently awaiting escrow payments.</p>
                </div>
              </div>

              {/* Payout Statement list */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Payout Ledger</h3>
                {myPaidBookings.length === 0 ? (
                  <p className="text-xs text-maroon-400 font-mono">No settlements recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-maroon-border/60 text-maroon-400 font-mono uppercase text-[10px]">
                          <th className="py-3 px-2">Order Ref</th>
                          <th className="py-3 px-2">Service Component</th>
                          <th className="py-3 px-2">Client Name</th>
                          <th className="py-3 px-2">Cleared Date</th>
                          <th className="py-3 px-2 text-right">Settled Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myPaidBookings.map((b) => (
                          <tr key={b.id} className="border-b border-maroon-border/30 hover:bg-maroon-black/30">
                            <td className="py-3.5 px-2 font-mono text-white">{b.id}</td>
                            <td className="py-3.5 px-2 text-white font-semibold">{b.serviceTitle}</td>
                            <td className="py-3.5 px-2 text-maroon-300">{b.customerName}</td>
                            <td className="py-3.5 px-2 text-maroon-300">{b.paymentDetails?.date || 'N/A'}</td>
                            <td className="py-3.5 px-2 text-right font-bold text-white">₹{b.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE CONFIGS & SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              {/* Part 1: Company Profile Info */}
              <div>
                <div className="border-b border-maroon-border/40 pb-3 mb-4">
                  <h2 className="font-display font-bold text-base text-white">Edit Company Portfolio Profile</h2>
                  <p className="text-[11px] text-maroon-400">This information represents your company listing card in the public directory.</p>
                </div>

                <form onSubmit={handleCompanyProfileSubmit} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Registered Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Years of Operation (Est)</label>
                      <input 
                        type="number" 
                        required
                        value={compExp}
                        onChange={(e) => setCompExp(Number(e.target.value))}
                        className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Corporate Description Summary</label>
                    <textarea 
                      rows={3}
                      required
                      placeholder="e.g. Master florists and event planning managers specializing in custom wedding stages..."
                      value={compDesc}
                      onChange={(e) => setCompDesc(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Headquarters Address</label>
                    <input 
                      type="text" 
                      required
                      value={compAddr}
                      onChange={(e) => setCompAddr(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Save Company Portfolio
                  </button>
                </form>
              </div>

              {/* Part 2: Personal Contact Configs */}
              <div className="pt-8 border-t border-maroon-border/30">
                <div className="border-b border-maroon-border/40 pb-3 mb-4">
                  <h2 className="font-display font-bold text-base text-white">Contact Partner settings</h2>
                  <p className="text-[11px] text-maroon-400">Manage coordinator contact numbers, emails, and login profiles.</p>
                </div>

                <form onSubmit={handlePersonalProfileSubmit} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Partner Contact Name</label>
                      <input 
                        type="text" 
                        required
                        value={uName}
                        onChange={(e) => setUName(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Coordinator Mobile</label>
                      <input 
                        type="text" 
                        required
                        value={uMobile}
                        onChange={(e) => setUMobile(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Coordinator Email</label>
                    <input 
                      type="email" 
                      required
                      value={uEmail}
                      onChange={(e) => setUEmail(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-1.5">Personal Mailing Address</label>
                    <input 
                      type="text" 
                      value={uAddr}
                      onChange={(e) => setUAddr(e.target.value)}
                      className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Save Contact Details
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
