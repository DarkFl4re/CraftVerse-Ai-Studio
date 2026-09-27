import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from './Icons';

export const PhotoLightbox: React.FC = () => {
  const { lightboxAccount, setLightboxAccount } = useApp();

  if (!lightboxAccount || !lightboxAccount.avatar) return null;

  return (
    <div
      onClick={() => setLightboxAccount(null)}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
    >
      {/* Top action bar */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <a
          href={lightboxAccount.avatar}
          download={`${lightboxAccount.username || lightboxAccount.name}-avatar.jpg`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#F3F5F9] text-xs font-semibold hover:bg-[#1C2540] transition-colors"
        >
          <Icons.Download size={16} />
          <span>Download</span>
        </a>
        <button
          onClick={() => setLightboxAccount(null)}
          className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
        >
          <Icons.Close size={20} />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center text-center max-w-sm w-full"
      >
        <img
          src={lightboxAccount.avatar}
          alt={lightboxAccount.name}
          className="max-w-full max-h-[70vh] rounded-3xl object-contain border-2 border-[#232D48] shadow-2xl mb-4"
        />
        <h4 className="font-extrabold text-base text-[#F3F5F9]">
          {lightboxAccount.name}
        </h4>
        {lightboxAccount.username && (
          <p className="text-xs text-[#8A93AC]">@{lightboxAccount.username}</p>
        )}
      </div>
    </div>
  );
};
