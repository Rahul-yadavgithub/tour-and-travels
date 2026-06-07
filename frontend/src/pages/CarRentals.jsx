import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function CarRentals() {
  const [apiCars, setApiCars] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [carPhotosLayout, setCarPhotosLayout] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/public/cars`)
      .then(res => setApiCars(res.data))
      .catch(err => console.error("Error fetching cars:", err));
  }, []);

  const defaultCars = [
    {
      _id: 'default-1',
      name: 'Toyota Innova / Crysta',
      photoUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600',
      description: 'The Toyota Innova Crysta is a premium Multi-Purpose Vehicle (MPV) highly preferred for long-distance journeys. Known for its robust build, spacious interiors, and exceptionally comfortable suspension, it easily handles inter-city travel between our major destinations.',
      seatCapacity: '6+1 or 7+1',
      luggageCapacity: '4-5 Medium Bags'
    },
    {
      _id: 'default-2',
      name: 'Swift Dzire / Toyota Etios',
      photoUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600',
      description: 'Economy sedans are the standard choice for small families or couples. They offer a smooth, highly comfortable ride on the highways and city roads connecting our major pilgrimage sites, driven by experienced local chauffeurs.',
      seatCapacity: '4',
      luggageCapacity: '2-3 Medium Bags in Boot'
    },
    {
      _id: 'default-3',
      name: 'Force Tempo Traveller',
      photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600',
      description: 'The ideal solution for group tours. Tempo Travellers offer powerful engines and comfortable push-back seating. They provide ample headroom, large windows for sightseeing, and sufficient luggage space, making group travel between cities highly enjoyable.',
      seatCapacity: '12, 16, or 20',
      luggageCapacity: 'Roof Carrier + Rear Space'
    },
    {
      _id: 'default-4',
      name: 'Toyota Fortuner / Luxury VIP',
      photoUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
      description: 'Reserved for VIP delegations and premium tours, this category includes heavy-duty luxury SUVs like the Toyota Fortuner. These vehicles offer supreme safety, absolute off-road capability, and a commanding presence, driven by highly vetted chauffeurs.',
      seatCapacity: '4-6',
      luggageCapacity: 'High Capacity Space'
    }
  ];

  const displayCars = apiCars.length > 0 ? apiCars : defaultCars;

  return (
    <div className="min-h-screen bg-ivory font-sans text-earth pt-32 pb-20">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-16">
          <p className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-4">Transportation Services</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light mb-6">Fleet & Vehicle Specifications</h1>
          <div className="bg-white p-6 border border-earth/10 shadow-md rounded-2xl max-w-4xl">
            <h2 className="text-xl font-serif mb-2">Service Overview</h2>
            <p className="text-earth-400 text-sm leading-relaxed mb-4">
              Our transportation division operates a comprehensive fleet of vehicles specifically maintained for both city and highway journeys. 
              <strong> All vehicle categories are available across all 4 major locations (Kashi, Prayagraj, Gaya, and Ayodhya)</strong>. Vehicles are assigned with highly experienced, professional drivers well-versed with the local routes.
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
          
          {displayCars.map(car => {
            const uniqueUrls = car.photoUrls ? Array.from(new Set(car.photoUrls)) : [];
            const layout = carPhotosLayout[car._id] || (uniqueUrls.length > 0 ? uniqueUrls : [car.photoUrl]);
            const mainPhoto = layout[0];
            const thumbUrls = layout.slice(1);
            
            return (
            <div key={car._id} className="flex flex-col md:flex-row gap-8 bg-white border border-earth/10 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-2">
                {layout.length > 0 ? (
                  <>
                    <img src={mainPhoto} alt={car.name} onClick={() => setFullScreenImage(mainPhoto)} className="w-full h-48 md:h-56 object-cover rounded-xl border border-earth/5 hover:scale-[1.02] transition-transform cursor-pointer" />
                    {thumbUrls.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 pt-1">
                        {thumbUrls.map((url, idx) => (
                          <img 
                            key={idx} 
                            src={url} 
                            alt={`${car.name} thumbnail ${idx + 1}`} 
                            className="w-20 h-16 object-cover rounded-lg border border-earth/10 shrink-0 hover:opacity-80 transition-all cursor-pointer" 
                            onClick={() => {
                              setCarPhotosLayout(prev => {
                                const currentLayout = prev[car._id] ? [...prev[car._id]] : [...(uniqueUrls.length > 0 ? uniqueUrls : [car.photoUrl])];
                                const layoutIndex = idx + 1;
                                const temp = currentLayout[0];
                                currentLayout[0] = currentLayout[layoutIndex];
                                currentLayout[layoutIndex] = temp;
                                return { ...prev, [car._id]: currentLayout };
                              });
                            }} 
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <img src={car.photoUrl} alt={car.name} onClick={() => setFullScreenImage(car.photoUrl)} className="w-full h-48 md:h-full object-cover rounded-xl border border-earth/5 hover:scale-[1.02] transition-transform cursor-pointer" />
                )}
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-2xl">{car.name}</h3>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-earth text-white px-2 py-1 rounded-sm">Vehicle Fleet</span>
                </div>
                <p className="text-sm text-earth/70 mb-4 leading-relaxed">
                  {car.description}
                </p>
                <div className="bg-ivory p-4 border border-earth/5 rounded-xl text-sm">
                  <h4 className="font-medium text-xs uppercase tracking-widest text-earth mb-2 border-b border-earth/10 pb-1">Technical Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-earth/80">
                    <div><strong>Seating Capacity:</strong> {car.seatCapacity} Passengers</div>
                    <div><strong>Luggage Capacity:</strong> {car.luggageCapacity || car.luggageCapacity === 0 ? car.luggageCapacity : 'Standard Capacity'}</div>
                    <div><strong>Air Conditioning:</strong> Dual Zone AC/Heater</div>
                    <div><strong>Best Suited For:</strong> Premium Travel & Tours</div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}

        </div>
        
        <div className="mt-12 text-center max-w-5xl">
          <Link to="/enquire-now" className="btn-saffron inline-flex items-center gap-2 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 transition-all">
            Enquire for Vehicle Availability
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
