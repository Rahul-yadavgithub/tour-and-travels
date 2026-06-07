import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function TourPackages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Fetch packages from the backend
    axios.get(`${API_BASE_URL}/api/packages`)
      .then(res => setPackages(res.data))
      .catch(err => console.error("Error fetching packages", err));
  }, []);

  return (
    <div className="bg-ivory text-earth pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="mb-12">
          <p className="font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Explore Our Routes</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15]">Tour Packages</h1>
          <p className="text-earth-400 text-lg mt-4 max-w-2xl">Find the perfect carefully-crafted pilgrimage package that suits your schedule and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white p-8 shadow-md rounded-2xl border border-earth/5 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                {pkg.imageUrl && (
                  <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl border border-earth/10">
                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div>
                  <p className="font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-2">{pkg.duration}</p>
                  <h3 className="font-serif text-2xl font-light leading-snug group-hover:text-gold transition-colors">{pkg.title}</h3>
                </div>
              </div>
              <hr className="border-0 border-t border-gold my-4 my-4" />
              <ul className="space-y-2 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-earth-400">
                    <span className="w-1.5 h-1.5 bg-saffron rounded-full flex-shrink-0 mt-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <span className="font-serif text-2xl md:text-3xl font-light text-earth">{pkg.price}</span>
                  <span className="text-xs text-earth-400 ml-1">/ person</span>
                </div>
                <Link to={pkg.link} className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-earth border-b border-current pb-[2px] transition-opacity hover:opacity-70">Details →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
