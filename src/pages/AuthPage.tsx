import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/common/Icons';

export const AuthPage: React.FC = () => {
  const {
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    accounts,
    switchAccount,
    navigate,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signup') {
      if (!name.trim()) {
        showToast('Please enter your display name.', 'error');
        setLoading(false);
        return;
      }
      const res = await signupWithEmail(name, identifier, password);
      if (!res.success && res.error) {
        showToast(res.error, 'error');
      }
    } else {
      const res = await loginWithEmail(identifier, password);
      if (!res.success && res.error) {
        showToast(res.error, 'error');
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const res = await loginWithGoogle();
    if (!res.success && res.error) {
      showToast(res.error, 'error');
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = (account: (typeof accounts)[0]) => {
    switchAccount(account);
    if (account.role === 'owner') {
      navigate('ownerPanel');
    } else {
      navigate('submit');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-6 pb-20">
      {/* Back button */}
      <button
        onClick={() => navigate('home')}
        className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors mb-6"
      >
        <Icons.ArrowLeft size={18} />
      </button>

      {/* Main Card */}
      <div className="rounded-3xl bg-[#141B2C] border border-[#232D48] shadow-2xl overflow-hidden">
        {/* Card Header Gradient */}
        <div className="p-6 text-center bg-gradient-to-br from-[#3E8EFF] to-[#7C5CFF] text-white">
          <h2 className="font-extrabold text-2xl tracking-tight mb-1">
            {mode === 'login' ? 'Welcome to CraftVerse' : 'Join as a Creator'}
          </h2>
          <p className="text-xs text-white/80 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Sign in to publish Free Fire maps and save your favorite room codes.'
              : 'Create an account to share your custom Craftland arenas with the world.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#232D48] bg-[#0A0E17]">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'login'
                ? 'text-[#3E8EFF] border-b-2 border-[#3E8EFF] bg-[#141B2C]'
                : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              mode === 'signup'
                ? 'text-[#3E8EFF] border-b-2 border-[#3E8EFF] bg-[#141B2C]'
                : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Raptor_FF"
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or username"
              className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#8A93AC] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0E17] border border-[#232D48] focus:border-[#3E8EFF] text-[#F3F5F9] text-sm rounded-xl px-3.5 py-2.5 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A93AC] hover:text-[#F3F5F9]"
              >
                {showPassword ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white font-extrabold text-sm shadow-md shadow-[#3E8EFF]/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up Free'}
          </button>

          {/* Google Sign In */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#232D48]" />
            </div>
            <span className="relative px-3 bg-[#141B2C] text-[11px] uppercase font-mono text-[#5C6580]">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[#F3F5F9] text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <Icons.Google size={18} />
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Demo Accounts Quick-Login Section */}
        <div className="p-4 bg-[#0A0E17] border-t border-[#232D48]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A93AC] mb-2 text-center">
            Quick Demo Accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            {accounts.slice(0, 4).map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickDemoLogin(acc)}
                className="p-2 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] text-left transition-colors flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3E8EFF] to-[#7C5CFF] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {acc.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#F3F5F9] truncate">
                    {acc.name}
                  </div>
                  <div className="text-[9px] text-[#8A93AC] uppercase font-mono">
                    {acc.role === 'owner' ? 'Owner' : 'Creator'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
