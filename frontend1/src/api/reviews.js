import { useApi } from '../hooks/useApi';

export const useReviewsApi = () => {
  const { fetchWithAuth } = useApi();

  const getReviews = () => {
    return fetchWithAuth('/guide/reviews');
  };

  const approveReview = (reviewId) => {
    return fetchWithAuth(`/guide/reviews/${reviewId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  };

  const rejectReview = (reviewId) => {
    return fetchWithAuth(`/guide/reviews/${reviewId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  };

  return {
    getReviews,
    approveReview,
    rejectReview,
  };
};
