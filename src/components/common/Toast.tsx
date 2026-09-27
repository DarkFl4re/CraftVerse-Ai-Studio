import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from './Icons';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-16 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 max-w-sm w-full animate-bounce-short">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium transition-all ${
          isError
            ? 'bg-[#1C2540]/95 text-[#F3F5F9] border-[#FF5D6C] shadow-[#FF5D6C]/20'
            : isInfo
            ? 'bg-[#1C2540]/95 text-[#F3F5F9] border-[#3E8EFF] shadow-[#3E8EFF]/20'
            : 'bg-[#1C2540]/95 text-[#F3F5F9] border-[#34D399] shadow-[#34D399]/20'
        }`}
      >
        <div
          className={`flex-shrink-0 ${
            isError ? 'text-[#FF5D6C]' : isInfo ? 'text-[#3E8EFF]' : 'text-[#34D399]'
          }`}
        >
          {isError ? (
            <Icons.Ban size={18} />
          ) : isInfo ? (
            <Icons.Bell size={18} />
          ) : (
            <Icons.Check size={18} />
          )}
        </div>
        <span className="flex-1 break-words leading-tight">{toast.msg}</span>
      </div>
    </div>
  );
};
