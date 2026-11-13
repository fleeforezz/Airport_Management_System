import React from 'react';
import { Link } from 'react-router-dom';
import { Tour } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useLanguage } from '../../context/LanguageContext';
import LazyImage from '../common/LazyImage';

interface TourCardProps {
  tour: Tour;
  onToggleSave?: (tourId: string) => void;
  index?: number;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  onToggleSave,
  index,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const durationStr = isVi
    ? `${tour.durationDays} Ngày / ${tour.durationNights} Đêm`
    : `${tour.durationDays} Days / ${tour.durationNights} Nights`;

  return (
    <div className="bg-white border border-[#E5E7EB] swiss-card-hover flex flex-col justify-between group select-none">
      {/* Card Header & Media Container */}
      <div className="relative">
        {/* Upper index ribbon */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black text-white px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider">
          <span>{index !== undefined ? `[ ${String(index + 1).padStart(2, '0')} ]` : tour.code}</span>
        </div>

        {/* Airline / Transport badge */}
        {tour.airlineName && (
          <div className="absolute top-2 right-2 z-10 bg-white/95 border border-[#E5E7EB] px-2 py-0.5 font-mono text-[9px] font-bold text-black uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#DC2626] swiss-beacon" />
            <span>{tour.airlineName}</span>
          </div>
        )}

        {/* Image Frame with Swiss Modernism 2.0 Lazy Loading */}
        <LazyImage
          src={tour.featuredImage}
          alt={tour.title}
          className="w-full h-full object-cover swiss-img-scale"
          containerClassName="h-48 overflow-hidden bg-[#EEEEEE] relative"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[#4B5563] font-mono text-[10px] mb-1.5 pb-1 border-b border-[#E5E7EB]">
            <span>{tour.departureCity}</span>
            <span>{durationStr}</span>
          </div>

          {/* Title */}
          <Link
            to={`/tours/${tour.id}`}
            className="font-bold text-sm text-black leading-snug line-clamp-2 hover:text-[#DC2626] swiss-transition-colors mb-2 block"
          >
            {tour.title}
          </Link>

          {/* Subtitle / Description */}
          <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed mb-3">
            {tour.subtitle}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-[#E5E7EB]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-mono text-[10px] text-[#4B5563] uppercase tracking-wider">
              {t('tourCard.totalFare')}
            </div>
            <div className="text-right">
              {tour.originalPrice && (
                <div className="text-[10px] text-[#9CA3AF] line-through font-mono">
                  {formatCurrency(tour.originalPrice)}
                </div>
              )}
              <div className="text-base font-black text-black font-mono">
                {formatCurrency(tour.price)}
              </div>
            </div>
          </div>

          {/* Actions Button Group */}
          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={() => onToggleSave && onToggleSave(tour.id)}
              title={tour.isSaved ? t('tourCard.unsaveTour') : t('tourCard.saveTour')}
              className={`col-span-1 border border-[#E5E7EB] flex items-center justify-center h-8 active:scale-90 swiss-transition ${
                tour.isSaved
                  ? 'bg-black text-[#DC2626] border-black'
                  : 'bg-white text-[#4B5563] hover:text-black hover:border-black'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {tour.isSaved ? 'bookmark_added' : 'bookmark_border'}
              </span>
            </button>
            <Link
              to={`/tours/${tour.id}`}
              className="col-span-4 bg-black hover:bg-[#DC2626] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 h-8 swiss-btn-glide"
            >
              <span>{t('tourCard.viewItinerary')}</span>
              <span className="glide-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
