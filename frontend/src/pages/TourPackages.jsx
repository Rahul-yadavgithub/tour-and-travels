import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function TourPackages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch packages from the backend
    axios.get(`${API_BASE_URL}/api/packages`)
      .then(res => setPackages(res.data))
      .catch(err => console.error("Error fetching packages", err));
  }, []);

  return (
    <div className="bg-ivory text-earth pt-[72px] md:pt-[88px] relative min-h-screen">
      {/* Header */}
      <div className="bg-black text-ivory py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="w-full relative z-10 text-center">
          <span className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-2 block">Explore Our Routes</span>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Tour Packages</h1>
          <p className="text-ivory/70 max-w-2xl mx-auto">Find the perfect carefully-crafted pilgrimage package that suits your schedule and preferences.</p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => (
            <div 
              key={pkg._id || pkg.legacyId} 
              onClick={() => navigate(`/package/${pkg._id || pkg.legacyId}`)}
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
                <div className="mb-4">
                  <p className="font-sans text-[10px] font-bold tracking-[0.1em] uppercase text-earth/70">{pkg.duration}</p>
                </div>
                
                <hr className="border-0 border-t border-earth/10 mb-4 mt-auto" />

                <div className="flex items-end justify-between w-full gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-earth/50 uppercase tracking-widest font-bold mb-1">Starting from</p>
                    
                    {pkg.oldPrice && pkg.discountPercentage > 0 && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs text-earth/50 font-semibold line-through decoration-earth/30">
                          ₹{pkg.oldPrice}
                        </span>
                        <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-1 py-0.5 rounded-sm shadow-sm flex items-center gap-0.5 whitespace-nowrap">
                          {pkg.discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-semibold text-earth drop-shadow-sm truncate">
                        ₹{pkg.currentPrice}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 w-[42%] max-w-[110px]">
                    <Link
                      to="/enquire-now"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-center overflow-hidden rounded-md bg-white border border-earth/20 px-2 py-1.5 font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white"
                    >
                      Visit Now
                    </Link>
                    <button 
                      className="group/btn w-full relative flex items-center justify-center gap-1 overflow-hidden rounded-md bg-gold px-2 py-1.5 font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-charcoal transition-all hover:bg-black hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/package/${pkg._id || pkg.legacyId}`);
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
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
