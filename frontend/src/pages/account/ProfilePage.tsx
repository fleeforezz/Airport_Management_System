import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!user) {
    return (
      <PageShell
        title="PASSENGER & DISPATCH IDENTITY DOSSIER"
        subtitle="Manage verified identity credentials, linked SSO session, and frequent flyer mileage tier"
        badge="UNAUTHENTICATED"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Passenger Profile' }]}
      >
        <div className="max-w-xl mx-auto bg-white border-2 border-black p-8 text-center space-y-5">
          <div className="w-12 h-12 bg-[#F5F5F5] border border-black text-black flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <div>
            <h2 className="font-black text-lg text-black uppercase tracking-tight">
              NO ACTIVE IDENTITY SESSION DETECTED
            </h2>
            <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
              Please authenticate your identity via the AeroOps Security Gateway to view your personal flight dossier, frequent flyer tier, and registered electronic tickets.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3 font-mono">
            <Link
              to="/auth/login"
              className="px-6 py-2.5 bg-black text-white hover:bg-[#DC2626] text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-2"
            >
              <span>ACCESS IDENTITY GATEWAY</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="PASSENGER & DISPATCH IDENTITY DOSSIER"
      subtitle="Manage verified identity credentials, linked SSO session, and frequent flyer mileage tier"
      badge="USER_PROFILE"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Passenger Profile' }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Identity Card */}
        <div className="bg-white border border-[#E5E7EB] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 object-cover border border-black"
              />
            ) : (
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-mono text-xl font-bold">
                {user?.name.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg text-black uppercase">
                  {user?.name}
                </h1>
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] font-bold uppercase">
                  {user?.role || 'STANDARD PASSENGER'}
                </span>
              </div>
              <div className="font-mono text-xs text-[#4B5563] mt-0.5">
                IDENTIFIER: {user?.id} | REGISTERED: {formatDate(user?.createdAt || '2026-01-15')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-none"
            >
              TERMINATE SESSION
            </button>
          </div>
        </div>

        {/* Loyalty Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E5E7EB] p-4 font-mono">
            <div className="text-[10px] text-[#4B5563] uppercase">MEMBERSHIP TIER</div>
            <div className="text-xl font-black text-black mt-1">PLATINUM DISPATCH</div>
            <div className="text-[10px] text-[#22C55E] mt-1">Biometric security bypass enabled</div>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-4 font-mono">
            <div className="text-[10px] text-[#4B5563] uppercase">ACCRUED FLIGHT MILES</div>
            <div className="text-xl font-black text-[#DC2626] mt-1">28,450 MILES</div>
            <div className="text-[10px] text-[#4B5563] mt-1">Redeemable for 2 round-trip charters</div>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-4 font-mono">
            <div className="text-[10px] text-[#4B5563] uppercase">COMPLETED FLIGHTS</div>
            <div className="text-xl font-black text-black mt-1">16 FLIGHTS</div>
            <div className="text-[10px] text-[#4B5563] mt-1">On-time departure rate: 100%</div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
          <div className="font-mono text-xs font-bold text-black uppercase pb-2 border-b border-[#E5E7EB]">
            UPDATE CONTACT & PASSENGER TELEMETRY
          </div>

          {saveSuccess && (
            <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E] text-[#22C55E] font-mono text-xs font-bold">
              ✓ PASSENGER TELEMETRY PROFILE SUCCESSFULLY SYNCHRONIZED!
            </div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                FULL LEGAL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                PRIMARY PHONE NUMBER
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                DISPATCH EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                SSO UNIQUE IDENTIFIER
              </label>
              <input
                type="text"
                disabled
                value={user?.zaloId || 'sso_alex_8821'}
                className="w-full h-10 px-3 bg-[#EEEEEE] border border-[#E5E7EB] font-mono text-xs text-[#7E7576]"
              />
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="submit"
                className="px-6 py-2.5 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black"
              >
                SAVE DOSSIER MODIFICATIONS
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
};

export default ProfilePage;
