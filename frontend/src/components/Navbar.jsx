import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isHome = location.pathname === '/';
  const isLightText = isHome;
  const isServicesActive = location.pathname === '/car-rentals' || location.pathname === '/hotels';

  const headerBgClass = isHome 
    ? (scrolled ? 'bg-charcoal shadow-xl' : 'bg-transparent')
    : 'bg-white shadow-sm border-b border-gray-100';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBgClass}`}>
      <nav className="w-full px-4 sm:px-6 md:px-10 lg:px-16 flex items-center justify-between py-3 md:py-4 gap-4">
        
        {/* Mobile Hamburger Icon (Left) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className={`p-2 -ml-2 rounded-lg transition-colors ${isLightText ? 'text-white hover:bg-white/10' : 'text-charcoal hover:bg-gray-100'}`}
            aria-label="Open mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Small Logo (Center) */}
        <Link className="md:hidden flex-1 text-center font-serif text-xl font-bold truncate px-2" to="/">
           <span className={isLightText ? 'text-ivory' : 'text-charcoal'}>SN Tours</span>
        </Link>

        {/* Invisible spacer to keep mobile logo centered */}
        <div className="md:hidden w-10"></div>

        {/* Desktop Logo */}
        <Link className="hidden md:inline-flex leading-none flex-col items-center" to="/">
          <span className={`font-serif font-light text-[26px] leading-none whitespace-nowrap ${isLightText ? 'text-ivory' : 'text-charcoal'}`} style={{ letterSpacing: '-0.005em' }}>
            Varanasi SN <span className="text-gold">Tour & Travels</span>
          </span>
          <span className="block h-[2px] bg-gold w-20 mt-2"></span>
          <span className={`text-[9px] font-medium tracking-[0.28em] mt-1.5 uppercase text-center ${isLightText ? 'text-ivory/40' : 'text-charcoal/40'}`}>Tourist Services</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 flex-shrink-0">
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/">Home</Link>
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/tour-packages' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/tour-packages">Tour Packages</Link>
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/pickup-route-guide' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/pickup-route-guide">Pickup & Route Guide</Link>
          
          <div className="relative group py-2">
            <button className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap flex items-center gap-1 ${isServicesActive ? 'text-gold' : (isLightText ? 'text-white/80 group-hover:text-white' : 'text-charcoal/70 group-hover:text-charcoal')}`}>
              Services
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
              <div className="pt-4">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden flex flex-col">
                  <Link className={`px-4 py-3 font-sans text-xs font-semibold tracking-[0.1em] uppercase hover:bg-gray-50 transition-colors ${location.pathname === '/car-rentals' ? 'text-gold bg-gold/5' : 'text-charcoal'}`} to="/car-rentals">Car Rentals</Link>
                  <Link className={`px-4 py-3 font-sans text-xs font-semibold tracking-[0.1em] uppercase hover:bg-gray-50 transition-colors ${location.pathname === '/hotels' ? 'text-gold bg-gold/5' : 'text-charcoal'}`} to="/hotels">Hotels</Link>
                </div>
              </div>
            </div>
          </div>

          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/enquire-now' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/enquire-now">Enquire</Link>
          <Link className="bg-gold text-charcoal font-bold text-sm px-6 py-2.5 rounded-full inline-flex items-center justify-center transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-lg ml-2" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer (Left Sliding) */}
      <div className={`md:hidden fixed top-0 left-0 h-screen w-[75vw] max-w-sm bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Drawer Header with Title */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col">
            <span className="font-serif font-medium text-xl text-charcoal leading-tight">Varanasi SN</span>
            <span className="font-serif font-medium text-xl text-gold leading-tight">Tour & Travels</span>
            <span className="text-[9px] font-bold tracking-[0.2em] mt-1.5 uppercase text-charcoal/50">Tourist Services</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-gray-400 hover:text-charcoal p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg ml-2"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide transition-colors ${location.pathname === '/' ? 'bg-gold/10 text-gold' : 'text-charcoal hover:bg-gray-50'}`} to="/">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Home
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide transition-colors ${location.pathname === '/tour-packages' ? 'bg-gold/10 text-gold' : 'text-charcoal hover:bg-gray-50'}`} to="/tour-packages">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Packages
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide transition-colors ${location.pathname === '/pickup-route-guide' ? 'bg-gold/10 text-gold' : 'text-charcoal hover:bg-gray-50'}`} to="/pickup-route-guide">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            Routes
          </Link>
          
          <div className="pt-2 pb-1">
            <button 
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide transition-colors ${isMobileServicesOpen ? 'bg-gray-50 text-charcoal' : 'text-charcoal hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Services
              </div>
              <svg className={`w-4 h-4 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`space-y-1 transition-all duration-300 origin-top overflow-hidden pl-12 ${isMobileServicesOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0 m-0'}`}>
              <Link onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 font-sans text-sm font-medium transition-colors ${location.pathname === '/car-rentals' ? 'text-gold' : 'text-gray-500 hover:text-charcoal'}`} to="/car-rentals">Car Rentals</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 font-sans text-sm font-medium transition-colors ${location.pathname === '/hotels' ? 'text-gold' : 'text-gray-500 hover:text-charcoal'}`} to="/hotels">Hotels</Link>
            </div>
          </div>

          <Link onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-semibold tracking-wide transition-colors ${location.pathname === '/enquire-now' ? 'bg-gold/10 text-gold' : 'text-charcoal hover:bg-gray-50'}`} to="/enquire-now">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Enquire
          </Link>
        </div>
        
        {/* Drawer Footer CTA */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <Link onClick={() => setIsMobileMenuOpen(false)} className="bg-gold text-charcoal font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center transition-all hover:brightness-110 active:scale-95 w-full shadow-md" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
