import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory py-20 border-t-4 border-gold relative overflow-hidden">
      
      <div className="w-full px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand & About */}
          <div className="md:col-span-5">
            <Link className="inline-flex leading-none flex-col items-start mb-6" to="/">
              <span className="font-serif text-ivory font-light text-[28px] leading-none whitespace-nowrap" style={{ letterSpacing: '-0.005em' }}>
                Varanasi SN <span className="text-gold">Tour & Travels</span>
              </span>
            </Link>
            <p className="text-ivory/70 text-sm leading-relaxed max-w-sm mb-6">
              Travel with Joy & Happiness everywhere where is needed. We make your spiritual journey to Kashi, Prayagraj, Gaya, and Ayodhya deeply memorable.
            </p>
            <div className="flex items-center gap-4 text-ivory/70">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="https://www.instagram.com/sn_tour_travel" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://wa.me/919120073105" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-gold text-xl font-light mb-6 flex items-center gap-2">
              <span className="text-gold-dark text-sm">✦</span> Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-ivory/60 hover:text-gold transition-colors text-sm">Home</Link></li>
              <li><Link to="/tour-packages" className="text-ivory/60 hover:text-gold transition-colors text-sm">Tour Packages</Link></li>
              <li><Link to="/car-rentals" className="text-ivory/60 hover:text-gold transition-colors text-sm">Car Rentals</Link></li>
              <li><Link to="/hotels" className="text-ivory/60 hover:text-gold transition-colors text-sm">Hotels</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="font-serif text-gold text-xl font-light mb-6 flex items-center gap-2">
              <span className="text-gold-dark text-sm">✦</span> Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="text-ivory/80 text-sm flex items-start gap-3">
                <span className="text-gold mt-0.5">📍</span>
                <span>Mahmoorganj, Nirala Nagar<br/>Lane No.3, Varanasi<br/>UP, India - 221010</span>
              </li>
              <li className="text-ivory/80 text-sm flex flex-col gap-1.5 ml-8">
                <div className="flex items-center gap-3 -ml-8">
                  <span className="text-gold">📞</span> 
                  <a href="tel:9335487124" className="hover:text-gold transition-colors font-medium">+91 9335487124</a>
                </div>
                <a href="tel:9120073105" className="hover:text-gold transition-colors font-medium">+91 9120073105</a>
                <a href="tel:8707482524" className="hover:text-gold transition-colors font-medium">+91 8707482524</a>
              </li>
              <li className="text-ivory/80 text-sm flex items-center gap-3">
                <span className="text-gold">✉️</span> 
                <a href="mailto:info@sntourandtravels.com" className="hover:text-gold transition-colors">info@sntourandtravels.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-white/10 my-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ivory/40 text-xs">© 2026 Varanasi SN Tour & Travels. <span className="text-gold">Jai Shri Ram.</span></p>
          <div className="flex gap-6">
            <a href="#" className="text-ivory/40 hover:text-gold text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-ivory/40 hover:text-gold text-xs transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
