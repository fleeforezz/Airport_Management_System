import React, { useState, useEffect } from 'react';
import Sidebar, { AdminTab } from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import TourPage from './pages/TourPage';
import DeparturePage from './pages/DeparturePage';
import DestinationPage from './pages/DestinationPage';
import ArticlePage from './pages/ArticlePage';
import CouponPage from './pages/CouponPage';

export const AdminApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [utcClock, setUtcClock] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcClock(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black font-sans text-xs antialiased selection:bg-[#DC2626] selection:text-white flex">
      {/* 1. PERSISTENT SIDEBAR NAVIGATION SHELL (240px, Swiss Modernism 2.0) */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 2. TOP GLOBAL NAVIGATION UTILITY BAR */}
      <header className="fixed top-0 right-0 left-[240px] z-30 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] h-14 select-none">
        {/* Left Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase">
            <span className="text-[#4B5563]">AEROOPS</span>
            <span className="text-[#E5E7EB]">/</span>
            <span className="text-black font-black uppercase">{currentTab}</span>
          </div>
          <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 uppercase tracking-wider font-bold">
            HUB: KJFK T4
          </span>
        </div>

        {/* Center Telemetry & UTC Clock */}
        <div className="hidden md:flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E7EB]">
            <span className="w-1.5 h-1.5 bg-[#22C55E]" />
            <span className="text-[#4B5563] text-[10px] font-bold">SYS: ONLINE</span>
          </div>
          <div className="flex items-center gap-2 text-[#4B5563] text-[10px]">
            <span className="font-bold text-black">40°38′23″N 073°46′44″W</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-black">
            <span className="w-1.5 h-1.5 bg-[#DC2626]" /> UTC {utcClock}
          </div>
        </div>

        {/* Right Actions Ribbon */}
        <div className="flex items-center gap-2 font-mono">
          <a
            href="/"
            className="h-8 px-3 bg-white border border-[#E5E7EB] text-black hover:border-black text-[10px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">public</span>
            <span>PASSENGER PORTAL →</span>
          </a>
          <button
            onClick={() => alert('Emergency Telemetry Override: All network airspace sectors operating within normal parameters.')}
            className="h-8 px-3 bg-white border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white text-[10px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>EMERGENCY OVERRIDE</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE / OPERATIONAL CANVAS */}
      <main className="ml-[240px] flex-1 min-h-screen p-6 bg-[#F5F5F5] pt-20">
        {currentTab === 'dashboard' && <DashboardPage />}
        {currentTab === 'bookings' && <BookingPage />}
        {currentTab === 'tours' && <TourPage />}
        {currentTab === 'departures' && <DeparturePage />}
        {currentTab === 'destinations' && <DestinationPage />}
        {currentTab === 'articles' && <ArticlePage />}
        {currentTab === 'coupons' && <CouponPage />}
      </main>
    </div>
  );
};

export default AdminApp;
