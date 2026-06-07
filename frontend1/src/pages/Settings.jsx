import { useState, useEffect } from 'react';
import { useProfileApi } from '../api/profile';
import { useUser } from '@clerk/clerk-react';
import { User, Phone, Mail, ExternalLink } from 'lucide-react';

const Settings = () => {
  const { user } = useUser();
  const { getProfile, updateProfile } = useProfileApi();
  
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setFormData({
            name: data.name || user?.fullName || '',
            phone: data.phone || ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const openClerkProfile = () => {
    // Clerk provides a pre-built modal for account management
    const clerkBtn = document.querySelector('.cl-userButtonTrigger');
    if (clerkBtn) clerkBtn.click();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your public profile and account security.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900">Public Profile</h2>
          <p className="text-sm text-zinc-500 mb-6 mt-1">This information will be displayed on your guide profile page.</p>

          {loading ? (
            <div className="py-4 text-zinc-500 text-sm">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2"><User className="w-4 h-4 text-zinc-400"/> Full Name</label>
                <input 
                  type="text" 
                  className="input-field max-w-md" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-400"/> Phone Number</label>
                <input 
                  type="tel" 
                  className="input-field max-w-md" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+91..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-400"/> Email Address (Read-only)</label>
                <input 
                  type="email" 
                  className="input-field max-w-md bg-zinc-100 text-zinc-500" 
                  value={user?.primaryEmailAddress?.emailAddress || ''} 
                  readOnly
                  disabled
                />
                <p className="text-xs text-zinc-500 mt-1">Change your email address via Clerk account settings.</p>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="p-6 bg-zinc-50">
          <h2 className="text-lg font-semibold text-zinc-900">Account Security</h2>
          <p className="text-sm text-zinc-500 mb-4 mt-1">Update your password and secure your account using Clerk.</p>
          
          <button onClick={openClerkProfile} className="btn btn-secondary bg-white">
            Manage Account <ExternalLink className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
