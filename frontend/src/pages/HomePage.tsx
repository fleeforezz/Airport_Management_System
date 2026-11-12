import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import TourCard from '../components/tour/TourCard';
import { MOCK_DESTINATIONS, MOCK_ARTICLES } from '../utils/mockData';
import { useTours } from '../hooks/useTours';
import { destinationApi, articleApi } from '../services/api';
import { Destination, Article } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tours, toggleSaveTour } = useTours();
  const [destinations, setDestinations] = useState<Destination[]>(MOCK_DESTINATIONS);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [origin, setOrigin] = useState('SGN');
  const [destination, setDestination] = useState('DAD');
  const [travelDate, setTravelDate] = useState('2026-11-20');

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

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tours?origin=${origin}&destination=${destination}&date=${travelDate}`);
  };

  return (
    <PageShell>
      {/* 1. HERO SECTION — SWISS TYPOGRAPHIC DOMINANCE */}
      <section className="bg-white border border-[#E5E7EB] p-6 md:p-12 mb-8 relative overflow-hidden">
        {/* Subtle coordinate overlay */}
        <div className="absolute top-4 right-4 font-mono text-[9px] text-[#9CA3AF] text-right hidden sm:block">
          <div>LAT: 40°38′23″N // LONG: 073°46′44″W</div>
          <div className="text-black font-bold">OPERATIONS MATRIX 2.0</div>
        </div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#DC2626] uppercase">
              FLIGHT DISPATCH & AIR CHARTER SYSTEM
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-black tracking-tight uppercase leading-[0.95] mb-4">
            PRECISION FLIGHTS. UNCOMPROMISING HORIZONS.
          </h1>

          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-8 max-w-xl">
            Experience international aviation precision with dedicated flight schedules, rapid biometric terminal clearance, and ground operations governed by Swiss Modernism.
          </p>
        </div>

        {/* 2. RAPID FLIGHT SEARCH ENGINE COMPONENT */}
        <div className="border border-black bg-[#F5F5F5] p-4 md:p-6">
          <div className="font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>[ 01 ] RAPID ROUTE & FLIGHT SEARCH MATRIX</span>
            <span className="text-[#DC2626]">DIRECT POINT-TO-POINT FLIGHTS</span>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Origin Select */}
            <div>
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                ORIGIN AIRPORT (IATA)
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              >
                <option value="SGN">Ho Chi Minh City (SGN)</option>
                <option value="HAN">Hanoi (HAN)</option>
                <option value="DAD">Da Nang (DAD)</option>
              </select>
            </div>

            {/* Destination Select */}
            <div>
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                DESTINATION AIRPORT (IATA)
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              >
                <option value="DAD">Da Nang — Hoi An (DAD)</option>
                <option value="PQC">Phu Quoc Island (PQC)</option>
                <option value="NRT">Tokyo Narita (NRT)</option>
                <option value="JFK">New York JFK (JFK)</option>
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label className="block font-mono text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                DEPARTURE DATE
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-10 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center justify-center gap-2"
              >
                <span>SEARCH FLIGHTS</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. FEATURED TOURS / FLIGHT PACKAGES */}
      <section className="mb-12">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              CURATED AIR CATALOG
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">
              FEATURED FLIGHT SCHEDULES & CHARTER PACKAGES
            </h2>
          </div>
          <Link
            to="/tours"
            className="font-mono text-xs font-bold text-black hover:text-[#DC2626] uppercase tracking-wider flex items-center gap-1"
          >
            <span>VIEW ALL FLIGHTS</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, idx) => (
            <TourCard
              key={tour.id}
              tour={tour}
              index={idx}
              onToggleSave={toggleSaveTour}
            />
          ))}
        </div>
      </section>

      {/* 4. DESTINATION HIGHLIGHTS */}
      <section className="mb-12">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              INTERNATIONAL AIRPORT NETWORK
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">
              GLOBAL GATEWAYS & REGIONAL HUBS
            </h2>
          </div>
          <Link
            to="/explore"
            className="font-mono text-xs font-bold text-black hover:text-[#DC2626] uppercase tracking-wider flex items-center gap-1"
          >
            <span>EXPLORE HUBS</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.id}`}
              className="bg-white border border-[#E5E7EB] hover:border-black transition-none flex flex-col group p-4"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#4B5563] pb-2 mb-2 border-b border-[#E5E7EB]">
                <span className="font-bold text-black">IATA: {dest.airportCode}</span>
                <span>{dest.country}</span>
              </div>
              <div className="h-32 bg-[#EEEEEE] overflow-hidden mb-3 relative">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-none"
                />
              </div>
              <h3 className="font-black text-sm text-black uppercase mb-1 group-hover:text-[#DC2626]">
                {dest.name}
              </h3>
              <p className="text-[11px] text-[#4B5563] line-clamp-2 leading-relaxed">
                {dest.description}
              </p>
              <div className="mt-3 pt-2 border-t border-[#E5E7EB] font-mono text-[10px] text-black font-bold flex items-center justify-between">
                <span>{dest.popularToursCount} SCHEDULES ACTIVE</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. ARTICLES & FLIGHT GUIDANCE */}
      <section className="mb-8">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">
              OPERATIONAL BRIEFS
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">
              TERMINAL PROCEDURES & FLIGHT GUIDELINES
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
