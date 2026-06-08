import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Star, Clock, Calendar, Shield, Info, Image as ImageIcon, 
  Map, MessageCircle, Navigation, Sun, CloudRain, Snowflake, CheckCircle2, ChevronDown, ChevronUp, Save, ArrowLeft, Loader2, Plus, Trash2, UploadCloud
} from 'lucide-react';
import { useApi } from '../hooks/useApi';

export default function PackageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchWithAuth } = useApi();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchWithAuth(`/packages/${id}`)
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching package details", err);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetchWithAuth(`/packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to update package');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('images', files[i]);
      }

      const res = await fetchWithAuth(`/packages/${id}/images`, {
        method: 'POST',
        body: uploadData
      });
      
      if (res && res.package && res.package.imageUrls) {
        setFormData(prev => ({ ...prev, imageUrls: res.package.imageUrls }));
      } else {
        const updated = await fetchWithAuth(`/packages/${id}`);
        setFormData(updated);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload images.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleHeroUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('images', files[0]); // Only the first file

      const res = await fetchWithAuth(`/packages/${id}/images`, {
        method: 'POST',
        body: uploadData
      });
      
      if (res && res.package && res.package.imageUrls) {
        // The newly added image is at the end of res.package.imageUrls
        const newUrls = [...res.package.imageUrls];
        const uploadedUrl = newUrls.pop(); // remove from end
        newUrls.unshift(uploadedUrl); // put at beginning
        setFormData(prev => ({ ...prev, imageUrls: newUrls }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload hero image.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleDeleteImage = async (index) => {
    try {
      if (!window.confirm("Are you sure you want to permanently delete this image?")) return;
      
      // Optimistic UI update
      const newUrls = [...formData.imageUrls];
      newUrls.splice(index, 1);
      updateField('imageUrls', newUrls);
      
      await fetchWithAuth(`/packages/${id}/images/${index}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Failed to delete image", error);
      alert("Failed to delete image from server.");
    }
  };

  if (loading) {
    return <div className="bg-zinc-50 min-h-screen flex items-center justify-center text-zinc-900 font-serif text-2xl">Loading WYSIWYG Editor...</div>;
  }

  if (!formData) return <div>Package Not Found</div>;

  const ai = formData.aiContent || {};

  return (
    <div className="bg-[#fcfaf5] text-[#3e342d] pb-20 font-sans min-h-screen relative">
      
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-medium border border-emerald-400"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <div>
              <p className="font-bold text-sm">Content Updated Successfully!</p>
              <p className="text-emerald-100 text-xs">The live website has been updated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Toolbar (Sticky Top) */}
      <div className="sticky top-0 z-[100] bg-white border-b border-zinc-200 px-6 py-4 shadow-sm flex justify-between items-center">
        <button onClick={() => navigate('/packages')} className="flex items-center gap-2 text-zinc-600 hover:text-black font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Packages
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:block">LIVE EDIT MODE</span>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-black hover:bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      <div style={{ zoom: window.innerWidth > 768 ? 0.6 : 0.8 }} className="origin-top transition-all">
        {/* 1. Hero Section */}
        <div className="px-4 md:px-8 mt-8">
          <label className="relative w-full h-[400px] md:h-[650px] rounded-[32px] overflow-hidden shadow-2xl mx-auto bg-black group border-4 border-dashed border-zinc-500/50 hover:border-[#fca311] transition-colors cursor-pointer block">
            <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} disabled={isUploading} />
            <div className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white text-xs font-bold flex items-center gap-2 border border-white/20 hover:bg-black/80 transition-colors cursor-pointer">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {isUploading ? 'Uploading Hero...' : 'Click to Upload Hero Image'}
            </div>

            <img 
              src={formData.imageUrls?.[0] || 'https://images.unsplash.com/photo-1590050752117-238cb123e42b'} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10"></div>
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16" onClick={(e) => e.preventDefault()}>
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="text-[#fca311] font-sans text-xs md:text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 
                  <input 
                    type="text" 
                    value={formData.tag || ''} 
                    onChange={(e) => updateField('tag', e.target.value)}
                    placeholder="Tag (e.g., Sacred Tour)"
                    className="bg-black/50 border-b border-white/30 text-[#fca311] px-2 py-1 outline-none w-48 md:w-64 placeholder-[#fca311]/50 focus:border-[#fca311] cursor-text"
                  />
                </div>
                
                <div className="text-white font-sans text-xs md:text-sm font-medium tracking-[0.1em] uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/80" /> 
                  <input 
                    type="text" 
                    value={formData.location || ''} 
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Location (e.g., Varanasi)"
                    className="bg-black/50 border-b border-white/30 text-white px-2 py-1 outline-none w-40 md:w-56 placeholder-white/50 focus:border-white cursor-text"
                  />
                </div>
              </div>
            
            <input 
              type="text"
              value={ai.heroSection?.title || formData.title || ''}
              onChange={(e) => {
                updateField('aiContent.heroSection.title', e.target.value);
                updateField('title', e.target.value);
              }}
              placeholder="Hero Title"
              className="bg-black/20 border border-white/20 hover:bg-black/40 focus:bg-black/60 focus:border-[#fca311] text-white font-serif text-3xl md:text-6xl font-medium drop-shadow-2xl leading-tight mb-2 max-w-5xl w-full px-4 py-2 rounded-xl outline-none transition-all"
            />
            
            <input 
              type="text"
              value={ai.heroSection?.subtitle || ai.heroSection?.tagline || ''}
              onChange={(e) => updateField('aiContent.heroSection.subtitle', e.target.value)}
              placeholder="Hero Subtitle"
              className="bg-black/20 border border-white/20 hover:bg-black/40 focus:bg-black/60 focus:border-[#fca311] text-white/80 text-lg md:text-2xl font-light italic mb-6 w-full max-w-3xl px-4 py-2 rounded-xl outline-none transition-all mt-4"
            />
          </div>
          </label>
      </div>

      {/* 2. Main Content Layout */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (Content) */}
        <div className="lg:col-span-8">
          
          {/* At A Glance Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white p-4 rounded-2xl border border-zinc-300 shadow-sm flex flex-col items-center text-center group hover:border-[#fca311] transition-colors focus-within:border-[#fca311]">
              <Star className="w-6 h-6 text-[#fca311] mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-bold">Google Rating</span>
              <input 
                type="text" 
                value={ai.ratings?.googleRating || ''} 
                onChange={(e) => updateField('aiContent.ratings.googleRating', e.target.value)}
                className="w-full text-center font-bold text-[#3e342d] bg-zinc-50 border border-zinc-200 rounded px-2 py-1 outline-none focus:border-[#fca311]" 
                placeholder="4.8"
              />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-300 shadow-sm flex flex-col items-center text-center group hover:border-[#fca311] transition-colors focus-within:border-[#fca311]">
              <MapPin className="w-6 h-6 text-[#e5b158] mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-bold">Location</span>
              <input 
                type="text" 
                value={ai.location?.city || formData.location || ''} 
                onChange={(e) => {
                  updateField('aiContent.location.city', e.target.value);
                  updateField('location', e.target.value);
                }}
                className="w-full text-center font-bold text-[#3e342d] text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1 outline-none focus:border-[#fca311]" 
                placeholder="City"
              />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-300 shadow-sm flex flex-col items-center text-center group hover:border-[#fca311] transition-colors focus-within:border-[#fca311]">
              <Clock className="w-6 h-6 text-amber-600 mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-bold">Duration</span>
              <input 
                type="text" 
                value={ai.visitInfo?.idealVisitDuration || formData.duration || ''} 
                onChange={(e) => {
                  updateField('aiContent.visitInfo.idealVisitDuration', e.target.value);
                  updateField('duration', e.target.value);
                }}
                className="w-full text-center font-bold text-[#3e342d] text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1 outline-none focus:border-[#fca311]" 
                placeholder="Duration"
              />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-zinc-300 shadow-sm flex flex-col items-center text-center group hover:border-[#fca311] transition-colors focus-within:border-[#fca311]">
              <Calendar className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-bold">Best Time</span>
              <input 
                type="text" 
                value={ai.visitInfo?.bestTimeToVisit || ''} 
                onChange={(e) => updateField('aiContent.visitInfo.bestTimeToVisit', e.target.value)}
                className="w-full text-center font-bold text-[#3e342d] text-sm bg-zinc-50 border border-zinc-200 rounded px-2 py-1 outline-none focus:border-[#fca311]" 
                placeholder="Season"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide border-b border-zinc-300">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'history', label: 'History & Culture', icon: Map },
              { id: 'guide', label: 'Travel Guide', icon: Navigation },
              { id: 'nearby', label: 'Nearby Places', icon: MapPin },
              { id: 'faqs', label: 'FAQs', icon: MessageCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-[#fca311] text-[#fca311] bg-white border-t border-l border-r' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-white'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-300 shadow-lg min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-[#3e342d] mb-4">About the Destination</h3>
                  <textarea 
                    value={ai.overview?.detailedDescription || ai.overview?.shortDescription || formData.overview || ''}
                    onChange={(e) => {
                      updateField('aiContent.overview.detailedDescription', e.target.value);
                      updateField('overview', e.target.value);
                    }}
                    className="w-full min-h-[150px] bg-zinc-50 border border-zinc-300 rounded-xl p-4 text-[#3e342d]/80 leading-relaxed mb-6 outline-none focus:border-[#fca311] focus:bg-white transition-colors shadow-inner"
                    placeholder="Write a detailed overview..."
                  />
                  
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-6 shadow-inner">
                    <h4 className="font-serif text-xl text-amber-900 mb-2 flex items-center gap-2">Spiritual Atmosphere</h4>
                    <textarea 
                      value={ai.overview?.spiritualAtmosphere || ''}
                      onChange={(e) => updateField('aiContent.overview.spiritualAtmosphere', e.target.value)}
                      className="w-full min-h-[100px] bg-white/70 border border-amber-300 rounded-lg p-3 text-amber-900/80 leading-relaxed outline-none focus:border-amber-500 focus:bg-white"
                      placeholder="Describe the spiritual atmosphere..."
                    />
                  </div>

                  <h4 className="font-serif text-xl text-[#3e342d] mb-4 mt-8 flex justify-between items-center">
                    Top Experiences
                    <button onClick={() => {
                      const exps = ai.topExperiences || [];
                      updateField('aiContent.topExperiences', [...exps, { title: 'New Experience', description: 'Description here' }]);
                    }} className="text-sm bg-zinc-800 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors font-sans">+ Add Experience</button>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(ai.topExperiences || []).map((exp, idx) => (
                      <div key={idx} className="border border-zinc-300 p-4 rounded-xl flex gap-3 items-start relative group bg-zinc-50 hover:border-[#fca311] transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="w-full">
                          <input 
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const arr = [...ai.topExperiences];
                              arr[idx].title = e.target.value;
                              updateField('aiContent.topExperiences', arr);
                            }}
                            className="block w-full font-bold text-[#3e342d] text-sm mb-2 bg-white border border-zinc-300 px-3 py-2 rounded outline-none focus:border-[#fca311] shadow-sm"
                          />
                          <textarea 
                            value={exp.description}
                            onChange={(e) => {
                              const arr = [...ai.topExperiences];
                              arr[idx].description = e.target.value;
                              updateField('aiContent.topExperiences', arr);
                            }}
                            className="w-full text-xs text-zinc-600 bg-white border border-zinc-300 px-3 py-2 rounded min-h-[60px] outline-none focus:border-[#fca311] shadow-sm"
                          />
                        </div>
                        <button onClick={() => {
                          const arr = [...ai.topExperiences];
                          arr.splice(idx, 1);
                          updateField('aiContent.topExperiences', arr);
                        }} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-lg shadow-md border border-red-100 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* HISTORY TAB */}
              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-[#3e342d] mb-2">Historical Background</h3>
                  <textarea 
                    value={ai.history?.historicalBackground || ''}
                    onChange={(e) => updateField('aiContent.history.historicalBackground', e.target.value)}
                    className="w-full min-h-[150px] bg-zinc-50 border border-zinc-300 rounded-xl p-4 text-[#3e342d]/80 leading-relaxed mb-8 outline-none focus:border-[#fca311] focus:bg-white shadow-inner"
                  />
                  
                  <h3 className="text-2xl font-serif text-[#3e342d] mb-2">Architecture</h3>
                  <textarea 
                    value={ai.history?.architecture || ''}
                    onChange={(e) => updateField('aiContent.history.architecture', e.target.value)}
                    className="w-full min-h-[120px] bg-zinc-50 border border-zinc-300 rounded-xl p-4 text-[#3e342d]/80 leading-relaxed mb-8 outline-none focus:border-[#fca311] focus:bg-white shadow-inner"
                  />
                  
                  <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-300 shadow-inner">
                    <h4 className="font-serif text-xl text-zinc-900 mb-2">Origin</h4>
                    <textarea 
                      value={ai.history?.origin || ''}
                      onChange={(e) => updateField('aiContent.history.origin', e.target.value)}
                      className="w-full min-h-[100px] bg-white border border-zinc-300 rounded-xl p-4 text-zinc-700 leading-relaxed outline-none focus:border-zinc-400 focus:border-[#fca311]"
                    />
                  </div>
                </motion.div>
              )}

              {/* GUIDE TAB */}
              {activeTab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-serif text-[#3e342d] mb-4 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-[#fca311]" /> How to Reach
                      </h3>
                      <div className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-300 shadow-inner">
                        <div className="flex gap-2 items-start"><strong className="text-sm mt-2 w-16">By Air:</strong> 
                          <textarea value={ai.travelGuide?.howToReach?.byAir || ''} onChange={(e) => updateField('aiContent.travelGuide.howToReach.byAir', e.target.value)} className="flex-1 p-2 text-sm border border-zinc-300 rounded bg-white focus:border-[#fca311] outline-none min-h-[60px]" />
                        </div>
                        <div className="flex gap-2 items-start"><strong className="text-sm mt-2 w-16">By Train:</strong> 
                          <textarea value={ai.travelGuide?.howToReach?.byTrain || ''} onChange={(e) => updateField('aiContent.travelGuide.howToReach.byTrain', e.target.value)} className="flex-1 p-2 text-sm border border-zinc-300 rounded bg-white focus:border-[#fca311] outline-none min-h-[60px]" />
                        </div>
                        <div className="flex gap-2 items-start"><strong className="text-sm mt-2 w-16">By Road:</strong> 
                          <textarea value={ai.travelGuide?.howToReach?.byRoad || ''} onChange={(e) => updateField('aiContent.travelGuide.howToReach.byRoad', e.target.value)} className="flex-1 p-2 text-sm border border-zinc-300 rounded bg-white focus:border-[#fca311] outline-none min-h-[60px]" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-serif text-[#3e342d] mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-[#fca311]" /> Essential Info
                      </h3>
                      <div className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-300 shadow-inner">
                        <div className="flex gap-2 items-center"><strong className="text-sm w-24">Dress Code:</strong> 
                          <input type="text" value={ai.visitInfo?.dressCode || ''} onChange={(e) => updateField('aiContent.visitInfo.dressCode', e.target.value)} className="flex-1 p-2 text-sm border border-zinc-300 rounded bg-white focus:border-[#fca311] outline-none" />
                        </div>
                        <div className="flex gap-2 items-center"><strong className="text-sm w-24">Timings:</strong> 
                          <input type="text" value={ai.visitInfo?.openingHours || ''} onChange={(e) => updateField('aiContent.visitInfo.openingHours', e.target.value)} className="flex-1 p-2 text-sm border border-zinc-300 rounded bg-white focus:border-[#fca311] outline-none" />
                        </div>
                        <div className="flex gap-2 items-center"><strong className="text-sm w-24">Photos:</strong> 
                          <input type="text" value={ai.visitInfo?.photographyAllowed || ''} onChange={(e) => updateField('aiContent.visitInfo.photographyAllowed', e.target.value)} className="flex-1 p-2 text-sm border border-zinc-300 rounded bg-white focus:border-[#fca311] outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif text-[#3e342d] mt-8 mb-4">Weather Guide</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-orange-50 p-4 rounded-xl flex sm:flex-col items-start sm:items-center sm:justify-center sm:text-center text-left gap-4 sm:gap-0 border border-orange-200 shadow-sm">
                      <div className="bg-orange-200/50 p-3 rounded-full sm:bg-transparent sm:p-0 sm:mb-2 flex-shrink-0">
                        <Sun className="w-6 h-6 sm:w-5 sm:h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 w-full">
                        <span className="text-sm sm:text-xs font-bold text-orange-900 block mb-1 sm:mb-2 uppercase tracking-wider">Summer</span>
                        <textarea value={ai.weatherGuide?.summer || ''} onChange={(e) => updateField('aiContent.weatherGuide.summer', e.target.value)} className="w-full text-xs p-2 rounded border border-orange-300 focus:border-orange-500 outline-none min-h-[80px]" placeholder="Summer weather..." />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl flex sm:flex-col items-start sm:items-center sm:justify-center sm:text-center text-left gap-4 sm:gap-0 border border-blue-200 shadow-sm">
                      <div className="bg-blue-200/50 p-3 rounded-full sm:bg-transparent sm:p-0 sm:mb-2 flex-shrink-0">
                        <CloudRain className="w-6 h-6 sm:w-5 sm:h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 w-full">
                        <span className="text-sm sm:text-xs font-bold text-blue-900 block mb-1 sm:mb-2 uppercase tracking-wider">Monsoon</span>
                        <textarea value={ai.weatherGuide?.monsoon || ''} onChange={(e) => updateField('aiContent.weatherGuide.monsoon', e.target.value)} className="w-full text-xs p-2 rounded border border-blue-300 focus:border-blue-500 outline-none min-h-[80px]" placeholder="Monsoon weather..." />
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl flex sm:flex-col items-start sm:items-center sm:justify-center sm:text-center text-left gap-4 sm:gap-0 border border-slate-200 shadow-sm">
                      <div className="bg-slate-200 p-3 rounded-full sm:bg-transparent sm:p-0 sm:mb-2 flex-shrink-0">
                        <Snowflake className="w-6 h-6 sm:w-5 sm:h-5 text-slate-500" />
                      </div>
                      <div className="flex-1 w-full">
                        <span className="text-sm sm:text-xs font-bold text-slate-900 block mb-1 sm:mb-2 uppercase tracking-wider">Winter</span>
                        <textarea value={ai.weatherGuide?.winter || ''} onChange={(e) => updateField('aiContent.weatherGuide.winter', e.target.value)} className="w-full text-xs p-2 rounded border border-slate-300 focus:border-slate-500 outline-none min-h-[80px]" placeholder="Winter weather..." />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* NEARBY TAB */}
              {activeTab === 'nearby' && (
                <motion.div key="nearby" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-[#3e342d] mb-6 flex justify-between items-center">
                    Nearby Attractions
                    <button onClick={() => {
                      const arr = ai.nearbyAttractions || [];
                      updateField('aiContent.nearbyAttractions', [...arr, { name: 'New Place', distance: '1 km', description: 'Desc' }]);
                    }} className="text-sm bg-zinc-800 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors font-sans shadow-md">+ Add Place</button>
                  </h3>
                  
                  <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-lg border border-zinc-700">
                    <div className="flex items-center gap-4">
                      <div className="bg-zinc-800 p-3 rounded-full shadow-inner border border-zinc-700">
                        <MapPin className="text-[#fca311] w-6 h-6 flex-shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-white mb-0.5">Map Coordinates</h4>
                        <p className="text-xs text-zinc-400">Used for interactive map pins</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <div className="flex-1 sm:flex-none">
                        <span className="text-xs font-bold block mb-1.5 text-zinc-400 uppercase tracking-wider">Latitude</span> 
                        <input type="number" step="0.0001" value={ai.location?.coordinates?.lat || ''} onChange={(e) => updateField('aiContent.location.coordinates.lat', parseFloat(e.target.value))} className="w-full sm:w-32 bg-black/50 border border-zinc-600 p-2.5 rounded-lg text-sm outline-none focus:border-[#fca311] transition-colors shadow-inner" placeholder="e.g. 25.31" />
                      </div>
                      <div className="flex-1 sm:flex-none">
                        <span className="text-xs font-bold block mb-1.5 text-zinc-400 uppercase tracking-wider">Longitude</span> 
                        <input type="number" step="0.0001" value={ai.location?.coordinates?.lng || ''} onChange={(e) => updateField('aiContent.location.coordinates.lng', parseFloat(e.target.value))} className="w-full sm:w-32 bg-black/50 border border-zinc-600 p-2.5 rounded-lg text-sm outline-none focus:border-[#fca311] transition-colors shadow-inner" placeholder="e.g. 82.97" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(ai.nearbyAttractions || []).map((place, idx) => (
                      <div key={idx} className="border border-zinc-300 p-5 rounded-2xl bg-zinc-50 relative group hover:border-[#fca311] transition-colors shadow-sm focus-within:border-[#fca311]">
                        <button onClick={() => {
                          const arr = [...ai.nearbyAttractions];
                          arr.splice(idx, 1);
                          updateField('aiContent.nearbyAttractions', arr);
                        }} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-lg shadow-md border border-red-100 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        
                        <input type="text" value={place.name} onChange={(e) => {
                          const arr = [...ai.nearbyAttractions]; arr[idx].name = e.target.value; updateField('aiContent.nearbyAttractions', arr);
                        }} className="font-serif text-lg text-[#3e342d] w-full mb-2 bg-white border border-zinc-300 p-2 rounded outline-none focus:border-[#fca311]" placeholder="Place Name" />
                        
                        <input type="text" value={place.distance || ''} onChange={(e) => {
                          const arr = [...ai.nearbyAttractions]; arr[idx].distance = e.target.value; updateField('aiContent.nearbyAttractions', arr);
                        }} className="text-xs font-bold text-[#fca311] w-full mb-3 bg-white border border-zinc-300 p-2 rounded outline-none focus:border-[#fca311]" placeholder="Distance (e.g. 2 km)" />
                        
                        <textarea value={place.description} onChange={(e) => {
                          const arr = [...ai.nearbyAttractions]; arr[idx].description = e.target.value; updateField('aiContent.nearbyAttractions', arr);
                        }} className="text-sm text-zinc-600 w-full min-h-[80px] bg-white border border-zinc-300 p-2 rounded outline-none focus:border-[#fca311]" placeholder="Description" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <motion.div key="faqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="text-2xl font-serif text-[#3e342d] mb-6 flex justify-between items-center">
                    Frequently Asked Questions
                    <button onClick={() => {
                      const arr = ai.faqs || [];
                      updateField('aiContent.faqs', [...arr, { question: 'New Question?', answer: 'New Answer' }]);
                    }} className="text-sm bg-zinc-800 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors font-sans shadow-md">+ Add FAQ</button>
                  </h3>
                  <div className="space-y-4">
                    {(ai.faqs || []).map((faq, idx) => (
                      <div key={idx} className="border border-zinc-300 rounded-xl overflow-hidden bg-zinc-50 relative group shadow-sm hover:border-[#fca311] transition-colors focus-within:border-[#fca311]">
                        <button onClick={() => {
                          const arr = [...ai.faqs]; arr.splice(idx, 1); updateField('aiContent.faqs', arr);
                        }} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 p-1.5 bg-white rounded-lg shadow-md border border-red-100 hover:bg-red-50 z-10"><Trash2 className="w-4 h-4" /></button>
                        
                        <div className="p-4 border-b border-zinc-300 bg-zinc-100">
                          <input type="text" value={faq.question} onChange={(e) => {
                            const arr = [...ai.faqs]; arr[idx].question = e.target.value; updateField('aiContent.faqs', arr);
                          }} className="w-[90%] font-medium text-[#3e342d] bg-white border border-zinc-300 p-2.5 rounded outline-none focus:border-[#fca311] shadow-sm" placeholder="Question" />
                        </div>
                        <div className="p-4">
                          <textarea value={faq.answer} onChange={(e) => {
                            const arr = [...ai.faqs]; arr[idx].answer = e.target.value; updateField('aiContent.faqs', arr);
                          }} className="w-full min-h-[100px] bg-white border border-zinc-300 p-3 rounded text-sm text-zinc-600 outline-none focus:border-[#fca311] shadow-sm" placeholder="Answer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
          
          {/* Gallery Preview */}
          <div className="mt-12 bg-white p-8 rounded-3xl border border-zinc-300 shadow-lg">
            <h3 className="text-2xl font-serif text-[#3e342d] mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#fca311]" /> Premium Gallery Images</div>
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <button className="text-sm bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-sans shadow-md flex items-center gap-2">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {isUploading ? 'Uploading...' : 'Upload Photos'}
                </button>
              </div>
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {(formData.imageUrls || []).map((imgUrl, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-300 shadow-sm hover:border-[#fca311] transition-colors focus-within:border-[#fca311]">
                  <img src={imgUrl} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-300 shadow-sm" onError={(e) => e.target.src = 'https://placehold.co/150x150/e2e8f0/64748b?text=Invalid+URL'} />
                  <div className="flex-1">
                    <label className="text-xs font-bold text-zinc-500 mb-1 block uppercase tracking-wider">Image URL {idx + 1}</label>
                    <input type="text" value={imgUrl} readOnly className="w-full border border-zinc-300 p-2.5 rounded bg-zinc-100 font-mono text-sm text-zinc-500" />
                  </div>
                  <button onClick={() => handleDeleteImage(idx)} className="text-red-500 p-3 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 mt-5 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
              
              {(!formData.imageUrls || formData.imageUrls.length === 0) && (
                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center text-zinc-500">
                  No images uploaded yet. Click the "Upload Photos" button above.
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-4 italic">Note: The first image in this list will be used as the massive Header Background at the top.</p>
          </div>

        </div>

        {/* Right Column (Sidebar Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-300 relative overflow-hidden group focus-within:border-[#fca311] transition-colors">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#fca311] to-[#e5b158]"></div>
              <p className="text-zinc-500 text-sm mb-4 uppercase tracking-wider font-bold">Pricing Controls</p>
              
              {/* Current Price */}
              <div className="mb-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Current Price (₹)</label>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl text-[#3e342d]">₹</span>
                  <input 
                    type="number" 
                    value={formData.currentPrice || ''} 
                    onChange={(e) => updateField('currentPrice', e.target.value ? parseInt(e.target.value) : '')}
                    className="flex-1 bg-zinc-50 border border-zinc-300 p-3 rounded-xl focus:border-[#fca311] outline-none text-2xl font-serif shadow-inner transition-colors" 
                    placeholder="e.g. 4999"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 italic">This price is shown to customers as the final price.</p>
              </div>

              {/* Old / Original Price */}
              <div className="mb-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Old Price (₹) <span className="text-zinc-400 font-normal normal-case">— optional</span></label>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl text-zinc-400">₹</span>
                  <input 
                    type="number" 
                    value={formData.oldPrice || ''} 
                    onChange={(e) => updateField('oldPrice', e.target.value ? parseInt(e.target.value) : '')}
                    className="flex-1 bg-zinc-50 border border-zinc-300 p-3 rounded-xl focus:border-[#fca311] outline-none text-2xl font-serif text-zinc-500 shadow-inner transition-colors" 
                    placeholder="e.g. 6999"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 italic">If set higher than current price, a strikethrough discount will appear on the website.</p>
              </div>

              {/* Auto-calculated Discount Display */}
              {formData.oldPrice && formData.currentPrice && formData.oldPrice > formData.currentPrice && (
                <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Auto Discount</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Visible on Home & Detail page</p>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    {Math.round(((formData.oldPrice - formData.currentPrice) / formData.oldPrice) * 100)}% OFF
                  </span>
                </div>
              )}

              {/* Discount Percentage Override */}
              <div className="mb-6">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Discount % <span className="text-zinc-400 font-normal normal-case">— override</span></label>
                <input 
                  type="number" 
                  value={formData.discountPercentage || ''} 
                  onChange={(e) => updateField('discountPercentage', e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full bg-zinc-50 border border-zinc-300 p-3 rounded-xl focus:border-[#fca311] outline-none text-lg font-bold shadow-inner transition-colors" 
                  placeholder="e.g. 20"
                />
                <p className="text-[10px] text-zinc-400 mt-1 italic">Manually set the discount badge %. Leave empty to auto-calculate from old price.</p>
              </div>
              
              <div className="w-full bg-[#fca311] text-white text-center rounded-xl py-4 font-bold text-lg shadow-md block mb-3 cursor-not-allowed opacity-70">
                Book This Tour (Preview)
              </div>
              <div className="w-full bg-white border-2 border-zinc-200 text-zinc-700 text-center rounded-xl py-4 font-bold block cursor-not-allowed opacity-70">
                Call for Details (Preview)
              </div>
            </div>

            <div className={`bg-gradient-to-br ${!!ai.visitInfo?.vipDarshanAvailable ? 'from-amber-500 to-amber-600' : 'from-zinc-500 to-zinc-600'} p-6 rounded-3xl shadow-lg text-white transition-all`}>
              <div className="flex items-center gap-3 mb-4 border-b border-white/20 pb-4">
                <input type="checkbox" id="vipToggle" checked={!!ai.visitInfo?.vipDarshanAvailable} onChange={(e) => updateField('aiContent.visitInfo.vipDarshanAvailable', e.target.checked)} className="w-5 h-5 rounded text-amber-900 focus:ring-amber-900 cursor-pointer" />
                <label htmlFor="vipToggle" className="font-bold cursor-pointer text-lg">VIP Access Active</label>
              </div>
              <h4 className="font-serif text-xl mb-2 flex items-center gap-2 opacity-90">
                <Star className="w-5 h-5 fill-current" /> VIP Access
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Fast-track entry and premium guided services are available for this destination. Contact us to upgrade your package.
              </p>
            </div>
            
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
