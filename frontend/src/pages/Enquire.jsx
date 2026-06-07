import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Enquire() {
  const navigate = useNavigate();
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
      await axios.post(`${API_BASE_URL}/api/enquiries`, formData);
      setStatus('Success! We will contact you within 2 hours. Redirecting...');
      setFormData({ fullName: '', mobile: '', email: '', city: '', travelDate: '', adults: 2, children: 0, budget: '', package: '' });
      
      // Redirect to home page after 2.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err) {
      console.error(err);
      setStatus('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="bg-ivory text-earth pt-32 pb-20 min-h-screen">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Plan Your Pilgrimage</h1>
          <p className="text-earth-400">Fill out the details below to receive a free, customized itinerary within 2 hours.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white p-8 md:p-12 shadow-2xl rounded-2xl">
          {status && (
            <div className={`p-4 mb-6 text-sm rounded ${status.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-saffron/20 text-earth'}`}>
              {status}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Full Name *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" placeholder="Your full name" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Mobile *</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" placeholder="10-digit number" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" placeholder="you@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Travelling From</label>
                <input name="city" value={formData.city} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" placeholder="Your city" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Travel Date</label>
                <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Adults</label>
                <input type="number" min="1" name="adults" value={formData.adults} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Children</label>
                <input type="number" min="0" name="children" value={formData.children} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 uppercase tracking-[0.05em]">Budget</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-3 bg-transparent border border-charcoal/20 rounded-xl font-sans text-sm text-charcoal outline-none transition-colors focus:border-charcoal">
                  <option value="">Select</option>
                  <option value="Standard">Standard (3-Star)</option>
                  <option value="Premium">Premium (4-Star)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-saffron w-full text-lg py-4 mt-4 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 transition-all">
              Get Free Quote
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
