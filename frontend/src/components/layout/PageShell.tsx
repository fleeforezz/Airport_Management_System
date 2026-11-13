import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  actions?: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
}) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] pb-16 lg:pb-0">
      <Header />

      {/* Optional Breadcrumb and Page Banner Bar */}
      {(title || breadcrumbs) && (
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            {/* Breadcrumb trail */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#4B5563] mb-2">
                {breadcrumbs.map((b, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-[#E5E7EB]">/</span>}
                    {b.path ? (
                      <a href={b.path} className="hover:text-black">
                        {b.label}
                      </a>
                    ) : (
                      <span className="text-black font-bold">{b.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Header Title with Swiss Accent */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-[#DC2626] inline-block" />
                  <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">
                    {title}
                  </h1>
                  {badge && (
                    <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                      {badge}
                    </span>
                  )}
                </div>
                {subtitle && (
                  <p className="font-mono text-xs text-[#4B5563] mt-1 tracking-tight">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Body with Smooth Swiss Transition */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 swiss-page-enter">
        {children}
      </main>

      {/* Swiss Modernist Footer */}
      <footer className="bg-black text-white border-t border-[#1F2937] py-10 mt-12 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#1F2937]">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#DC2626]" />
                <span className="font-black text-base tracking-tight uppercase">
                  AEROFLIGHT // SYS
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Global flight dispatch and premier air charter booking infrastructure built to Swiss Modernism 2.0 standards.
              </p>
              <div className="font-mono text-[10px] text-[#9CA3AF]">
                KJFK - SGN - HAN - DAD - NRT
              </div>
            </div>

            {/* Links column 1 */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">
                {t('footer.flightOps')}
              </div>
              <ul className="space-y-2 text-xs">
                <li><a href="/tours" className="hover:text-[#DC2626] transition-none">{t('footer.flightMatrix')}</a></li>
                <li><a href="/explore" className="hover:text-[#DC2626] transition-none">{t('footer.airportDir')}</a></li>
                <li><a href="/articles" className="hover:text-[#DC2626] transition-none">{t('footer.kioskDirectives')}</a></li>
              </ul>
            </div>

            {/* Links column 2 */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">
                {t('footer.passengerServices')}
              </div>
              <ul className="space-y-2 text-xs">
                <li><a href="/booking/my" className="hover:text-[#DC2626] transition-none">{t('footer.retrievePnr')}</a></li>
                <li><a href="/auth/permissions" className="hover:text-[#DC2626] transition-none">{t('footer.privacyDisclosure')}</a></li>
                <li><a href="/account/profile" className="hover:text-[#DC2626] transition-none">{t('footer.vipMileage')}</a></li>
              </ul>
            </div>

            {/* Links column 3 */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">
                {t('footer.dispatchOps')}
              </div>
              <ul className="space-y-2 text-xs">
                <li><a href="/auth/login" className="text-[#DC2626] font-bold hover:underline">{t('footer.officerPortal')}</a></li>
                <li><span className="text-[#9CA3AF]">{t('footer.release')}</span></li>
                <li><span className="text-[#9CA3AF]">{t('footer.station')}</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between font-mono text-[10px] text-[#9CA3AF] gap-3">
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <span>{t('footer.rights')}</span>
            </div>
            <div>{t('footer.telemetry')}</div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
};

export default PageShell;
