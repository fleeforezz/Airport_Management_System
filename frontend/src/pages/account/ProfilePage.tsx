import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/format';

const PRESET_AVATARS = [
  {
    id: 'pilot_capt',
    name: 'Airline Captain',
    url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'first_officer',
    name: 'First Officer',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'dispatcher',
    name: 'Ground Dispatcher',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'traveler',
    name: 'Global Passenger',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'route_lead',
    name: 'Operations Lead',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'alpine_flyer',
    name: 'Alpine Explorer',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [customUrl, setCustomUrl] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setEmail(user.email);
      setAvatarPreview(user.avatarUrl || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, phone, email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleOpenAvatarModal = () => {
    setAvatarPreview(user?.avatarUrl || '');
    setCustomUrl(user?.avatarUrl?.startsWith('data:') ? '' : user?.avatarUrl || '');
    setAvatarError('');
    setShowAvatarModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError(t('profile.invalidImage'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError(t('profile.fileTooBig'));
      return;
    }

    setAvatarError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      setCustomUrl('');
    };
    reader.onerror = () => {
      setAvatarError(t('profile.invalidImage'));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setAvatarPreview(customUrl.trim());
    setAvatarError('');
  };

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    try {
      await updateProfile({ avatarUrl: avatarPreview.trim() });
      setShowAvatarModal(false);
      setAvatarSuccess(true);
      setTimeout(() => setAvatarSuccess(false), 3500);
    } catch {
      setAvatarError('Failed to synchronize avatar.');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setCustomUrl('');
    setAvatarError('');
  };

  if (!user) {
    return (
      <PageShell
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
        badge="UNAUTHENTICATED"
        breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: 'Passenger Profile' }]}
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
      title={t('profile.title')}
      subtitle={t('profile.subtitle')}
      badge="USER_PROFILE"
      breadcrumbs={[{ label: t('nav.home'), path: '/' }, { label: 'Passenger Profile' }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Notifications */}
        {avatarSuccess && (
          <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E] text-[#22C55E] font-mono text-xs font-bold flex items-center justify-between">
            <span>{t('profile.avatarSuccess')}</span>
            <span className="font-bold">OK ✓</span>
          </div>
        )}

        {/* Profile Identity Card with Interactive Avatar */}
        <div className="bg-white border-2 border-black p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Frame with Zero-Radius Swiss Modernism Style */}
            <div className="relative group flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-20 h-20 object-cover border-2 border-black bg-[#F5F5F5]"
                />
              ) : (
                <div className="w-20 h-20 bg-black text-white flex items-center justify-center font-mono text-2xl font-black border-2 border-black select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Hover / Click to Change Trigger */}
              <button
                type="button"
                onClick={handleOpenAvatarModal}
                className="absolute inset-0 bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-none flex flex-col items-center justify-center font-mono text-[9px] font-bold uppercase gap-1 cursor-pointer select-none"
                title={t('profile.changeAvatar')}
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                <span>{t('profile.changeAvatar')}</span>
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-black text-xl text-black uppercase tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <div className="font-mono text-xs text-[#4B5563] mt-1">
                IDENTIFIER: {user.id} | REGISTERED: {formatDate(user.createdAt || '2026-01-15')}
              </div>
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleOpenAvatarModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F5] hover:bg-black hover:text-white border border-[#E5E7EB] hover:border-black font-mono text-[10px] font-bold uppercase tracking-wider text-black transition-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  <span>{t('profile.changeAvatar')}</span>
                </button>
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
          <div className="font-mono text-xs font-bold text-black uppercase pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#DC2626]" />
            <span>UPDATE CONTACT & PASSENGER TELEMETRY</span>
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
                value={user?.zaloId || 'sso_verified_user'}
                className="w-full h-10 px-3 bg-[#EEEEEE] border border-[#E5E7EB] font-mono text-xs text-[#7E7576]"
              />
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="submit"
                className="px-6 py-2.5 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black cursor-pointer"
              >
                SAVE DOSSIER MODIFICATIONS
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SWISS MODERNISM 2.0 AVATAR MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-none animate-none">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-5 shadow-none rounded-none">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#DC2626]" />
                <h3 className="font-mono text-xs font-black uppercase text-black tracking-wider">
                  {t('profile.avatarModalTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="w-7 h-7 flex items-center justify-center text-black hover:bg-black hover:text-white border border-[#E5E7EB] hover:border-black font-mono text-xs font-bold transition-none"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {avatarError && (
              <div className="p-2.5 bg-[#DC2626]/10 border border-[#DC2626] text-[#DC2626] font-mono text-xs font-bold">
                * {avatarError}
              </div>
            )}

            {/* Preview Section */}
            <div className="bg-[#F5F5F5] border border-[#E5E7EB] p-4 flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-black bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError('Cannot load image from preview URL.')}
                  />
                ) : (
                  <div className="w-full h-full bg-black text-white flex items-center justify-center font-mono text-2xl font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="font-mono space-y-1">
                <div className="text-[10px] text-[#DC2626] font-bold uppercase tracking-wider">
                  {t('profile.preview')}
                </div>
                <div className="text-xs font-bold text-black uppercase">
                  {user.name}
                </div>
                <div className="text-[10px] text-[#4B5563]">
                  {avatarPreview ? (avatarPreview.startsWith('data:') ? 'Local Image File (Data URL)' : 'Remote Image Link') : 'Default Passenger Monogram'}
                </div>
              </div>
            </div>

            {/* Option 1: Upload from Device */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">
                [ A ] {t('profile.uploadDevice')}
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-[#F5F5F5] hover:bg-black hover:text-white border border-[#E5E7EB] hover:border-black font-mono text-xs font-bold uppercase tracking-wider text-black transition-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>{t('profile.chooseFile')}</span>
              </button>
            </div>

            {/* Option 2: Curated Aviation Presets */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">
                [ B ] {t('profile.orPreset')}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatarPreview === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatarPreview(preset.url);
                        setCustomUrl('');
                        setAvatarError('');
                      }}
                      className={`h-14 border-2 transition-none relative group overflow-hidden ${
                        isSelected ? 'border-[#DC2626]' : 'border-[#E5E7EB] hover:border-black'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#DC2626]/20 border border-[#DC2626] flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-[#DC2626]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Image URL input */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1.5">
                [ C ] {t('profile.orUrl')}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    if (e.target.value.trim().startsWith('http')) {
                      setAvatarPreview(e.target.value.trim());
                    }
                  }}
                  placeholder={t('profile.urlPlaceholder')}
                  className="flex-1 h-9 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 bg-black hover:bg-[#DC2626] text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-none"
                >
                  LOAD
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-[#DC2626] hover:underline font-bold uppercase transition-none"
              >
                {t('profile.removeAvatar')}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] hover:border-black text-black font-bold uppercase tracking-wider transition-none"
                >
                  {t('profile.cancel')}
                </button>
                <button
                  type="button"
                  disabled={isSavingAvatar}
                  onClick={handleSaveAvatar}
                  className="px-5 py-2 bg-black hover:bg-[#DC2626] text-white font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingAvatar ? 'SAVING...' : t('profile.saveAvatar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default ProfilePage;
