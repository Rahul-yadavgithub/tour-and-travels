import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Star, Clock, Calendar, Shield, Info, Image as ImageIcon, 
  Map, MessageCircle, Navigation, Sun, CloudRain, Snowflake, CheckCircle2, ChevronDown, ChevronUp, ArrowLeft, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Gallery drag & auto-scroll refs
  const galleryRef = useRef(null);
  const galleryAnimRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const isPaused = useRef(false);

  // Auto-scroll the gallery
  const startAutoScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;
    const step = () => {
      if (!isPaused.current && el) {
        el.scrollLeft += 0.8;
        // Loop back when reaching the end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
          el.scrollLeft = 0;
        }
      }
      galleryAnimRef.current = requestAnimationFrame(step);
    };
    galleryAnimRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (pkg?.imageUrls?.length > 1) {
      startAutoScroll();
    }
    return () => {
      if (galleryAnimRef.current) cancelAnimationFrame(galleryAnimRef.current);
    };
  }, [pkg, startAutoScroll]);

  const handleGalleryMouseDown = (e) => {
    isPaused.current = true;
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX - galleryRef.current.offsetLeft;
    dragState.current.scrollLeft = galleryRef.current.scrollLeft;
    galleryRef.current.style.cursor = 'grabbing';
  };
  const handleGalleryMouseMove = (e) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    galleryRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };
  const handleGalleryMouseUp = () => {
    dragState.current.isDragging = false;
    if (galleryRef.current) galleryRef.current.style.cursor = 'grab';
  };
  const handleGalleryMouseEnter = () => { isPaused.current = true; };
  const handleGalleryMouseLeave = () => {
    dragState.current.isDragging = false;
    isPaused.current = false;
    if (galleryRef.current) galleryRef.current.style.cursor = 'grab';
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    axios.get(`${API_BASE_URL}/api/packages/${id}`)
      .then(res => {
        setPkg(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching package details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="bg-ivory min-h-screen flex items-center justify-center text-earth font-serif text-2xl">Loading...</div>;
  }

  if (!pkg) {
    return (
      <div className="bg-ivory min-h-screen flex flex-col items-center justify-center text-earth py-20">
        <h2 className="font-serif text-3xl mb-4">Package Not Found</h2>
        <Link to="/tour-packages" className="btn-saffron rounded-full hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 transition-all">Back to Packages</Link>
      </div>
    );
  }

  const ai = pkg.aiContent;
  const isPremium = !!ai;

  // Render Legacy View if no AI Content
  if (!isPremium) {
    return (
      <div className="bg-ivory text-earth pt-20">
        <div className="px-4 md:px-8 mt-6">
          <div className="relative w-full h-[450px] md:h-[600px] rounded-[32px] overflow-hidden shadow-2xl mx-auto w-full bg-black">
            <motion.img 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 0.6 }}
              transition={{ duration: 10, ease: "easeOut" }}
              src={pkg.imageUrl || pkg.imageUrls?.[0]} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-3xl" 
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={pkg.imageUrl || pkg.imageUrls?.[0]} 
              alt={pkg.title} 
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-10" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 md:p-16">
              <div className="w-full">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="text-gold font-sans text-sm font-bold tracking-[0.2em] uppercase mb-4 block drop-shadow-md"
                >
                  {pkg.tag || 'Sacred Tour'}
                </motion.span>
                <motion.h1 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium drop-shadow-xl leading-tight mb-4 max-w-4xl"
                >
                  {pkg.title}
                </motion.h1>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <h2 className="font-serif text-3xl mb-6">Overview</h2>
            <p className="text-earth-400 mb-12 leading-relaxed">{pkg.overview}</p>
          </div>
          <div className="md:col-span-4">
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-t-4 border-saffron sticky top-32">
              <p className="text-earth-400 text-sm mb-2">Price Details</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-serif text-4xl text-earth">₹{pkg.currentPrice}</span>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/enquire-now" className="bg-gold text-white hover:bg-gold-dark text-center rounded py-3 font-bold uppercase tracking-wide transition-all shadow-sm">
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PREMIUM AI VIEW ---
  return (
    <div className="bg-ivory text-earth">
      
      {/* 1. Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] overflow-hidden shadow-2xl mx-auto bg-black group">
        
        {/* Top Bar for Back Button (Mobile Safe Area) */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-8 z-50 flex items-start justify-between pointer-events-none">
          <button 
            onClick={() => navigate(-1)} 
            className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white rounded-full p-3 backdrop-blur-md transition-all shadow-xl hover:-translate-x-1 border border-white/20 hover:border-saffron flex items-center gap-2 pr-5"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-sans text-xs font-bold uppercase tracking-widest hidden sm:inline">Back</span>
          </button>
        </div>
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={pkg.imageUrls?.[0] || 'https://images.unsplash.com/photo-1590050752117-238cb123e42b'} 
            alt={ai.heroSection?.title || pkg.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"></div>
          
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
            <motion.span 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-gold font-sans text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> {ai.aiGeneratedTags?.[0] || pkg.tag || 'Sacred Pilgrimage Route'}
            </motion.span>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="font-serif text-4xl md:text-6xl text-white font-medium drop-shadow-2xl leading-tight mb-2 max-w-5xl"
            >
              {ai.heroSection?.title || pkg.title}
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/80 text-lg md:text-2xl font-light drop-shadow-md italic mb-6"
            >
              "{ai.heroSection?.subtitle || ai.heroSection?.tagline}"
            </motion.p>
          </div>
        </div>

      {/* 2. Main Content Layout */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-8">
          
          {/* At A Glance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
              <Star className="w-6 h-6 text-saffron mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Google Rating</span>
              <span className="font-bold text-earth">{ai.ratings?.googleRating || '4.8'} / 5.0</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
              <MapPin className="w-6 h-6 text-gold mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Location</span>
              <span className="font-bold text-earth text-sm truncate w-full">{ai.location?.city || pkg.location}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
              <Clock className="w-6 h-6 text-amber-600 mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Duration</span>
              <span className="font-bold text-earth text-sm">{ai.visitInfo?.idealVisitDuration || '2-3 Hours'}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
              <Calendar className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Best Time</span>
              <span className="font-bold text-earth text-sm">{ai.visitInfo?.bestTimeToVisit || 'Year Round'}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide border-b border-zinc-200">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'history', label: 'History & Culture', icon: Map },
              { id: 'guide', label: 'Travel Guide', icon: Navigation },
              { id: 'nearby', label: 'Nearby Places', icon: MapPin },
              { id: 'faqs', label: 'FAQs', icon: MessageCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-saffron text-saffron bg-saffron/5' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-earth mb-4">About {ai.name || pkg.title}</h3>
                  <p className="text-earth/80 leading-relaxed mb-6">{ai.overview?.detailedDescription || ai.overview?.shortDescription || pkg.overview}</p>
                  
                  {ai.overview?.spiritualAtmosphere && (
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100/50 mb-6">
                      <h4 className="font-serif text-xl text-amber-900 mb-2">Spiritual Atmosphere</h4>
                      <p className="text-amber-800/80 leading-relaxed">{ai.overview.spiritualAtmosphere}</p>
                    </div>
                  )}

                  {ai.topExperiences?.length > 0 && (
                    <>
                      <h4 className="font-serif text-xl text-earth mb-4 mt-8">Top Experiences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ai.topExperiences.map((exp, idx) => (
                          <div key={idx} className="border border-zinc-100 p-4 rounded-xl flex gap-3 items-start">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-earth text-sm mb-1">{exp.title}</strong>
                              <span className="text-xs text-zinc-500">{exp.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* HISTORY TAB */}
              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-earth mb-4">Historical Background</h3>
                  <p className="text-earth/80 leading-relaxed mb-8">{ai.history?.historicalBackground || 'Historical details coming soon.'}</p>
                  
                  {ai.history?.architecture && (
                    <>
                      <h3 className="text-2xl font-serif text-earth mb-4">Architecture</h3>
                      <p className="text-earth/80 leading-relaxed mb-8">{ai.history.architecture}</p>
                    </>
                  )}
                  
                  {ai.history?.origin && (
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                      <h4 className="font-serif text-xl text-zinc-900 mb-2">Origin</h4>
                      <p className="text-zinc-600 leading-relaxed">{ai.history.origin}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* GUIDE TAB */}
              {activeTab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-serif text-earth mb-4 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-saffron" /> How to Reach
                      </h3>
                      <ul className="space-y-4">
                        {ai.travelGuide?.howToReach?.byAir && (
                          <li className="text-sm"><strong className="text-earth">By Air:</strong> <span className="text-zinc-500">{ai.travelGuide.howToReach.byAir}</span></li>
                        )}
                        {ai.travelGuide?.howToReach?.byTrain && (
                          <li className="text-sm"><strong className="text-earth">By Train:</strong> <span className="text-zinc-500">{ai.travelGuide.howToReach.byTrain}</span></li>
                        )}
                        {ai.travelGuide?.howToReach?.byRoad && (
                          <li className="text-sm"><strong className="text-earth">By Road:</strong> <span className="text-zinc-500">{ai.travelGuide.howToReach.byRoad}</span></li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-serif text-earth mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-saffron" /> Essential Info
                      </h3>
                      <ul className="space-y-4">
                        <li className="text-sm"><strong className="text-earth">Dress Code:</strong> <span className="text-zinc-500">{ai.visitInfo?.dressCode || 'Modest clothing recommended.'}</span></li>
                        <li className="text-sm"><strong className="text-earth">Timings:</strong> <span className="text-zinc-500">{ai.visitInfo?.openingHours || 'Check locally.'}</span></li>
                        <li className="text-sm"><strong className="text-earth">Photography:</strong> <span className="text-zinc-500">{ai.visitInfo?.photographyAllowed || 'Check rules upon entry.'}</span></li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif text-earth mt-8 mb-4">Weather Guide</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-orange-50 p-4 rounded-xl flex sm:flex-col items-center sm:justify-center sm:text-center text-left gap-4 sm:gap-0 border border-orange-100">
                      <div className="bg-orange-200/50 p-3 rounded-full sm:bg-transparent sm:p-0 sm:mb-2 flex-shrink-0">
                        <Sun className="w-6 h-6 sm:w-5 sm:h-5 text-orange-500" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-xs font-bold text-orange-900 block mb-1">Summer</span>
                        <span className="text-xs sm:text-[10px] text-orange-700 leading-relaxed">{ai.weatherGuide?.summer || 'Hot'}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl flex sm:flex-col items-center sm:justify-center sm:text-center text-left gap-4 sm:gap-0 border border-blue-100">
                      <div className="bg-blue-200/50 p-3 rounded-full sm:bg-transparent sm:p-0 sm:mb-2 flex-shrink-0">
                        <CloudRain className="w-6 h-6 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-xs font-bold text-blue-900 block mb-1">Monsoon</span>
                        <span className="text-xs sm:text-[10px] text-blue-700 leading-relaxed">{ai.weatherGuide?.monsoon || 'Wet'}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl flex sm:flex-col items-center sm:justify-center sm:text-center text-left gap-4 sm:gap-0 border border-slate-200">
                      <div className="bg-slate-200 p-3 rounded-full sm:bg-transparent sm:p-0 sm:mb-2 flex-shrink-0">
                        <Snowflake className="w-6 h-6 sm:w-5 sm:h-5 text-slate-500" />
                      </div>
                      <div>
                        <span className="text-sm sm:text-xs font-bold text-slate-900 block mb-1">Winter</span>
                        <span className="text-xs sm:text-[10px] text-slate-700 leading-relaxed">{ai.weatherGuide?.winter || 'Cool'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* NEARBY TAB */}
              {activeTab === 'nearby' && (
                <motion.div key="nearby" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-earth mb-6">Nearby Attractions</h3>
                  
                  {ai.location?.coordinates?.lat && (
                    <div className="bg-zinc-900 text-white p-4 rounded-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-saffron w-5 h-5 flex-shrink-0" />
                        <div>
                          <span className="block text-sm font-bold">Exact Coordinates</span>
                          <span className="text-xs text-zinc-400 font-mono break-all">{ai.location.coordinates.lat}, {ai.location.coordinates.lng}</span>
                        </div>
                      </div>
                      <a 
                        href={`https://maps.google.com/?q=${ai.location.coordinates.lat},${ai.location.coordinates.lng}`}
                        target="_blank" rel="noreferrer"
                        className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors whitespace-nowrap w-full sm:w-auto text-center"
                      >
                        Open Maps
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ai.nearbyAttractions?.length > 0 ? ai.nearbyAttractions.map((place, idx) => (
                      <div key={idx} className="border border-zinc-200 p-5 rounded-2xl hover:border-saffron transition-colors group">
                        <h4 className="font-serif text-lg text-earth mb-1 group-hover:text-saffron transition-colors">{place.name}</h4>
                        {place.distance && <span className="text-xs font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded inline-block mb-2">{place.distance} away</span>}
                        <p className="text-sm text-zinc-500 leading-relaxed">{place.description}</p>
                      </div>
                    )) : (
                      <p className="text-zinc-500 col-span-2">No nearby attractions listed.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <motion.div key="faqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-earth mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {ai.faqs?.length > 0 ? ai.faqs.map((faq, idx) => (
                      <div key={idx} className="border border-zinc-200 rounded-xl overflow-hidden">
                        <button 
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full text-left px-6 py-4 bg-zinc-50 hover:bg-zinc-100 flex justify-between items-center transition-colors"
                        >
                          <span className="font-medium text-earth">{faq.question}</span>
                          {openFaq === idx ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                        </button>
                        <AnimatePresence>
                          {openFaq === idx && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 py-4 bg-white text-zinc-600 text-sm leading-relaxed"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )) : (
                      <p className="text-zinc-500">No FAQs available.</p>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
          
          {/* Gallery Preview */}
          {pkg.imageUrls?.length > 1 && (
            <div className="mt-12 overflow-hidden w-full bg-zinc-50 rounded-[2rem] py-8 border border-zinc-100 shadow-inner">
              <h3 className="text-2xl font-serif text-earth mb-6 flex items-center gap-2 px-8">
                <ImageIcon className="w-5 h-5 text-saffron" /> Premium Gallery
              </h3>
              <div
                ref={galleryRef}
                className="w-full flex overflow-x-auto hide-scrollbar gap-5 px-6 py-2 select-none"
                style={{ cursor: 'grab', scrollBehavior: 'auto' }}
                onMouseDown={handleGalleryMouseDown}
                onMouseMove={handleGalleryMouseMove}
                onMouseUp={handleGalleryMouseUp}
                onMouseEnter={handleGalleryMouseEnter}
                onMouseLeave={handleGalleryMouseLeave}
              >
                {[...pkg.imageUrls, ...pkg.imageUrls, ...pkg.imageUrls].map((img, idx) => (
                  <div
                    key={idx}
                    className="w-64 h-48 md:w-80 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group shadow-lg border-4 border-white relative hover:shadow-2xl transition-shadow duration-300"
                    onClick={() => {
                      if (!dragState.current.isDragging) {
                        setLightboxIndex(idx % pkg.imageUrls.length);
                      }
                    }}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" draggable={false} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm text-zinc-800 text-xs font-bold px-4 py-2 rounded-full shadow-md">Click to View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox Overlay */}
          <AnimatePresence>
            {lightboxIndex !== null && pkg.imageUrls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                onClick={() => setLightboxIndex(null)}
              >
                {/* Blurred Background */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

                {/* Close Button */}
                <button
                  className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-colors border border-white/20"
                  onClick={() => setLightboxIndex(null)}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Previous Button */}
                <button
                  className="absolute left-4 md:left-8 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-colors border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev - 1 + pkg.imageUrls.length) % pkg.imageUrls.length);
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Image */}
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  src={pkg.imageUrls[lightboxIndex]}
                  alt={`Full view ${lightboxIndex + 1}`}
                  className="relative z-[1] max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />

                {/* Next Button */}
                <button
                  className="absolute right-4 md:right-8 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-colors border border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev + 1) % pkg.imageUrls.length);
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md text-white text-sm font-bold px-5 py-2 rounded-full border border-white/20">
                  {lightboxIndex + 1} / {pkg.imageUrls.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column (Sidebar Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron to-gold"></div>
              <p className="text-zinc-500 text-sm mb-1 uppercase tracking-wider font-bold">Premium Package</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-serif text-5xl text-earth">₹{pkg.currentPrice}</span>
              </div>
              
              <Link to="/enquire-now" className="w-full bg-[#fcd34d] hover:bg-[#f59e0b] text-zinc-900 hover:text-white text-center rounded-xl py-4 font-bold text-lg transition-colors duration-300 shadow-md hover:shadow-xl block mb-3">
                Book This Tour
              </Link>
              <a href="tel:+919120073105" className="w-full bg-white border-2 border-zinc-200 text-zinc-700 hover:border-[#f59e0b] hover:text-[#f59e0b] text-center rounded-xl py-4 font-bold transition-colors duration-300 block">
                Call for Details
              </a>
            </div>

            {ai.visitInfo?.vipDarshanAvailable && (
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl shadow-lg text-white">
                <h4 className="font-serif text-xl mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" /> VIP Access Available
                </h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  Fast-track entry and premium guided services are available for this destination. Contact us to upgrade your package.
                </p>
              </div>
            )}

            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
              <h4 className="font-bold text-earth mb-4">Included in Premium Routes:</h4>
              <ul className="space-y-3">
                {['Verified accurate historical data', 'Hand-picked Unsplash imagery', 'Guaranteed structured itineraries', 'Priority local support'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
