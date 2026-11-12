import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');

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
    { label: 'HOME', path: '/' },
    { label: 'EXPLORE DESTINATIONS', path: '/explore' },
    { label: 'FLIGHTS & TOURS', path: '/tours' },
    { label: 'SAVED FLIGHTS', path: '/tours/saved' },
    { label: 'MY BOOKINGS', path: '/booking/my' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] select-none">
      {/* Top Telemetry Hairline Bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 bg-[#F5F5F5] border-b border-[#E5E7EB] font-mono text-[9px] text-[#4B5563]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-black">
            <span className="w-1.5 h-1.5 bg-[#22C55E]" />
            AERO-NET: 100% OPERATIONAL
          </span>
          <span className="text-[#E5E7EB]">|</span>
          <span>STATION: KJFK / SGN GATEWAY</span>
          <span className="text-[#E5E7EB]">|</span>
          <span>DISPATCH MATRIX V2.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-black">
            <span className="w-1.5 h-1.5 bg-[#DC2626]" />
            <span>UTC {currentTime}</span>
          </div>
          <a
            href="/admin.html"
            className="text-black hover:text-[#DC2626] font-bold underline transition-none"
          >
            ENTER ADMIN PORTAL →
          </a>
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
              AIRPORT & FLIGHT OPERATIONS
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
                className={`px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider uppercase transition-none border ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5] border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Account Ribbon */}
        <div className="flex items-center gap-3">
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
                title="Sign Out"
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
                <span>SIGN IN / ACCESS</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
