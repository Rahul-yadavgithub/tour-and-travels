import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 transition-shadow duration-300 bg-charcoal">
      <div className="hidden md:block border-b border-white/10">
        <div className="container-max container-px flex items-center justify-between py-2">
          <div className="flex items-center gap-4 text-[10px] whitespace-nowrap">
            <span className="eyebrow-gold text-[10px]">★ Experienced & Professional</span>
            <span className="text-white/15">·</span>
            <span className="eyebrow-ivory text-[10px]">100% Customer Satisfaction</span>
            <span className="text-white/15">·</span>
            <span className="eyebrow-ivory text-[10px]">24x7 Available</span>
          </div>
          <a href="tel:9120073105" className="eyebrow-gold text-[10px] hover:text-gold-dark transition-colors whitespace-nowrap">+91 9120073105</a>
        </div>
      </div>
      <nav className="container-max container-px flex items-center justify-between py-3 md:py-4 gap-4">
        <Link className="inline-flex leading-none flex-col items-center" to="/">
          <span className="font-serif text-ivory font-light text-[26px] leading-none whitespace-nowrap" style={{ letterSpacing: '-0.005em' }}>
            AMIT <span className="text-gold">Guide</span>
          </span>
          <span className="block h-[2px] bg-gold w-20 mt-2"></span>
          <span className="text-ivory/40 text-[9px] font-medium tracking-[0.28em] mt-1.5 uppercase text-center">Tourist Services</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 flex-shrink-0">
          <Link className={`eyebrow transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-gold' : 'text-ivory/75 hover:text-ivory'}`} to="/">Home</Link>
          <Link className={`eyebrow transition-colors whitespace-nowrap ${location.pathname === '/tour-packages' ? 'text-gold' : 'text-ivory/75 hover:text-ivory'}`} to="/tour-packages">Tour Packages</Link>
          <Link className={`eyebrow transition-colors whitespace-nowrap ${location.pathname.startsWith('/package/') ? 'text-gold' : 'text-ivory/75 hover:text-ivory'}`} to="/package/1">Featured Tour</Link>
          <Link className={`eyebrow transition-colors whitespace-nowrap ${location.pathname === '/enquire-now' ? 'text-gold' : 'text-ivory/75 hover:text-ivory'}`} to="/enquire-now">Enquire</Link>
          <Link className="btn-gold btn-sm inline-flex items-center gap-2" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
        
        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-ivory hover:text-gold p-2">
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
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block eyebrow ${location.pathname === '/' ? 'text-gold' : 'text-ivory'}`} to="/">Home</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block eyebrow ${location.pathname === '/tour-packages' ? 'text-gold' : 'text-ivory'}`} to="/tour-packages">Tour Packages</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block eyebrow ${location.pathname.startsWith('/package/') ? 'text-gold' : 'text-ivory'}`} to="/package/1">Featured Tour</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className={`block eyebrow ${location.pathname === '/enquire-now' ? 'text-gold' : 'text-ivory'}`} to="/enquire-now">Enquire</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} className="btn-gold w-full text-center mt-4" to="/enquire-now">
            Get Free Quote
          </Link>
        </div>
      )}
    </header>
  );
}
