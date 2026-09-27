import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from '../components/common/Icons';

interface StaticPageProps {
  type: 'about' | 'terms' | 'dmca';
}

export const StaticPage: React.FC<StaticPageProps> = ({ type }) => {
  const { siteContent, branding, navigate } = useApp();

  const titles = {
    about: 'About ' + branding.siteName,
    terms: 'Terms of Service',
    dmca: 'DMCA & Copyright Policy',
  };

  const content = siteContent[type] || '';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-20">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#232D48]">
        <button
          onClick={() => navigate('home')}
          className="w-9 h-9 rounded-xl border border-[#232D48] bg-[#141B2C] text-[#8A93AC] hover:text-[#F3F5F9] flex items-center justify-center transition-colors"
        >
          <Icons.ArrowLeft size={18} />
        </button>
        <h1 className="font-extrabold text-lg text-[#F3F5F9]">
          {titles[type]}
        </h1>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#141B2C] border border-[#232D48] shadow-xl">
        <div className="text-sm text-[#8A93AC] leading-relaxed whitespace-pre-line font-medium space-y-4">
          {content}
        </div>
      </div>
    </div>
  );
};
