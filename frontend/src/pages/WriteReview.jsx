import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function WriteReview() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', from: '', text: '', rating: 5 });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await axios.post(`${API_BASE_URL}/api/reviews`, formData);
      setStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-ivory">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-gold font-sans text-xs font-semibold tracking-[0.15em] uppercase mb-2">Share Your Experience</p>
          <h1 className="font-serif text-4xl font-light text-charcoal">Write a Review</h1>
          <p className="text-charcoal-400 mt-4">We value your feedback. Please share your spiritual journey experience with SN Tour And Travels.</p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-sm text-center">
            <div className="text-4xl mb-4">🙏</div>
            <h3 className="font-serif text-2xl mb-2">Thank You!</h3>
            <p>Your review has been submitted successfully and is pending admin approval.</p>
            <p className="text-sm mt-4 text-green-600/80">Redirecting to homepage...</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-gold-dark rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleSubmit} className="relative bg-white p-8 border border-charcoal/5 shadow-2xl rounded-2xl">
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                {errorMessage}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">Your Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-charcoal/20 px-4 py-3 rounded-xl focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Rajesh Sharma"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="from" className="block text-sm font-medium text-charcoal mb-2">City/Location</label>
              <input 
                type="text" 
                id="from" 
                name="from" 
                required 
                value={formData.from}
                onChange={handleChange}
                className="w-full border border-charcoal/20 px-4 py-3 rounded-xl focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Mumbai"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg 
                      className={`w-8 h-8 transition-colors ${star <= (hoverRating || formData.rating) ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="1" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <label htmlFor="text" className="block text-sm font-medium text-charcoal mb-2">Your Review</label>
              <textarea 
                id="text" 
                name="text" 
                required 
                rows="5"
                value={formData.text}
                onChange={handleChange}
                className="w-full border border-charcoal/20 px-4 py-3 rounded-xl focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Share your experience..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-gold text-white py-4 font-medium uppercase tracking-widest text-sm rounded-full hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 hover:bg-gold-dark transition-all disabled:opacity-70"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Review'}
            </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
