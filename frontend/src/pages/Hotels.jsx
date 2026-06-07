import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Hotels() {
  const [apiHotels, setApiHotels] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/public/hotels`)
      .then(res => setApiHotels(res.data))
      .catch(err => console.error("Error fetching hotels:", err));
  }, []);

  const defaultHotels = [
    {
      _id: 'default-1',
      name: 'Luxury 5-Star Resorts',
      photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
      description: 'The highest tier of accommodation available on the route. These resorts offer world-class luxury, expansive views, and high-end wellness facilities. They are perfect for travelers who want to experience spiritual enlightenment without compromising on modern luxury.',
      roomType: 'Suites, Premium Valley View',
      location: 'Prime scenic locations'
    },
    {
      _id: 'default-2',
      name: 'Premium Boutique Hotels',
      photoUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d27ece91?auto=format&fit=crop&q=80&w=600',
      description: 'Boutique hotels offer highly personalized services in an aesthetically rich, culturally immersive environment. They have fewer rooms compared to large resorts, ensuring a quiet, peaceful atmosphere just minutes away from main attractions.',
      roomType: 'Executive, Heritage Rooms',
      location: 'City center or near temples'
    },
    {
      _id: 'default-3',
      name: 'Deluxe / Standard Accommodations',
      photoUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=600',
      description: 'The most popular choice for standard group packages. These hotels provide clean, comfortable, and hygienic accommodations with all modern necessities. They are thoroughly vetted for hot water availability and comfortable bedding.',
      roomType: 'Standard Double/Triple AC/Non-AC',
      location: 'Highly accessible transit hubs'
    },
    {
      _id: 'default-4',
      name: 'Budget Hotels & Ashram Stays',
      photoUrl: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&q=80&w=600',
      description: 'Ideal for budget travelers and those seeking an authentic, stripped-down spiritual experience. Ashram stays provide basic, clean lodging with highly disciplined environments, daily aartis, and communal vegetarian meals (Langar/Prasad).',
      roomType: 'Basic Twin/Dormitory',
      location: 'Walking distance to major temples'
    }
  ];

  const displayHotels = apiHotels.length > 0 ? apiHotels : defaultHotels;

  return (
    <div className="min-h-screen bg-ivory font-sans text-earth pt-32 pb-20">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-16">
          <p className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Accommodation Services</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light mb-6">Hotel & Stay Specifications</h1>
          <div className="bg-white p-6 border border-earth/10 shadow-md rounded-2xl max-w-4xl">
            <h2 className="text-xl font-serif mb-2">Service Overview</h2>
            <p className="text-earth-400 text-sm leading-relaxed mb-4">
              Our accommodation division partners with highly vetted hotels, resorts, and heritage stays across major pilgrimage destinations. 
              <strong> All accommodation categories are available across our 4 major focus locations (Kashi, Prayagraj, Gaya, and Ayodhya)</strong>. All properties guarantee strict hygiene standards, safety, and proper vegetarian dining facilities suitable for devout pilgrims.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-saffron/10 text-saffron-dark px-2 py-1 border border-saffron/20 rounded">Available in Kashi (Varanasi)</span>
              <span className="text-xs bg-saffron/10 text-saffron-dark px-2 py-1 border border-saffron/20 rounded">Available in Prayagraj</span>
              <span className="text-xs bg-saffron/10 text-saffron-dark px-2 py-1 border border-saffron/20 rounded">Available in Gaya</span>
              <span className="text-xs bg-saffron/10 text-saffron-dark px-2 py-1 border border-saffron/20 rounded">Available in Ayodhya</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-8 max-w-5xl">
          
          {displayHotels.map(hotel => (
            <div key={hotel._id} className="flex flex-col md:flex-row gap-8 bg-white border border-earth/10 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-full md:w-2/5 shrink-0 flex flex-col gap-2">
                {hotel.photoUrls && hotel.photoUrls.length > 0 ? (
                  <>
                    <img src={hotel.photoUrls[0]} alt={hotel.name} onClick={(e) => setFullScreenImage(e.target.src)} className="w-full h-56 md:h-64 object-cover rounded-xl border border-earth/5 hover:scale-[1.02] transition-transform cursor-pointer" />
                    {hotel.photoUrls.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                        {hotel.photoUrls.slice(1).map((url, idx) => (
                          <img key={idx} src={url} alt={`${hotel.name} ${idx + 1}`} className="w-20 h-16 object-cover rounded-lg border border-earth/10 shrink-0 hover:opacity-80 transition-opacity cursor-pointer" onClick={(e) => { e.target.src = hotel.photoUrls[0]; e.target.parentElement.previousSibling.src = url; }} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <img src={hotel.photoUrl} alt={hotel.name} onClick={(e) => setFullScreenImage(e.target.src)} className="w-full h-56 md:h-full object-cover rounded-xl border border-earth/5 hover:scale-[1.02] transition-transform cursor-pointer" />
                )}
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-2xl">{hotel.name}</h3>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-earth text-white px-2 py-1 rounded-sm">Premium Stay</span>
                </div>
                <p className="text-sm text-earth/70 mb-4 leading-relaxed">
                  {hotel.description}
                </p>
                <div className="bg-ivory p-4 border border-earth/5 rounded-xl text-sm">
                  <h4 className="font-medium text-xs uppercase tracking-widest text-earth mb-2 border-b border-earth/10 pb-1">Property Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-earth/80">
                    <div><strong>Room Types:</strong> {hotel.roomType}</div>
                    <div><strong>Dining:</strong> In-house Restaurant, Buffet</div>
                    <div><strong>Facilities:</strong> Power Backup, High-Speed Wi-Fi</div>
                    <div><strong>Location:</strong> {hotel.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
        
        <div className="mt-12 text-center max-w-5xl">
          <Link to="/enquire-now" className="btn-saffron inline-flex items-center gap-2 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 transition-all">
            Enquire for Accommodation Availability
          </Link>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setFullScreenImage(null)}
        >
          <img 
            src={fullScreenImage} 
            alt="Full screen view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <button 
            className="absolute top-6 right-6 text-white/70 bg-black/50 hover:bg-black hover:text-white p-3 rounded-full transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
