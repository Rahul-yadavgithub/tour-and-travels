import { useState, useRef, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';

const MultipleImageUploader = ({ onImagesSelect, currentImageUrls = [] }) => {
  const [previews, setPreviews] = useState(currentImageUrls || []);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentImageUrls && currentImageUrls.length > 0 && selectedFiles.length === 0) {
      setPreviews(currentImageUrls);
    } else if (!currentImageUrls || currentImageUrls.length === 0) {
      if (selectedFiles.length === 0) {
        setPreviews([]);
      }
    }
  }, [currentImageUrls]);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    
    // Add to existing new files, or replace old URLs
    const newPreviews = fileArray.map(file => URL.createObjectURL(file));
    
    // If we are appending to existing selection:
    const updatedPreviews = [...previews.filter(p => !currentImageUrls.includes(p)), ...newPreviews];
    const updatedFiles = [...selectedFiles, ...fileArray];
    
    setPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    
    if (onImagesSelect) {
      onImagesSelect(updatedFiles);
    }
  };

  const removeImage = (indexToRemove) => {
    const newPreviews = previews.filter((_, idx) => idx !== indexToRemove);
    setPreviews(newPreviews);
    
    // Only filter selectedFiles if it was a new upload
    if (selectedFiles.length > 0 && indexToRemove < selectedFiles.length) {
      const newFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
      setSelectedFiles(newFiles);
      if (onImagesSelect) onImagesSelect(newFiles);
    }
  };

  const clearAll = () => {
    setPreviews([]);
    setSelectedFiles([]);
    if (onImagesSelect) onImagesSelect([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          w-full py-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
          ${isDragging ? 'border-accent bg-accent/5' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100/50'}
        `}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-500">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-700">Click to upload or drag and drop multiple images</p>
          <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB per file)</p>
          {currentImageUrls?.length > 0 && selectedFiles.length === 0 && (
            <p className="text-xs text-amber-600 mt-2 font-medium bg-amber-50 px-3 py-1 rounded inline-block">Uploading new images will replace existing ones.</p>
          )}
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 group bg-zinc-50 flex items-center justify-center">
              <img 
                src={preview} 
                alt={`Preview ${index}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="bg-white text-zinc-900 p-2 rounded-full flex items-center gap-2 hover:bg-zinc-100 transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {previews.length > 0 && selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={clearAll} className="text-xs text-danger font-medium hover:underline">
            Clear all selected images
          </button>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default MultipleImageUploader;
