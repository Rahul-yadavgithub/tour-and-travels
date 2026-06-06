import { useState } from 'react';
import axios from 'axios';

export default function Enquire() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    city: '',
    travelDate: '',
    adults: 2,
    children: 0,
    budget: '',
    package: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await axios.post('http://localhost:5000/api/enquiries', formData);
      setStatus('Success! We will contact you within 2 hours.');
      setFormData({ fullName: '', mobile: '', email: '', city: '', travelDate: '', adults: 2, children: 0, budget: '', package: '' });
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="bg-ivory text-charcoal py-20 min-h-screen">
      <div className="container-max container-px max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Plan Your Pilgrimage</h1>
          <p className="text-charcoal-400">Fill out the details below to receive a free, customized itinerary within 2 hours.</p>
        </div>

        <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm">
          {status && (
            <div className={`p-4 mb-6 text-sm rounded ${status.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-gold/20 text-charcoal'}`}>
              {status}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-base">Full Name *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className="input-base" placeholder="Your full name" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-base">Mobile *</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="input-base" placeholder="10-digit number" />
              </div>
              <div>
                <label className="label-base">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-base" placeholder="you@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-base">Travelling From</label>
                <input name="city" value={formData.city} onChange={handleChange} className="input-base" placeholder="Your city" />
              </div>
              <div>
                <label className="label-base">Travel Date</label>
                <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} className="input-base" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="label-base">Adults</label>
                <input type="number" min="1" name="adults" value={formData.adults} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="label-base">Children</label>
                <input type="number" min="0" name="children" value={formData.children} onChange={handleChange} className="input-base" />
              </div>
              <div>
                <label className="label-base">Budget</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="input-base">
                  <option value="">Select</option>
                  <option value="Standard">Standard (3-Star)</option>
                  <option value="Premium">Premium (4-Star)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-gold w-full text-lg py-4 mt-4">
              Get Free Quote
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
