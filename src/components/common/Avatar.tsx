import React from 'react';
import { gradientFor } from '../../utils/platforms';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 40,
  className = '',
  onClick,
}) => {
  const [c1, c2] = gradientFor(name || '?');
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        onClick={onClick}
        className={`rounded-full object-cover border border-[#232D48] flex-shrink-0 ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        onError={(e) => {
          // If image fails to load, replace with gradient
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        fontSize: `${Math.round(size * 0.42)}px`,
      }}
    >
      {initial}
    </div>
  );
};
