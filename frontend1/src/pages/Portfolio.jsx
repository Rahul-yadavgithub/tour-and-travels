import { useState, useEffect } from 'react';
import { usePortfolioApi } from '../api/portfolio';
import ImageUploader from '../components/shared/ImageUploader';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Trash2, Plus, GripVertical } from 'lucide-react';

const Portfolio = () => {
  const { getPortfolioPhotos, uploadPortfolioPhoto, deletePortfolioPhoto } = usePortfolioApi();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, photoId: null, isLoading: false });

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioPhotos();
      setPhotos(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      await uploadPortfolioPhoto(formData);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      fetchPhotos();
    } catch (error) {
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteModalState(prev => ({ ...prev, isLoading: true }));
      await deletePortfolioPhoto(deleteModalState.photoId);
      setDeleteModalState({ isOpen: false, photoId: null, isLoading: false });
      fetchPhotos();
    } catch (error) {
      alert("Failed to delete photo");
      setDeleteModalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Portfolio</h1>
          <p className="text-sm text-zinc-500 mt-1">Showcase your best moments — these photos appear on your public profile.</p>
        </div>
        <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Upload photo
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading portfolio...</div>
      ) : photos.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2 bg-zinc-50/50">
          <h3 className="text-base font-semibold text-zinc-900 mb-1">No photos yet</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm">Upload your first portfolio photo to build your gallery and attract more customers.</p>
          <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-secondary">
            <Plus className="w-4 h-4 mr-2" /> Upload photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo._id} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <img src={photo.imageUrl} alt="Portfolio" className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-between items-center">
                  <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-md text-white cursor-move hover:bg-white/30 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button 
                    onClick={() => setDeleteModalState({ isOpen: true, photoId: photo._id, isLoading: false })}
                    className="p-1.5 bg-red-500/80 backdrop-blur-md rounded-md text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !uploading && setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-premium overflow-hidden p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Upload Portfolio Photo</h3>
            <ImageUploader onImageSelect={setSelectedFile} />
            <div className="flex justify-end gap-3 mt-6">
              <button disabled={uploading} onClick={() => setIsUploadModalOpen(false)} className="btn btn-ghost">Cancel</button>
              <button disabled={!selectedFile || uploading} onClick={handleUpload} className="btn btn-primary">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDelete}
        title="Delete Photo"
        message="Are you sure you want to delete this photo from your portfolio? This action cannot be undone."
        confirmText="Delete"
        danger={true}
        isLoading={deleteModalState.isLoading}
      />
    </div>
  );
};

export default Portfolio;
