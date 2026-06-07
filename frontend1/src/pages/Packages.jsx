import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Package, Edit2, MapPin, Tag, Calendar, IndianRupee, Save, X, UploadCloud, Trash2, Loader2 } from 'lucide-react';

export default function Packages() {
  const { fetchWithAuth } = useApi();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await fetchWithAuth('/packages'); // Matches the updated API routes
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [newFiles, setNewFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleEditClick = (pkg) => {
    setEditingPkg({ ...pkg });
    setNewFiles([]); // Reset files when opening a package
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setNewFiles([...newFiles, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFiles([...newFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveNewFile = (indexToRemove) => {
    setNewFiles(newFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const confirmDelete = (index) => {
    setImageToDelete(index);
  };

  const executeDelete = async () => {
    if (imageToDelete === null) return;
    
    try {
      setIsDeletingImage(true);
      await fetchWithAuth(`/packages/${editingPkg._id}/images/${imageToDelete}`, {
        method: 'DELETE'
      });
      
      setEditingPkg(prev => ({
        ...prev,
        imageUrls: prev.imageUrls.filter((_, idx) => idx !== imageToDelete)
      }));
      
      fetchPackages();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete image from cloud.');
    } finally {
      setIsDeletingImage(false);
      setImageToDelete(null);
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);

      // First update the general details (title, subtitle, etc)
      await fetchWithAuth(`/packages/${editingPkg._id}`, {
        method: 'PUT',
        body: JSON.stringify(editingPkg)
      });
      
      // Update price via dedicated route as per requirement
      await fetchWithAuth(`/packages/${editingPkg._id}/price`, {
        method: 'PATCH',
        body: JSON.stringify({
          currentPrice: editingPkg.currentPrice,
          oldPrice: editingPkg.oldPrice
        })
      });

      // Upload new images to Cloudinary if any were selected
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => formData.append('images', file));
        
        await fetchWithAuth(`/packages/${editingPkg._id}/images`, {
          method: 'POST',
          body: formData
        });
      }

      setEditingPkg(null);
      setNewFiles([]);
      fetchPackages();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to update package');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500">Loading premium package data...</div>;

  return (
    <div className="p-8 w-full space-y-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-serif text-zinc-900 tracking-tight mb-2">Package Management</h1>
          <p className="text-zinc-500 text-sm">Manage dynamic pricing and premium tour content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg._id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img src={pkg.imageUrl || pkg.imageUrls?.[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {pkg.discountPercentage > 0 && (
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {pkg.discountPercentage}% OFF
                </span>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-serif text-xl leading-tight mb-1">{pkg.title}</h3>
                <div className="flex items-center text-zinc-300 text-xs gap-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {pkg.location || 'Varanasi'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pkg.duration}</span>
                </div>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between bg-zinc-50/50">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Dynamic Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-serif text-zinc-900 flex items-center">
                    <IndianRupee className="w-5 h-5" />{pkg.currentPrice}
                  </span>
                  {pkg.oldPrice && (
                    <span className="text-sm text-zinc-400 line-through">₹{pkg.oldPrice}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleEditClick(pkg)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Edit Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-5 border-b border-zinc-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-serif text-zinc-900">Edit Package: {editingPkg.title}</h2>
              <button onClick={() => setEditingPkg(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 rounded-full hover:bg-zinc-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Dynamic Pricing Section */}
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-100/50">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" /> Dynamic Pricing
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">Current Price (₹)</label>
                    <input 
                      type="number" 
                      value={editingPkg.currentPrice} 
                      onChange={(e) => setEditingPkg({...editingPkg, currentPrice: parseInt(e.target.value) || 0})}
                      className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-medium text-amber-900">Old Price (₹)</label>
                      {editingPkg.oldPrice > editingPkg.currentPrice && (
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm">
                          {Math.round(((editingPkg.oldPrice - editingPkg.currentPrice) / editingPkg.oldPrice) * 100)}% OFF PREVIEW
                        </span>
                      )}
                    </div>
                    <input 
                      type="number" 
                      value={editingPkg.oldPrice || ''} 
                      onChange={(e) => setEditingPkg({...editingPkg, oldPrice: parseInt(e.target.value) || null})}
                      className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* General Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Package Title</label>
                  <input 
                    type="text" 
                    value={editingPkg.title} 
                    onChange={(e) => setEditingPkg({...editingPkg, title: e.target.value})}
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Duration</label>
                  <input 
                    type="text" 
                    value={editingPkg.duration} 
                    onChange={(e) => setEditingPkg({...editingPkg, duration: e.target.value})}
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Subtitle/Tag</label>
                  <input 
                    type="text" 
                    value={editingPkg.tag || ''} 
                    onChange={(e) => setEditingPkg({...editingPkg, tag: e.target.value})}
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Overview / Description</label>
                  <textarea 
                    rows={4}
                    value={editingPkg.overview || ''} 
                    onChange={(e) => setEditingPkg({...editingPkg, overview: e.target.value})}
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zinc-900 resize-none"
                  />
                </div>
                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
                    Gallery Images <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Drag & Drop</span>
                  </label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                      ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-zinc-300 hover:border-amber-400 bg-zinc-50'}`}
                  >
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="gallery-upload"
                    />
                    <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center w-full">
                      <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-amber-500' : 'text-zinc-400'}`} />
                      <p className="text-sm font-medium text-zinc-700">
                        Drop images here or <span className="text-amber-600">browse files</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">Supports JPG, PNG, WEBP</p>
                    </label>
                  </div>

                  {/* Existing & New Files Preview */}
                  {(editingPkg.imageUrls?.length > 0 || newFiles.length > 0) && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {editingPkg.imageUrls?.map((url, idx) => (
                        <div key={`existing-${idx}`} className={`relative group rounded-lg overflow-hidden border border-zinc-200 aspect-video ${isDeletingImage && imageToDelete === idx ? 'opacity-50 pointer-events-none' : ''}`}>
                          <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute top-1.5 right-1.5 flex gap-1 items-center">
                            <span className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shadow-sm">
                              Saved
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(idx);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white p-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete from Cloud"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {newFiles.map((file, idx) => (
                        <div key={`new-${idx}`} className="relative group rounded-lg overflow-hidden border-2 border-amber-400 aspect-video">
                          <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute top-1.5 right-1.5 flex gap-1 items-center">
                            <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shadow-sm">
                              New
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveNewFile(idx);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white p-0.5 rounded shadow-sm transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-zinc-500 mt-3">These images will appear in the premium auto-scrolling gallery at the bottom of the package pop-up.</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md px-8 py-4 border-t border-zinc-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setEditingPkg(null)}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isUploading}
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isUploading ? 'Uploading & Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {imageToDelete !== null && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-zinc-200 transform animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-zinc-900 mb-2">Delete Permanently?</h3>
              <p className="text-center text-zinc-500 text-sm mb-6">
                Are you sure you want to delete this image? It will be removed from the cloud and cannot be recovered.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setImageToDelete(null)}
                  disabled={isDeletingImage}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  disabled={isDeletingImage}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDeletingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isDeletingImage ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
