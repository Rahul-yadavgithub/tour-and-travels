import { useApi } from '../hooks/useApi';

export const useProfileApi = () => {
  const { fetchWithAuth } = useApi();

  const getProfile = () => {
    return fetchWithAuth('/guide/profile');
  };

  const updateProfile = (data) => {
    return fetchWithAuth('/guide/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  return {
    getProfile,
    updateProfile,
  };
};
