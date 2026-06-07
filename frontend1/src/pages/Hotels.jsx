import { useState, useEffect } from 'react';
import { useHotelsApi } from '../api/hotels';
import MultipleImageUploader from '../components/shared/MultipleImageUploader';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';

const Hotels = () => {
  const { getHotels, createHotel, updateHotel, deleteHotel } = useHotelsApi();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const [formData, setFormData] = useState({ name: '', roomType: '', location: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await getHotels();
      setHotels(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const openForm = (hotel = null) => {
    setEditingHotel(hotel);
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        roomType: hotel.roomType || '',
        location: hotel.location || '',
        description: hotel.description || ''
      });
    } else {
      setFormData({ name: '', roomType: '', location: '', description: '' });
    }
    setSelectedFiles([]);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach(file => data.append('images', file));
      }

      if (editingHotel) {
        await updateHotel(editingHotel._id, data);
      } else {
        await createHotel(data);
      }
      
      setIsFormOpen(false);
      fetchHotels();
    } catch (error) {
      alert("Failed to save hotel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteHotel(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      fetchHotels();
    } catch (error) {
      alert("Failed to delete hotel");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Hotel services</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage partner hotels and rooms you offer.</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Add hotel
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2 bg-zinc-50/50">
          <h3 className="text-base font-semibold text-zinc-900 mb-1">No hotels yet</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm">Add your first partner hotel to expand your offerings.</p>
          <button onClick={() => openForm()} className="btn btn-secondary">
            <Plus className="w-4 h-4 mr-2" /> Add hotel
          </button>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Hotel Details</th>
                  <th className="px-6 py-3 font-medium">Room Type</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {hotel.photoUrls && hotel.photoUrls.length > 0 ? (
                          <img src={hotel.photoUrls[0]} alt={hotel.name} className="w-10 h-10 rounded-md object-cover border border-zinc-200" />
                        ) : hotel.photoUrl ? (
                          <img src={hotel.photoUrl} alt={hotel.name} className="w-10 h-10 rounded-md object-cover border border-zinc-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200"><span className="text-[10px]">No Img</span></div>
                        )}
                        <span className="font-medium text-zinc-900">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{hotel.roomType || '-'}</td>
                    <td className="px-6 py-4 text-zinc-600">{hotel.location || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openForm(hotel)} className="p-2 text-zinc-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal({ isOpen: true, id: hotel._id })} className="p-2 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsFormOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-premium overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-zinc-100">
              <h3 className="text-lg font-semibold text-zinc-900">{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Hotel Photos</label>
                <MultipleImageUploader onImagesSelect={setSelectedFiles} currentImageUrls={editingHotel?.photoUrls || (editingHotel?.photoUrl ? [editingHotel.photoUrl] : [])} />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Hotel Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Taj Ganges" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Room Type</label>
                  <input type="text" className="input-field" value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} placeholder="e.g. Deluxe Double" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Location</label>
                  <input type="text" className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Varanasi City Center" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Description (Optional)</label>
                <textarea rows="3" className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief details..."></textarea>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
                <button type="button" disabled={isSubmitting} onClick={() => setIsFormOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Hotel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Hotel"
        message="Are you sure you want to remove this hotel? This action cannot be undone."
      />
    </div>
  );
};

export default Hotels;
