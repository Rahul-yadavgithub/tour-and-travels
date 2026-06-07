import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = true, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined} />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-premium overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-zinc-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-5 bg-zinc-50 border-t border-zinc-100">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn ${danger ? 'btn-danger' : 'btn-accent'}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
