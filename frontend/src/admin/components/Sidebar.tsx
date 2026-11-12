import React from 'react';

export type AdminTab =
  | 'dashboard'
  | 'bookings'
  | 'tours'
  | 'departures'
  | 'destinations'
  | 'articles'
  | 'coupons';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const user = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const operatorName = user?.name ? user.name.toUpperCase() : 'CHIEF DISPATCHER';
  const operatorRole = user?.role ? `${user.role} [${user.id || 'SYS'}]` : 'ADMIN [KJFK-01]';
  const initials = operatorName.split(' ').map((n: string) => n.charAt(0)).slice(0, 2).join('') || 'AM';
  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col justify-between bg-white z-40 border-r border-[#E5E7EB] text-black select-none">
      <div className="overflow-y-auto flex-1">
        {/* Brand / System Identifier */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black text-xs font-mono tracking-tighter">
              <span className="material-symbols-outlined text-[15px]">north_east</span>
            </div>
            <div>
              <div className="flex items-center gap-1 font-black text-sm tracking-tight leading-none text-black uppercase">
                <span>AEROOPS</span>
                <span className="w-1.5 h-1.5 bg-[#DC2626] inline-block" />
              </div>
              <div className="font-mono text-[9px] text-[#4B5563] tracking-widest uppercase mt-0.5">
                SYS / KJFK-V2.0
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5E7EB] flex items-center justify-between font-mono text-[9px] text-[#4B5563]">
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <span className="w-1.5 h-1.5 bg-[#DC2626]" />
              STATION: T4 DISPATCH
            </span>
            <span className="font-bold text-black">v4.8.2</span>
          </div>
        </div>

        {/* Navigation List strictly structured */}
        <div className="px-3 pt-3 space-y-4">
          {/* 01 / OVERVIEW */}
          <div>
            <div className="px-2 pb-1 font-mono text-[9px] text-[#4B5563] uppercase tracking-wider font-bold">
              01 / OVERVIEW
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'dashboard'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[15px]">dashboard</span>
                  <span className="font-medium tracking-tight text-xs">Operations Dashboard</span>
                </div>
                <span
                  className={`font-mono text-[9px] ${
                    currentTab === 'dashboard' ? 'text-white' : 'text-[#9CA3AF]'
                  }`}
                >
                  [01]
                </span>
              </button>
            </nav>
          </div>

          {/* 02 / OPERATIONS */}
          <div>
            <div className="px-2 pb-1 font-mono text-[9px] text-[#4B5563] uppercase tracking-wider font-bold">
              02 / FLIGHT OPERATIONS
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => onSelectTab('bookings')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'bookings'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {currentTab === 'bookings' && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
                  <span className="tracking-tight text-xs">Bookings & PNR</span>
                </div>
                <span className="font-mono text-[9px] px-1 bg-[#262626] text-white">2.4k</span>
              </button>

              <button
                onClick={() => onSelectTab('tours')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'tours'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {currentTab === 'tours' && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  <span className="material-symbols-outlined text-[15px]">travel_explore</span>
                  <span className="font-medium tracking-tight text-xs">Flight Tours & Charters</span>
                </div>
                <span className="font-mono text-[9px] text-[#9CA3AF]">[18]</span>
              </button>

              <button
                onClick={() => onSelectTab('departures')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'departures'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {currentTab === 'departures' && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  <span className="material-symbols-outlined text-[15px]">flight_takeoff</span>
                  <span className="font-medium tracking-tight text-xs">Departure Matrix</span>
                </div>
                <span className="font-mono text-[9px] text-[#9CA3AF]">[64]</span>
              </button>
            </nav>
          </div>

          {/* 03 / METADATA & CONTENT */}
          <div>
            <div className="px-2 pb-1 font-mono text-[9px] text-[#4B5563] uppercase tracking-wider font-bold">
              03 / NETWORK & METADATA
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => onSelectTab('destinations')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'destinations'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {currentTab === 'destinations' && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  <span className="material-symbols-outlined text-[15px]">local_airport</span>
                  <span className="font-medium tracking-tight text-xs">Airports & Gateways</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('articles')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'articles'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {currentTab === 'articles' && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  <span className="material-symbols-outlined text-[15px]">article</span>
                  <span className="font-medium tracking-tight text-xs">Terminal Directives</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('coupons')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 transition-none cursor-pointer text-left ${
                  currentTab === 'coupons'
                    ? 'bg-black text-white font-bold'
                    : 'text-[#4B5563] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {currentTab === 'coupons' && <span className="w-1.5 h-1.5 bg-[#DC2626]" />}
                  <span className="material-symbols-outlined text-[15px]">sell</span>
                  <span className="font-medium tracking-tight text-xs">Tariffs & Concessions</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Operator Info & Client Link */}
      <div className="p-3 border-t border-[#E5E7EB] bg-[#F5F5F5]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-mono font-bold text-[10px]">
              {initials}
            </div>
            <div>
              <div className="font-bold text-[11px] leading-tight text-black truncate max-w-[130px]">{operatorName}</div>
              <div className="font-mono text-[8px] text-[#4B5563]">{operatorRole}</div>
            </div>
          </div>
          <a
            href="/"
            title="Return to Passenger Portal"
            className="text-[#4B5563] hover:text-black"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
        <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between font-mono text-[9px] text-[#4B5563]">
          <span>T4_SECURE_LAN</span>
          <span className="text-[#DC2626] font-bold">LAT: 14MS</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
