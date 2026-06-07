import { useState, useEffect } from 'react';
import { Loader2, Trash2, Mail, Phone, Calendar, Users, IndianRupee } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import ConfirmModal from '../components/shared/ConfirmModal';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fetchWithAuth } = useApi();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const data = await fetchWithAuth('/dashboard/enquiries');
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetchWithAuth(`/dashboard/enquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' }
      });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);
    try {
      await fetchWithAuth(`/dashboard/enquiries/${enquiryToDelete._id}`, { method: 'DELETE' });
      fetchEnquiries();
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete enquiry');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="p-6 md:p-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Customer Enquiries</h1>
        <p className="text-zinc-500 mt-1">Manage leads and booking requests from the website.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Package Request</th>
                <th className="p-4 font-semibold">Travel Info</th>
                <th className="p-4 font-semibold w-40">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 align-top">
                    <p className="font-bold text-zinc-900">{enquiry.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                      <Phone className="w-3 h-3" /> <a href={`tel:${enquiry.mobile}`} className="hover:text-amber-600 hover:underline">{enquiry.mobile}</a>
                    </div>
                    {enquiry.email && (
                      <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                        <Mail className="w-3 h-3" /> <a href={`mailto:${enquiry.email}`} className="hover:text-amber-600 hover:underline">{enquiry.email}</a>
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <p className="font-semibold text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded text-sm mb-2">{enquiry.package || 'General Inquiry'}</p>
                    <p className="text-xs text-zinc-500">Received: {new Date(enquiry.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {enquiry.travelDate || 'Not specified'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Users className="w-3.5 h-3.5 text-zinc-400" /> {enquiry.adults} Adults, {enquiry.children} Children
                      </div>
                      {enquiry.budget && (
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <IndianRupee className="w-3.5 h-3.5 text-zinc-400" /> Budget: {enquiry.budget}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <select
                      value={enquiry.status || 'New'}
                      onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                      className={`text-sm font-semibold border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors ${getStatusColor(enquiry.status || 'New')}`}
                    >
                      <option value="New" className="bg-white text-zinc-900">New</option>
                      <option value="Contacted" className="bg-white text-zinc-900">Contacted</option>
                      <option value="Resolved" className="bg-white text-zinc-900">Resolved</option>
                    </select>
                  </td>
                  <td className="p-4 align-top text-right">
                    <button 
                      onClick={() => {
                        setEnquiryToDelete(enquiry);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-zinc-500">
                    No enquiries received yet. Check back soon!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from ${enquiryToDelete?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
