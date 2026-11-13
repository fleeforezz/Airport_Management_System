import React, { useState, useEffect, Suspense, lazy } from 'react';
import Sidebar, { AdminTab } from './components/Sidebar';
import SwissSuspenseLoader from '../components/common/SwissSuspenseLoader';

// Dynamic Code Splitting for Admin Sub-Portals
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const TourPage = lazy(() => import('./pages/TourPage'));
const DeparturePage = lazy(() => import('./pages/DeparturePage'));
const DestinationPage = lazy(() => import('./pages/DestinationPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const CouponPage = lazy(() => import('./pages/CouponPage'));
const AirlinesPage = lazy(() => import('./pages/AirlinesPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));

export const AdminApp: React.FC = () => {
  const [utcClock, setUtcClock] = useState('');

  // 1. Read Authentication & Authorization Identity
  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token && !!user;
  const rawRole = (user?.role || '').toUpperCase();
  const userEmail = (user?.email || '').toLowerCase();
  const isOperator = rawRole === 'TOUR_OPERATOR' || rawRole === 'OPERATOR' || userEmail.includes('operator');
  const isAdmin = (rawRole === 'ADMIN' || rawRole === 'DISPATCHER' || userEmail.includes('admin')) && !isOperator;
  const isTraveler = user && !isAdmin && !isOperator;
  const userRole = isOperator ? 'TOUR_OPERATOR' : isAdmin ? 'ADMIN' : 'TRAVELER';

  // Read URL Mode: ?mode=admin or ?mode=operator
  const urlParams = new URLSearchParams(window.location.search);
  const requestedMode = urlParams.get('mode'); // 'admin' | 'operator' | null

  const [currentTab, setCurrentTab] = useState<AdminTab>(() => {
    if (isOperator) return 'tours';
    return 'users';
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcClock(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  // =========================================================================
  // GUARD CASE 1: UN-AUTHENTICATED ACCESS (HTTP 401)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#DC2626]" />
              <span className="font-mono text-xs font-bold tracking-widest uppercase text-black">
                CLEARANCE GATE // CODE: 401_UNAUTHORIZED
              </span>
            </div>
            <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold">
              AUTH REQUIRED
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-black uppercase tracking-tight">
              AUTHENTICATION CLEARANCE MANDATORY
            </h1>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Bạn cần đăng nhập bằng tài khoản có thẩm quyền để truy cập hệ thống:
            </p>
            <ul className="text-xs font-mono space-y-1.5 pt-2 text-black">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#DC2626]" />
                <span><strong>Admin Portal:</strong> Yêu cầu tài khoản Administrator (ADMIN).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black" />
                <span><strong>Operation Portal:</strong> Yêu cầu tài khoản Tour Operator.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
            <a
              href="/auth/login"
              className="w-full py-3 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SECURE SIGN IN →</span>
            </a>
            <a
              href="/"
              className="w-full py-2.5 bg-white border border-[#E5E7EB] hover:border-black text-black font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center"
            >
              RETURN TO PASSENGER PORTAL
            </a>
          </div>

          <div className="font-mono text-[9px] text-[#4B5563] text-center">
            CIVIL AVIATION DATA SECURITY SPECIFICATION // SWISS MODERNISM 2.0
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GUARD CASE 2: TRAVELER RESTRICTION (HTTP 403 FORBIDDEN)
  // Traveler only permitted to book tours and checkout payment!
  // =========================================================================
  if (isTraveler) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-lg w-full bg-white border-2 border-[#DC2626] p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#DC2626]" />
              <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#DC2626]">
                ACCESS DENIED // CODE: RBAC_403_FORBIDDEN
              </span>
            </div>
            <span className="font-mono text-[9px] bg-[#DC2626] text-white px-2 py-0.5 font-bold">
              ROLE: TRAVELER
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-xl font-black text-black uppercase tracking-tight">
              TRAVELER ROLE ACCESS RESTRICTED
            </h1>
            <div className="p-3 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs space-y-1">
              <div><strong>Tài khoản hiện tại:</strong> {user.name} ({user.email})</div>
              <div><strong>Vai trò hệ thống:</strong> <span className="text-[#DC2626] font-bold">TRAVELER (Khách du lịch)</span></div>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Theo quy định nghiệp vụ hệ thống, người dùng với vai trò <strong>TRAVELER</strong> chỉ được quyền:
            </p>
            <div className="space-y-1 text-xs font-mono text-black pl-2 border-l-2 border-black">
              <div>✓ Tra cứu & đặt lịch tour du lịch hàng không độc quyền</div>
              <div>✓ Lựa chọn chuyến bay & phân bổ ghế ngồi trên cabin</div>
              <div>✓ Mua thêm các gói phụ thu hành lý (+10kg, +20kg, dụng cụ thể thao)</div>
              <div>✓ Thực hiện thanh toán & hủy vé nhận tiền hoàn theo chính sách</div>
            </div>
            <p className="text-xs text-[#4B5563] pt-1">
              * Khách du lịch <strong>không có quyền</strong> truy cập vào trang Admin Portal (chỉ dành cho Quản trị viên) hoặc trang Operation Portal (chỉ dành cho Tour Operator).
            </p>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
            <a
              href="/"
              className="w-full py-3 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center gap-2"
            >
              <span>VỀ TRANG ĐẶT TOUR (PASSENGER PORTAL) →</span>
            </a>
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-white border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center"
            >
              ĐĂNG XUẤT ĐỂ ĐĂNG NHẬP TÀI KHOẢN ADMIN / OPERATOR
            </button>
          </div>

          <div className="font-mono text-[9px] text-[#4B5563] text-center">
            CIVIL AVIATION DATA SECURITY SPECIFICATION // STRICT ROLE BOUNDARY
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GUARD CASE 3: TOUR OPERATOR ATTEMPTING TO ACCESS ADMIN MODE
  // =========================================================================
  if (isOperator && requestedMode === 'admin') {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border-2 border-black p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-black">
              ADMIN PORTAL // PERMISSION RESTRICTED
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-black text-black uppercase">
              YÊU CẦU QUYỀN ADMINISTRATOR
            </h1>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Bạn đang đăng nhập bằng tài khoản <strong>Tour Operator</strong> ({user.name}). Trang Admin Portal (quản lý phân quyền user, bài viết) chỉ dành riêng cho Quản trị viên hệ thống.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
            <a
              href="/admin.html?mode=operator"
              className="w-full py-3 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center"
            >
              CHUYỂN ĐẾN TRANG OPERATION PORTAL →
            </a>
            <button
              onClick={handleSignOut}
              className="w-full py-2 bg-white border border-[#E5E7EB] hover:border-black text-black font-mono text-xs font-bold uppercase transition-none"
            >
              ĐĂNG XUẤT TÀI KHOẢN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PORTAL SUITE VIEW: AUTHORIZED ADMIN OR TOUR OPERATOR
  // =========================================================================
  const portalTitle = isAdmin ? 'ADMIN PORTAL' : 'OPERATION PORTAL';
  const portalSubtitle = isAdmin
    ? 'GOVERNANCE & FLEET REGISTRY'
    : 'EXPEDITION & TOUR OPERATIONS';

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black font-sans text-xs antialiased selection:bg-[#DC2626] selection:text-white flex">
      {/* 1. PERSISTENT SIDEBAR NAVIGATION SHELL (240px, Swiss Modernism 2.0) */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        onSignOut={handleSignOut}
      />

      {/* 2. TOP GLOBAL NAVIGATION UTILITY BAR */}
      <header className="fixed top-0 right-0 left-[240px] z-30 flex items-center justify-between px-6 bg-white border-b border-[#E5E7EB] h-14 select-none">
        {/* Left Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase">
            <span className="text-[#DC2626]">{portalTitle}</span>
            <span className="text-[#E5E7EB]">/</span>
            <span className="text-[#4B5563]">{portalSubtitle}</span>
            <span className="text-[#E5E7EB]">/</span>
            <span className="text-black font-black uppercase">{currentTab}</span>
          </div>
          <span className={`font-mono text-[9px] text-white px-2 py-0.5 uppercase tracking-wider font-bold ${isAdmin ? 'bg-[#DC2626]' : 'bg-black'}`}>
            ROLE: {userRole}
          </span>
        </div>

        {/* Center Telemetry & UTC Clock */}
        <div className="hidden md:flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E7EB]">
            <span className="w-1.5 h-1.5 bg-[#22C55E]" />
            <span className="text-[#4B5563] text-[10px] font-bold">IDENTITY: {user?.email}</span>
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
            onClick={handleSignOut}
            className="h-8 px-3 bg-white border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white text-[10px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE / OPERATIONAL CANVAS */}
      <main className="ml-[240px] flex-1 min-h-screen p-6 bg-[#F5F5F5] pt-20">
        <Suspense fallback={<SwissSuspenseLoader label="ADMIN_PORTAL // INITIALIZING VIEW" />}>
          {currentTab === 'dashboard' && <DashboardPage />}
          {currentTab === 'bookings' && <BookingPage />}
          {currentTab === 'tours' && <TourPage />}
          {currentTab === 'departures' && <DeparturePage />}
          {currentTab === 'airlines' && <AirlinesPage />}
          {currentTab === 'users' && <UsersPage />}
          {currentTab === 'destinations' && <DestinationPage />}
          {currentTab === 'articles' && <ArticlePage />}
          {currentTab === 'coupons' && <CouponPage />}
        </Suspense>
      </main>
    </div>
  );
};

export default AdminApp;
