import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import { useAuth } from '../../context/AuthContext';

type AuthMode = 'LOGIN' | 'REGISTER';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithZalo, isAuthenticated, user, logout } = useAuth();

  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('admin@airport.gov');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Fields
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Retrieve origin destination if redirected
  const from = (location.state as any)?.from?.pathname || '/account/profile';

  const handleSelectQuickCreds = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setSuccessMessage(`Credentials populated for ${demoEmail}`);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage(res.message || 'Authenticated successfully.');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 600);
      } else {
        setErrorMessage(res.message || 'Authentication rejected: Invalid credentials.');
      }
    } catch {
      setErrorMessage('Unexpected gateway communication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regEmail || !regPassword) {
      setErrorMessage('Email and password are mandatory fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        fullName: regFullName || regEmail.split('@')[0],
        username: regUsername || regEmail.split('@')[0],
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message || 'Account generated successfully!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 700);
      } else {
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMessage('Gateway network failure during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSsoClick = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginWithZalo();
      if (res.success) {
        setSuccessMessage('Biometric SSO verified. Redirecting...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageShell
      title="IDENTITY & ACCESS CLEARANCE GATEWAY"
      subtitle="Authenticated flight dispatch manifests, passenger PNR dossiers, and biometric terminal verification"
      badge="CLEARANCE_LEVEL_01"
      breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Identity Gateway' }]}
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Already Authenticated Banner */}
        {isAuthenticated && user && (
          <div className="bg-white border-2 border-black p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#22C55E]" />
                <span className="font-mono text-xs font-bold text-black uppercase">
                  ACTIVE TERMINAL SESSION DETECTED
                </span>
              </div>
              <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] font-bold uppercase">
                {user.role}
              </span>
            </div>

            <p className="text-xs text-[#4B5563]">
              You are currently signed in as <strong className="text-black">{user.name}</strong> ({user.email}).
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E5E7EB]">
              <Link
                to="/account/profile"
                className="px-3.5 py-1.5 bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#DC2626] transition-none"
              >
                VIEW PROFILE DOSSIER →
              </Link>
              {(user.role === 'ADMIN' || user.role === 'DISPATCHER') && (
                <a
                  href="/admin.html"
                  className="px-3.5 py-1.5 border border-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-none"
                >
                  ACCESS DISPATCH PORTAL →
                </a>
              )}
              <button
                onClick={logout}
                className="px-3.5 py-1.5 border border-[#DC2626] text-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#DC2626] hover:text-white transition-none ml-auto"
              >
                SIGN OUT
              </button>
            </div>
          </div>
        )}

        {/* Main Authentication Box */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 space-y-6">
          {/* Top Mode Selector Tabs */}
          <div className="grid grid-cols-2 border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-3 font-mono text-xs font-bold uppercase tracking-wider transition-none ${
                mode === 'LOGIN'
                  ? 'bg-black text-white'
                  : 'bg-[#F5F5F5] text-[#4B5563] hover:text-black'
              }`}
            >
              [ 01 ] SIGN IN TO ACCESS
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('REGISTER');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-3 font-mono text-xs font-bold uppercase tracking-wider transition-none ${
                mode === 'REGISTER'
                  ? 'bg-black text-white'
                  : 'bg-[#F5F5F5] text-[#4B5563] hover:text-black'
              }`}
            >
              [ 02 ] REGISTER NEW ACCOUNT
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="p-3 bg-[#DC2626]/10 border-l-4 border-[#DC2626] text-[#DC2626] font-mono text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
              <div>
                <div className="font-bold uppercase tracking-wider">AUTHENTICATION ERROR</div>
                <div className="mt-0.5">{errorMessage}</div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-[#22C55E]/10 border-l-4 border-[#22C55E] text-[#15803D] font-mono text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">check_circle</span>
              <div>
                <div className="font-bold uppercase tracking-wider">OPERATION VERIFIED</div>
                <div className="mt-0.5">{successMessage}</div>
              </div>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1">
                  OFFICIAL EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., admin@airport.gov or alex@gmail.com"
                  className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider">
                    SECURITY PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="font-mono text-[9px] text-[#4B5563] hover:text-black uppercase font-bold"
                  >
                    {showPassword ? '[ HIDE ]' : '[ SHOW ]'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access passphrase"
                  className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-none accent-black"
                  />
                  <span className="text-[11px] text-[#4B5563]">Remember on this terminal</span>
                </label>
                <Link
                  to="/auth/permissions"
                  className="text-[11px] text-[#4B5563] hover:text-black underline"
                >
                  Privacy Directives →
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>AUTHENTICATING TELEMETRY...</span>
                ) : (
                  <>
                    <span>VERIFY CREDENTIALS & ACCESS</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1">
                    FULL LEGAL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g., Alex Nguyen"
                    className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1">
                    USERNAME / PASSPORT ID
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g., alex_traveler"
                    className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g., traveler@global.com"
                    className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1">
                    TELEPHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+84 909 123 456"
                    className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-1">
                  SECURITY PASSWORD (MIN 6 CHARACTERS)
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create encrypted passphrase"
                  className="w-full h-11 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>GENERATING DOSSIER...</span>
                ) : (
                  <>
                    <span>REGISTER PASSENGER DOSSIER</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick-Access Test Credentials Matrix */}
          <div className="pt-5 border-t border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-black uppercase">[ QUICK-TEST CREDENTIALS MATRIX ]</span>
              <span className="text-[#9CA3AF]">ONE-CLICK FILL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectQuickCreds('admin@airport.gov', 'admin123')}
                className="p-2.5 bg-[#F5F5F5] border border-[#E5E7EB] hover:border-black text-left transition-none font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#DC2626]">CHIEF DISPATCHER</span>
                  <span className="text-[9px] text-[#4B5563]">[ADMIN]</span>
                </div>
                <div className="text-[11px] font-bold text-black mt-0.5 truncate">
                  admin@airport.gov
                </div>
                <div className="text-[9px] text-[#4B5563]">Pass: admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuickCreds('alex@gmail.com', 'user123')}
                className="p-2.5 bg-[#F5F5F5] border border-[#E5E7EB] hover:border-black text-left transition-none font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-black">PASSENGER</span>
                  <span className="text-[9px] text-[#4B5563]">[USER]</span>
                </div>
                <div className="text-[11px] font-bold text-black mt-0.5 truncate">
                  alex@gmail.com
                </div>
                <div className="text-[9px] text-[#4B5563]">Pass: user123</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuickCreds('dispatcher@aeroops.global', 'password')}
                className="p-2.5 bg-[#F5F5F5] border border-[#E5E7EB] hover:border-black text-left transition-none font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-black">OPERATIONS LEAD</span>
                  <span className="text-[9px] text-[#4B5563]">[DISPATCH]</span>
                </div>
                <div className="text-[11px] font-bold text-black mt-0.5 truncate">
                  dispatcher@...
                </div>
                <div className="text-[9px] text-[#4B5563]">Pass: password</div>
              </button>
            </div>
          </div>

          {/* Alternative Biometric / SSO Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSsoClick}
              disabled={isLoading}
              className="w-full py-2.5 bg-white hover:bg-[#F5F5F5] text-black font-mono text-xs font-bold uppercase tracking-wider transition-none border border-[#E5E7EB] hover:border-black flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
              <span>ONE-TOUCH BIOMETRIC / SSO LOGIN</span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default LoginPage;
