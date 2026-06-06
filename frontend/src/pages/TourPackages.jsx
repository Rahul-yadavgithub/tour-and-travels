import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TourPackages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Fetch packages from the backend
    axios.get('http://localhost:5000/api/packages')
      .then(res => setPackages(res.data))
      .catch(err => console.error("Error fetching packages", err));
  }, []);

  return (
    <div className="bg-ivory text-charcoal py-20">
      <div className="container-max container-px">
        <div className="mb-12">
          <p className="eyebrow mb-4">Explore Our Routes</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15]">Tour Packages</h1>
          <p className="text-charcoal-400 text-lg mt-4 max-w-2xl">Find the perfect carefully-crafted pilgrimage package that suits your schedule and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white p-8 shadow-sm border border-charcoal/5 flex flex-col group hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <p className="eyebrow mb-2">{pkg.duration}</p>
                  <h3 className="font-serif text-2xl font-light leading-snug">{pkg.title}</h3>
                </div>
              </div>
              <hr className="hr-gold my-4" />
              <ul className="space-y-2 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-charcoal-400">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0 mt-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <span className="font-serif text-2xl md:text-3xl font-light text-charcoal">{pkg.price}</span>
                  <span className="text-xs text-charcoal-400 ml-1">/ person</span>
                </div>
                <Link to={pkg.link} className="eyebrow text-charcoal link-underline">Details →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
