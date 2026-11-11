import React from 'react';
import logoWhite from '../../assets/logo-white.png';
import logoBlack from '../../assets/logo-black.png';
import { BRAND_CONFIG } from '../../data/config';

export interface BrandLogoProps {
  /**
   * 'white': For dark or black backgrounds (Image 1)
   * 'black': For white or light backgrounds (Image 2)
   */
  variant?: 'white' | 'black';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  className?: string;
  imgClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'black',
  size = 'md',
  showText = true,
  textClassName = '',
  className = '',
  imgClassName = '',
}) => {
  const isWhite = variant === 'white';
  const logoSrc = isWhite ? logoWhite : logoBlack;

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official Emblem Logo Image */}
      <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses[size]}`}>
        <img
          src={logoSrc}
          alt={`${BRAND_CONFIG.name} Official Emblem`}
          className={`w-full h-full object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
          loading="eager"
        />
      </div>

      {/* Brand Name & Tagline Text */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight leading-none flex items-center gap-1.5 ${
              isWhite ? 'text-white' : 'text-slate-900'
            } ${titleSizes[size]} ${textClassName}`}
          >
            <span>{BRAND_CONFIG.name}</span>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isWhite ? 'bg-amber-400' : 'bg-amber-500'
              }`}
            />
          </span>
          <span
            className={`text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase mt-1 ${
              isWhite ? 'text-blue-300' : 'text-blue-700'
            }`}
          >
            Career Counselling & Admissions
          </span>
        </div>
      )}
    </div>
  );
};
