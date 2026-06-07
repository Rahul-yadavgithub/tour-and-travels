import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

export default function PickupRouteGuide() {
  const [pickups, setPickups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [pickupsRes, templatesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/route-management/pickups`),
          axios.get(`${API_BASE_URL}/api/route-management/templates`)
        ]);
        setPickups(pickupsRes.data.filter(p => p.isActive !== false));
        setTemplates(templatesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group pickups by city
  const pickupsByCity = pickups.reduce((acc, p) => {
    if (!acc[p.city]) acc[p.city] = [];
    acc[p.city].push(p);
    return acc;
  }, {});

  const handleSelectPickup = (pickup) => {
    setSelectedPickup(pickup);
    // On mobile, scroll to route details
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('route-preview')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const activeTemplate = templates.find(t => t.pickupPointId?._id === selectedPickup?._id);

  if (loading) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center pt-20">Loading...</div>;
  }

  return (
    <div className="bg-ivory min-h-screen pt-[72px] md:pt-[88px] text-earth">
      {/* Header */}
      <div className="bg-black text-ivory py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="w-full relative z-10 text-center">
          <span className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-2 block">Premium Travel Experience</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Pickup & Route Guide</h1>
          <p className="text-ivory/70 max-w-2xl mx-auto">Explore our available pickup locations and preview your immersive spiritual journey route before you book.</p>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="w-full px-4 md:px-8 py-12 flex flex-col md:flex-row gap-8 min-h-[600px]">
        
        {/* LEFT SIDE: Pickup Locations List */}
        <div className="w-full md:w-1/2 lg:w-5/12 pr-0 md:pr-4 overflow-y-auto max-h-[800px] custom-scrollbar">
          <h2 className="font-serif text-2xl mb-8 flex items-center gap-3">
            <span className="text-saffron">📍</span> Available Pickup Locations
          </h2>

          <div className="space-y-10">
            {Object.entries(pickupsByCity).map(([city, cityPickups]) => (
              <div key={city}>
                <h3 className="font-sans text-sm font-bold tracking-[0.1em] text-earth/50 uppercase mb-4 border-b border-earth/10 pb-2">{city}</h3>
                <div className="space-y-4">
                  {cityPickups.map(pickup => (
                    <motion.div 
                      key={pickup._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectPickup(pickup)}
                      className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                        selectedPickup?._id === pickup._id 
                          ? 'border-saffron shadow-lg shadow-saffron/20 bg-white ring-1 ring-saffron' 
                          : 'border-earth/10 shadow-sm bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-stretch h-32">
                        {/* Image */}
                        <div className="w-1/3 bg-earth/5 relative overflow-hidden">
                          {pickup.image ? (
                            <img src={pickup.image} alt={pickup.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-earth/40 text-xs">
                              <span className="text-xl mb-1">✈️</span> No Image
                            </div>
                          )}
                        </div>
                        {/* Content */}
                        <div className="w-2/3 p-4 flex flex-col justify-center">
                          <span className="text-xs font-bold text-saffron uppercase tracking-wider mb-1 flex items-center gap-1">
                            {pickup.type === 'Airport' ? '✈️' : pickup.type === 'Railway Station' ? '🚆' : '🚌'} {pickup.type}
                          </span>
                          <h4 className="font-serif text-lg font-medium leading-tight mb-2 text-earth truncate">{pickup.name}</h4>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase border border-green-200">
                              Pickup Available
                            </span>
                            <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${selectedPickup?._id === pickup._id ? 'text-saffron' : 'text-earth/40 hover:text-saffron'}`}>
                              View Route →
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Route Preview */}
        <div className="w-full md:w-1/2 lg:w-7/12" id="route-preview">
          <div className="bg-white rounded-3xl border border-earth/10 shadow-xl overflow-hidden sticky top-28">
            <AnimatePresence mode="wait">
              {!selectedPickup ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="p-16 flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                >
                  <div className="w-24 h-24 bg-saffron/10 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🗺️</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-earth">Select a Pickup Location</h3>
                  <p className="text-earth/60 max-w-sm">Choose a pickup point from the list to preview the interactive route, estimated time, and major journey stops.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedPickup._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full max-h-[800px]"
                >
                  {/* Route Header Overview */}
                  <div className="bg-gradient-to-r from-charcoal to-charcoal p-8 text-ivory">
                    <div className="flex items-center gap-3 text-gold text-sm font-bold tracking-widest uppercase mb-3">
                      <span>Route Overview</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-light mb-6">
                      {activeTemplate ? activeTemplate.name : `${selectedPickup.name} → Destination`}
                    </h3>
                    
                    {activeTemplate ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10">
                        <div>
                          <p className="text-ivory/60 text-xs uppercase tracking-wider mb-1">Total Distance</p>
                          <p className="font-bold text-lg">{activeTemplate.distance}</p>
                        </div>
                        <div>
                          <p className="text-ivory/60 text-xs uppercase tracking-wider mb-1">Travel Time</p>
                          <p className="font-bold text-lg">{activeTemplate.estimatedTime}</p>
                        </div>
                        <div>
                          <p className="text-ivory/60 text-xs uppercase tracking-wider mb-1">Pickup Point</p>
                          <p className="font-bold text-sm truncate">{activeTemplate.pickupPointId?.name}</p>
                        </div>
                        <div>
                          <p className="text-ivory/60 text-xs uppercase tracking-wider mb-1">Drop Point</p>
                          <p className="font-bold text-sm truncate">{activeTemplate.dropPointId?.name || 'End of Tour'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm text-center border border-white/10">
                        <p className="text-ivory">Route template data is currently being prepared for this location.</p>
                      </div>
                    )}
                  </div>

                  {/* Route Timeline */}
                  <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-zinc-50">
                    <h4 className="font-serif text-xl mb-8 flex items-center gap-2">
                      <span className="text-gold">❖</span> Major Journey Stops
                    </h4>

                    {activeTemplate && activeTemplate.stops && activeTemplate.stops.length > 0 ? (
                      <div className="relative pl-6">
                        {/* Connecting Line */}
                        <div className="absolute left-9 top-4 bottom-12 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent"></div>
                        
                        <div className="space-y-10">
                          {activeTemplate.stops.map((stop, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="relative flex gap-6"
                            >
                              {/* Timeline Node */}
                              <div className="relative z-10 w-6 h-6 rounded-full bg-white border-4 border-gold flex-shrink-0 mt-2 shadow-sm shadow-gold/30"></div>
                              
                              {/* Stop Content */}
                              <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-charcoal/5 hover:shadow-md transition-shadow group flex flex-col md:flex-row gap-5">
                                {stop.image && (
                                  <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={stop.image} alt={stop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                )}
                                <div>
                                  <h5 className="font-serif text-lg font-medium text-charcoal mb-2">{stop.title}</h5>
                                  {stop.description && (
                                    <p className="text-sm text-charcoal/60 leading-relaxed">{stop.description}</p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* Final Drop Point Node */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: activeTemplate.stops.length * 0.1 }}
                            className="relative flex gap-6"
                          >
                            <div className="relative z-10 w-6 h-6 rounded-full bg-charcoal flex-shrink-0 mt-2 ring-4 ring-charcoal/20 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-1 pt-1">
                              <h5 className="font-serif text-lg font-medium text-charcoal">Tour Concludes</h5>
                              <p className="text-sm text-charcoal/60 mt-1">Drop off at {activeTemplate.dropPointId?.name || 'designated location'}.</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-charcoal/20 rounded-2xl">
                        <p className="text-charcoal/50">Detailed timeline coming soon.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
