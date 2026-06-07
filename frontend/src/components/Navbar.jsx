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
        <Link className="inline-flex leading-none flex-col items-center" to="/">
          <span className={`font-serif font-light text-[26px] leading-none whitespace-nowrap ${isLightText ? 'text-ivory' : 'text-charcoal'}`} style={{ letterSpacing: '-0.005em' }}>
            Varanasi SN <span className="text-gold">Tour & Travels</span>
          </span>
          <span className="block h-[2px] bg-gold w-20 mt-2"></span>
          <span className={`text-[9px] font-medium tracking-[0.28em] mt-1.5 uppercase text-center ${isLightText ? 'text-ivory/40' : 'text-charcoal/40'}`}>Tourist Services</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 flex-shrink-0">
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/">Home</Link>
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/tour-packages' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/tour-packages">Tour Packages</Link>
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/pickup-route-guide' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/pickup-route-guide">Pickup & Route Guide</Link>
          
          {/* Services Dropdown */}
          <div className="relative group">
            <button className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap flex items-center gap-1 ${isServicesActive ? 'text-gold' : (isLightText ? 'text-white/80 group-hover:text-white' : 'text-charcoal/70 group-hover:text-charcoal')}`}>
              Services
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-4 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 overflow-hidden">
              <Link to="/car-rentals" className={`block px-4 py-3 font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors border-b border-gray-50 ${location.pathname === '/car-rentals' ? 'text-gold bg-gray-50' : 'text-gray-700 hover:text-gold hover:bg-gray-50'}`}>Car Rentals</Link>
              <Link to="/hotels" className={`block px-4 py-3 font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors border-b border-gray-50 ${location.pathname === '/hotels' ? 'text-gold bg-gray-50' : 'text-gray-700 hover:text-gold hover:bg-gray-50'}`}>Hotels</Link>
            </div>
          </div>


          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/enquire-now' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/enquire-now">Enquire</Link>
          <Link className="bg-gold text-charcoal font-bold text-sm px-6 py-2.5 rounded-full inline-flex items-center justify-center transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-lg" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
        
        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 ${isLightText ? 'text-ivory hover:text-gold' : 'text-charcoal hover:text-gold'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-screen w-[80vw] max-w-sm bg-charcoal z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-gold font-serif text-xl tracking-wide">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-sm font-semibold tracking-[0.15em] uppercase ${location.pathname === '/' ? 'text-gold' : 'text-ivory'}`} to="/">Home</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-sm font-semibold tracking-[0.15em] uppercase ${location.pathname === '/tour-packages' ? 'text-gold' : 'text-ivory'}`} to="/tour-packages">Tour Packages</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-sm font-semibold tracking-[0.15em] uppercase ${location.pathname === '/pickup-route-guide' ? 'text-gold' : 'text-ivory'}`} to="/pickup-route-guide">Pickup & Route Guide</Link>
          
          <div className="space-y-4 pl-3 border-l border-white/10">
            <button 
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)} 
              className={`w-full flex items-center justify-between font-sans text-sm font-semibold tracking-[0.15em] uppercase transition-colors ${isMobileServicesOpen ? 'text-gold' : 'text-ivory hover:text-gold'}`}
            >
              Services
              <svg className={`w-4 h-4 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`space-y-4 transition-all duration-300 origin-top ${isMobileServicesOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 m-0 overflow-hidden'}`}>
              <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase pl-4 transition-colors ${location.pathname === '/car-rentals' ? 'text-gold' : 'text-ivory/75 hover:text-gold'}`} to="/car-rentals">- Car Rentals</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase pl-4 transition-colors ${location.pathname === '/hotels' ? 'text-gold' : 'text-ivory/75 hover:text-gold'}`} to="/hotels">- Hotels</Link>
            </div>
          </div>

          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-sm font-semibold tracking-[0.15em] uppercase ${location.pathname === '/enquire-now' ? 'text-gold' : 'text-ivory'}`} to="/enquire-now">Enquire</Link>
        </div>
        
        <div className="p-6 border-t border-white/10 bg-black/20">
          <Link onClick={() => setIsMobileMenuOpen(false)} className="bg-gold text-charcoal font-bold text-sm px-6 py-4 rounded-full flex items-center justify-center transition-all hover:brightness-110 active:scale-95 w-full shadow-lg" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
