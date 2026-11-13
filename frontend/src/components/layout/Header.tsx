import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { getSavedTourIdsFromStorage } from '../../hooks/useTours';
import { useBookings } from '../../hooks/useBookings';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const { bookings } = useBookings();
  const [currentTime, setCurrentTime] = useState<string>('');

  const [savedCount, setSavedCount] = useState<number>(() => {
    return isAuthenticated && user ? getSavedTourIdsFromStorage(user.email).length : 0;
  });

  // Keep saved tours count in sync across sessions and events
  useEffect(() => {
    const handleSavedChange = () => {
      if (isAuthenticated && user) {
        setSavedCount(getSavedTourIdsFromStorage(user.email).length);
      } else {
        setSavedCount(0);
      }
    };

    handleSavedChange();
    window.addEventListener('aeroflight_saved_tours_updated', handleSavedChange);
    window.addEventListener('storage', handleSavedChange);
    return () => {
      window.removeEventListener('aeroflight_saved_tours_updated', handleSavedChange);
      window.removeEventListener('storage', handleSavedChange);
    };
  }, [isAuthenticated, user?.email]);

  const bookingCount = isAuthenticated ? bookings.length : 0;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toTimeString().split(' ')[0];
      setCurrentTime(utcString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.explore'), path: '/explore' },
    { label: t('nav.tours'), path: '/tours' },
    ...(isAuthenticated
      ? [
          { label: t('nav.savedTours'), path: '/tours/saved', count: savedCount },
          { label: t('nav.myBookings'), path: '/booking/my', count: bookingCount },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] select-none">
      {/* Top Telemetry Hairline Bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 bg-[#F5F5F5] border-b border-[#E5E7EB] font-mono text-[9px] text-[#4B5563]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-black">
            <span className="w-1.5 h-1.5 bg-[#22C55E] swiss-beacon" />
            {t('nav.operational')}
          </span>
          <span className="text-[#E5E7EB]">|</span>
          <span>{t('nav.station')}</span>
          <span className="text-[#E5E7EB]">|</span>
          <span>{t('nav.dispatchMatrix')}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-1.5 font-bold text-black">
            <span className="w-1.5 h-1.5 bg-[#DC2626] swiss-beacon" />
            <span>UTC {currentTime}</span>
          </div>
          {isAuthenticated && user ? (
            user.role === 'ADMIN' ? (
              <a
                href="/admin.html?mode=admin"
                className="text-[#DC2626] hover:text-black font-bold underline transition-none"
              >
                {t('nav.adminPortal')}
              </a>
            ) : user.role === 'TOUR_OPERATOR' ? (
              <a
                href="/admin.html?mode=operator"
                className="text-black hover:text-[#DC2626] font-bold underline transition-none"
              >
                {t('nav.operationPortal')}
              </a>
            ) : (
              <span className="text-[#22C55E] font-bold">
                {t('nav.travelerVerified')}
              </span>
            )
          ) : (
            <Link
              to="/auth/login"
              className="text-black hover:text-[#DC2626] font-bold underline transition-none"
            >
              {t('nav.signIn')} →
            </Link>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-black text-xs transition-none group-hover:bg-[#DC2626]">
            <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
          </div>
          <div>
            <div className="flex items-center gap-1 font-black text-sm md:text-base tracking-tight leading-none text-black uppercase">
              <span>AEROFLIGHT</span>
              <span className="w-1.5 h-1.5 bg-[#DC2626] inline-block" />
            </div>
            <div className="font-mono text-[9px] text-[#4B5563] tracking-widest uppercase mt-0.5">
              FLIGHT-EXCLUSIVE EXPEDITIONS & TOURS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider uppercase swiss-transition-colors border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5] border-transparent'
                }`}
              >
                <span>{link.label}</span>
                {link.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 font-mono text-[9px] font-bold leading-none select-none border swiss-transition ${
                      link.count > 0
                        ? isActive
                          ? 'bg-[#DC2626] text-white border-[#DC2626]'
                          : 'bg-[#DC2626] text-white border-[#DC2626]'
                        : isActive
                        ? 'bg-[#262626] text-[#9CA3AF] border-[#404040]'
                        : 'bg-[#F5F5F5] text-[#6B7280] border-[#E5E7EB]'
                    }`}
                  >
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account Ribbon & Language Switcher */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="md:hidden" />
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/account/profile"
                className="flex items-center gap-2 px-2.5 py-1.5 bg-[#F5F5F5] border border-[#E5E7EB] hover:border-black transition-none"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 bg-black text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-[11px] leading-tight text-black truncate max-w-[110px]">
                    {user.name}
                  </div>
                  <div className="font-mono text-[8px] text-[#4B5563] tracking-wider uppercase">
                    {user.role}
                  </div>
                </div>
              </Link>
              <button
                onClick={logout}
                title={t('nav.signOut')}
                className="w-8 h-8 border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-black hover:border-black hover:bg-[#F5F5F5] transition-none"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="px-3.5 py-1.5 bg-black text-white hover:bg-[#DC2626] font-mono text-[11px] font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>{t('nav.signIn')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
