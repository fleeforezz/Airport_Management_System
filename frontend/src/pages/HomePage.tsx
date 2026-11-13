import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { FeaturedRecommendationsCarousel } from '../components/home/FeaturedRecommendationsCarousel';
import TourCard from '../components/tour/TourCard';
import LazyImage from '../components/common/LazyImage';
import { useTours } from '../hooks/useTours';
import { useLanguage } from '../context/LanguageContext';
import { destinationApi, articleApi, couponApi } from '../services/api';
import { Destination, Article, Coupon, Tour } from '../types';
import { formatCurrency } from '../utils/format';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tours, toggleSaveTour } = useTours();
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Search Form State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDestination, setSearchDestination] = useState('ALL');
  const [searchDuration, setSearchDuration] = useState('ALL');
  const [searchAirline, setSearchAirline] = useState('ALL');

  // Curated Collection Tab State
  const [activeCollectionTab, setActiveCollectionTab] = useState<'ALL' | 'BEACH' | 'HERITAGE' | 'CITY' | 'COMBO'>('ALL');

  useEffect(() => {
    let isMounted = true;
    destinationApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setDestinations(res.data);
      }
    }).catch(() => {});

    articleApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setArticles(res.data);
      }
    }).catch(() => {});

    couponApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setCoupons(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTourSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set('search', searchKeyword.trim());
    if (searchDestination !== 'ALL') params.set('destination', searchDestination);
    if (searchDuration !== 'ALL') params.set('duration', searchDuration);
    if (searchAirline !== 'ALL') params.set('airline', searchAirline);
    navigate(`/tours?${params.toString()}`);
  };

  const handleQuickTagClick = (tag: string) => {
    navigate(`/tours?search=${encodeURIComponent(tag)}`);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Select Spotlight Tour (Premier Promotion of the Week)
  const spotlightTour: Tour | null = useMemo(() => {
    if (!tours || tours.length === 0) return null;
    return tours.find((t) => t.originalPrice && t.originalPrice > t.price) || tours[0];
  }, [tours]);

  // Filtered Collection Tours
  const filteredCollectionTours = useMemo(() => {
    if (!tours || tours.length === 0) return [];
    if (activeCollectionTab === 'ALL') return tours.slice(0, 8);

    if (activeCollectionTab === 'BEACH') {
      const beachKeywords = ['biển', 'beach', 'đà nẵng', 'phú quốc', 'nha trang', 'quy nhơn', 'côn đảo', 'bali'];
      return tours.filter((t) =>
        beachKeywords.some((k) =>
          t.title.toLowerCase().includes(k) ||
          t.subtitle.toLowerCase().includes(k) ||
          t.destinationName.toLowerCase().includes(k)
        )
      ).slice(0, 8);
    }

    if (activeCollectionTab === 'HERITAGE') {
      const heritageKeywords = ['di sản', 'hạ long', 'huế', 'hội an', 'paris', 'heritage', 'tokyo', 'văn hóa'];
      return tours.filter((t) =>
        heritageKeywords.some((k) =>
          t.title.toLowerCase().includes(k) ||
          t.subtitle.toLowerCase().includes(k) ||
          t.destinationName.toLowerCase().includes(k)
        )
      ).slice(0, 8);
    }

    if (activeCollectionTab === 'CITY') {
      const cityKeywords = ['tokyo', 'seoul', 'singapore', 'bangkok', 'hong kong', 'đô thị', 'shopping', 'city'];
      return tours.filter((t) =>
        cityKeywords.some((k) =>
          t.title.toLowerCase().includes(k) ||
          t.subtitle.toLowerCase().includes(k) ||
          t.destinationName.toLowerCase().includes(k)
        )
      ).slice(0, 8);
    }

    if (activeCollectionTab === 'COMBO') {
      return tours.filter((t) =>
        t.transportType === 'COMBO_AIR_HOTEL' ||
        t.title.toLowerCase().includes('combo') ||
        t.subtitle.toLowerCase().includes('resort') ||
        t.subtitle.toLowerCase().includes('khách sạn')
      ).slice(0, 8);
    }

    return tours.slice(0, 8);
  }, [tours, activeCollectionTab]);

  return (
    <PageShell>
      {/* =========================================================================
          PROMOTIONAL BANNER TICKER — SWISS CONCESSION BULLETIN
          ========================================================================= */}
      <div className="bg-black text-white px-4 py-2 mb-6 border border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#DC2626] animate-pulse" />
          <span className="font-bold text-[#DC2626] tracking-wider uppercase">
            [ 2026 AVIATION CONCESSION ]
          </span>
          <span className="text-[#E5E7EB] hidden md:inline">/</span>
          <span className="text-white tracking-wide">
            {isVi
              ? 'ÁP DỤNG MÃ "PROMO2026" GIẢM NGAY 10% TỔNG HOÁ ĐƠN + TẶNG 20KG HÀNH LÝ KÝ GỬI CHO TOUR QUỐC TẾ'
              : 'APPLY CODE "PROMO2026" FOR 10% DIRECT REBATE + COMPLIMENTARY 20KG CHECKED BAGGAGE'}
          </span>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleCopyCoupon('PROMO2026')}
            className="px-2.5 py-0.5 bg-[#DC2626] hover:bg-white hover:text-black text-white text-[10px] font-bold tracking-widest uppercase transition-none border border-[#DC2626]"
          >
            {copiedCode === 'PROMO2026' ? (isVi ? '✓ ĐÃ CHÉP' : '✓ COPIED') : (isVi ? 'SAO CHÉP MÃ' : 'COPY CODE')}
          </button>
        </div>
      </div>

      {/* =========================================================================
          1. HERO SECTION — HIGH-IMPACT PROMOTIONAL SHOWCASE
          ========================================================================= */}
      <section className="bg-white border border-[#E5E7EB] p-6 sm:p-8 md:p-10 mb-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Bold Typographic Headline & Value Props (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Badge & Telemetry */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#DC2626]" />
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#DC2626] uppercase">
                  {t('home.heroBadge')}
                </span>
                <span className="font-mono text-[10px] text-[#737373]">
                  // SWISS AVIATION MATRIX
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase leading-[0.95] mb-4">
                {t('home.heroTitle')}
              </h1>

              {/* Lead Description */}
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-xl mb-6">
                {t('home.heroDesc')}
              </p>

              {/* Promotional Value Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px] mb-6">
                <div className="p-2.5 bg-[#F5F5F5] border border-[#E5E7EB]">
                  <div className="text-[#DC2626] font-bold">100% AIRBORNE</div>
                  <div className="text-[#4B5563] text-[9px] mt-0.5">{isVi ? 'Bay hãng 4-5 sao' : 'Certified 4-5★ airlines'}</div>
                </div>
                <div className="p-2.5 bg-[#F5F5F5] border border-[#E5E7EB]">
                  <div className="text-black font-bold">VIP FAST-TRACK</div>
                  <div className="text-[#4B5563] text-[9px] mt-0.5">{isVi ? 'Lối đi ưu tiên sân bay' : 'Dedicated security lane'}</div>
                </div>
                <div className="p-2.5 bg-[#F5F5F5] border border-[#E5E7EB] col-span-2 sm:col-span-1">
                  <div className="text-black font-bold">{isVi ? 'HOÀN TIỀN TỰ ĐỘNG' : 'TIERED REFUND'}</div>
                  <div className="text-[#4B5563] text-[9px] mt-0.5">{isVi ? 'Lên đến 100% minh bạch' : 'Up to 100% guaranteed'}</div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E5E7EB]">
              <Link
                to="/tours"
                className="h-11 px-6 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-2"
              >
                <span>{isVi ? `KHÁM PHÁ ${tours.length}+ TOUR DU LỊCH` : `EXPLORE ${tours.length}+ AIR TOURS`}</span>
                <span>→</span>
              </Link>
              <Link
                to="/explore"
                className="h-11 px-5 bg-white hover:border-black text-black font-mono text-xs font-bold uppercase tracking-wider transition-none border border-[#E5E7EB] flex items-center gap-2"
              >
                <span>{t('home.exploreHubs')}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Spotlight Tour Promotion of the Week (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {spotlightTour ? (
              <div className="bg-[#F5F5F5] border-2 border-black p-5 flex flex-col justify-between h-full relative group">
                {/* Spotlight Ribbon Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#DC2626]" />
                    <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider">
                      {t('home.spotlightBadge')}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] bg-[#DC2626] text-white px-2 py-0.5 font-bold uppercase tracking-widest">
                    {t('home.spotlightSale')}
                  </span>
                </div>

                {/* Media Frame with Hero Priority Loading */}
                <div className="relative h-48 sm:h-56 bg-black overflow-hidden mb-4 border border-[#E5E7EB]">
                  <LazyImage
                    src={spotlightTour.featuredImage}
                    alt={spotlightTour.title}
                    className="w-full h-full object-cover group-hover:scale-105 swiss-transition"
                    containerClassName="w-full h-full"
                    priority={true}
                  />
                  <div className="absolute top-2 left-2 z-10 bg-black/90 text-white font-mono text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider border border-white/20">
                    CODE: {spotlightTour.code}
                  </div>
                  {spotlightTour.airlineName && (
                    <div className="absolute top-2 right-2 z-10 bg-white/95 text-black font-mono text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider border border-[#E5E7EB]">
                      {spotlightTour.airlineName}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 z-10 bg-black/85 text-white font-mono text-[10px] px-2.5 py-1">
                    {spotlightTour.departureCity} → {spotlightTour.destinationName}
                  </div>
                </div>

                {/* Tour Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[#4B5563] font-mono text-[10px]">
                    <span>{spotlightTour.durationDays}D / {spotlightTour.durationNights}N</span>
                    <span className="text-[#DC2626] font-bold">★ {spotlightTour.rating} ({spotlightTour.reviewsCount} reviews)</span>
                  </div>
                  <Link
                    to={`/tours/${spotlightTour.id}`}
                    className="font-black text-base text-black uppercase hover:text-[#DC2626] line-clamp-2 leading-tight block"
                  >
                    {spotlightTour.title}
                  </Link>
                  <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                    {spotlightTour.subtitle}
                  </p>
                </div>

                {/* Price & Booking Call-to-action */}
                <div className="pt-3 border-t border-[#E5E7EB] flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[9px] text-[#4B5563] uppercase">
                      {isVi ? 'GIÁ TOUR TRỌN GÓI / KHÁCH' : 'ALL-INCLUSIVE FARE / GUEST'}
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-mono text-xl sm:text-2xl font-black text-black">
                        {formatCurrency(spotlightTour.price)}
                      </span>
                      {spotlightTour.originalPrice && (
                        <span className="font-mono text-xs text-[#9CA3AF] line-through">
                          {formatCurrency(spotlightTour.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/tours/${spotlightTour.id}`}
                    className="h-10 px-4 bg-black hover:bg-[#DC2626] text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
                  >
                    <span>{t('home.bookNow')}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TOUR SEARCH & DISPATCH ENGINE
          ========================================================================= */}
      <section className="border-2 border-black bg-[#F5F5F5] p-5 sm:p-6 md:p-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">
              {t('home.searchTitle')}
            </span>
          </div>
          <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-widest self-start sm:self-auto">
            {t('home.searchBadge')}
          </span>
        </div>

        <form onSubmit={handleTourSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Field 1: Keyword Search (Span 5 cols) */}
            <div className="sm:col-span-2 lg:col-span-5">
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                {t('home.keywordLabel')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder={t('home.keywordPlaceholder')}
                  className="w-full h-11 pl-3 pr-8 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black placeholder-[#9CA3AF]"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#9CA3AF] hover:text-black"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Field 2: Destination Select (Span 3 cols) */}
            <div className="lg:col-span-3">
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                {t('home.destLabel')}
              </label>
              <select
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              >
                <option value="ALL">{t('home.allDest')}</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code || d.airportCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Duration Select (Span 2 cols) */}
            <div className="lg:col-span-2">
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                {t('home.durationLabel')}
              </label>
              <select
                value={searchDuration}
                onChange={(e) => setSearchDuration(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              >
                <option value="ALL">{t('home.allDurations')}</option>
                <option value="3">{t('home.dur3')}</option>
                <option value="4">{t('home.dur4')}</option>
                <option value="5">{t('home.dur5')}</option>
                <option value="7">{t('home.dur7')}</option>
              </select>
            </div>

            {/* Field 4: Partner Airline (Span 2 cols) */}
            <div className="lg:col-span-2">
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                {t('home.airlineLabel')}
              </label>
              <select
                value={searchAirline}
                onChange={(e) => setSearchAirline(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              >
                <option value="ALL">{t('home.allAirlines')}</option>
                <option value="VN">Vietnam Airlines</option>
                <option value="VJ">Vietjet Air</option>
                <option value="QH">Bamboo Airways</option>
                <option value="SQ">Singapore Airlines</option>
                <option value="AF">Air France</option>
              </select>
            </div>
          </div>

          {/* Submit Bar & Quick Suggestion Chips */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-[#E5E7EB]">
            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
              <span className="text-[#4B5563] font-bold mr-1 uppercase">{t('home.quickSuggestions')}</span>
              {['Đà Nẵng', 'Phú Quốc', 'Nha Trang', 'Hạ Long', 'Tokyo', 'Seoul', 'Singapore', 'Paris'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2 py-0.5 bg-white border border-[#E5E7EB] hover:border-black hover:text-[#DC2626] text-black transition-none uppercase font-bold"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="h-11 px-6 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center justify-center gap-2 whitespace-nowrap self-end md:self-auto"
            >
              <span>{t('home.searchBtn')}</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </section>

      {/* =========================================================================
          3. FEATURED RECOMMENDATIONS CAROUSEL (AUTOMATIC HORIZONTAL SCROLL)
          ========================================================================= */}
      <FeaturedRecommendationsCarousel tours={tours} onToggleSave={toggleSaveTour} />

      {/* =========================================================================
          4. THEMATIC TOUR COLLECTIONS (BỘ SƯU TẬP TOUR THEO CHỦ ĐỀ)
          ========================================================================= */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 mb-6 border-b border-[#E5E7EB] gap-2">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              {t('home.collectionsTitle')}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mt-0.5">
              {t('home.collectionsSubtitle')}
            </h2>
          </div>
          <Link
            to="/tours"
            className="font-mono text-xs font-bold text-black hover:text-[#DC2626] uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"
          >
            <span>{isVi ? `XEM TẤT CẢ (${tours.length} TOURS)` : `VIEW ALL (${tours.length} TOURS)`}</span>
            <span>→</span>
          </Link>
        </div>

        {/* Collection Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs mb-6">
          <button
            onClick={() => setActiveCollectionTab('ALL')}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCollectionTab === 'ALL'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.collectionsAll')}
          </button>
          <button
            onClick={() => setActiveCollectionTab('BEACH')}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCollectionTab === 'BEACH'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.collectionsBeach')}
          </button>
          <button
            onClick={() => setActiveCollectionTab('HERITAGE')}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCollectionTab === 'HERITAGE'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.collectionsHeritage')}
          </button>
          <button
            onClick={() => setActiveCollectionTab('CITY')}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCollectionTab === 'CITY'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.collectionsCity')}
          </button>
          <button
            onClick={() => setActiveCollectionTab('COMBO')}
            className={`px-3 py-1.5 font-bold uppercase tracking-wider swiss-transition-colors border ${
              activeCollectionTab === 'COMBO'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-[#E5E7EB] hover:border-black'
            }`}
          >
            {t('home.collectionsCombo')}
          </button>
        </div>

        {/* Collection Tour Grid (8 Items with Smooth Fade-In Transition) */}
        {filteredCollectionTours.length > 0 ? (
          <div key={activeCollectionTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 swiss-fade-in">
            {filteredCollectionTours.map((tour, idx) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={idx}
                onToggleSave={toggleSaveTour}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-[#E5E7EB] text-center font-mono text-xs text-[#737373]">
            [ {isVi ? 'ĐANG TẢI TOUR DU LỊCH TỪ CƠ SỞ DỮ LIỆU...' : 'RETRIEVING TOURS FROM DATABASE...'} ]
          </div>
        )}

        {/* Banner Link to All Tours */}
        <div className="mt-8 p-4 bg-[#F5F5F5] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-[#DC2626]" />
            <span className="font-bold text-black uppercase">
              {isVi ? `ĐÃ NẠP ${tours.length} HÀNH TRÌNH HÀNG KHÔNG ĐẶC QUYỀN TRÊN TOÀN MẠNG BAY` : `${tours.length} EXCLUSIVE AVIATION CORRIDORS LOADED IN LIVE MATRIX`}
            </span>
          </div>
          <Link
            to="/tours"
            className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider transition-none self-start sm:self-auto"
          >
            {t('home.viewAllTours')} →
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. SPECIAL CONCESSION & AIRLINE COUPONS PROMOTION
          ========================================================================= */}
      <section className="bg-black text-white border-2 border-black p-6 sm:p-8 md:p-10 mb-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#DC2626]" />
              <span className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-widest">
                {t('home.promoBannerTitle')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              {isVi ? 'NHẬN NGAY ƯU ĐÃI $50 & MIỄN PHÍ 20KG HÀNH LÝ KÝ GỬI' : 'INSTANT $50 FARE DISCOUNT + 20KG FREE CHECKED BAGGAGE'}
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-xl">
              {t('home.promoBannerSubtitle')}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#D1D5DB] pt-2">
              <li className="flex items-center gap-2">
                <span className="text-[#DC2626] font-bold">✓</span>
                <span>{isVi ? 'Áp dụng cho mọi tour bay khứ hồi' : 'Valid on all round-trip flights'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#DC2626] font-bold">✓</span>
                <span>{isVi ? 'Lối đi an ninh VIP Fast-track' : 'Dedicated VIP security lane'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#DC2626] font-bold">✓</span>
                <span>{isVi ? 'Bảo hiểm hàng không cao cấp' : 'Aviation traveler insurance'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#DC2626] font-bold">✓</span>
                <span>{isVi ? 'Hoàn tiền minh bạch khi hủy tour' : 'Tiered cancellation refund'}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 bg-white text-black p-5 sm:p-6 border border-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <span className="font-mono text-[10px] font-bold uppercase text-[#737373]">
                {t('home.promoCodeLabel')}
              </span>
              <span className="font-mono text-[9px] bg-[#DC2626] text-white px-2 py-0.5 font-bold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between p-3 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div>
                  <div className="text-xs font-black tracking-widest text-black">PROMO2026</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">{isVi ? 'Giảm 10% tổng đơn' : '10% Direct Rebate'}</div>
                </div>
                <button
                  onClick={() => handleCopyCoupon('PROMO2026')}
                  className="px-3 py-1 bg-black text-white hover:bg-[#DC2626] text-[10px] font-bold uppercase tracking-wider transition-none"
                >
                  {copiedCode === 'PROMO2026' ? (isVi ? '✓ ĐÃ CHÉP' : '✓ COPIED') : t('home.copyCode')}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F5F5F5] border border-[#E5E7EB]">
                <div>
                  <div className="text-xs font-black tracking-widest text-black">AEROVIP50</div>
                  <div className="text-[10px] text-[#737373] mt-0.5">{isVi ? 'Giảm $50 đơn từ $300' : '$50 off on orders > $300'}</div>
                </div>
                <button
                  onClick={() => handleCopyCoupon('AEROVIP50')}
                  className="px-3 py-1 bg-black text-white hover:bg-[#DC2626] text-[10px] font-bold uppercase tracking-wider transition-none"
                >
                  {copiedCode === 'AEROVIP50' ? (isVi ? '✓ ĐÃ CHÉP' : '✓ COPIED') : t('home.copyCode')}
                </button>
              </div>
            </div>

            <Link
              to="/tours"
              className="w-full py-2.5 bg-[#DC2626] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center gap-1.5"
            >
              <span>{isVi ? 'ÁP DỤNG ĐẶT TOUR NGAY' : 'APPLY TO BOOKING'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WHY CHOOSE OUR AIR EXPEDITIONS (CAM KẾT DỊCH VỤ ĐỘC BẢN)
          ========================================================================= */}
      <section className="mb-12">
        <div className="pb-3 mb-6 border-b border-[#E5E7EB]">
          <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
            [ SWISS SERVICE EXCELLENCE ]
          </div>
          <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mt-0.5">
            {t('home.whyTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] p-5 space-y-2 hover:border-black transition-none">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="font-black text-xs uppercase text-black tracking-tight pt-1">
              {t('home.why1Title')}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {t('home.why1Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-5 space-y-2 hover:border-black transition-none">
            <div className="w-8 h-8 bg-[#DC2626] text-white flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="font-black text-xs uppercase text-black tracking-tight pt-1">
              {t('home.why2Title')}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {t('home.why2Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-5 space-y-2 hover:border-black transition-none">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="font-black text-xs uppercase text-black tracking-tight pt-1">
              {t('home.why3Title')}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {t('home.why3Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-5 space-y-2 hover:border-black transition-none">
            <div className="w-8 h-8 bg-[#DC2626] text-white flex items-center justify-center font-mono font-bold text-xs">
              04
            </div>
            <h3 className="font-black text-xs uppercase text-black tracking-tight pt-1">
              {t('home.why4Title')}
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {t('home.why4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. TOP GATEWAYS & DESTINATIONS
          ========================================================================= */}
      <section className="mb-12">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              {t('home.destSectionBadge')}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mt-0.5">
              {t('home.destSectionTitle')}
            </h2>
          </div>
          <Link
            to="/explore"
            className="font-mono text-xs font-bold text-black hover:text-[#DC2626] uppercase tracking-wider flex items-center gap-1"
          >
            <span>{t('home.exploreHubs')}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.slice(0, 8).map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.id}`}
              className="bg-white border border-[#E5E7EB] hover:border-black transition-none flex flex-col group p-4"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#4B5563] pb-2 mb-2 border-b border-[#E5E7EB]">
                <span className="font-bold text-black">IATA: {dest.airportCode}</span>
                <span>{dest.country}</span>
              </div>
              <LazyImage
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 swiss-transition"
                containerClassName="h-32 bg-[#EEEEEE] overflow-hidden mb-3 relative"
              />
              <h3 className="font-black text-sm text-black uppercase mb-1 group-hover:text-[#DC2626]">
                {dest.name}
              </h3>
              <p className="text-[11px] text-[#4B5563] line-clamp-2 leading-relaxed">
                {dest.description}
              </p>
              <div className="mt-3 pt-2 border-t border-[#E5E7EB] font-mono text-[10px] text-black font-bold flex items-center justify-between">
                <span>{dest.popularToursCount || 5}+ {t('home.schedulesActive')}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. VERIFIED TRAVELER REVIEWS (TRẢI NGHIỆM THỰC TẾ)
          ========================================================================= */}
      <section className="mb-12 bg-white border border-[#E5E7EB] p-6 md:p-8">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              [ 100% VERIFIED PASSENGERS ]
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mt-0.5">
              {t('home.reviewsTitle')}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#4B5563] font-bold hidden sm:block">
            ★ 4.9 / 5.0 (1,480+ REVIEWS)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border border-[#E5E7EB] p-4 bg-[#F5F5F5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-black">TRẦN HOÀNG ANH</span>
                <span className="text-[#DC2626]">★★★★★</span>
              </div>
              <div className="font-mono text-[9px] text-[#737373] mb-2 uppercase">
                PNR: VN-DAD-8849 // BAY CÙNG VIETNAM AIRLINES
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                "{isVi
                  ? 'Tour Đà Nẵng 3N2Đ bằng máy bay cực kỳ chuyên nghiệp. Không tốn thời gian di chuyển đường bộ, khách sạn 5 sao mặt biển và vé máy bay bao gồm đủ 20kg ký gửi.'
                  : 'The Da Nang 3D2N air tour was extraordinarily smooth. Zero road delays, 5-star beachfront resort and 20kg baggage included.'}"
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#DC2626] font-bold pt-2 border-t border-[#E5E7EB]">
              ✓ VERIFIED EXPEDITION PASSENGER
            </div>
          </div>

          <div className="border border-[#E5E7EB] p-4 bg-[#F5F5F5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-black">MICHAEL VOGEL</span>
                <span className="text-[#DC2626]">★★★★★</span>
              </div>
              <div className="font-mono text-[9px] text-[#737373] mb-2 uppercase">
                PNR: VN-PQC-1092 // PHÚ QUỐC LUXURY CHARTER
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                "{isVi
                  ? 'Đặt tour rất nhanh chóng. Điều mình thích nhất là chính sách hoàn huỷ tour tự động minh bạch hiển thị rõ ngay tại thời điểm thanh toán. Dịch vụ tuyệt vời!'
                  : 'Fast booking flow. The best part is the transparent automated refund tier shown upfront at checkout. Excellent execution!'}"
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#DC2626] font-bold pt-2 border-t border-[#E5E7EB]">
              ✓ VERIFIED EXPEDITION PASSENGER
            </div>
          </div>

          <div className="border border-[#E5E7EB] p-4 bg-[#F5F5F5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-black">LÊ THU TRANG</span>
                <span className="text-[#DC2626]">★★★★★</span>
              </div>
              <div className="font-mono text-[9px] text-[#737373] mb-2 uppercase">
                PNR: VN-NRT-4720 // TOKYO — NÚI PHÚ SĨ 5N4Đ
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                "{isVi
                  ? 'Chuyến bay thẳng đến Narita đúng giờ từng phút. Hướng dẫn viên chu đáo, lịch trình tham quan dày đặc nhưng không mệt nhờ bay thẳng. Rất đáng tiền!'
                  : 'Direct flight to Narita punctual to the minute. Attentive guide, full itinerary yet relaxed thanks to non-stop flights. Highly recommended!'}"
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#DC2626] font-bold pt-2 border-t border-[#E5E7EB]">
              ✓ VERIFIED EXPEDITION PASSENGER
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. ARTICLES & FLIGHT GUIDANCE
          ========================================================================= */}
      <section className="mb-8">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              {t('home.articleSectionBadge')}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight mt-0.5">
              {t('home.articleSectionTitle')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-[#E5E7EB] p-5 flex flex-col justify-between hover:border-black transition-none"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#4B5563] mb-2">
                  <span className="px-1.5 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] text-black font-bold">
                    {article.category}
                  </span>
                  <span>•</span>
                  <span>{article.readTimeMinutes} MIN READ</span>
                </div>
                <Link
                  to={`/articles/${article.id}`}
                  className="font-bold text-base text-black hover:text-[#DC2626] transition-none leading-snug mb-2 block"
                >
                  {article.title}
                </Link>
                <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#4B5563]">Author: {article.author}</span>
                <Link
                  to={`/articles/${article.id}`}
                  className="font-bold text-black hover:text-[#DC2626] uppercase"
                >
                  READ DIRECTIVE →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default HomePage;
