import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const useApi = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    try {
      const token = await getToken();
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      };

      // If we're not sending FormData (like file uploads), default to JSON
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      } else {
        // When using FormData, fetch automatically sets the correct Content-Type with the boundary
        // We must ensure we don't accidentally override it
        delete headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Call Failed:', error);
      throw error;
    }
  }, [getToken]);

  return { fetchWithAuth };
};
