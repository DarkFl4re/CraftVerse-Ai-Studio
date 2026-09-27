import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from './Icons';

export const BottomNav: React.FC = () => {
  const { screen, navigate, currentAccount, likedPostIds } = useApp();

  const handleNav = (target: 'home' | 'explore' | 'submit' | 'favorites' | 'account') => {
    if ((target === 'submit' || target === 'favorites' || target === 'account') && !currentAccount) {
      navigate('auth');
      return;
    }
    navigate(target);
  };

  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: <Icons.Home size={22} filled={screen === 'home'} />,
      active: screen === 'home',
    },
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: <Icons.Compass size={22} />,
      active: screen === 'explore',
    },
    {
      id: 'submit' as const,
      label: 'Submit',
      icon: <Icons.Plus size={24} />,
      active: screen === 'submit',
      highlight: true,
    },
    {
      id: 'favorites' as const,
      label: 'Saved',
      icon: <Icons.Heart size={22} fill={screen === 'favorites' ? '#FF5D6C' : 'none'} />,
      active: screen === 'favorites',
      badge: likedPostIds.length > 0 ? likedPostIds.length : undefined,
    },
    {
      id: 'account' as const,
      label: 'Profile',
      icon: <Icons.User size={22} filled={screen === 'account' || screen === 'editAccount'} />,
      active: screen === 'account' || screen === 'editAccount',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E17]/95 backdrop-blur-lg border-t border-[#232D48] px-2 py-1.5 pb-[max(6px,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all duration-150 ${
              item.active
                ? 'text-[#3E8EFF]'
                : 'text-[#8A93AC] hover:text-[#F3F5F9]'
            }`}
          >
            {item.highlight ? (
              <div
                className={`w-10 h-10 -mt-3 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                  item.active
                    ? 'bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] text-white scale-105 shadow-[#3E8EFF]/30'
                    : 'bg-[#1C2540] border border-[#232D48] text-[#3E8EFF] hover:scale-105'
                }`}
              >
                {item.icon}
              </div>
            ) : (
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-[#FF5D6C] text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
            )}
            <span
              className={`text-[10px] font-medium tracking-tight mt-0.5 ${
                item.highlight ? 'mt-1' : ''
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
