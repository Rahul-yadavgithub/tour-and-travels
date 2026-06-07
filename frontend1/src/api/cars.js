import { useApi } from '../hooks/useApi';

export const useCarsApi = () => {
  const { fetchWithAuth } = useApi();

  const getCars = () => {
    return fetchWithAuth('/guide/cars');
  };

  const createCar = (formData) => {
    return fetchWithAuth('/guide/cars', {
      method: 'POST',
      body: formData,
    });
  };

  const updateCar = (carId, formData) => {
    return fetchWithAuth(`/guide/cars/${carId}`, {
      method: 'PUT',
      body: formData,
    });
  };

  const deleteCar = (carId) => {
    return fetchWithAuth(`/guide/cars/${carId}`, {
      method: 'DELETE',
    });
  };

  return {
    getCars,
    createCar,
    updateCar,
    deleteCar,
  };
};
