import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const tabs = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Explore', path: '/explore', icon: 'explore' },
    { label: 'Flights', path: '/tours', icon: 'flight_takeoff' },
    { label: 'Saved', path: '/tours/saved', icon: 'bookmark' },
    { label: 'Bookings', path: '/booking/my', icon: 'confirmation_number' },
    { label: 'Profile', path: '/account/profile', icon: 'person' },
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
          <span className="material-symbols-outlined text-[20px] mb-0.5">
            {tab.icon}
          </span>
          <span className="font-mono text-[9px] tracking-tight uppercase">
            {tab.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
