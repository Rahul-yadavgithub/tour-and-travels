import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Fetch all unapproved reviews
      const res = await axios.get(`${API_BASE_URL}/api/reviews?approved=false`);
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/reviews/${id}/approve`);
      // Remove approved review from the list
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error approving review', err);
      alert('Failed to approve review');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-ivory">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-light text-charcoal">Admin Dashboard</h1>
          <p className="text-charcoal-400 mt-2">Manage Unapproved Reviews</p>
        </div>

        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-md text-center border border-charcoal/5">
            <p className="text-charcoal-400">There are no unapproved reviews pending.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 border border-charcoal/5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center justify-between group">
                <div className="flex-1">
                  <div className="flex gap-1 text-gold mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-charcoal-600 mb-4 italic">"{review.text}"</p>
                  <div>
                    <span className="font-medium">{review.name}</span>
                    <span className="text-gray-400 text-sm ml-2">from {review.from}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Submitted: {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleApprove(review._id)}
                    className="bg-gold text-white px-6 py-2 rounded-full hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 transition-all font-medium"
                  >
                    Approve Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
