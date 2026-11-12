import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';

export const PermissionExplainPage: React.FC = () => {
  const permissions = [
    {
      title: 'FULL LEGAL NAME & BIOMETRIC AVATAR',
      scope: 'scope.userInfo',
      purpose: 'Utilized to cross-verify passenger manifest entries and preliminary boarding pass validation prior to gate clearance.',
      required: true,
    },
    {
      title: 'VERIFIED TELEPHONE NUMBER',
      scope: 'scope.userPhonenumber',
      purpose: 'Mandatory for real-time dispatch alerts including gate reassignments, flight delay notifications, and emergency alerts.',
      required: true,
    },
    {
      title: 'COMMUNICATIONS EMAIL ADDRESS',
      scope: 'scope.userEmail',
      purpose: 'Designated recipient for encrypted IATA-compliant PDF e-boarding passes and corporate tax invoices.',
      required: false,
    },
  ];

  return (
    <PageShell
      title="AUTHENTICATION DISCLOSURE & DATA PRIVACY"
      subtitle="Transparent data stewardship governed by Aviation Authority Directives and Data Protection Standards"
      badge="PRIVACY_DISCLOSURE"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Sign In', path: '/auth/login' },
        { label: 'Permission Disclosure' },
      ]}
    >
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E7EB] p-8 space-y-6">
        <div className="border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="font-black text-lg text-black uppercase tracking-tight">
              PASSENGER DATA PROTECTION COMMITMENT
            </h1>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            The AeroOps dispatch system enforces uncompromising data security protocols. We solicit solely the bare minimum telemetry fields required to process international flight bookings and issue official boarding passes.
          </p>
        </div>

        {/* Permissions Table */}
        <div className="space-y-4">
          {permissions.map((perm, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#F5F5F5] border border-[#E5E7EB] font-mono text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black" />
                  <span className="font-bold text-black">{perm.title}</span>
                </div>
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                    perm.required ? 'bg-black text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                  }`}
                >
                  {perm.required ? 'MANDATORY' : 'OPTIONAL'}
                </span>
              </div>
              <div className="text-[10px] text-[#DC2626]">SCOPE: {perm.scope}</div>
              <p className="text-xs text-[#4B5563] font-sans pt-1 leading-relaxed">
                {perm.purpose}
              </p>
            </div>
          ))}
        </div>

        {/* Security standards box */}
        <div className="p-4 border border-black bg-white space-y-2">
          <div className="font-mono text-xs font-bold text-black uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>ACTIVE SECURITY & COMPLIANCE BENCHMARKS</span>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed">
            - End-to-end telemetry encrypted using TLS 1.3 with SHA-256 digital certificate authorities.<br />
            - Information is never disclosed to commercial third parties outside Civil Aviation Authorities, Customs, and Airport Border Security.
          </p>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <Link
            to="/auth/login"
            className="px-5 py-2.5 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider transition-none"
          >
            ← RETURN TO AUTHENTICATION GATEWAY
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default PermissionExplainPage;
