import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function TourPackages() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    // Fetch packages from the backend
    axios.get(`${API_BASE_URL}/api/packages`)
      .then(res => setPackages(res.data))
      .catch(err => console.error("Error fetching packages", err));
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPackage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPackage]);

  return (
    <div className="bg-ivory text-earth pt-32 pb-20 relative min-h-screen">
      <div className="max-w-[1536px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="mb-12">
          <p className="font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Explore Our Routes</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15]">Tour Packages</h1>
          <p className="text-earth-400 text-lg mt-4 max-w-2xl">Find the perfect carefully-crafted pilgrimage package that suits your schedule and preferences.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => (
            <div 
              key={pkg._id || pkg.legacyId} 
              onClick={() => setSelectedPackage(pkg)}
              className="bg-white rounded-2xl shadow-sm border border-earth/5 flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* TOP SECTION: Media & Badges */}
              <div className="relative h-48 overflow-hidden block">
                <img 
                  src={pkg.imageUrl || (pkg.imageUrls && pkg.imageUrls[0])} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1.5 inline-block">
                      {pkg.location || 'Varanasi'}
                    </span>
                    <h3 className="font-serif text-lg text-white font-medium leading-tight drop-shadow-md">{pkg.title}</h3>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: Content & Pricing */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-earth/70">{pkg.duration}</p>
                  <p className="font-sans text-[10px] font-bold tracking-widest text-gold truncate ml-2">{pkg.tag || pkg.subtitle}</p>
                </div>
                
                <hr className="border-0 border-t border-earth/10 mb-4 mt-auto" />

                <div className="flex items-end justify-between w-full">
                  <div className="flex-1">
                    <p className="text-[9px] text-earth/50 uppercase tracking-widest font-bold mb-1">Starting from</p>
                    
                    {pkg.oldPrice && pkg.discountPercentage > 0 && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs text-red-500/70 font-semibold line-through decoration-red-500/40">
                          ₹{pkg.oldPrice}
                        </span>
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-1 py-0.5 rounded-sm shadow-sm flex items-center gap-0.5">
                          {pkg.discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-semibold text-earth drop-shadow-sm">
                        ₹{pkg.currentPrice}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="group/btn relative flex items-center justify-center gap-1 overflow-hidden rounded-md bg-black px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-saffron"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackage(pkg);
                    }}
                  >
                    <span className="relative z-10">Details</span>
                    <svg className="relative z-10 h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedPackage(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-ivory w-[95vw] h-[95vh] max-w-[1600px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-[2rem] shadow-2xl flex flex-col z-10 animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPackage(null)}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-black/60 hover:bg-saffron text-white rounded-full p-2.5 backdrop-blur-md transition-all shadow-xl hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Hero */}
            <div className="relative bg-black h-[40vh] md:h-[50vh] min-h-[300px] overflow-hidden flex-shrink-0 rounded-t-[2rem]">
              <img src={selectedPackage.imageUrl || (selectedPackage.imageUrls && selectedPackage.imageUrls[0])} alt={selectedPackage.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-[1536px] mx-auto right-0">
                <span className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-3 block drop-shadow-md">{selectedPackage.tag}</span>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ivory font-light leading-[1.1] drop-shadow-lg">{selectedPackage.title}</h1>
                <p className="text-ivory/80 mt-4 text-lg md:text-xl font-light">{selectedPackage.duration}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-12 gap-12 max-w-[1400px] mx-auto w-full">
              <div className="md:col-span-8 space-y-12">
                {selectedPackage.officialInfo && (
                  <div className="bg-white p-6 rounded-xl border border-earth/5 shadow-sm">
                    <h2 className="font-serif text-2xl mb-3 border-b border-earth/10 pb-3 flex items-center gap-3">
                      <span className="text-saffron">🏛️</span> Official Information
                    </h2>
                    <p className="text-earth-400 leading-relaxed text-sm italic">
                      {selectedPackage.officialInfo}
                    </p>
                  </div>
                )}

                <div>
                  <h2 className="font-serif text-3xl mb-5">Overview</h2>
                  <p className="text-earth-400 leading-relaxed text-sm md:text-base">
                    {selectedPackage.overview}
                  </p>
                </div>

                {selectedPackage.itinerary && selectedPackage.itinerary.length > 0 && (
                  <div>
                    <h2 className="font-serif text-3xl mb-6">Itinerary Highlights</h2>
                    <div className="space-y-6 border-l border-saffron/30 pl-6 ml-2">
                      {selectedPackage.itinerary.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-saffron border-4 border-ivory"></div>
                          <h3 className="font-serif text-lg font-medium">{step.title}</h3>
                          <p className="text-earth-400 mt-1 text-sm">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Animated Image Gallery */}
                {selectedPackage.imageUrls && selectedPackage.imageUrls.length > 0 && (
                  <div className="pt-6">
                    <h2 className="font-serif text-3xl mb-6 flex items-center gap-3">
                      <span className="text-saffron">📸</span> Location Gallery
                    </h2>
                    <div className="w-full overflow-hidden bg-charcoal/5 rounded-[2rem] py-8 flex">
                      <div className="animate-marquee flex gap-6 px-6">
                        {/* Duplicate the array to create a seamless infinite scrolling effect */}
                        {[...selectedPackage.imageUrls, ...selectedPackage.imageUrls].map((url, idx) => (
                          <div key={idx} className="w-72 h-48 md:w-80 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-white group relative">
                            <img src={url} alt={`Gallery Image ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Pricing in Modal */}
              <div className="md:col-span-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-saffron sticky top-8">
                  <p className="text-earth-400 text-sm mb-2">Price Details</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-serif text-3xl text-earth">₹{selectedPackage.currentPrice}</span>
                    {selectedPackage.oldPrice && (
                      <span className="text-lg text-earth/40 line-through">₹{selectedPackage.oldPrice}</span>
                    )}
                  </div>
                  
                  {selectedPackage.features && selectedPackage.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {selectedPackage.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-earth-400">
                          <span className="text-saffron mt-0.5 font-bold">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="space-y-3">
                    <Link to="/enquire-now" onClick={() => { document.body.style.overflow = 'unset'; }} className="bg-charcoal hover:bg-gold text-white text-center flex items-center justify-center rounded-lg py-3 text-xs font-bold uppercase tracking-wide transition-all shadow-md w-full">
                      Enquire Now
                    </Link>
                    <a href="tel:+919120073105" className="bg-white border border-gray-200 text-charcoal hover:bg-gold hover:text-white hover:border-gold text-center rounded-lg py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-all shadow-sm w-full">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Contact Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
