import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, MapPin } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import ConfirmModal from '../shared/ConfirmModal';

export default function PickupManager() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPickup, setCurrentPickup] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pickupToDelete, setPickupToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const data = await fetchWithAuth(`/route-management/pickups`);
      setPickups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', currentPickup.name || '');
      formData.append('type', currentPickup.type || '');
      formData.append('city', currentPickup.city || '');
      formData.append('description', currentPickup.description || '');
      formData.append('latitude', currentPickup.latitude || '');
      formData.append('longitude', currentPickup.longitude || '');
      formData.append('isActive', currentPickup.isActive !== false);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (currentPickup._id) {
        await fetchWithAuth(`/route-management/pickups/${currentPickup._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        await fetchWithAuth(`/route-management/pickups`, {
          method: 'POST',
          body: formData
        });
      }
      setIsEditing(false);
      setImageFile(null);
      fetchPickups();
    } catch (err) {
      console.error(err);
      alert('Failed to save pickup point');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (pickup) => {
    setPickupToDelete(pickup);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pickupToDelete) return;
    setIsDeleting(true);
    try {
      await fetchWithAuth(`/route-management/pickups/${pickupToDelete._id}`, { method: 'DELETE' });
      fetchPickups();
      setDeleteModalOpen(false);
      setPickupToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>;

  if (isEditing) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">{currentPickup._id ? 'Edit' : 'Add'} Pickup Point</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location Name</label>
              <input required type="text" className="w-full border rounded-lg p-2" placeholder="e.g., Varanasi Junction" value={currentPickup.name || ''} onChange={e => setCurrentPickup({...currentPickup, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input required type="text" className="w-full border rounded-lg p-2" placeholder="e.g., Varanasi" value={currentPickup.city || ''} onChange={e => setCurrentPickup({...currentPickup, city: e.target.value})} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select required className="w-full border rounded-lg p-2" value={currentPickup.type || ''} onChange={e => setCurrentPickup({...currentPickup, type: e.target.value})}>
                <option value="">Select Type...</option>
                <option value="Airport">Airport</option>
                <option value="Railway Station">Railway Station</option>
                <option value="Bus Stand">Bus Stand</option>
                <option value="Hotel">Hotel</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image Upload</label>
              <input type="file" accept="image/*" className="w-full border rounded-lg p-2" onChange={e => setImageFile(e.target.files[0])} />
              {currentPickup.image && !imageFile && (
                <div className="mt-2 text-sm text-zinc-500">
                  Current image: <a href={currentPickup.image} target="_blank" rel="noreferrer" className="text-amber-500 underline">View</a>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border rounded-lg p-2 h-24" value={currentPickup.description || ''} onChange={e => setCurrentPickup({...currentPickup, description: e.target.value})} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg hover:bg-zinc-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Pickup Point'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Manage Pickup Points</h2>
        <button onClick={() => { setCurrentPickup({}); setIsEditing(true); }} className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Pickup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickups.map(pickup => (
          <div key={pickup._id} className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 bg-zinc-100 relative">
              {pickup.image ? (
                <img src={pickup.image} alt={pickup.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100">No Image</div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3 text-amber-500" />
                {pickup.type}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg leading-tight">{pickup.name}</h3>
              <p className="text-sm text-zinc-500 mb-4 mt-1">{pickup.city}</p>
              
              <div className="flex gap-2">
                <button onClick={() => { setCurrentPickup(pickup); setIsEditing(true); }} className="flex-1 px-3 py-2 bg-zinc-100 text-zinc-700 rounded hover:bg-zinc-200 text-sm font-medium flex justify-center items-center gap-2">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => openDeleteModal(pickup)} className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Pickup Point"
        message={`Are you sure you want to delete ${pickupToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
