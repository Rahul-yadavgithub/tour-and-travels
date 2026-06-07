import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Remove synchronous setLoading(true)
    axios.get(`${API_BASE_URL}/api/packages/${id}`)
      .then(res => {
        setPkg(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching package details", err);
        setLoading(false);
      });

    axios.get(`${API_BASE_URL}/api/packages`)
      .then(res => setAllPackages(res.data))
      .catch(err => console.error("Error fetching packages", err));
  }, [id]);

  const sliderImages = pkg?.imageUrls?.length > 0 ? pkg.imageUrls : (pkg?.imageUrl ? [pkg.imageUrl] : []);

  // Use another useEffect to handle slider rotation only when pkg is loaded
  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length, pkg]);

  if (loading) {
    return <div className="bg-ivory min-h-screen flex items-center justify-center text-earth font-serif text-2xl">Loading...</div>;
  }

  if (!pkg) {
    return <div className="bg-ivory min-h-screen flex flex-col items-center justify-center text-earth py-20">
      <h2 className="font-serif text-3xl mb-4">Package Not Found</h2>
      <Link to="/tour-packages" className="btn-saffron rounded-full hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 transition-all">Back to Packages</Link>
    </div>;
  }

  return (
    <div className="bg-ivory text-earth pt-20">
      {/* Premium Hybrid Hero Section with Motion */}
      <div className="px-4 md:px-8 mt-6">
        <div className="relative w-full h-[450px] md:h-[600px] rounded-[32px] overflow-hidden shadow-2xl mx-auto w-full bg-black">
          
          {/* 1. Blurred background image layer (Cinematic Slow Zoom) */}
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1.25, opacity: 0.6 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={pkg.imageUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover blur-3xl" 
          />
          
          {/* 2. Dark overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* 3. Main full image layer (Subtle scale in) */}
          <motion.img 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={pkg.imageUrl} 
            alt={pkg.title} 
            className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-10" 
          />
          
          {/* Bottom Gradient for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-20 pointer-events-none"></div>

          {/* 4. Hero content layer (Fade up stagger) */}
          <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 md:p-16">
            <div className="w-full ">
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
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                className="text-white/90 text-lg md:text-xl font-light drop-shadow-md"
              >
                {pkg.duration}
              </motion.p>
            </div>
          </div>
          
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <div className="bg-white p-8 rounded-2xl border border-earth/5 shadow-md hover:shadow-lg transition-shadow mb-12">
            <h2 className="font-serif text-3xl mb-4 border-b border-earth/10 pb-4 flex items-center gap-3">
              <span className="text-saffron">🏛️</span> Official Information
            </h2>
            <p className="text-earth-400 leading-relaxed text-sm italic">
              {pkg.officialInfo}
            </p>
          </div>

          <h2 className="font-serif text-3xl mb-6">Overview</h2>
          <p className="text-earth-400 mb-12 leading-relaxed">
            {pkg.overview}
          </p>

          <h2 className="font-serif text-3xl mb-6">Specific Itinerary Highlights</h2>
          <div className="space-y-8 border-l border-saffron/30 pl-6 ml-2">
            {pkg.itinerary && pkg.itinerary.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-saffron"></div>
                <h3 className="font-serif text-xl font-medium">{step.title}</h3>
                <p className="text-earth-400 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="relative group sticky top-32">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-t-4 border-saffron">
            <p className="text-earth-400 text-sm mb-2">Price Details</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-serif text-4xl text-earth">₹{pkg.currentPrice}</span>
              {pkg.oldPrice && (
                <span className="text-xl text-earth/40 line-through">₹{pkg.oldPrice}</span>
              )}
            </div>
            
            <ul className="space-y-3 mb-8">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-earth-400">
                  <span className="text-saffron mt-0.5">✓</span> {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-row gap-3 mt-4">
              <Link to="/enquire-now" className="bg-white border border-gray-200 text-charcoal hover:bg-gold hover:text-white hover:border-gold flex-1 text-center flex items-center justify-center rounded py-2.5 text-xs font-bold uppercase tracking-wide transition-all shadow-sm">
                Enquire Now
              </Link>
              <a href="tel:+919120073105" className="bg-white border border-gray-200 text-charcoal hover:bg-gold hover:text-white hover:border-gold flex-1 text-center rounded py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-all shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Contact Now
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* End of Page Notifier */}
      <div className="mt-16 mb-12 flex flex-col items-center justify-center text-center opacity-60">
        <div className="flex items-center justify-center gap-4 w-full max-w-md">
          <div className="h-px bg-gradient-to-r from-transparent to-charcoal flex-1"></div>
          <span className="text-gold text-lg">❖</span>
          <div className="h-px bg-gradient-to-l from-transparent to-charcoal flex-1"></div>
        </div>
        <p className="font-serif text-sm text-charcoal mt-3 tracking-widest uppercase">End of Tour Details</p>
      </div>

    </div>
  );
}
