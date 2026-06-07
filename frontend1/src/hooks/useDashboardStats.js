import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export const useDashboardStats = () => {
  const { fetchWithAuth } = useApi();
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalCars: 0,
    totalHotels: 0,
    pendingReviews: 0,
    approvedReviews: 0 // If backend supports it, otherwise derived or mocked
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth('/guide/dashboard/stats');
        setStats({
          ...stats,
          ...data
        });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fetchWithAuth]);

  return { stats, loading, error };
};
