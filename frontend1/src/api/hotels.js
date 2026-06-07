import { useApi } from '../hooks/useApi';

export const useHotelsApi = () => {
  const { fetchWithAuth } = useApi();

  const getHotels = () => {
    return fetchWithAuth('/guide/hotels');
  };

  const createHotel = (formData) => {
    return fetchWithAuth('/guide/hotels', {
      method: 'POST',
      body: formData,
    });
  };

  const updateHotel = (hotelId, formData) => {
    return fetchWithAuth(`/guide/hotels/${hotelId}`, {
      method: 'PUT',
      body: formData,
    });
  };

  const deleteHotel = (hotelId) => {
    return fetchWithAuth(`/guide/hotels/${hotelId}`, {
      method: 'DELETE',
    });
  };

  return {
    getHotels,
    createHotel,
    updateHotel,
    deleteHotel,
  };
};
