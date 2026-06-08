import { useState, useEffect } from 'react';
import { useCarsApi } from '../api/cars';
import MultipleImageUploader from '../components/shared/MultipleImageUploader';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Cars = () => {
  const { getCars, createCar, updateCar, deleteCar } = useCarsApi();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  // Form states
  const [formData, setFormData] = useState({ name: '', seatCapacity: '', luggageCapacity: '', isAC: true, bestSuitedFor: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await getCars();
      setCars(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const openForm = (car = null) => {
    setEditingCar(car);
    if (car) {
      setFormData({
        name: car.name || '',
        seatCapacity: car.seatCapacity || '',
        luggageCapacity: car.luggageCapacity || '',
        isAC: car.isAC ?? true,
        bestSuitedFor: car.bestSuitedFor || ''
      });
    } else {
      setFormData({ name: '', seatCapacity: '', luggageCapacity: '', isAC: true, bestSuitedFor: '' });
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

      if (editingCar) {
        await updateCar(editingCar._id, data);
      } else {
        await createCar(data);
      }
      
      setIsFormOpen(false);
      fetchCars();
    } catch (error) {
      alert("Failed to save car");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCar(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      fetchCars();
    } catch (error) {
      alert("Failed to delete car");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Car services</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage the vehicles you offer to customers.</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Add car
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Loading cars...</div>
      ) : cars.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 px-4 text-center border-dashed border-2 bg-zinc-50/50">
          <h3 className="text-base font-semibold text-zinc-900 mb-1">No cars yet</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm">Add your first vehicle to start receiving transport bookings.</p>
          <button onClick={() => openForm()} className="btn btn-secondary">
            <Plus className="w-4 h-4 mr-2" /> Add car
          </button>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Vehicle</th>
                  <th className="px-6 py-3 font-medium">Capacity</th>
                  <th className="px-6 py-3 font-medium">AC/Non-AC</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {cars.map((car) => (
                  <tr key={car._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {car.photoUrls && car.photoUrls.length > 0 ? (
                          <img src={car.photoUrls[0]} alt={car.name} className="w-10 h-10 rounded-md object-cover border border-zinc-200" />
                        ) : car.photoUrl ? (
                          <img src={car.photoUrl} alt={car.name} className="w-10 h-10 rounded-md object-cover border border-zinc-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200"><span className="text-[10px]">No Img</span></div>
                        )}
                        <span className="font-medium text-zinc-900">{car.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {car.seatCapacity} seats {car.luggageCapacity && `• ${car.luggageCapacity} bags`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${car.isAC ? 'badge-neutral' : 'bg-zinc-100 text-zinc-600'}`}>
                        {car.isAC ? 'AC' : 'Non-AC'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openForm(car)} className="p-2 text-zinc-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteModal({ isOpen: true, id: car._id })} className="p-2 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
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
              <h3 className="text-lg font-semibold text-zinc-900">{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Car Photos</label>
                <MultipleImageUploader onImagesSelect={setSelectedFiles} currentImageUrls={editingCar?.photoUrls || (editingCar?.photoUrl ? [editingCar.photoUrl] : [])} />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Car Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Toyota Innova Crysta" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Seat Capacity</label>
                  <input required type="number" className="input-field" value={formData.seatCapacity} onChange={e => setFormData({...formData, seatCapacity: e.target.value})} placeholder="e.g. 7" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Luggage Bags (Opt)</label>
                  <input type="number" className="input-field" value={formData.luggageCapacity} onChange={e => setFormData({...formData, luggageCapacity: e.target.value})} placeholder="e.g. 4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">AC Available?</label>
                <select className="input-field" value={formData.isAC} onChange={e => setFormData({...formData, isAC: e.target.value === 'true'})}>
                  <option value="true">Yes, AC</option>
                  <option value="false">No (Non-AC)</option>
                </select>
              </div>



              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
                <button type="button" disabled={isSubmitting} onClick={() => setIsFormOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Saving...' : 'Save Car'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Car"
        message="Are you sure you want to remove this vehicle? This will remove it from the customer site immediately."
      />
    </div>
  );
};

export default Cars;
