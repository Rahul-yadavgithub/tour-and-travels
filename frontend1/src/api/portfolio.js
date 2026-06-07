import { useApi } from '../hooks/useApi';

export const usePortfolioApi = () => {
  const { fetchWithAuth } = useApi();

  const getPortfolioPhotos = () => {
    return fetchWithAuth('/guide/portfolio');
  };

  const uploadPortfolioPhoto = (formData) => {
    return fetchWithAuth('/guide/portfolio', {
      method: 'POST',
      body: formData,
    });
  };

  const deletePortfolioPhoto = (photoId) => {
    return fetchWithAuth(`/guide/portfolio/${photoId}`, {
      method: 'DELETE',
    });
  };

  const reorderPortfolioPhotos = (orderedIds) => {
    return fetchWithAuth('/guide/portfolio/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ orderedIds }),
    });
  };

  return {
    getPortfolioPhotos,
    uploadPortfolioPhoto,
    deletePortfolioPhoto,
    reorderPortfolioPhotos,
  };
};
