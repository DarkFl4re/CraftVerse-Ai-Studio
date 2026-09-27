import React from 'react';
import { useApp } from '../../context/AppContext';
import { renderPlatformIcon } from './Icons';
import { PLATFORM_META, sanitizeUrl } from '../../utils/platforms';

export const Footer: React.FC = () => {
  const { branding, navigate } = useApp();

  const enabledSocials = branding.socialEnabled
    ? (branding.socialLinks || []).filter((s) => s.enabled && s.url)
    : [];

  return (
    <footer className="mt-12 bg-[#141B2C] border-t border-[#232D48] rounded-t-3xl pt-8 pb-20 md:pb-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Footer Brand Logo */}
        {branding.footerLogo ? (
          <img
            src={branding.footerLogo}
            alt={branding.siteName}
            className="h-10 w-auto object-contain rounded-lg mb-3"
          />
        ) : (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3E8EFF] to-[#7C5CFF] flex items-center justify-center font-bold text-white text-base">
              {branding.siteName.charAt(0) || 'C'}
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#F3F5F9]">
              {branding.siteName}
            </span>
          </div>
        )}

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-[#8A93AC] max-w-md mb-5 leading-relaxed font-medium">
          {branding.footerTagline}
        </p>

        {/* Official Social Links */}
        {enabledSocials.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            {enabledSocials.map((soc) => {
              const meta = PLATFORM_META[soc.icon] || PLATFORM_META.other;
              return (
                <a
                  key={soc.id}
                  href={sanitizeUrl(soc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] transition-all hover:scale-105 active:scale-95 no-underline"
                  style={{ color: meta.color }}
                  title={soc.label}
                >
                  {renderPlatformIcon(soc.icon, 16)}
                  <span className="text-xs font-semibold text-[#F3F5F9]">{soc.label}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* Navigation / Policy Links */}
        <div className="flex items-center gap-6 mb-6 text-xs font-medium text-[#8A93AC]">
          <button
            onClick={() => navigate('about')}
            className="hover:text-[#F3F5F9] transition-colors"
          >
            About Us
          </button>
          <span className="text-[#232D48]">·</span>
          <button
            onClick={() => navigate('terms')}
            className="hover:text-[#F3F5F9] transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-[#232D48]">·</span>
          <button
            onClick={() => navigate('dmca')}
            className="hover:text-[#F3F5F9] transition-colors"
          >
            DMCA Policy
          </button>
        </div>

        <div className="w-full max-w-md h-px bg-[#232D48] mb-4" />

        {/* Copyright */}
        <p className="text-[11px] text-[#5C6580] tracking-wide">
          © {new Date().getFullYear()} {branding.siteName}. All Free Fire trademarks and assets belong to Garena.
        </p>
      </div>
    </footer>
  );
};
