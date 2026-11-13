import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center border border-[#E5E7EB] bg-white select-none ${className}`}
      title="Switch Language / Chuyển đổi ngôn ngữ (Tiếng Việt / English)"
    >
      <button
        type="button"
        onClick={() => setLanguage('vi')}
        aria-label="Tiếng Việt"
        className={`px-2 py-1 font-mono text-[10px] font-bold tracking-wider transition-none ${
          language === 'vi'
            ? 'bg-black text-white'
            : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
        }`}
      >
        VI
      </button>
      <span className="w-[1px] h-3 bg-[#E5E7EB]" />
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-label="English"
        className={`px-2 py-1 font-mono text-[10px] font-bold tracking-wider transition-none ${
          language === 'en'
            ? 'bg-black text-white'
            : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
