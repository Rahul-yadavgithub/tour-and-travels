import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal py-20 border-t border-white/10">
      <div className="container-max container-px">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link className="inline-flex leading-none flex-col items-start mb-6" to="/">
              <span className="font-serif text-ivory font-light text-[26px] leading-none whitespace-nowrap" style={{ letterSpacing: '-0.005em' }}>
                AMIT <span className="text-gold">Guide</span>
              </span>
            </Link>
            <p className="text-ivory/60 text-sm leading-relaxed max-w-sm mb-6">
              We make your journey spiritual and memorable. Your satisfaction is our priority. Safe & Trusted Guide Services for Kashi, Prayagraj, Gaya, and Ayodhya.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-serif text-ivory text-xl font-light mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/tour-packages" className="text-ivory/60 hover:text-gold transition-colors text-sm">Tour Packages</Link></li>
              <li><Link to="/package/1" className="text-ivory/60 hover:text-gold transition-colors text-sm">Featured Tour</Link></li>
              <li><Link to="/enquire-now" className="text-ivory/60 hover:text-gold transition-colors text-sm">Free Quote</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-serif text-ivory text-xl font-light mb-4">Contact Amit Guide</h4>
            <ul className="space-y-3">
              <li className="text-ivory/60 text-sm flex gap-2">
                <span className="text-gold">📞</span> <a href="tel:9120073105" className="hover:text-gold transition-colors">+91 9120073105</a>
              </li>
              <li className="text-ivory/60 text-sm flex gap-2">
                <span className="text-gold">✉️</span> <a href="mailto:info@amitguide.com" className="hover:text-gold transition-colors">info@amitguide.com</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-white/10 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ivory/40 text-xs">© 2026 Amit Tourist Guide Services. Jai Shri Ram.</p>
          <div className="flex gap-4">
            <a href="#" className="text-ivory/40 hover:text-ivory text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-ivory/40 hover:text-ivory text-xs transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
