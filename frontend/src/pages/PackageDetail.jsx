import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/packages/${id}`)
      .then(res => {
        setPkg(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching package details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="bg-ivory min-h-screen flex items-center justify-center text-charcoal font-serif text-2xl">Loading...</div>;
  }

  if (!pkg) {
    return <div className="bg-ivory min-h-screen flex flex-col items-center justify-center text-charcoal py-20">
      <h2 className="font-serif text-3xl mb-4">Package Not Found</h2>
      <Link to="/tour-packages" className="btn-gold">Back to Packages</Link>
    </div>;
  }

  return (
    <div className="bg-ivory text-charcoal">
      {/* Hero */}
      <div className="relative bg-charcoal h-80 md:h-[30rem] overflow-hidden">
        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container-max">
            <span className="eyebrow-gold mb-2 block">{pkg.tag}</span>
            <h1 className="font-serif text-4xl md:text-5xl text-ivory font-light">{pkg.title}</h1>
            <p className="text-ivory/70 mt-2 text-lg">{pkg.duration}</p>
          </div>
        </div>
      </div>

      <div className="container-max container-px py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <div className="bg-white p-8 border border-charcoal/5 shadow-sm mb-12">
            <h2 className="font-serif text-3xl mb-4 border-b border-charcoal/10 pb-4 flex items-center gap-3">
              <span className="text-gold">🏛️</span> Official Information
            </h2>
            <p className="text-charcoal-400 leading-relaxed text-sm italic">
              {pkg.officialInfo}
            </p>
          </div>

          <h2 className="font-serif text-3xl mb-6">Overview</h2>
          <p className="text-charcoal-400 mb-12 leading-relaxed">
            {pkg.overview}
          </p>

          <h2 className="font-serif text-3xl mb-6">Specific Itinerary Highlights</h2>
          <div className="space-y-8 border-l border-gold/30 pl-6 ml-2">
            {pkg.itinerary && pkg.itinerary.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-gold"></div>
                <h3 className="font-serif text-xl font-medium">{step.title}</h3>
                <p className="text-charcoal-400 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="bg-white p-8 shadow-xl sticky top-32 border-t-4 border-gold">
            <p className="text-charcoal-400 text-sm mb-2">Price Details</p>
            <p className="font-serif text-4xl text-charcoal mb-6">{pkg.price}</p>
            
            <ul className="space-y-3 mb-8">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal-400">
                  <span className="text-gold mt-0.5">✓</span> {feature}
                </li>
              ))}
            </ul>

            <Link to="/enquire-now" className="btn-gold w-full text-center block">Enquire Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
