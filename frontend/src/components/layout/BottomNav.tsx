import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSavedTourIdsFromStorage } from '../../hooks/useTours';
import { useBookings } from '../../hooks/useBookings';

export const BottomNav: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { bookings } = useBookings();

  const [savedCount, setSavedCount] = useState<number>(() => {
    return isAuthenticated && user ? getSavedTourIdsFromStorage(user.email).length : 0;
  });

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
  const isVi = language === 'vi';

  const tabs = [
    { label: isVi ? 'Trang chủ' : 'Home', path: '/', icon: 'home' },
    { label: isVi ? 'Điểm đến' : 'Explore', path: '/explore', icon: 'explore' },
    { label: isVi ? 'Tour bay' : 'Tours', path: '/tours', icon: 'flight_takeoff' },
    ...(isAuthenticated
      ? [
          { label: isVi ? 'Đã lưu' : 'Saved', path: '/tours/saved', icon: 'bookmark', count: savedCount },
          { label: isVi ? 'Đơn đặt' : 'Bookings', path: '/booking/my', icon: 'confirmation_number', count: bookingCount },
        ]
      : []),
    { label: isVi ? 'Hồ sơ' : 'Profile', path: '/account/profile', icon: 'person' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-2 py-1 flex items-center justify-around select-none">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-none ${
              isActive
                ? 'text-black font-bold border-b-2 border-[#DC2626]'
                : 'text-[#4B5563] hover:text-black'
            }`
          }
        >
          <div className="relative mb-0.5">
            <span className="material-symbols-outlined text-[20px] block">
              {tab.icon}
            </span>
            {tab.count !== undefined && (
              <span
                className={`absolute -top-1 -right-2 px-1 py-0.2 font-mono text-[8px] font-bold leading-none border select-none ${
                  tab.count > 0
                    ? 'bg-[#DC2626] text-white border-[#DC2626]'
                    : 'bg-[#E5E7EB] text-[#4B5563] border-[#D1D5DB]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </div>
          <span className="font-mono text-[9px] tracking-tight uppercase">
            {tab.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
