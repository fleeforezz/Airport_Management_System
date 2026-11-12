import React, { useState } from 'react';

interface SourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export const SourceEditor: React.FC<SourceEditorProps> = ({
  value,
  onChange,
  label = 'TELEMETRY SOURCE DIRECTIVE / MARKDOWN EDITOR',
  placeholder = 'Input structured directive text or standard markdown...',
  rows = 10,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex items-center justify-between pb-1">
        <label className="font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-[#9CA3AF]">
            {wordCount} WORDS // {charCount} CHARACTERS
          </span>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-2 py-0.5 border border-[#E5E7EB] font-mono text-[9px] font-bold uppercase text-black hover:bg-[#F5F5F5] transition-none"
          >
            {isPreview ? 'EDIT SOURCE' : 'LIVE PREVIEW'}
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="min-h-[200px] p-4 bg-white border border-black font-sans text-xs leading-relaxed whitespace-pre-wrap text-black">
          {value || <span className="text-[#9CA3AF] font-mono">[ Empty Directive Content ]</span>}
        </div>
      ) : (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black leading-relaxed focus:outline-none resize-y"
        />
      )}
    </div>
  );
};

export default SourceEditor;
