import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from './Icons';
import { Avatar } from './Avatar';

export const Header: React.FC = () => {
  const { branding, currentAccount, notifications, navigate, screen } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#0A0E17]/85 backdrop-blur-md border-[#232D48]/80 shadow-lg'
          : 'bg-[#0A0E17] border-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Logo and Brand Title */}
        <div
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none min-w-0"
        >
          {branding.logo ? (
            <img
              src={branding.logo}
              alt={branding.siteName}
              className="w-8 h-8 rounded-lg object-cover border border-[#232D48] flex-shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3E8EFF] to-[#7C5CFF] flex items-center justify-center font-bold text-white text-base flex-shrink-0 shadow-sm shadow-[#3E8EFF]/20">
              {branding.siteName.charAt(0) || 'C'}
            </div>
          )}
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-extrabold text-base tracking-tight text-[#F3F5F9] truncate group-hover:text-[#3E8EFF] transition-colors">
              {branding.siteName}
            </span>
            <span className="text-[10px] text-[#8A93AC] tracking-wider uppercase truncate hidden xs:inline">
              FreeFire Craftland
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('home')}
            className={`text-sm font-semibold transition-colors ${
              screen === 'home' ? 'text-[#3E8EFF]' : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate('explore')}
            className={`text-sm font-semibold transition-colors ${
              screen === 'explore' ? 'text-[#3E8EFF]' : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => navigate('favorites')}
            className={`text-sm font-semibold transition-colors ${
              screen === 'favorites' ? 'text-[#3E8EFF]' : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => navigate('submit')}
            className={`text-sm font-semibold transition-colors ${
              screen === 'submit' ? 'text-[#3E8EFF]' : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            Submit Map
          </button>
          {currentAccount?.role === 'owner' && (
            <button
              onClick={() => navigate('ownerPanel')}
              className={`text-sm font-semibold transition-colors ${
                screen === 'ownerPanel' ? 'text-[#FF5D6C]' : 'text-[#8A93AC] hover:text-[#FF5D6C]'
              }`}
            >
              Admin Panel
            </button>
          )}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick Search trigger for mobile */}
          <button
            onClick={() => navigate('explore')}
            className="md:hidden w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
            title="Search maps"
            aria-label="Search maps"
          >
            <Icons.Search size={18} />
          </button>

          {/* Notifications Trigger */}
          {currentAccount && (
            <button
              onClick={() => navigate('notifications')}
              className="relative w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Icons.Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#FF5D6C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0E17] animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Account Profile or Sign In Button */}
          {currentAccount ? (
            <button
              onClick={() => navigate('account')}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-[#232D48] bg-[#141B2C] hover:bg-[#1C2540] transition-colors"
              title={currentAccount.name}
            >
              <Avatar name={currentAccount.name} src={currentAccount.avatar} size={28} />
              <span className="text-xs font-semibold text-[#F3F5F9] max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">
                {currentAccount.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate('auth')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white text-xs font-semibold shadow-md shadow-[#3E8EFF]/20 hover:opacity-95 active:scale-95 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
