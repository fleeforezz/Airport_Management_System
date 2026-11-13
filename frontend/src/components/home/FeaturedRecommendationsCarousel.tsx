import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tour } from '../../types';
import TourCard from '../tour/TourCard';
import { useLanguage } from '../../context/LanguageContext';

interface FeaturedRecommendationsCarouselProps {
  tours: Tour[];
  onToggleSave?: (tourId: string) => void;
}

type RecommendationCategory = 'ALL' | 'BEACH' | 'HERITAGE' | 'GLOBAL' | 'HOT_DEAL';

export const FeaturedRecommendationsCarousel: React.FC<FeaturedRecommendationsCarouselProps> = ({
  tours,
  onToggleSave,
}) => {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [activeCategory, setActiveCategory] = useState<RecommendationCategory>('ALL');
  const [isAutoScrollActive, setIsAutoScrollActive] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  // Filter recommendations based on smart criteria
  const recommendedTours = useMemo(() => {
    let pool = [...tours];

    // Priority sort: Higher ratings and reviews first
    pool.sort((a, b) => (b.rating * 100 + b.reviewsCount) - (a.rating * 100 + a.reviewsCount));

    if (activeCategory === 'BEACH') {
      const beachCodes = ['PQC', 'CXR', 'DAD', 'VCS', 'UIH', 'DPS'];
      pool = pool.filter((t) => {
        const dest = (t.destinationCode || t.destinationId || '').toUpperCase();
        return beachCodes.some((code) => dest.includes(code) || t.title.toLowerCase().includes('biển') || t.title.toLowerCase().includes('đảo'));
      });
    } else if (activeCategory === 'HERITAGE') {
      const heritageCodes = ['HAN', 'HUI', 'VDO', 'DAD'];
      pool = pool.filter((t) => {
        const dest = (t.destinationCode || t.destinationId || '').toUpperCase();
        return heritageCodes.some((code) => dest.includes(code) || t.title.toLowerCase().includes('di sản') || t.title.toLowerCase().includes('cố đô') || t.title.toLowerCase().includes('văn hiến'));
      });
    } else if (activeCategory === 'GLOBAL') {
      const globalCodes = ['NRT', 'KIX', 'ICN', 'SIN', 'BKK', 'DPS', 'TPE', 'HKG', 'CDG', 'JFK'];
      pool = pool.filter((t) => {
        const dest = (t.destinationCode || t.destinationId || '').toUpperCase();
        return globalCodes.some((code) => dest.includes(code));
      });
    } else if (activeCategory === 'HOT_DEAL') {
      pool = pool.filter((t) => (t.originalPrice && t.originalPrice > t.price) || t.rating >= 4.9);
    }

    // Limit to top 16 curated recommendations per category
    return pool.slice(0, 16);
  }, [tours, activeCategory]);

  // Update scroll telemetry on container scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
      setScrollProgress(progress);

      // Estimate active item index (each item is ~360px + 20px gap)
      const approxItemWidth = 380;
      const index = Math.min(recommendedTours.length, Math.floor(scrollLeft / approxItemWidth) + 1);
      setCurrentIndex(Math.max(1, index));
    }
  };

  // Automated Horizontal Scrolling Timer
  useEffect(() => {
    if (!isAutoScrollActive || isHovered) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      // Scroll step equals one card width + gap (approx 360px on mobile, 380px on desktop)
      const step = clientWidth > 768 ? 380 : 320;

      if (scrollLeft >= maxScroll - 15) {
        // Smoothly loop back to start when reaching the end
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoScrollActive, isHovered, recommendedTours.length]);

  // Manual Previous / Next Scroll
  const scrollStep = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const step = container.clientWidth > 768 ? 380 : 320;
    container.scrollBy({
      left: direction === 'right' ? step : -step,
      behavior: 'smooth',
    });
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="mb-14 select-none">
      {/* 1. Header with Swiss Typography & Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 mb-5 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <span className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-widest">
              {t('home.featuredBadge')}
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase">
              AUTO-ROTATING STREAM
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight leading-tight">
            {t('home.featuredTitle')}
          </h2>

          <p className="font-mono text-xs text-[#4B5563] mt-1 max-w-2xl leading-relaxed">
            {t('home.featuredSubtitle')}
          </p>
        </div>

        {/* View All Button */}
        <Link
          to="/tours"
          className="h-10 px-5 bg-white hover:bg-black hover:text-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-none border-2 border-black flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-end"
        >
          <span>{t('home.viewAllTours')} ({tours.length})</span>
          <span>→</span>
        </Link>
      </div>

      {/* 2. Category Recommendation Chips & Telemetry Bar */}
      <div className="bg-[#F5F5F5] border border-[#E5E7EB] p-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCategory === 'ALL'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.recAll')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('BEACH')}
            className={`px-3 py-1 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCategory === 'BEACH'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.recBeach')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('HERITAGE')}
            className={`px-3 py-1 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCategory === 'HERITAGE'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.recHeritage')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('GLOBAL')}
            className={`px-3 py-1 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCategory === 'GLOBAL'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.recGlobal')}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('HOT_DEAL')}
            className={`px-3 py-1 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCategory === 'HOT_DEAL'
                ? 'bg-[#DC2626] text-white border-[#DC2626]'
                : 'bg-white text-[#DC2626] border-[#E5E7EB] hover:border-[#DC2626]'
            }`}
          >
            ★ {t('home.recHotDeal')}
          </button>
        </div>

        {/* Carousel Telemetry & Interactive Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
          {/* Pause / Play Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAutoScrollActive(!isAutoScrollActive)}
            title={isAutoScrollActive ? 'Pause auto-scroll' : 'Resume auto-scroll'}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E7EB] hover:border-black text-black font-bold uppercase text-[10px]"
          >
            <span
              className={`w-2 h-2 ${
                isAutoScrollActive && !isHovered ? 'bg-[#16A34A] animate-pulse' : 'bg-[#9CA3AF]'
              }`}
            />
            <span>{isAutoScrollActive && !isHovered ? t('home.autoScrollRunning') : t('home.autoScrollPaused')}</span>
          </button>

          {/* Index Counter */}
          <span className="font-bold text-black hidden md:inline-block text-[11px]">
            [ {String(currentIndex).padStart(2, '0')} / {String(recommendedTours.length).padStart(2, '0')} ] {t('home.suggestedCorridor')}
          </span>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollStep('left')}
              className="w-8 h-8 flex items-center justify-center bg-white border border-[#E5E7EB] hover:border-black hover:bg-black hover:text-white text-black font-mono font-bold transition-none"
              title="Previous card"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => scrollStep('right')}
              className="w-8 h-8 flex items-center justify-center bg-white border border-[#E5E7EB] hover:border-black hover:bg-black hover:text-white text-black font-mono font-bold transition-none"
              title="Next card"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Smooth Scroll Container */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUpOrLeave();
        }}
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 cursor-grab active:cursor-grabbing scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {recommendedTours.map((tour, idx) => (
            <div
              key={tour.id}
              className="w-[300px] sm:w-[340px] md:w-[370px] shrink-0 h-full flex flex-col relative"
            >
              {/* Recommendation Callout Pill */}
              <div className="absolute top-2 right-2 z-20 pointer-events-none">
                <span className="px-2 py-0.5 bg-black/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider border border-white/20">
                  {idx === 0
                    ? '★ TOP SUGGESTION'
                    : idx === 1
                    ? '🔥 POPULAR CORRIDOR'
                    : `RECOMMENDED #${idx + 1}`}
                </span>
              </div>

              <TourCard
                tour={tour}
                index={idx}
                onToggleSave={onToggleSave}
              />
            </div>
          ))}
        </div>

        {/* Left / Right overlay indicators on desktop hover */}
        <button
          type="button"
          onClick={() => scrollStep('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-14 bg-black/80 text-white hover:bg-[#DC2626] hidden md:flex items-center justify-center font-mono text-sm font-bold opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 border border-white/20"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => scrollStep('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-14 bg-black/80 text-white hover:bg-[#DC2626] hidden md:flex items-center justify-center font-mono text-sm font-bold opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 border border-white/20"
        >
          ▶
        </button>
      </div>

      {/* 4. Swiss Modernism 2.0 Progress Track Bar */}
      <div className="w-full h-1 bg-[#E5E7EB] mt-1 relative overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${Math.max(12, scrollProgress)}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#4B5563]">
        <span>HÃY DI CHUỘT / CHẠM ĐỂ TẠM DỪNG HOẶC KÉO NGANG</span>
        <span className="font-bold text-black uppercase">
          {recommendedTours.length} HÀNH TRÌNH ĐƯỢC CHỌN LỌC
        </span>
      </div>
    </section>
  );
};

export default FeaturedRecommendationsCarousel;
