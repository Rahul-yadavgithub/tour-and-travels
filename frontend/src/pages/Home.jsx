import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [stats, setStats] = useState({ enquiries: 0, visitors: 0, happyCustomers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch packages to make the homepage dynamic
    axios.get('http://localhost:5000/api/packages')
      .then(res => {
        // Take the first 4 packages for the homepage grid
        setFeaturedPackages(res.data.slice(0, 4));
      })
      .catch(err => console.error("Error fetching packages for homepage", err));

    // Fetch dynamic stats for Amit's portfolio
    axios.get('http://localhost:5000/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats", err));
  }, []);

  return (
    <div className="bg-ivory text-charcoal">
      {/* Hero Section */}
      <section className="relative bg-charcoal py-16 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://varanasiayodhya.com/images/varanasi-ghats-ganga-boats-evening.webp" alt="Varanasi" className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-charcoal/40"></div>
        </div>
        <div className="relative container-max container-px grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="mb-6 space-y-1">
              <p className="eyebrow-gold">Experienced & Professional Guide</p>
              <p className="eyebrow-gold">100% Customer Satisfaction</p>
            </div>
            <h1 className="font-serif text-ivory text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-[1.1] mb-6">
              AMIT TOURIST<br />
              <span className="italic text-gold font-normal">GUIDE SERVICES</span>
            </h1>
            <p className="text-ivory/70 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              KASHI | PRAYAGRAJ | GAYA | AYODHYA<br />
              We make your journey comfortable, safe and memorable.
            </p>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-serif text-gold text-3xl md:text-4xl font-light">Reasonable Price</span>
              <span className="text-ivory/50 text-sm">per person</span>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <a href="#" className="btn-gold">WhatsApp — Free Quote</a>
              <Link to="/tour-packages" className="btn-outline-ivory">View All Packages</Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-ivory p-7 md:p-8 shadow-2xl rounded-sm">
              <p className="eyebrow mb-2">Fast Enquiry · 30 Seconds</p>
              <p className="font-serif text-2xl font-light text-charcoal mb-1 leading-tight">Free itinerary in <span className="italic">2 hours</span>.</p>
              <p className="text-charcoal-400 text-xs mb-5">Tell us when and how many. We handle the rest.</p>
              <form className="space-y-3.5">
                <div>
                  <label className="label-base">Full Name *</label>
                  <input required className="input-base" placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="label-base">Mobile *</label>
                    <input required type="tel" className="input-base" placeholder="10-digit number" />
                  </div>
                  <div>
                    <label className="label-base">Email</label>
                    <input type="email" className="input-base" placeholder="you@email.com" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 pt-4">
                  <Link to="/enquire-now" className="btn-gold w-full text-center">Proceed to Enquire →</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#262626] border-y border-white/10 py-6">
        <div className="container-max container-px grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-4">
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
      <section className="bg-ivory/60 py-20 md:py-28">
        <div className="container-max container-px">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow mb-4">Our Main Service Areas</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-[1.15]">Kashi. Prayagraj. Gaya.<br /><span className="italic">Ayodhya.</span></h2>
            <p className="text-charcoal-400 text-base leading-relaxed mt-6 max-w-xl">We provide safe & trusted guide services across the most revered pilgrimage destinations in North India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-charcoal/10">
            {featuredPackages.length > 0 ? featuredPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-ivory group overflow-hidden cursor-pointer" 
                onClick={() => navigate(`/package/${pkg.id}`)}
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/25 to-charcoal/30"></div>
                  <div className="absolute top-5 left-5">
                    <span className="font-serif text-ivory text-5xl font-light italic opacity-80">
                      0{index + 1}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="eyebrow mb-2">{pkg.tag}</p>
                  <h3 className="font-serif text-2xl md:text-3xl font-light mb-3 group-hover:text-gold transition-colors">{pkg.title}</h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed line-clamp-3">
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

      {/* Amit's Work Showcase / Portfolio */}
      <section className="bg-charcoal py-20 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-charcoal to-charcoal"></div>
        <div className="container-max container-px relative z-10">
          <div className="text-center mb-16">
            <p className="eyebrow-gold mb-4">Journey with Amit Guide</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-ivory">Glimpses of Divine Experiences</h2>
            <p className="text-ivory/60 mt-6 max-w-2xl mx-auto">Witness the spiritual journeys and memorable moments captured by our pilgrims. A visual testament to our commitment to safe and fulfilling yatras.</p>
          </div>
          
          {/* Floating Image Gallery */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 h-auto md:h-[600px] mt-12">
            
            {/* Left Column (Floats normally) */}
            <div className="flex flex-col gap-6 md:w-1/3 animate-float">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img src="https://res.cloudinary.com/dyoaxu1dc/image/upload/portfolio_1.jpg" alt="Amit with pilgrims" className="w-full h-48 md:h-64 object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 ml-0 md:ml-8">
                <img src="https://res.cloudinary.com/dyoaxu1dc/image/upload/portfolio_2.jpg" alt="Ganga Aarti View" className="w-full h-56 md:h-72 object-cover hover:scale-110 transition-transform duration-700" />
              </div>
            </div>

            {/* Center Column (Prominent, Delayed float) */}
            <div className="flex flex-col gap-6 md:w-1/3 z-20 animate-float-delayed">
              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-gold/30">
                <img src="https://res.cloudinary.com/dyoaxu1dc/image/upload/portfolio_3.jpg" alt="Sunrise at Ghats" className="w-full h-80 md:h-[450px] object-cover hover:scale-110 transition-transform duration-700" />
              </div>
            </div>

            {/* Right Column (Slow float) */}
            <div className="flex flex-col gap-6 md:w-1/3 animate-float-slow">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 mr-0 md:mr-8">
                <img src="https://res.cloudinary.com/dyoaxu1dc/image/upload/portfolio_4.jpg" alt="Group Pilgrimage Dining" className="w-full h-56 md:h-72 object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img src="https://res.cloudinary.com/dyoaxu1dc/image/upload/portfolio_5.jpg" alt="Grand Temple View" className="w-full h-48 md:h-64 object-cover hover:scale-110 transition-transform duration-700" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-white py-20 md:py-28 border-t border-charcoal/10">
        <div className="container-max container-px">
          <div className="text-center mb-16">
            <p className="eyebrow-gold mb-4">Testimonials</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light">What Our Pilgrims Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-ivory p-8 border border-charcoal/5 rounded-sm shadow-sm">
              <div className="flex gap-1 text-gold mb-4">★★★★★</div>
              <p className="text-charcoal-400 italic mb-6">"Amit is a truly exceptional guide. His polite and friendly behavior made our family feel completely safe. He arranged VIP darshan at Kashi Vishwanath effortlessly. Highly recommended!"</p>
              <div>
                <p className="font-serif text-lg font-medium">Rajesh Sharma</p>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1">Travelled from Mumbai</p>
              </div>
            </div>
            <div className="bg-ivory p-8 border border-charcoal/5 rounded-sm shadow-sm relative md:-top-4">
              <div className="flex gap-1 text-gold mb-4">★★★★★</div>
              <p className="text-charcoal-400 italic mb-6">"The Gaya Pind Daan was perfectly organized. Amit ji ensured all rituals were complete without any hassle. The hotels he booked were comfortable and the pricing was very reasonable."</p>
              <div>
                <p className="font-serif text-lg font-medium">Suresh Kumar</p>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1">Travelled from Delhi</p>
              </div>
            </div>
            <div className="bg-ivory p-8 border border-charcoal/5 rounded-sm shadow-sm">
              <div className="flex gap-1 text-gold mb-4">★★★★★</div>
              <p className="text-charcoal-400 italic mb-6">"We went to Ayodhya Ram Mandir and Prayagraj Sangam. Amit's knowledge of the sacred places is profound. His dedication to 100% customer satisfaction is real. Jai Shri Ram!"</p>
              <div>
                <p className="font-serif text-lg font-medium">Anjali Gupta</p>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest mt-1">Travelled from Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amit's Impact / Live Stats Portfolio */}
      <section className="bg-charcoal py-16 text-ivory text-center">
        <div className="container-max container-px">
          <p className="eyebrow-gold mb-4">Amit's Portfolio</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-12">Our Growing Spiritual Family</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-8 sm:pt-0">
              <p className="font-serif text-5xl md:text-6xl text-gold font-light mb-2">{stats.visitors ? stats.visitors.toLocaleString() : '15,420'}+</p>
              <p className="text-ivory/60 text-sm uppercase tracking-widest">Website Visitors</p>
            </div>
            <div className="pt-8 sm:pt-0">
              <p className="font-serif text-5xl md:text-6xl text-gold font-light mb-2">{stats.enquiries ? stats.enquiries.toLocaleString() : '850'}+</p>
              <p className="text-ivory/60 text-sm uppercase tracking-widest">Enquiries Received</p>
            </div>
            <div className="pt-8 sm:pt-0">
              <p className="font-serif text-5xl md:text-6xl text-gold font-light mb-2">{stats.happyCustomers ? stats.happyCustomers.toLocaleString() : '1,100'}+</p>
              <p className="text-ivory/60 text-sm uppercase tracking-widest">Happy Travelers</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
