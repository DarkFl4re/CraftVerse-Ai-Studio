import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sanitizeUrl } from '../../utils/platforms';

export const BannerSlider: React.FC = () => {
  const { branding, adSettings } = useApp();
  const slides = (branding.bannerSlides || []).filter((s) => s.image);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!adSettings.bannerEnabled || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        // swipe left -> next
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      } else {
        // swipe right -> prev
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  return (
    <div className="relative mb-6 group select-none">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full relative rounded-2xl overflow-hidden border border-[#232D48] bg-[#141B2C] shadow-md shadow-black/40 aspect-[21/9] sm:aspect-[24/9] max-h-52"
      >
        {currentSlide.link ? (
          <a
            href={sanitizeUrl(currentSlide.link)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title || 'Featured Banner'}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            {currentSlide.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/90 via-[#0A0E17]/20 to-transparent flex items-end p-4">
                <span className="font-extrabold text-sm sm:text-base text-white drop-shadow">
                  {currentSlide.title}
                </span>
              </div>
            )}
          </a>
        ) : (
          <div className="w-full h-full relative">
            <img
              src={currentSlide.image}
              alt={currentSlide.title || 'Featured Banner'}
              className="w-full h-full object-cover"
            />
            {currentSlide.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17]/90 via-[#0A0E17]/20 to-transparent flex items-end p-4">
                <span className="font-extrabold text-sm sm:text-base text-white drop-shadow">
                  {currentSlide.title}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? 'w-6 bg-[#3E8EFF]'
                  : 'w-2 bg-[#232D48] hover:bg-[#3A445E]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
