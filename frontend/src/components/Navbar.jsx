import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LogoSVG = ({ className = "w-[clamp(3.5rem,5vw,5rem)] h-auto" }) => (
  <svg 
    className={`overflow-visible transition-all duration-700 ease-in-out ${className}`} 
    viewBox="-5 -5 110 110" 
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="sunGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFB300" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#F57C00" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="candleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E65100" />
        <stop offset="100%" stopColor="#992B00" />
      </linearGradient>
      <linearGradient id="templeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D84315" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#8C1313" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="auraGradient" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#FFB300" stopOpacity="0.25" />
        <stop offset="60%" stopColor="#FF8F00" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#F57C00" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Spiritual aura - Scales on large screens */}
    <g className="origin-center transition-transform duration-1000 md:scale-[1.15]">
      <circle cx="50" cy="45" r="45" fill="url(#auraGradient)" />
    </g>

    {/* Rising sun rays */}
    <g className="origin-center transition-transform duration-1000 md:scale-105" opacity="0.85" stroke="#F57C00" strokeWidth="2" strokeLinecap="round">
      <line x1="50" y1="5" x2="50" y2="-2" />
      <line x1="72" y1="12" x2="80" y2="5" />
      <line x1="88" y1="30" x2="96" y2="25" />
      <line x1="92" y1="52" x2="102" y2="52" />
      <line x1="28" y1="12" x2="20" y2="5" />
      <line x1="12" y1="30" x2="4" y2="25" />
      <line x1="8" y1="52" x2="-2" y2="52" />
    </g>

    {/* Sun arc */}
    <path d="M 22 55 A 28 28 0 0 1 78 55" fill="none" stroke="url(#sunGradient)" strokeWidth="3" opacity="0.7"/>

    {/* Temple structure - Subtle background layer */}
    <g className="origin-bottom transition-transform duration-1000 md:-translate-y-1">
      <rect x="28" y="45" width="44" height="32" fill="url(#templeGradient)" rx="2" opacity="0.5"/>
      <path d="M 23 45 L 50 30 L 77 45 Z" fill="url(#templeGradient)" opacity="0.6"/>
      <path d="M 31 35 L 50 22 L 69 35 Z" fill="url(#templeGradient)" opacity="0.7"/>
      <circle cx="50" cy="22" r="3" fill="#FFB300" opacity="0.9"/>
      <rect x="49" y="16" width="2" height="6" fill="#FFB300" opacity="0.9"/>
    </g>

    {/* Focal Point: Premium Candle / Diya */}
    <g className="origin-bottom transition-transform duration-1000 md:scale-110 relative z-10">
      {/* Candle Body - Prominent and visually heavier than flame */}
      <rect x="36" y="52" width="28" height="26" fill="url(#candleGradient)" rx="3" />
      <ellipse cx="50" cy="52" rx="14" ry="4" fill="#E65100" />
      
      {/* Candle base shadow */}
      <ellipse cx="50" cy="78" rx="15" ry="3" fill="#2B1D0E" opacity="0.4" />

      {/* Elegant Flame Glow */}
      <circle cx="50" cy="40" r="16" fill="url(#flameGlow)" className="animate-pulse" />

      {/* Flame (Om symbol) - Scaled to be balanced and smaller than body */}
      <g transform="translate(50, 42) scale(0.65) translate(-50, -60)">
        <path d="M 48 60 Q 48 58 50 58 Q 52 58 52 60 Q 52 62 50 62 Q 48 62 48 60 M 50 58 L 50 55 M 52 60 Q 54 60 54 62"
              stroke="#FFF8E1" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 48 60 Q 48 58 50 58 Q 52 58 52 60 Q 52 62 50 62 Q 48 62 48 60 M 50 58 L 50 55 M 52 60 Q 54 60 54 62"
              stroke="#FF8F00" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>

    {/* Ganga river waves */}
    <g className="origin-bottom transition-transform duration-1000 md:scale-105">
      <path d="M -2 78 Q 15 72 35 78 T 65 78 T 102 78" stroke="#1565C0" strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round"/>
      <path d="M 5 86 Q 25 80 45 86 T 75 86 T 100 86" stroke="#1E88E5" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>
    </g>
  </svg>
);

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
        <Link className="md:hidden flex-1 flex justify-center items-center gap-2 font-serif text-xl font-bold truncate px-2" to="/">
           <LogoSVG className="w-[clamp(2.5rem,8vw,3.5rem)] h-auto" />
        </Link>

        {/* Invisible spacer to keep mobile logo centered */}
        <div className="md:hidden w-10"></div>

        {/* Desktop Logo */}
        <Link className="hidden md:inline-flex leading-none flex-row items-center gap-3" to="/">
          <LogoSVG className="w-[clamp(3.5rem,5vw,5rem)] h-auto" />
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
          <div className="flex flex-row items-center gap-3">
            <LogoSVG className="w-[clamp(3.5rem,10vw,4.5rem)] h-auto" />
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
