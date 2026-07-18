import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service, PaymentMethod } from '../types';
import { 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  User, 
  CheckCircle, 
  Award, 
  Heart,
  Briefcase,
  Layers,
  Sparkles,
  Utensils,
  Camera,
  AlertCircle
} from 'lucide-react';

interface ServiceDetailsProps {
  serviceId: string;
  setView: (view: string, extraParams?: any) => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceId, setView }) => {
  const { services, currentUser, toggleSaveService, createBooking, payBooking } = useApp();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [guestCount, setGuestCount] = useState(150); // Default for caterer
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'portfolio' | 'reviews'>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [cardNo, setCardNo] = useState('');
  const [upiId, setUpiId] = useState('');

  // Find the service
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="p-16 text-center bg-maroon-black text-white">
        <p>Service profile not found.</p>
        <button 
          onClick={() => setView('services')}
          className="px-4 py-2 bg-maroon-700 rounded-lg text-xs font-semibold mt-4"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const isSaved = currentUser?.savedServices.includes(service.id);

  // Check if selected date falls on a day the provider is available
  const getDayName = (dateStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  const isDayAvailable = selectedDate ? service.availability.includes(getDayName(selectedDate)) : true;

  // Calculate total price
  const totalPrice = service.category === 'caterer' 
    ? service.price * guestCount
    : service.price;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setView('login', { redirectTo: 'service-details', redirectServiceId: serviceId });
      return;
    }
    if (currentUser.role !== 'customer') {
      alert('You are logged in as an Organizer. Only customers can book services!');
      return;
    }
    if (!selectedDate) return;

    try {
      const newBooking = createBooking(service, selectedDate, service.category === 'caterer' ? guestCount : undefined);
      setBookingSuccess(newBooking);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSuccess) return;
    payBooking(bookingSuccess.id, paymentMethod);
    setView('customer-dashboard');
  };

  const categoryIcons = {
    organiser: <Layers className="w-5 h-5" />,
    planner: <Sparkles className="w-5 h-5" />,
    caterer: <Utensils className="w-5 h-5" />,
    cameraman: <Camera className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-maroon-black text-maroon-100 font-sans px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <button 
          onClick={() => setView('services')}
          className="flex items-center gap-1.5 text-xs font-semibold text-maroon-300 hover:text-gold-400 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </button>

        {/* TOP SPLIT: Cover Image & Service Core Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Main Info Card & Image */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-maroon-card border border-maroon-border shadow-2xl">
              <img 
                src={service.coverImage} 
                alt={service.title} 
                className="w-full h-full object-cover referrer-policy='no-referrer'"
              />
              <div className="absolute top-4 left-4 bg-maroon-black/95 backdrop-blur-md text-xs text-gold-400 px-3.5 py-1.5 rounded-full border border-maroon-border font-mono capitalize flex items-center gap-1.5">
                {categoryIcons[service.category]}
                {service.category === 'cameraman' ? 'Cameraman' : service.category + ' Service'}
              </div>

              {currentUser && currentUser.role === 'customer' && (
                <button 
                  onClick={() => toggleSaveService(service.id)}
                  className="absolute top-4 right-4 p-3 bg-maroon-black/95 backdrop-blur-md hover:bg-maroon-card border border-maroon-border rounded-full transition-all text-maroon-200 hover:text-red-500"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              )}
            </div>

            {/* Title Block */}
            <div className="bg-maroon-card border border-maroon-border p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <img 
                  src={service.providerAvatar || 'https://api.dicebear.com/7.x/initials/svg?seed=Event'} 
                  alt={service.providerName}
                  className="w-12 h-12 rounded-full object-cover border border-gold-500/20 referrer-policy='no-referrer'"
                />
                <div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">{service.title}</h1>
                  <p className="text-xs text-gold-400 font-mono mt-0.5">By {service.providerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-maroon-border/30">
                <div>
                  <p className="text-[10px] text-maroon-400 font-mono">Location</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white mt-1">
                    <MapPin className="w-3.5 h-3.5 text-maroon-400" />
                    <span>{service.location}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-maroon-400 font-mono">Experience</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white mt-1">
                    <Award className="w-3.5 h-3.5 text-maroon-400" />
                    <span>{service.experience} Years Active</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-maroon-400 font-mono">Average Rating</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white mt-1">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                    <span>{service.rating} ({service.reviews.length} Reviews)</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-maroon-400 font-mono">Pricing Mode</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-white mt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-400" />
                    <span className="capitalize">{service.pricingUnit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Tabs for Info, Portfolio, Reviews */}
            <div className="border-b border-maroon-border/40 flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('info')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'info' 
                    ? 'border-gold-500 text-gold-400' 
                    : 'border-transparent text-maroon-300 hover:text-white'
                }`}
              >
                Information
              </button>
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'portfolio' 
                    ? 'border-gold-500 text-gold-400' 
                    : 'border-transparent text-maroon-300 hover:text-white'
                }`}
              >
                Portfolio Gallery ({service.portfolio.length})
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'reviews' 
                    ? 'border-gold-500 text-gold-400' 
                    : 'border-transparent text-maroon-300 hover:text-white'
                }`}
              >
                Client Reviews ({service.reviews.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="bg-maroon-card border border-maroon-border p-6 rounded-2xl">
              
              {/* TAB 1: INFORMATION */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Service Description</h3>
                    <p className="text-xs md:text-sm text-maroon-300 leading-relaxed">{service.description}</p>
                  </div>

                  {/* Specifications (Conditional based on category) */}
                  {service.specs && (
                    <div className="pt-4 border-t border-maroon-border/30">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">Service Specifics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Planners */}
                        {service.specs.decorOptions && (
                          <div className="p-4 bg-maroon-black/40 border border-maroon-border/60 rounded-xl">
                            <p className="text-[10px] text-maroon-400 font-mono uppercase">Decor Themes Available</p>
                            <ul className="list-disc list-inside text-xs text-maroon-200 mt-2 space-y-1">
                              {service.specs.decorOptions.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Caterers */}
                        {service.specs.menuCategories && (
                          <div className="p-4 bg-maroon-black/40 border border-maroon-border/60 rounded-xl">
                            <p className="text-[10px] text-maroon-400 font-mono uppercase">Menu Specializations</p>
                            <ul className="list-disc list-inside text-xs text-maroon-200 mt-2 space-y-1">
                              {service.specs.menuCategories.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Cameramen */}
                        {service.specs.cameraEquipment && (
                          <div className="p-4 bg-maroon-black/40 border border-maroon-border/60 rounded-xl">
                            <p className="text-[10px] text-maroon-400 font-mono uppercase">Camera Rigs & Gear</p>
                            <ul className="list-disc list-inside text-xs text-maroon-200 mt-2 space-y-1">
                              {service.specs.cameraEquipment.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Packages included */}
                        {service.specs.packagesIncluded && (
                          <div className="p-4 bg-maroon-black/40 border border-maroon-border/60 rounded-xl">
                            <p className="text-[10px] text-maroon-400 font-mono uppercase">What's Included</p>
                            <ul className="list-disc list-inside text-xs text-maroon-200 mt-2 space-y-1">
                              {service.specs.packagesIncluded.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Capacity limits */}
                        {service.specs.capacityLimit && (
                          <div className="p-4 bg-maroon-black/40 border border-maroon-border/60 rounded-xl sm:col-span-2">
                            <p className="text-[10px] text-maroon-400 font-mono uppercase">Guest Serving Capacity</p>
                            <p className="text-xs text-white mt-1 font-semibold">
                              Up to {service.specs.capacityLimit.toLocaleString()} guests simultaneously
                            </p>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  )}

                  {/* Active Days list */}
                  <div className="pt-4 border-t border-maroon-border/30">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Available Operational Days</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const isAvailable = service.availability.includes(day);
                        return (
                          <span 
                            key={day}
                            className={`px-3 py-1 rounded-lg text-[10px] font-mono border ${
                              isAvailable 
                                ? 'bg-maroon-950/40 border-gold-500/30 text-gold-400' 
                                : 'bg-maroon-black border-transparent text-maroon-500 opacity-40 line-through'
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PORTFOLIO */}
              {activeTab === 'portfolio' && (
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">Past Work Showcase</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.portfolio.map((img, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-maroon-border bg-maroon-black">
                        <img 
                          src={img} 
                          alt={`portfolio-${i}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 referrer-policy='no-referrer'"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-maroon-border/30 pb-4 mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Reviews & Ratings</h3>
                    <div className="flex items-center gap-1.5 bg-maroon-black px-3 py-1.5 rounded-lg border border-maroon-border">
                      <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      <span className="text-xs font-bold text-white">{service.rating} / 5.0</span>
                    </div>
                  </div>

                  {service.reviews.length === 0 ? (
                    <div className="p-8 text-center text-xs text-maroon-400 font-mono">
                      No customer reviews yet. Be the first to hire and review!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {service.reviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-maroon-black/40 border border-maroon-border/60 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-maroon-800 flex items-center justify-center font-bold text-xs text-white uppercase">
                                {rev.reviewerName[0]}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{rev.reviewerName}</h4>
                                <span className="text-[9px] text-maroon-400 font-mono">{rev.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < rev.rating ? 'text-gold-400 fill-gold-400' : 'text-maroon-600'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-maroon-200 leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDEBAR: BOOKING ENGINE CARD */}
          <div className="space-y-6">
            <div className="bg-maroon-card border border-maroon-border p-6 rounded-2xl shadow-xl sticky top-24">
              
              <div className="border-b border-maroon-border/50 pb-4 mb-4">
                <p className="text-[10px] text-maroon-400 font-mono uppercase">Unit Service Price</p>
                <p className="text-2xl font-display font-bold text-white mt-1">
                  ₹{service.price.toLocaleString()}
                  <span className="text-xs font-sans text-maroon-300 font-normal"> / {service.pricingUnit}</span>
                </p>
              </div>

              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Date selection */}
                  <div>
                    <label className="block text-xs font-semibold text-maroon-300 mb-2">
                      Choose Event Date
                    </label>
                    <div className="relative">
                      <input 
                        type="date"
                        required
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
                      />
                    </div>

                    {selectedDate && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                        {isDayAvailable ? (
                          <p className="text-green-500 flex items-center gap-1 font-mono">
                            <CheckCircle className="w-3.5 h-3.5" /> Available on {getDayName(selectedDate)}
                          </p>
                        ) : (
                          <p className="text-gold-400 flex items-center gap-1 font-mono">
                            <AlertCircle className="w-3.5 h-3.5" /> Outside typical schedule ({getDayName(selectedDate)})
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Guest count (Conditional for Caterers) */}
                  {service.category === 'caterer' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-maroon-300">
                          Total Guests count
                        </label>
                        <span className="text-xs font-mono font-bold text-gold-400">{guestCount} plates</span>
                      </div>
                      <input 
                        type="number"
                        min="50"
                        max="2000"
                        step="10"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Math.max(50, Number(e.target.value)))}
                        className="w-full bg-maroon-black border border-maroon-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                      <p className="text-[10px] text-maroon-400/80 mt-1">
                        *Minimum order count is 50 guests.
                      </p>
                    </div>
                  )}

                  {/* Calculations breakdown */}
                  {selectedDate && (
                    <div className="p-3 bg-maroon-black/50 border border-maroon-border/80 rounded-xl space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between text-maroon-300">
                        <span>Base Cost:</span>
                        <span>₹{service.price.toLocaleString()}</span>
                      </div>
                      {service.category === 'caterer' && (
                        <div className="flex items-center justify-between text-maroon-300">
                          <span>Plates ({guestCount}):</span>
                          <span>x {guestCount}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-maroon-border/30 pt-1.5 font-bold text-white">
                        <span>Total Price:</span>
                        <span className="text-gold-400">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  {currentUser ? (
                    <button 
                      type="submit"
                      disabled={!selectedDate}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-maroon-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      Instant Book
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        type="button"
                        onClick={() => setView('login', { redirectTo: 'service-details', redirectServiceId: serviceId })}
                        className="w-full py-3 rounded-xl bg-maroon-900/50 border border-maroon-800 text-gold-400 hover:text-white font-semibold text-xs uppercase tracking-wider transition-all"
                      >
                        Login to Book Service
                      </button>
                      <p className="text-[9px] text-center text-maroon-400 leading-normal">
                        Create a premium hosting account to manage secure escrows.
                      </p>
                    </div>
                  )}

                </form>
              ) : (
                /* Successful booking / Proceed to Payment State */
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto">
                    <CheckCircle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">Booking Request Sent</h3>
                    <p className="text-[11px] text-maroon-300 mt-1">
                      Your booking request is registered in pending state under code:
                    </p>
                    <p className="text-xs font-mono font-semibold text-gold-400 bg-maroon-black px-3 py-1 rounded-lg mt-2 inline-block">
                      {bookingSuccess.id}
                    </p>
                  </div>

                  <div className="p-3 bg-maroon-black border border-maroon-border/80 rounded-xl text-left text-[11px] space-y-1 mt-4">
                    <p className="text-white font-semibold">Summary:</p>
                    <p className="text-maroon-300">Service: {service.title}</p>
                    <p className="text-maroon-300">Date: {bookingSuccess.date}</p>
                    <p className="text-maroon-300">Final Cost: <span className="text-white font-semibold">₹{bookingSuccess.price.toLocaleString()}</span></p>
                  </div>

                  {!showPaymentFlow ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => setShowPaymentFlow(true)}
                        className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        Secure Pay Now
                      </button>
                      <button 
                        onClick={() => setView('customer-dashboard')}
                        className="w-full py-2.5 bg-maroon-black border border-maroon-border text-maroon-300 hover:text-white text-xs font-semibold rounded-xl transition-all"
                      >
                        Pay Later in Dashboard
                      </button>
                    </div>
                  ) : (
                    /* Visual Payment Flow Options */
                    <form onSubmit={handleProcessPayment} className="space-y-4 text-left border-t border-maroon-border/30 pt-4 mt-4 animate-fade-in">
                      <label className="block text-xs font-semibold text-white">Choose Payment Method</label>
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

                      {paymentMethod === 'netbanking' && (
                        <div>
                          <label className="block text-[10px] font-semibold text-maroon-300 mb-1">Select Bank</label>
                          <select className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-1.5 text-xs text-white">
                            <option>HDFC Bank</option>
                            <option>SBI Bank</option>
                            <option>ICICI Bank</option>
                            <option>Axis Bank</option>
                          </select>
                        </div>
                      )}

                      {paymentMethod === 'wallet' && (
                        <div>
                          <label className="block text-[10px] font-semibold text-maroon-300 mb-1">Select Wallet Provider</label>
                          <select className="w-full bg-maroon-black border border-maroon-border rounded-lg px-3 py-1.5 text-xs text-white">
                            <option>Paytm Wallet</option>
                            <option>Amazon Pay</option>
                            <option>PhonePe Wallet</option>
                          </select>
                        </div>
                      )}

                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        Authorize & Pay ₹{totalPrice.toLocaleString()}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
