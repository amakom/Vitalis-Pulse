'use client';

import { useState } from 'react';

interface ProjectLogoProps {
  name: string;
  logo_url?: string | null;
  size?: number;
  className?: string;
}

export function ProjectLogo({ name, logo_url, size = 32, className = '' }: ProjectLogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClass = size === 32 ? 'h-8 w-8' : size === 24 ? 'h-6 w-6' : `h-[${size}px] w-[${size}px]`;
  const textSize = size <= 24 ? 'text-[10px]' : 'text-xs';

  if (logo_url && !imgError) {
    return (
      <img
        src={logo_url}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  const hue = (name.charCodeAt(0) * 7 + (name.charCodeAt(1) || 0) * 3) % 360;

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full ${textSize} font-bold text-white ${className}`}
      style={{ backgroundColor: `hsl(${hue}, 55%, 45%)` }}
    >
      {name.charAt(0)}
    </div>
  );
}
