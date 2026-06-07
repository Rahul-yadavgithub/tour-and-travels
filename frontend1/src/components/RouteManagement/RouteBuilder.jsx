import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Save, Route as RouteIcon } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import ConfirmModal from '../shared/ConfirmModal';

export default function RouteBuilder() {
  const [templates, setTemplates] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesData, pickupsData] = await Promise.all([
        fetchWithAuth('/route-management/templates'),
        fetchWithAuth('/route-management/pickups')
      ]);
      setTemplates(templatesData);
      setPickups(pickupsData);
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
      formData.append('name', currentTemplate.name || '');
      formData.append('distance', currentTemplate.distance || '');
      formData.append('estimatedTime', currentTemplate.estimatedTime || '');
      formData.append('pickupPointId', currentTemplate.pickupPointId || '');
      formData.append('dropPointId', currentTemplate.dropPointId || '');

      // Create a clean stops array without the file objects
      const cleanStops = (currentTemplate.stops || []).map(stop => ({
        title: stop.title,
        description: stop.description,
        order: stop.order,
        // Preserve existing image URL if there's no new file
        ...(stop.image && !stop.file && { image: stop.image }),
        ...(stop.cloudinaryPublicId && !stop.file && { cloudinaryPublicId: stop.cloudinaryPublicId })
      }));

      formData.append('stops', JSON.stringify(cleanStops));

      // Append image files dynamically
      (currentTemplate.stops || []).forEach((stop, idx) => {
        if (stop.file) {
          formData.append(`stopImage_${idx}`, stop.file);
        }
      });

      if (currentTemplate._id) {
        await fetchWithAuth(`/route-management/templates/${currentTemplate._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        await fetchWithAuth(`/route-management/templates`, {
          method: 'POST',
          body: formData
        });
      }
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save route template');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (template) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;
    setIsDeleting(true);
    try {
      await fetchWithAuth(`/route-management/templates/${templateToDelete._id}`, { method: 'DELETE' });
      fetchData();
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const addStop = () => {
    const newStop = { title: '', description: '', image: '', order: (currentTemplate.stops || []).length };
    setCurrentTemplate({
      ...currentTemplate,
      stops: [...(currentTemplate.stops || []), newStop]
    });
  };

  const updateStop = (idx, field, value) => {
    const newStops = [...currentTemplate.stops];
    newStops[idx][field] = value;
    setCurrentTemplate({ ...currentTemplate, stops: newStops });
  };

  const removeStop = (idx) => {
    const newStops = [...currentTemplate.stops];
    newStops.splice(idx, 1);
    // Fix orders
    newStops.forEach((stop, i) => stop.order = i);
    setCurrentTemplate({ ...currentTemplate, stops: newStops });
  };

  const moveStop = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === currentTemplate.stops.length - 1) return;
    
    const newStops = [...currentTemplate.stops];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    
    const temp = newStops[idx];
    newStops[idx] = newStops[swapIdx];
    newStops[swapIdx] = temp;
    
    newStops.forEach((stop, i) => stop.order = i);
    setCurrentTemplate({ ...currentTemplate, stops: newStops });
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>;

  if (isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{currentTemplate._id ? 'Edit' : 'Create'} Route Template</h2>
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg hover:bg-zinc-50">Back to List</button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Template Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Route Name (e.g., Varanasi Junction → Kashi Vishwanath)</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={currentTemplate.name || ''} onChange={e => setCurrentTemplate({...currentTemplate, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Distance</label>
                  <input required type="text" className="w-full border rounded-lg p-2" placeholder="e.g., 28 km" value={currentTemplate.distance || ''} onChange={e => setCurrentTemplate({...currentTemplate, distance: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Est. Travel Time</label>
                  <input required type="text" className="w-full border rounded-lg p-2" placeholder="e.g., 50 mins" value={currentTemplate.estimatedTime || ''} onChange={e => setCurrentTemplate({...currentTemplate, estimatedTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Starting Pickup Point</label>
                <select required className="w-full border rounded-lg p-2" value={currentTemplate.pickupPointId || ''} onChange={e => setCurrentTemplate({...currentTemplate, pickupPointId: e.target.value})}>
                  <option value="">Select Pickup Point...</option>
                  {pickups.map(p => <option key={p._id} value={p._id}>{p.name} ({p.city})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Final Drop Point</label>
                <select required className="w-full border rounded-lg p-2" value={currentTemplate.dropPointId || ''} onChange={e => setCurrentTemplate({...currentTemplate, dropPointId: e.target.value})}>
                  <option value="">Select Drop Point...</option>
                  {pickups.map(p => <option key={p._id} value={p._id}>{p.name} ({p.city})</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Journey Stops (Route Timeline)</h3>
              <button type="button" onClick={addStop} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700">
                <Plus className="w-4 h-4" /> Add Stop
              </button>
            </div>

            <div className="space-y-4">
              {(currentTemplate.stops || []).map((stop, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                  <div className="flex flex-col gap-1 pt-2">
                    <button type="button" onClick={() => moveStop(idx, 'up')} disabled={idx === 0} className="p-1 text-zinc-400 hover:text-amber-500 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                    <button type="button" onClick={() => moveStop(idx, 'down')} disabled={idx === currentTemplate.stops.length - 1} className="p-1 text-zinc-400 hover:text-amber-500 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Stop Title</label>
                      <input required type="text" placeholder="e.g., Hotel Check-in" className="w-full border border-zinc-300 rounded-lg p-2 font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={stop.title} onChange={e => updateStop(idx, 'title', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                        <textarea placeholder="Write a short description..." className="w-full border border-zinc-300 rounded-lg p-2 text-sm h-16 resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={stop.description} onChange={e => updateStop(idx, 'description', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Image Upload (Cloudinary)</label>
                        <input type="file" accept="image/*" className="w-full border border-zinc-300 rounded-lg p-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" onChange={e => updateStop(idx, 'file', e.target.files[0])} />
                        {stop.image && !stop.file && (
                          <div className="mt-1 text-xs text-zinc-500">
                            Current image: <a href={stop.image} target="_blank" rel="noreferrer" className="text-amber-500 underline">View</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button type="button" onClick={() => removeStop(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {(!currentTemplate.stops || currentTemplate.stops.length === 0) && (
                <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-300 rounded-lg">
                  No stops added yet. Click "Add Stop" to build your route timeline.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" disabled={saving} className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-bold flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Route Template'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Route Templates</h2>
        <button onClick={() => { setCurrentTemplate({ stops: [] }); setIsEditing(true); }} className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Create Route Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div key={template._id} className="border border-zinc-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-900">{template.name}</h3>
                <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                  <span>{template.distance}</span>
                  <span>•</span>
                  <span>{template.estimatedTime}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCurrentTemplate(template); setIsEditing(true); }} className="p-2 text-zinc-400 hover:text-amber-500 bg-zinc-50 hover:bg-amber-50 rounded-lg">
                  <RouteIcon className="w-4 h-4" />
                </button>
                <button onClick={() => openDeleteModal(template)} className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-50 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-zinc-50 rounded-lg p-4">
              <div className="text-sm font-medium text-zinc-700 mb-2">Route Flow:</div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 overflow-x-auto pb-2 whitespace-nowrap">
                <span className="font-semibold text-amber-600">{template.pickupPointId?.name}</span>
                {template.stops?.map((stop, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="text-zinc-300">→</span>
                    <span>{stop.title}</span>
                  </span>
                ))}
                <span className="text-zinc-300">→</span>
                <span className="font-semibold text-amber-600">{template.dropPointId?.name}</span>
              </div>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No route templates created yet.
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Route Template"
        message={`Are you sure you want to delete ${templateToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
