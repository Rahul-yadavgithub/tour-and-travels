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

      <nav className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between py-3 md:py-4 gap-4">
        <Link className="inline-flex leading-none flex-col items-center" to="/">
          <span className={`font-serif font-light text-[26px] leading-none whitespace-nowrap ${isLightText ? 'text-ivory' : 'text-charcoal'}`} style={{ letterSpacing: '-0.005em' }}>
            SN <span className="text-gold">Tour & Travels</span>
          </span>
          <span className="block h-[2px] bg-gold w-20 mt-2"></span>
          <span className={`text-[9px] font-medium tracking-[0.28em] mt-1.5 uppercase text-center ${isLightText ? 'text-ivory/40' : 'text-charcoal/40'}`}>Tourist Services</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 flex-shrink-0">
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/">Home</Link>
          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname === '/tour-packages' ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/tour-packages">Tour Packages</Link>
          
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

          <Link className={`font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${location.pathname.startsWith('/package/') ? 'text-gold' : (isLightText ? 'text-white/80 hover:text-white' : 'text-charcoal/70 hover:text-charcoal')}`} to="/package/1">Featured Tour</Link>
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-charcoal border-t border-white/10 px-4 py-4 space-y-4 shadow-xl">
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase ${location.pathname === '/' ? 'text-gold' : 'text-ivory'}`} to="/">Home</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase ${location.pathname === '/tour-packages' ? 'text-gold' : 'text-ivory'}`} to="/tour-packages">Tour Packages</Link>
          
          <div className="space-y-3 pl-2 border-l-2 border-white/10 overflow-hidden">
            <button 
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)} 
              className={`w-full flex items-center justify-between font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors ${isMobileServicesOpen ? 'text-gold' : 'text-ivory hover:text-gold'}`}
            >
              Services
              <svg className={`w-3 h-3 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`space-y-3 transition-all duration-300 origin-top ${isMobileServicesOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 m-0 overflow-hidden'}`}>
              <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase pl-4 transition-colors ${location.pathname === '/car-rentals' ? 'text-gold' : 'text-ivory/75 hover:text-gold'}`} to="/car-rentals">- Car Rentals</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase pl-4 transition-colors ${location.pathname === '/hotels' ? 'text-gold' : 'text-ivory/75 hover:text-gold'}`} to="/hotels">- Hotels</Link>
            </div>
          </div>

          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase ${location.pathname.startsWith('/package/') ? 'text-gold' : 'text-ivory'}`} to="/package/1">Featured Tour</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block font-sans text-xs font-semibold tracking-[0.15em] uppercase ${location.pathname === '/enquire-now' ? 'text-gold' : 'text-ivory'}`} to="/enquire-now">Enquire</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className="bg-gold text-charcoal font-bold text-sm px-6 py-3 rounded-full inline-flex items-center justify-center transition-all hover:brightness-110 active:scale-95 cursor-pointer w-full text-center mt-4" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
      )}
    </header>
  );
}
