import { useState, useEffect } from 'react';
import { useReviewsApi } from '../api/reviews';
import { CheckCircle2, XCircle, Clock, User, Star } from 'lucide-react';

const Reviews = () => {
  const { getReviews, approveReview, rejectReview } = useReviewsApi();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      fetchReviews();
    } catch (error) {
      alert("Failed to approve review");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectReview(id);
      fetchReviews();
    } catch (error) {
      alert("Failed to reject review");
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Reviews</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage customer feedback.</p>
        </div>
        
        <div className="flex bg-zinc-100 p-1 rounded-lg border border-zinc-200 w-fit">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${filter === f ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2 bg-zinc-50/50">
          <h3 className="text-base font-semibold text-zinc-900 mb-1">No reviews found</h3>
          <p className="text-sm text-zinc-500 max-w-sm">There are no reviews matching the "{filter}" filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="card p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{review.name}</h4>
                    <p className="text-xs text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {review.status === 'pending' && <span className="badge badge-warning flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>}
                {review.status === 'approved' && <span className="badge badge-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</span>}
                {review.status === 'rejected' && <span className="badge badge-danger flex items-center gap-1"><XCircle className="w-3 h-3"/> Rejected</span>}
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`} />
                ))}
              </div>
              
              <p className="text-sm text-zinc-700 italic flex-1 mb-6 line-clamp-4">"{review.text}"</p>
              
              {review.status === 'pending' && (
                <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-zinc-100">
                  <button onClick={() => handleReject(review._id)} className="btn btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200">
                    Reject
                  </button>
                  <button onClick={() => handleApprove(review._id)} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20">
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
