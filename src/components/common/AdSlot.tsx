import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from './Icons';
import { sanitizeUrl } from '../../utils/platforms';

interface AdSlotProps {
  variant: 'native' | 'postview';
}

export const AdSlot: React.FC<AdSlotProps> = ({ variant }) => {
  const { adSettings } = useApp();
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      variant === 'postview' &&
      adSettings.postViewAdType === 'code' &&
      adSettings.postViewAdCode &&
      scriptContainerRef.current
    ) {
      scriptContainerRef.current.innerHTML = adSettings.postViewAdCode;
      const scripts = scriptContainerRef.current.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.text = oldScript.textContent || '';
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [variant, adSettings.postViewAdType, adSettings.postViewAdCode]);

  if (!adSettings.adsEnabled) return null;

  if (variant === 'postview') {
    if (!adSettings.postViewEnabled) return null;

    if (adSettings.postViewAdType === 'code' && adSettings.postViewAdCode) {
      return (
        <div className="my-5 rounded-2xl overflow-hidden border border-[#232D48] bg-[#141B2C] p-2 text-center">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#5C6580] mb-2">
            Sponsored
          </div>
          <div ref={scriptContainerRef} />
        </div>
      );
    }

    if (adSettings.postViewAdImage) {
      const img = (
        <img
          src={adSettings.postViewAdImage}
          alt="Sponsored Partner"
          className="w-full object-cover rounded-2xl max-h-48 border border-[#232D48]"
        />
      );
      return (
        <div className="my-5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#5C6580] mb-1.5 pl-1">
            Sponsored
          </div>
          {adSettings.postViewAdLink ? (
            <a
              href={sanitizeUrl(adSettings.postViewAdLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-95 transition-opacity"
            >
              {img}
            </a>
          ) : (
            img
          )}
        </div>
      );
    }

    // Default clean partner slot
    return (
      <div className="my-5 rounded-2xl border border-dashed border-[#232D48] bg-[#141B2C]/70 p-4 text-center">
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#5C6580]">
          Sponsored Partner
        </span>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E8EFF] to-[#7C5CFF] flex items-center justify-center text-white">
            <Icons.Megaphone size={20} />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm text-[#F3F5F9]">Community Showcase</div>
            <div className="text-xs text-[#8A93AC]">Custom tournaments & weekly scrim prizes</div>
          </div>
        </div>
      </div>
    );
  }

  // Native feed ad slot
  if (!adSettings.nativeEnabled) return null;

  return (
    <div className="bg-[#141B2C] border border-[#232D48] rounded-2xl p-4 mb-4 flex items-center gap-3.5 hover:border-[#3E8EFF]/40 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5D6C] to-[#FF9B5D] flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-[#FF5D6C]/20">
        <Icons.Megaphone size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C6580]">
          Sponsored Partner
        </div>
        <div className="font-bold text-sm text-[#F3F5F9] truncate">
          Join the Elite Craftland Scrim League
        </div>
        <div className="text-xs text-[#8A93AC] truncate">
          Weekly custom room tournaments with cash prizes
        </div>
      </div>
    </div>
  );
};
