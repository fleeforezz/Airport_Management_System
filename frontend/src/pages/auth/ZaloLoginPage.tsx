import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import { useAuth } from '../../context/AuthContext';

export const ZaloLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithZalo, login } = useAuth();
  const [email, setEmail] = useState('dispatcher@aeroops.global');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSsoLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithZalo();
      navigate('/account/profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, 'DISPATCHER');
      navigate('/account/profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell
      title="AEROFLIGHT IDENTITY & ACCESS GATEWAY"
      subtitle="Verify passenger credentials via One-Touch SSO or internal dispatcher credentials"
      badge="AUTH_GATEWAY"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Sign In' }]}
    >
      <div className="max-w-md mx-auto bg-white border-2 border-black p-8 select-none space-y-6">
        {/* Brand header */}
        <div className="text-center pb-4 border-b border-[#E5E7EB]">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono font-bold text-sm mx-auto mb-2">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <h1 className="font-black text-lg text-black uppercase tracking-tight">
            AUTHENTICATE PASSENGER CREDENTIALS
          </h1>
          <p className="font-mono text-[10px] text-[#4B5563] mt-1">
            ICAO & SWISS MODERNISM 2.0 SECURITY STANDARD
          </p>
        </div>

        {/* Primary SSO Button */}
        <div>
          <button
            onClick={handleSsoLogin}
            disabled={isSubmitting}
            className="w-full py-3 bg-[#000000] hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none flex items-center justify-center gap-2 border border-black"
          >
            <span className="w-4 h-4 bg-white text-black font-black text-[10px] flex items-center justify-center">
              ✓
            </span>
            <span>ONE-TOUCH SINGLE SIGN-ON (SSO)</span>
          </button>
          <div className="mt-2 text-center">
            <Link
              to="/auth/permissions"
              className="font-mono text-[10px] text-[#4B5563] hover:text-black underline"
            >
              Review credential disclosure and access permissions →
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E5E7EB] w-full" />
          <span className="bg-white px-2 font-mono text-[10px] text-[#9CA3AF] uppercase">
            OR DISPATCH TERMINAL OPERATOR
          </span>
        </div>

        {/* Dispatcher / Email Login */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
              AUTHORIZED DISPATCHER ID / OPERATOR EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black"
          >
            ENTER OPERATIONS CONSOLE
          </button>
        </form>

        <div className="pt-2 border-t border-[#E5E7EB] text-center font-mono text-[9px] text-[#9CA3AF]">
          ALL TELEMETRY ENCRYPTED PURSUANT TO ISO/IEC 27001
        </div>
      </div>
    </PageShell>
  );
};

export default ZaloLoginPage;
