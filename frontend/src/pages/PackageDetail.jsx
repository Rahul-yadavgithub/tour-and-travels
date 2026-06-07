import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/packages/${id}`)
      .then(res => {
        setPkg(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching package details", err);
        setLoading(false);
      });

    axios.get(`${API_BASE_URL}/api/packages`)
      .then(res => setAllPackages(res.data))
      .catch(err => console.error("Error fetching packages", err));
  }, [id]);

  if (loading) {
    return <div className="bg-ivory min-h-screen flex items-center justify-center text-earth font-serif text-2xl">Loading...</div>;
  }

  if (!pkg) {
    return <div className="bg-ivory min-h-screen flex flex-col items-center justify-center text-earth py-20">
      <h2 className="font-serif text-3xl mb-4">Package Not Found</h2>
      <Link to="/tour-packages" className="btn-saffron rounded-full hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 transition-all">Back to Packages</Link>
    </div>;
  }

  return (
    <div className="bg-ivory text-earth pt-20">
      {/* Hero */}
      <div className="relative bg-black h-80 md:h-[30rem] overflow-hidden">
        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-[1200px] mx-auto">
            <span className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-2 block">{pkg.tag}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-ivory font-light">{pkg.title}</h1>
            <p className="text-ivory/70 mt-2 text-lg">{pkg.duration}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <div className="bg-white p-8 rounded-2xl border border-earth/5 shadow-md hover:shadow-lg transition-shadow mb-12">
            <h2 className="font-serif text-3xl mb-4 border-b border-earth/10 pb-4 flex items-center gap-3">
              <span className="text-saffron">🏛️</span> Official Information
            </h2>
            <p className="text-earth-400 leading-relaxed text-sm italic">
              {pkg.officialInfo}
            </p>
          </div>

          <h2 className="font-serif text-3xl mb-6">Overview</h2>
          <p className="text-earth-400 mb-12 leading-relaxed">
            {pkg.overview}
          </p>

          <h2 className="font-serif text-3xl mb-6">Specific Itinerary Highlights</h2>
          <div className="space-y-8 border-l border-saffron/30 pl-6 ml-2">
            {pkg.itinerary && pkg.itinerary.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-saffron"></div>
                <h3 className="font-serif text-xl font-medium">{step.title}</h3>
                <p className="text-earth-400 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="relative group sticky top-32">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border-t-4 border-saffron">
            <p className="text-earth-400 text-sm mb-2">Price Details</p>
            <p className="font-serif text-4xl text-earth mb-6">{pkg.price}</p>
            
            <ul className="space-y-3 mb-8">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-earth-400">
                  <span className="text-saffron mt-0.5">✓</span> {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link to="/enquire-now" className="btn-saffron flex-1 text-center flex items-center justify-center rounded-full py-3.5 text-sm md:text-base font-semibold">
                Enquire Now
              </Link>
              <a href="tel:+919120073105" className="btn-saffron flex-1 text-center rounded-full py-3.5 flex items-center justify-center gap-2 font-semibold text-sm md:text-base">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Contact Now
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
