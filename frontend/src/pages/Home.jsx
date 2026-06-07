import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const formatStat = (num) => {
  if (num === undefined || num === null) return '';
  return new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num).toLowerCase();
};

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [stats, setStats] = useState({ enquiries: 0, visitors: 0, happyCustomers: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
  const galleryRef = useRef(null);
  const [isReviewsPaused, setIsReviewsPaused] = useState(false);
  const reviewsRef = useRef(null);
  const [apiReviews, setApiReviews] = useState([]);
  const [publicPhotos, setPublicPhotos] = useState([]);
  const navigate = useNavigate();

  const dragGallery = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });
  const dragReviews = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleDragStart = (e, ref, dragState) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX - ref.current.offsetLeft;
    dragState.current.scrollLeft = ref.current.scrollLeft;
  };

  const handleDragEnd = (dragState) => {
    dragState.current.isDragging = false;
  };

  const handleDragMove = (e, ref, dragState) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 2; // Scroll speed multiplier
    ref.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const reviews = [
    {
      text: "Varanasi SN Tour & Travels provided a truly exceptional experience. Their polite and friendly behavior made our family feel completely safe. They arranged VIP darshan at Kashi Vishwanath effortlessly. Highly recommended!",
      name: "Rajesh Sharma",
      from: "Mumbai"
    },
    {
      text: "The Gaya Pind Daan was perfectly organized. Varanasi SN Tour & Travels ensured all rituals were complete without any hassle. The hotels they booked were comfortable and the pricing was very reasonable.",
      name: "Suresh Kumar",
      from: "Delhi"
    },
    {
      text: "We went to Ayodhya Ram Mandir and Prayagraj Sangam. Varanasi SN Tour & Travels' knowledge of the sacred places is profound. Their dedication to 100% customer satisfaction is real.",
      name: "Anjali Gupta",
      from: "Bangalore"
    },
    {
      text: "Our trip to Kashi was magical thanks to Varanasi SN Tour & Travels. They know all the hidden gems and the best times to visit the ghats. The boat ride during Ganga Aarti was unforgettable.",
      name: "Priya Patel",
      from: "Ahmedabad"
    },
    {
      text: "Extremely professional service. From picking us up at the station to arranging local transport, everything was seamless. We didn't have to worry about a thing.",
      name: "Vikram Singh",
      from: "Jaipur"
    }
  ];

  const galleryPhotos = publicPhotos.length > 0 
    ? publicPhotos.map(p => p.imageUrl) 
    : [1, 2, 3, 4, 5].map(num => `https://res.cloudinary.com/dyoaxu1dc/image/upload/portfolio_${num}.jpg`);

  useEffect(() => {
    let intervalId;
    if (!isGalleryPaused && galleryRef.current) {
      intervalId = setInterval(() => {
        if (galleryRef.current) {
          galleryRef.current.scrollLeft += 1;
          
          if (galleryPhotos.length < 20) {
            // Seamless loop with duplicate set
            if (galleryRef.current.scrollLeft >= galleryRef.current.scrollWidth / 2) {
              galleryRef.current.scrollLeft = 0;
            }
          } else {
            // Standard loop without duplicate set (jumps at the end)
            if (galleryRef.current.scrollLeft >= (galleryRef.current.scrollWidth - galleryRef.current.clientWidth - 1)) {
              galleryRef.current.scrollLeft = 0;
            }
          }
        }
      }, 20);
    }
    return () => clearInterval(intervalId);
  }, [isGalleryPaused, galleryPhotos.length]);

  useEffect(() => {
    let intervalId;
    if (!isReviewsPaused && reviewsRef.current) {
      intervalId = setInterval(() => {
        if (reviewsRef.current) {
          reviewsRef.current.scrollLeft += 1;
          if (reviewsRef.current.scrollLeft >= reviewsRef.current.scrollWidth / 2) {
            reviewsRef.current.scrollLeft = 0;
          }
        }
      }, 20);
    }
    return () => clearInterval(intervalId);
  }, [isReviewsPaused]);

  useEffect(() => {
    // Fetch packages to make the homepage dynamic
    axios.get(`${API_BASE_URL}/api/packages`)
      .then(res => {
        setFeaturedPackages(res.data);
      })
      .catch(err => console.error("Error fetching packages:", err));

    // Fetch site stats (only increment if this is their first visit this session)
    const hasVisited = sessionStorage.getItem('hasVisited');
    const incrementQuery = hasVisited ? '' : '?increment=true';
    
    axios.get(`${API_BASE_URL}/api/stats${incrementQuery}`)
      .then(res => {
        setStats(res.data);
        if (!hasVisited) {
          sessionStorage.setItem('hasVisited', 'true');
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
      
    // Fetch approved reviews
    axios.get(`${API_BASE_URL}/api/reviews?approved=true`)
      .then(res => setApiReviews(res.data))
      .catch(err => console.error("Error fetching reviews:", err));
      
    // Fetch dynamic portfolio photos
    axios.get(`${API_BASE_URL}/api/public/portfolio`)
      .then(res => setPublicPhotos(res.data))
      .catch(err => console.error("Error fetching portfolio photos:", err));
  }, []);

  const displayReviews = [...apiReviews, ...reviews];

  return (
    <div className="bg-ivory text-charcoal">
      {/* Hero Section */}
      <style>
        {`
          @keyframes subtleFloat {
            0% { transform: scale(1) translate(0, 0); }
            100% { transform: scale(1.15) translate(-3%, 3%); }
          }
          .animate-hero-float {
            animation: subtleFloat 8s ease-in-out infinite alternate;
          }
        `}
      </style>
      <section className="relative h-auto min-h-[750px] w-full overflow-hidden flex items-center pt-24 pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="https://varanasiayodhya.com/images/varanasi-ghats-ganga-boats-evening.webp" alt="Varanasi" className="w-full h-full object-cover animate-hero-float" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-black/40 pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="mb-6 space-y-2">
              <p className="text-gold bg-white/10 px-3 py-1 rounded-full inline-block font-sans text-[11px] font-bold tracking-widest uppercase backdrop-blur-sm">Experienced & Professional Guide</p>
              <br/>
              <p className="text-white font-sans text-[11px] font-bold tracking-widest uppercase pl-1">100% Customer Satisfaction</p>
            </div>
            
            <h1 className="font-serif text-white text-4xl md:text-5xl lg:text-[4rem] font-bold leading-[1.1] mb-6 drop-shadow-md">
              VARANASI SN TOUR & TRAVELS<br />
              <span className="text-gold font-medium">GUIDE SERVICES</span>
            </h1>
            
            <p className="text-white/90 text-base md:text-xl font-medium mb-8 max-w-xl drop-shadow-md">
              KASHI | PRAYAGRAJ | GAYA | AYODHYA | VINDHYACHAL TO ALL INDIA<br />
              Travel with Joy & Happiness everywhere where is needed
            </p>
            
            <div className="flex items-baseline gap-3 mb-10">
              <span className="font-serif text-white text-3xl md:text-4xl font-bold drop-shadow-md">Reasonable Price</span>
              <span className="text-white/70 text-sm font-medium">per person</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-gold hover:brightness-110 active:scale-95 transition-all text-charcoal font-bold text-sm px-8 py-3.5 rounded-full inline-flex items-center justify-center shadow-lg">WhatsApp — Free Quote</a>
              <Link to="/tour-packages" className="bg-transparent text-white border border-white/40 hover:bg-white hover:text-charcoal font-medium text-sm px-8 py-3.5 rounded-full inline-flex items-center justify-center transition-colors">View All Packages</Link>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative bg-white p-7 md:p-8 shadow-2xl rounded-2xl border border-gray-100">
              <p className="font-sans text-xs font-bold tracking-widest text-gold uppercase mb-2">Fast Enquiry · 30 Seconds</p>
              <p className="font-serif text-3xl font-bold text-gray-900 mb-2 leading-tight">Free itinerary in <span className="text-gold">2 hours</span>.</p>
              <p className="text-gray-500 text-sm font-medium mb-6">Tell us when and how many. We handle the rest.</p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <input required className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm text-gray-900 outline-none transition-colors hover:border-blue-200 focus:border-[#006CE4] focus:ring-2 focus:ring-blue-100" placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Mobile *</label>
                    <input required type="tel" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm text-gray-900 outline-none transition-colors hover:border-blue-200 focus:border-[#006CE4] focus:ring-2 focus:ring-blue-100" placeholder="10-digit number" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email</label>
                    <input type="email" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-sans text-sm text-gray-900 outline-none transition-colors hover:border-blue-200 focus:border-[#006CE4] focus:ring-2 focus:ring-blue-100" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/enquire-now" className="bg-gold hover:brightness-110 active:scale-95 transition-all text-charcoal font-bold text-sm px-6 py-4 rounded-xl inline-flex items-center justify-center w-full text-center shadow-md">Proceed to Enquire →</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#262626] border-y border-white/10 py-6">
        <div className="w-full px-6 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚗</span>
            <span className="text-ivory/75 text-[11px] md:text-xs leading-tight"><span className="text-ivory font-medium">Local Sightseeing</span><br />Comfortable Travel</span>
          </div>
          <div className="flex items-center gap-3 md:border-l md:border-white/10 md:pl-4">
            <span className="text-2xl">🏨</span>
            <span className="text-ivory/75 text-[11px] md:text-xs leading-tight"><span className="text-ivory font-medium">Hotel Booking Assistance</span><br />Vetted Stays</span>
          </div>
          <div className="flex items-center gap-3 md:border-l md:border-white/10 md:pl-4">
            <span className="text-2xl">👑</span>
            <span className="text-ivory/75 text-[11px] md:text-xs leading-tight"><span className="text-ivory font-medium">VIP Darshan Support</span><br />Hassle-free visits</span>
          </div>
          <div className="flex items-center gap-3 md:border-l md:border-white/10 md:pl-4">
            <span className="text-2xl">👪</span>
            <span className="text-ivory/75 text-[11px] md:text-xs leading-tight"><span className="text-ivory font-medium">Family & Group Tours</span><br />Tailored Packages</span>
          </div>
        </div>
      </section>

      {/* The Four Sacred Cities */}
      <section className="bg-ivory py-20 md:py-28 relative">
        <div className="w-full px-6 md:px-10 lg:px-16 relative z-10">
          <div className="mb-12 max-w-3xl">
            <p className="font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Our Main Service Areas</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-[1.15]">Kashi. Prayagraj. Gaya.<br /><span className="italic">Ayodhya.</span></h2>
            <p className="text-charcoal-400 text-base leading-relaxed mt-6 max-w-xl">We provide safe & trusted guide services across the most revered pilgrimage destinations in North India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPackages.length > 0 ? featuredPackages.slice(0, 4).map((pkg, index) => (
              <div 
                key={pkg._id || pkg.legacyId} 
                className="bg-ivory group overflow-hidden cursor-pointer rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-earth/5" 
                onClick={() => navigate(`/package/${pkg.legacyId || pkg._id}`)}
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img src={pkg.imageUrl || (pkg.imageUrls && pkg.imageUrls[0])} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent"></div>
                  
                  {pkg.discountPercentage > 0 && (
                    <div className="absolute top-4 right-4 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                      {pkg.discountPercentage}% OFF
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 flex justify-between items-end">
                    <span className="font-serif text-ivory text-5xl font-light italic opacity-90 drop-shadow-md">
                      0{index + 1}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-earth/60">{pkg.tag || pkg.subtitle || 'Pilgrimage'}</p>
                    <div className="text-right">
                      {pkg.oldPrice && pkg.discountPercentage > 0 && (
                        <div className="flex items-center justify-end gap-1.5 mb-0.5">
                          <span className="text-xs text-red-500/70 font-semibold line-through decoration-red-500/40">
                            ₹{pkg.oldPrice}
                          </span>
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-1 py-0.5 rounded-sm">
                            {pkg.discountPercentage}% OFF
                          </span>
                        </div>
                      )}
                      <p className="font-serif text-2xl font-semibold text-earth leading-none">₹{pkg.currentPrice}</p>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 group-hover:text-gold transition-colors">{pkg.title}</h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed line-clamp-2">
                    {pkg.overview}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-8 col-span-2 text-center text-charcoal-400">Loading dynamic packages...</div>
            )}
          </div>
        </div>
      </section>


      {/* Varanasi SN Tour & Travels Work Showcase / Portfolio */}
      <section className="bg-charcoal py-20 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-charcoal to-charcoal"></div>
        <div className="w-full px-6 md:px-10 lg:px-16 relative z-10">
          <div className="text-center mb-16">
            <p className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Journey with Varanasi SN Tour & Travels</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-ivory">Glimpses of Divine Experiences</h2>
            <p className="text-ivory/60 mt-6 max-w-2xl mx-auto">Witness the spiritual journeys and memorable moments captured by our pilgrims. A visual testament to our commitment to safe and fulfilling yatras.</p>
          </div>
          
          {/* Scrolling Marquee Gallery */}
          <div className="relative mt-12 w-full overflow-hidden flex hide-scrollbar items-center py-4">
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none"></div>
            
            <div 
              className="flex w-full overflow-x-auto hide-scrollbar gap-6 md:gap-8 px-4 py-2 cursor-grab active:cursor-grabbing"
              ref={galleryRef}
              onMouseEnter={() => setIsGalleryPaused(true)}
              onMouseLeave={() => {
                setIsGalleryPaused(false);
                handleDragEnd(dragGallery);
              }}
              onMouseDown={(e) => {
                setIsGalleryPaused(true);
                handleDragStart(e, galleryRef, dragGallery);
              }}
              onMouseUp={() => handleDragEnd(dragGallery)}
              onMouseMove={(e) => handleDragMove(e, galleryRef, dragGallery)}
              onTouchStart={() => setIsGalleryPaused(true)}
              onTouchEnd={() => setIsGalleryPaused(false)}
            >
              {/* First Set of Images */}
              {galleryPhotos.map((url, idx) => (
                <div 
                  key={`img-${idx}`} 
                  className="relative group w-64 md:w-80 h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} alt="Gallery image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">+</span>
                  </div>
                </div>
              ))}
              {/* Duplicate Set of Images for seamless looping (only if less than 20 images) */}
              {galleryPhotos.length < 20 && galleryPhotos.map((url, idx) => (
                <div 
                  key={`img-dup-${idx}`} 
                  className="relative group w-64 md:w-80 h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} alt="Gallery image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-ivory py-20 md:py-28 border-t border-charcoal/10 relative">
        <div className="w-full px-6 md:px-10 lg:px-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Testimonials</p>
              <h2 className="font-serif text-3xl md:text-5xl font-light">What Our Pilgrims Say</h2>
            </div>
            <div>
              <Link to="/write-review" className="inline-block border border-gold text-gold hover:bg-gold hover:text-white transition-colors px-6 py-3 uppercase tracking-widest text-xs font-medium rounded-sm">
                Write a Review
              </Link>
            </div>
          </div>
          <div className="relative mt-8 w-full overflow-hidden flex hide-scrollbar items-stretch py-4">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-ivory to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-ivory to-transparent z-10 pointer-events-none"></div>
            
            <div 
              className="flex w-full overflow-x-auto hide-scrollbar gap-6 md:gap-8 px-4 py-4 cursor-grab active:cursor-grabbing"
              ref={reviewsRef}
              onMouseEnter={() => setIsReviewsPaused(true)}
              onMouseLeave={() => {
                setIsReviewsPaused(false);
                handleDragEnd(dragReviews);
              }}
              onMouseDown={(e) => {
                setIsReviewsPaused(true);
                handleDragStart(e, reviewsRef, dragReviews);
              }}
              onMouseUp={() => handleDragEnd(dragReviews)}
              onMouseMove={(e) => handleDragMove(e, reviewsRef, dragReviews)}
              onTouchStart={() => setIsReviewsPaused(true)}
              onTouchEnd={() => setIsReviewsPaused(false)}
            >
              {displayReviews.map((review, index) => (
                <div key={`review-${review._id || index}`} className="bg-white p-8 border border-charcoal/5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-80 md:w-96 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-gold mb-4">
                      {Array.from({ length: review.rating || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-charcoal-400 italic mb-6">"{review.text}"</p>
                  </div>
                  <div>
                    <p className="font-serif text-lg font-medium">{review.name}</p>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1">Travelled from {review.from}</p>
                  </div>
                </div>
              ))}
              {displayReviews.map((review, index) => (
                <div key={`review-dup-${review._id || index}`} className="bg-white p-8 border border-charcoal/5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-80 md:w-96 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-gold mb-4">
                      {Array.from({ length: review.rating || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-charcoal-400 italic mb-6">"{review.text}"</p>
                  </div>
                  <div>
                    <p className="font-serif text-lg font-medium">{review.name}</p>
                    <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1">Travelled from {review.from}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Varanasi SN Tour & Travels Impact / Live Stats Portfolio */}
      <section className="bg-charcoal py-16 text-ivory text-center">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <p className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Varanasi SN Tour & Travels Portfolio</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-12">Our Growing Spiritual Family</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-8 sm:pt-0">
              <p className="font-serif text-5xl md:text-6xl text-gold font-light mb-2">{stats.visitors !== undefined ? formatStat(stats.visitors) : '15.4k'}+</p>
              <p className="text-ivory/60 text-sm uppercase tracking-widest">Website Visitors</p>
            </div>
            <div className="pt-8 sm:pt-0">
              <p className="font-serif text-5xl md:text-6xl text-gold font-light mb-2">{stats.enquiries !== undefined ? formatStat(stats.enquiries) : '850'}+</p>
              <p className="text-ivory/60 text-sm uppercase tracking-widest">Enquiries Received</p>
            </div>
            <div className="pt-8 sm:pt-0">
              <p className="font-serif text-5xl md:text-6xl text-gold font-light mb-2">{stats.happyCustomers !== undefined ? formatStat(stats.happyCustomers) : '1.1k'}+</p>
              <p className="text-ivory/60 text-sm uppercase tracking-widest">Happy Travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex justify-center items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gold text-4xl font-light transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
