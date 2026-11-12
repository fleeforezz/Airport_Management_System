import React, { useState } from 'react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'UPLOAD BANNER / AIRCRAFT MEDIA FRAME',
}) => {
  const [urlInput, setUrlInput] = useState(value);

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handlePresetSelect = (presetUrl: string) => {
    setUrlInput(presetUrl);
    onChange(presetUrl);
  };

  const presets = [
    { label: 'Airbus A350', url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Da Nang Hub', url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Tokyo Skyline', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div className="space-y-2 select-none">
      <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
        {label}
      </label>

      {/* Preview Box */}
      <div className="h-40 w-full bg-[#EEEEEE] border border-[#E5E7EB] relative overflow-hidden flex items-center justify-center">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center font-mono text-[10px] text-[#9CA3AF] p-4">
            <span className="material-symbols-outlined text-[28px] block mb-1">
              add_photo_alternate
            </span>
            <span>NO FRAME LOADED [ RECOMMENDED RATIO 1200x800 ]</span>
          </div>
        )}
      </div>

      {/* Input controls */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter media source URL (https://...)"
          className="flex-1 h-9 px-2.5 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs text-black"
        />
        <button
          type="button"
          onClick={handleApplyUrl}
          className="px-3.5 bg-black hover:bg-[#DC2626] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-none"
        >
          APPLY URL
        </button>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 pt-1 font-mono text-[9px]">
        <span className="text-[#9CA3AF]">PRESETS:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePresetSelect(p.url)}
            className="px-1.5 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] text-black hover:border-black transition-none"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
