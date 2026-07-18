import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Sparkles, 
  Award, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Star, 
  Heart, 
  ChevronRight,
  Utensils,
  Camera,
  Layers,
  MapPin
} from 'lucide-react';

const BACKGROUND_FILMS = [
  {
    id: 'wedding',
    title: 'Royal Wedding',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-under-fairy-lights-42938-large.mp4'
  },
  {
    id: 'gala',
    title: 'Gala Celebration',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-glamourous-party-with-sparklers-and-dancing-34306-large.mp4'
  },
  {
    id: 'concert',
    title: 'Grand Concert',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-crowd-at-a-music-concert-under-flashing-lights-34300-large.mp4'
  },
  {
    id: 'reception',
    title: 'Luxury Dinner Setting',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-elegant-wedding-reception-table-setting-42937-large.mp4'
  }
];

interface LandingPageProps {
  setView: (view: string, extraParams?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  const { services } = useApp();
  const [activeFilmIdx, setActiveFilmIdx] = useState(0);

  // Get one featured service from each category for showcase
  const categoriesList = [
    { id: 'organiser', title: 'Event Organisers', desc: 'Complete end-to-end full scale wedding & corporate planning teams.', icon: Layers, count: services.filter(s => s.category === 'organiser').length },
    { id: 'planner', title: 'Event Planners', desc: 'Decorations, visual coordination, themes, and design schedules.', icon: Sparkles, count: services.filter(s => s.category === 'planner').length },
    { id: 'caterer', title: 'Caterers & Diners', desc: 'Master chefs offering exquisite Veg/Non-veg menus and custom counters.', icon: Utensils, count: services.filter(s => s.category === 'caterer').length },
    { id: 'cameraman', title: 'Cameramen & Film', desc: 'Professional cinematic videographers and high-res event portraits.', icon: Camera, count: services.filter(s => s.category === 'cameraman').length },
  ];

  const featuredServices = services.slice(0, 3);

  const testimonials = [
    {
      id: 1,
      name: 'Simran & Kabir',
      role: 'Wedding Clients',
      text: 'The Elite team made our wedding planning stress-free. Every single detail, from the royal flower gate to the lighting, matched our dream perfectly!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      id: 2,
      name: 'Vikram Mehta',
      role: 'MD, Google Cloud Partner Summit',
      text: 'Phenomenal logistics execution! Absolute professionalism from the catering staff, and the AV stagings were crystal clear and incredibly reliable.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
    {
      id: 3,
      name: 'Aditi Rao',
      role: 'Social Gala Organiser',
      text: 'The bohemian chic setup planned through iORGANISE left all our guests spellbound. Truly high-end and premium taste. Highly recommended for elite events.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-maroon-black overflow-x-hidden text-maroon-100 font-sans">
      
      {/* HERO BANNER SECTION WITH AMBIENT VIDEO FILM BACKGROUND */}
      <header className="relative px-4 md:px-8 border-b border-maroon-border/40 overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center">
        {/* Cinematic Backdrop Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            key={BACKGROUND_FILMS[activeFilmIdx].url}
            autoPlay
            loop
            muted={true}
            playsInline
            className="w-full h-full object-cover opacity-20 md:opacity-25 scale-[1.03] transition-all duration-1000"
          >
            <source src={BACKGROUND_FILMS[activeFilmIdx].url} type="video/mp4" />
          </video>
          {/* Deep cinematic gradient overlays to maximize legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-radial-gradient-overlay pointer-events-none" style={{
            background: 'radial-gradient(circle at center, rgba(69,10,10,0.2) 0%, rgba(10,10,10,0.98) 100%)'
          }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-full text-[#facc15] text-xs font-mono tracking-wider uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#facc15]" />
            Voted #1 Luxury Event Booking Hub
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1] max-w-4xl"
          >
            Crafting Unforgettable <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-[#facc15]">
              Celebrations & Memories
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-gray-300 max-w-2xl mt-6 leading-relaxed"
          >
            Discover and hire verified luxury event organisers, boutique decorators, culinary masters, and award-winning cinematographers. All coordinated seamlessly in one high-density, ultra-modern portal.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto"
          >
            <button 
              onClick={() => setView('services')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-[#facc15] hover:from-yellow-300 hover:to-yellow-400 text-[#450a0a] font-bold rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm"
            >
              Explore Event Services
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('register', { forceRole: 'organiser' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm"
            >
              Join as Organiser
            </button>
          </motion.div>

          {/* DYNAMIC AMBIENT BACKDROP FILM SELECTOR PILLS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl flex flex-wrap items-center justify-center gap-2 max-w-3xl"
          >
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-3 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#facc15]" />
              Ambient Film Backdrop:
            </span>

            {BACKGROUND_FILMS.map((film, index) => (
              <button
                key={film.id}
                onClick={() => setActiveFilmIdx(index)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeFilmIdx === index 
                    ? 'bg-[#450a0a] border border-[#facc15]/30 text-[#facc15] font-semibold shadow-md shadow-[#450a0a]/50'
                    : 'bg-white/5 border border-transparent hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {film.title}
              </button>
            ))}
          </motion.div>

          {/* Quick Statistics Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-12 p-6 bg-[#1a1a1a]/60 backdrop-blur-sm border border-white/5 rounded-2xl w-full"
          >
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-white">450+</p>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Events Managed</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="font-display font-bold text-2xl md:text-3xl text-white">120+</p>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Verified Pros</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="font-display font-bold text-2xl md:text-3xl text-white">99.4%</p>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Client Reviews</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="font-display font-bold text-2xl md:text-3xl text-white">₹15Cr+</p>
              <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Booked Value</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* SERVICE CATEGORIES BROWSE */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
            Comprehensive Event Ecosystem
          </h2>
          <p className="text-xs md:text-sm text-maroon-400 mt-2">
            No matter the scale of your occasion, we host specialized elites to deliver absolute perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesList.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <motion.div 
                key={cat.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setView('services', { category: cat.id })}
                className="p-6 bg-maroon-card border border-maroon-border rounded-2xl cursor-pointer hover:border-gold-500/40 group flex flex-col justify-between h-48 transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-maroon-950 border border-maroon-800 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-maroon-black transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-white mt-4 text-sm tracking-wide">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-maroon-300 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-mono text-maroon-400">
                    {cat.count} listings live
                  </span>
                  <ChevronRight className="w-4 h-4 text-maroon-400 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE US - BENTO/MODERN LAYOUT */}
      <section className="py-16 bg-maroon-dark border-y border-maroon-border/30 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Left side text intro */}
            <div>
              <span className="text-xs font-mono uppercase text-gold-500 tracking-wider">iORGANISE Security & Quality</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mt-2 leading-tight">
                Why Discerning Hosts Book Here
              </h2>
              <p className="text-xs md:text-sm text-maroon-300 mt-4 leading-relaxed">
                Hosting a wedding, milestone jubilee, or key corporate gala is high stakes. We eliminate the guesswork by ensuring strict vetting, payment protection, and live coordination.
              </p>
              
              <div className="mt-8">
                <button 
                  onClick={() => setView('services')}
                  className="px-5 py-2.5 bg-maroon-card border border-maroon-border hover:border-gold-500 text-xs font-semibold text-white rounded-xl transition-all flex items-center gap-2"
                >
                  Browse Verified Partners
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right side bento feature grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-5 bg-maroon-card border border-maroon-border/80 rounded-2xl flex gap-4">
                <div className="p-3 bg-maroon-950/80 rounded-xl text-gold-400 h-fit border border-maroon-border">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Elite Vetting Process</h4>
                  <p className="text-xs text-maroon-300 mt-1 leading-relaxed">
                    We personally verify physical registries, past events portfolios, and customer feedbacks of every company.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-maroon-card border border-maroon-border/80 rounded-2xl flex gap-4">
                <div className="p-3 bg-maroon-950/80 rounded-xl text-gold-400 h-fit border border-maroon-border">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Secure Escrow Payments</h4>
                  <p className="text-xs text-maroon-300 mt-1 leading-relaxed">
                    Your payments are held securely and released only after the vendor fulfills their milestone services.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-maroon-card border border-maroon-border/80 rounded-2xl flex gap-4">
                <div className="p-3 bg-maroon-950/80 rounded-xl text-gold-400 h-fit border border-maroon-border">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Guaranteed Availability</h4>
                  <p className="text-xs text-maroon-300 mt-1 leading-relaxed">
                    Instantly book specific dates in our calendar with contractual backup guarantees.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-maroon-card border border-maroon-border/80 rounded-2xl flex gap-4">
                <div className="p-3 bg-maroon-950/80 rounded-xl text-gold-400 h-fit border border-maroon-border">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Transparent Portfolios</h4>
                  <p className="text-xs text-maroon-300 mt-1 leading-relaxed">
                    Real high-definition gallery uploads and unedited reviews from actual authenticated customers.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT SERVICES GALLERY */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase text-gold-500 tracking-wider">Premium Curations</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mt-1">
              Featured Luxury Listings
            </h2>
          </div>
          <button 
            onClick={() => setView('services')}
            className="text-gold-400 hover:text-gold-300 text-xs font-semibold flex items-center gap-1.5 mt-4 md:mt-0"
          >
            View all services
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div 
              key={service.id}
              className="bg-maroon-card border border-maroon-border rounded-2xl overflow-hidden group hover:border-gold-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-maroon-950">
                  <img 
                    src={service.coverImage} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 referrer-policy='no-referrer'"
                  />
                  <div className="absolute top-3 left-3 bg-maroon-black/80 backdrop-blur-md text-[10px] text-gold-400 px-2.5 py-1 rounded-full border border-maroon-border font-mono capitalize">
                    {service.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                    <span className="text-xs font-semibold text-white">{service.rating}</span>
                    <span className="text-[10px] text-maroon-400 font-mono">({service.reviews.length} reviews)</span>
                  </div>

                  <h3 className="font-display font-bold text-white text-sm tracking-wide group-hover:text-gold-400 transition-colors">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-maroon-300 mt-2">
                    <MapPin className="w-3 h-3 text-maroon-400" />
                    <span>{service.location}</span>
                    <span className="text-maroon-500">•</span>
                    <span>{service.experience} yrs exp</span>
                  </div>

                  <p className="text-xs text-maroon-400 mt-3 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-maroon-border/20 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-maroon-400 font-mono">Pricing Starts</span>
                  <p className="text-xs font-semibold text-white">
                    ₹{service.price.toLocaleString()} <span className="text-[10px] text-maroon-400 font-normal">/ {service.pricingUnit}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setView('service-details', { serviceId: service.id })}
                  className="px-4 py-2 bg-maroon-900/40 hover:bg-maroon-800 text-gold-400 hover:text-white text-xs font-semibold rounded-lg transition-all"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-maroon-dark border-t border-maroon-border/30 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-gold-500 tracking-wider">Testimonials</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mt-1">
              Words From Our Premium Hosts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div 
                key={test.id} 
                className="p-6 bg-maroon-card border border-maroon-border rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-maroon-200 italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-maroon-border/30">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="w-10 h-10 rounded-full object-cover border border-maroon-border"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[10px] text-maroon-400 font-mono mt-0.5">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION (CTA) */}
      <section className="py-24 relative px-4 md:px-8 text-center border-t border-maroon-border/30">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-maroon-card to-maroon-dark border border-maroon-border rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <span className="text-xs font-mono uppercase text-gold-400 tracking-wider">Plan Your Big Day Today</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mt-3">
            Ready to Begin Custom Curations?
          </h2>
          <p className="text-xs md:text-sm text-maroon-300 max-w-xl mx-auto mt-4 leading-relaxed">
            Create an account in minutes to filter premium services, get custom quotes, book specific calendar dates, and pay with complete transaction insurance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button 
              onClick={() => setView('register', { forceRole: 'customer' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-maroon-black font-semibold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-gold-500/10 transition-all"
            >
              Sign Up as Customer
            </button>
            <button 
              onClick={() => setView('services')}
              className="w-full sm:w-auto px-8 py-3.5 bg-maroon-black/60 border border-maroon-border hover:border-maroon-700 text-white font-medium rounded-xl text-xs uppercase tracking-wider hover:bg-maroon-card/40 transition-all"
            >
              Browse Showcase First
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-maroon-black border-t border-maroon-border/60 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-maroon-700 flex items-center justify-center">
                <span className="text-gold-400 font-display font-bold text-base">iO</span>
              </div>
              <span className="font-display font-bold text-base text-white">
                i<span className="text-gold-400">ORGANISE</span>
              </span>
            </div>
            <p className="text-xs text-maroon-400 leading-relaxed">
              India's premium marketplace for luxury event services, planners, and verified decorators.
            </p>
            <p className="text-[10px] text-maroon-500 font-mono mt-4">
              © 2026 iORGANISE Ltd. All rights reserved.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 font-mono">Navigate</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-maroon-400">
              <li><button onClick={() => setView('landing')} className="hover:text-gold-400">Home</button></li>
              <li><button onClick={() => setView('services')} className="hover:text-gold-400">All Services</button></li>
              <li><button onClick={() => setView('services', { category: 'organiser' })} className="hover:text-gold-400">Organisers</button></li>
              <li><button onClick={() => setView('services', { category: 'cameraman' })} className="hover:text-gold-400">Cameramen</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 font-mono">Categories</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-maroon-400">
              <li><button onClick={() => setView('services', { category: 'planner' })} className="hover:text-gold-400">Decor & Planning</button></li>
              <li><button onClick={() => setView('services', { category: 'caterer' })} className="hover:text-gold-400">Fine Catering</button></li>
              <li><button onClick={() => setView('services', { category: 'cameraman' })} className="hover:text-gold-400">Cinematic Film</button></li>
              <li><button onClick={() => setView('services', { category: 'organiser' })} className="hover:text-gold-400">Executive Galas</button></li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 font-mono">Contact Support</h4>
            <p className="text-xs text-maroon-400 leading-relaxed">
              101, Prestige Towers, MG Road, Bangalore - 560001
            </p>
            <p className="text-xs text-gold-400 font-semibold mt-2">
              support@iorganise.in
            </p>
            <p className="text-xs text-maroon-400 mt-0.5">
              +91 99999 88888
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
