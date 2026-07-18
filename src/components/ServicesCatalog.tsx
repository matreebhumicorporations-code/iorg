import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Service, ServiceCategory } from '../types';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  SlidersHorizontal, 
  Heart, 
  ChevronRight, 
  X,
  Sparkles,
  Layers,
  Utensils,
  Camera
} from 'lucide-react';

interface ServicesCatalogProps {
  initialCategory?: ServiceCategory;
  setView: (view: string, extraParams?: any) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ initialCategory, setView }) => {
  const { services, currentUser, toggleSaveService } = useApp();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>(initialCategory || 'all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(300000);
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Derive unique locations
  const locations = useMemo(() => {
    const locs = services.map(s => s.location.split(',')[0].trim());
    return ['all', ...Array.from(new Set(locs))];
  }, [services]);

  // Days of week
  const daysOfWeek = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filter the list of services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && service.category !== selectedCategory) {
        return false;
      }

      // 2. Search query matching (title, description, providerName, location)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesProvider = service.providerName.toLowerCase().includes(query);
        const matchesLoc = service.location.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesDesc && !matchesProvider && !matchesLoc) {
          return false;
        }
      }

      // 3. Location filter
      if (selectedLocation !== 'all') {
        const servLoc = service.location.toLowerCase();
        if (!servLoc.includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // 4. Budget filter (price <= maxBudget)
      // Caterer prices are per plate, so we handle them proportionally
      if (service.category === 'caterer') {
        // Assume avg buffet crowd of 150 guests for budget filtering purposes
        if (service.price * 150 > maxBudget) return false;
      } else {
        if (service.price > maxBudget) return false;
      }

      // 5. Rating filter
      if (service.rating < minRating) {
        return false;
      }

      // 6. Experience filter
      if (service.experience < minExperience) {
        return false;
      }

      // 7. Availability day filter
      if (selectedDay !== 'all') {
        if (!service.availability.includes(selectedDay)) {
          return false;
        }
      }

      return true;
    });
  }, [services, selectedCategory, searchQuery, selectedLocation, maxBudget, minRating, minExperience, selectedDay]);

  const categoryIcons = {
    organiser: <Layers className="w-4 h-4" />,
    planner: <Sparkles className="w-4 h-4" />,
    caterer: <Utensils className="w-4 h-4" />,
    cameraman: <Camera className="w-4 h-4" />
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setMaxBudget(300000);
    setMinRating(0);
    setMinExperience(0);
    setSelectedDay('all');
  };

  return (
    <div className="min-h-screen bg-maroon-black text-maroon-100 font-sans px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white tracking-tight">
            Discover Service Providers
          </h1>
          <p className="text-xs text-maroon-400 mt-1">
            Browse and hire premium, handpicked event organizers, planners, chefs, and film crews.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin border-b border-maroon-border/40 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black border-gold-500'
                : 'bg-maroon-card border-maroon-border text-maroon-200 hover:border-maroon-700'
            }`}
          >
            All Categories
          </button>
          {(['organiser', 'planner', 'caterer', 'cameraman'] as ServiceCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black border-gold-500'
                  : 'bg-maroon-card border-maroon-border text-maroon-200 hover:border-maroon-700'
              }`}
            >
              {categoryIcons[cat]}
              <span className="capitalize">{cat === 'cameraman' ? 'Cameraman' : cat + 's'}</span>
            </button>
          ))}
        </div>

        {/* Grid Layout: Left Filters (Desktop), Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block bg-maroon-card border border-maroon-border p-6 rounded-2xl h-fit">
            <div className="flex items-center justify-between border-b border-maroon-border/60 pb-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-400" />
                Filters
              </span>
              <button 
                onClick={handleResetFilters}
                className="text-[10px] text-maroon-400 hover:text-gold-400 hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-maroon-300 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-maroon-black border border-maroon-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500/50"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-maroon-300">Max Budget</label>
                <span className="text-xs font-bold font-mono text-gold-400">₹{maxBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="300000"
                step="5000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer h-1 bg-maroon-black rounded-lg appearance-none"
              />
              <p className="text-[10px] text-maroon-400/80 mt-1">
                *Caterers calculated on average 150 guests count.
              </p>
            </div>

            {/* Ratings */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-maroon-300 mb-2">Minimum Rating</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 3, 4, 4.5, 4.8].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`py-1 rounded-lg text-[10px] font-mono border ${
                      minRating === stars
                        ? 'bg-maroon-900 border-gold-500 text-gold-400 font-bold'
                        : 'bg-maroon-black border-maroon-border/80 text-maroon-300 hover:border-maroon-700'
                    }`}
                  >
                    {stars === 0 ? 'All' : `${stars}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Experience */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-maroon-300 mb-2">Experience Level</label>
              <select
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="w-full bg-maroon-black border border-maroon-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500/50"
              >
                <option value={0}>Any Experience</option>
                <option value={3}>3+ Years</option>
                <option value={5}>5+ Years</option>
                <option value={8}>8+ Years</option>
                <option value={10}>10+ Years</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-maroon-300 mb-2">Availability Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-maroon-black border border-maroon-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500/50"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day === 'all' ? 'Any Day' : day}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* MAIN SERVICES LIST VIEW */}
          <main className="lg:col-span-3">
            
            {/* Search Bar / Mobile Filter Toggle */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-maroon-400" />
                <input
                  type="text"
                  placeholder="Search wedding halls, planners, catering packages, cameramen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-maroon-card border border-maroon-border rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-gold-500/50 placeholder-maroon-400/70"
                />
              </div>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden p-3 bg-maroon-card border border-maroon-border rounded-xl text-maroon-200 hover:text-gold-400 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Search Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-maroon-400 font-mono">
                Showing {filteredServices.length} of {services.length} services matching
              </p>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="p-16 text-center bg-maroon-card border border-maroon-border rounded-2xl">
                <p className="text-sm font-semibold text-white">No services match your criteria.</p>
                <p className="text-xs text-maroon-400 mt-2">Try relaxing your filters or searching another keyword.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 bg-maroon-900/40 border border-maroon-800 text-gold-400 text-xs font-semibold rounded-xl mt-4 hover:bg-maroon-800 hover:text-white transition-all"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => {
                  const isSaved = currentUser?.savedServices.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      className="bg-maroon-card border border-maroon-border rounded-2xl overflow-hidden group hover:border-gold-500/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image banner */}
                        <div className="relative aspect-video overflow-hidden bg-maroon-black">
                          <img
                            src={service.coverImage}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500 referrer-policy='no-referrer'"
                          />
                          <div className="absolute top-3 left-3 bg-maroon-black/80 backdrop-blur-sm text-[10px] text-gold-400 px-2.5 py-1 rounded-full border border-maroon-border font-mono capitalize">
                            {service.category}
                          </div>
                          
                          {/* Saved icon for Customer only */}
                          {currentUser && currentUser.role === 'customer' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveService(service.id);
                              }}
                              className="absolute top-3 right-3 p-2 bg-maroon-black/80 backdrop-blur-sm hover:bg-maroon-card border border-maroon-border rounded-full transition-all text-maroon-200 hover:text-red-500"
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Text details */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                            <span className="text-xs font-semibold text-white">{service.rating}</span>
                            <span className="text-[10px] text-maroon-400 font-mono">({service.reviews.length} reviews)</span>
                          </div>

                          <h3 
                            onClick={() => setView('service-details', { serviceId: service.id })}
                            className="font-display font-bold text-white text-sm tracking-wide hover:text-gold-400 cursor-pointer transition-colors"
                          >
                            {service.title}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-maroon-300 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-maroon-400" />
                            <span>{service.location}</span>
                            <span className="text-maroon-500">•</span>
                            <Clock className="w-3.5 h-3.5 text-maroon-400" />
                            <span>{service.experience} yrs exp</span>
                          </div>

                          <p className="text-xs text-maroon-400 mt-3 line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer price / action */}
                      <div className="p-5 pt-0 border-t border-maroon-border/25 mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-maroon-400 font-mono">Starting cost</span>
                          <p className="text-xs font-semibold text-white">
                            ₹{service.price.toLocaleString()}{' '}
                            <span className="text-[10px] text-maroon-400 font-normal">/ {service.pricingUnit}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => setView('service-details', { serviceId: service.id })}
                          className="px-4 py-2 bg-maroon-900/40 hover:bg-maroon-800 border border-maroon-800 text-gold-400 hover:text-white text-xs font-semibold rounded-lg transition-all"
                        >
                          Details & Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FULL SCREEN FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-maroon-black/90 backdrop-blur-md z-50 p-6 overflow-y-auto animate-fade-in">
          <div className="flex items-center justify-between border-b border-maroon-border pb-3 mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-white">Refine Search</span>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-1 text-maroon-300 hover:text-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-maroon-300 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-maroon-card border border-maroon-border rounded-xl px-3 py-3 text-xs text-white"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'all' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-maroon-300">Max Budget</label>
              <span className="text-xs font-bold font-mono text-gold-400">₹{maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="300000"
              step="5000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-maroon-card rounded-lg appearance-none"
            />
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-maroon-300 mb-2">Minimum Rating</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 3, 4, 4.5, 4.8].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`py-2 rounded-xl text-xs font-mono border ${
                    minRating === stars
                      ? 'bg-maroon-900 border-gold-500 text-gold-400 font-bold'
                      : 'bg-maroon-card border-maroon-border/80 text-maroon-300'
                  }`}
                >
                  {stars === 0 ? 'All' : `${stars}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-maroon-300 mb-2">Experience Level</label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full bg-maroon-card border border-maroon-border rounded-xl px-3 py-3 text-xs text-white"
            >
              <option value={0}>Any Experience</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
              <option value={8}>8+ Years</option>
              <option value={10}>10+ Years</option>
            </select>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-maroon-300 mb-2">Availability Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-maroon-card border border-maroon-border rounded-xl px-3 py-3 text-xs text-white"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day === 'all' ? 'Any Day' : day}
                </option>
              ))}
            </select>
          </div>

          {/* Done Button */}
          <button
            onClick={() => setShowMobileFilters(false)}
            className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Apply Filters & Close
          </button>
        </div>
      )}

    </div>
  );
};
