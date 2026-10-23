import React, { useState } from 'react';
import { Product } from '../types/catalog';
import { BRAND_INFO } from '../data/products';

interface BookCoverArtProps {
  product: Product;
  customChildName?: string;
  customSchoolName?: string;
  compact?: boolean;
  className?: string;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({
  product,
  customChildName,
  customSchoolName,
  compact = false,
  className = '',
}) => {
  const [logoError, setLogoError] = useState(false);
  const { bgFrom, bgTo, accent, motif } = product.coverPalette;
  const svgHeightClass = compact ? 'h-16' : 'h-24';

  const renderMotifIllustration = () => {
    switch (motif) {
      case 'jungle':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <circle cx="90" cy="58" r="44" fill="#FFFFFF" fillOpacity="0.75" />
            {/* Cute Lion / Elephant clay illustration */}
            <circle cx="90" cy="58" r="32" fill="#FFB74D" />
            <circle cx="90" cy="58" r="23" fill="#FFE082" />
            <circle cx="82" cy="53" r="3.5" fill="#3E2723" />
            <circle cx="98" cy="53" r="3.5" fill="#3E2723" />
            <ellipse cx="90" cy="61" rx="5" ry="3.5" fill="#E65100" />
            <path d="M84 67 Q90 72 96 67" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Tropical leaves */}
            <path d="M26 90 Q40 60 58 82" fill="#81C784" />
            <path d="M154 90 Q140 60 122 82" fill="#66BB6A" />
          </svg>
        );
      case 'scribble':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <rect x="28" y="16" width="124" height="78" rx="18" fill="#FFFFFF" fillOpacity="0.82" />
            <path
              d="M45 62 C60 26, 85 88, 102 40 C114 14, 128 78, 138 48"
              stroke="#0288D1"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M48 75 Q90 55 132 75"
              stroke="#FF7043"
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="52" cy="36" r="8" fill="#FFD54F" />
            <polygon points="130,26 138,40 122,40" fill="#AB47BC" />
          </svg>
        );
      case 'alphabet':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <rect x="24" y="18" width="132" height="76" rx="16" fill="#FFFFFF" fillOpacity="0.88" />
            <line x1="36" y1="38" x2="144" y2="38" stroke="#EF5350" strokeWidth="1.5" />
            <line x1="36" y1="54" x2="144" y2="54" stroke="#42A5F5" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="36" y1="70" x2="144" y2="70" stroke="#42A5F5" strokeWidth="1.5" />
            <line x1="36" y1="84" x2="144" y2="84" stroke="#EF5350" strokeWidth="1.5" />
            <text x="48" y="68" fontFamily="Fredoka, sans-serif" fontSize="34" fontWeight="700" fill={accent}>
              Aa Bb
            </text>
          </svg>
        );
      case 'festival':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <circle cx="90" cy="56" r="42" fill="#FFFFFF" fillOpacity="0.8" />
            {/* Diya & Flame */}
            <path d="M62 66 Q90 92 118 66 Z" fill="#D84315" />
            <path d="M68 66 Q90 82 112 66 Z" fill="#FFB300" />
            <path d="M90 30 C82 44, 82 56, 90 63 C98 56, 98 44, 90 30 Z" fill="#FF6F00" />
            <path d="M90 38 C86 46, 86 54, 90 59 C94 54, 94 46, 90 38 Z" fill="#FFF176" />
            <circle cx="52" cy="48" r="5" fill="#EC407A" />
            <circle cx="128" cy="48" r="5" fill="#26A69A" />
          </svg>
        );
      case 'numbers':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <rect x="28" y="18" width="124" height="74" rx="18" fill="#FFFFFF" fillOpacity="0.85" />
            <text x="44" y="68" fontFamily="Fredoka, sans-serif" fontSize="36" fontWeight="700" fill="#7B1FA2">
              1 2 3
            </text>
            <circle cx="128" cy="42" r="9" fill="#FFCA28" />
            <circle cx="128" cy="68" r="9" fill="#26C6DA" />
          </svg>
        );
      case 'vehicles':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <circle cx="90" cy="56" r="42" fill="#FFFFFF" fillOpacity="0.8" />
            {/* Playful Rocket / Train */}
            <rect x="58" y="48" width="64" height="26" rx="10" fill="#1E88E5" />
            <rect x="96" y="34" width="22" height="18" rx="5" fill="#42A5F5" />
            <circle cx="72" cy="76" r="9" fill="#37474F" />
            <circle cx="72" cy="76" r="4" fill="#CFD8DC" />
            <circle cx="108" cy="76" r="9" fill="#37474F" />
            <circle cx="108" cy="76" r="4" fill="#CFD8DC" />
          </svg>
        );
      case 'return-gift':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <rect x="34" y="20" width="112" height="72" rx="16" fill="#FFFFFF" fillOpacity="0.86" />
            <rect x="68" y="42" width="44" height="36" rx="6" fill="#EC407A" />
            <rect x="86" y="42" width="8" height="36" fill="#FFD54F" />
            <rect x="64" y="36" width="52" height="10" rx="4" fill="#D81B60" />
            <path d="M90 36 C78 22, 68 34, 90 36 C112 34, 102 22, 90 36" fill="#FFD54F" />
          </svg>
        );
      case 'mandala':
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <circle cx="90" cy="55" r="40" fill="#FFFFFF" fillOpacity="0.85" />
            <circle cx="90" cy="55" r="30" stroke="#7E57C2" strokeWidth="2.5" fill="none" />
            <circle cx="90" cy="55" r="20" stroke="#EC407A" strokeWidth="2" strokeDasharray="5 3" fill="none" />
            <circle cx="90" cy="55" r="10" fill="#FFB300" />
          </svg>
        );
      case 'school':
      default:
        return (
          <svg viewBox="0 0 180 110" className="w-full h-full drop-shadow-sm" aria-hidden="true">
            <rect x="30" y="18" width="120" height="74" rx="16" fill="#FFFFFF" fillOpacity="0.88" />
            <path d="M90 28 L124 44 L90 60 L56 44 Z" fill="#F9A825" />
            <path d="M68 52 L68 72 Q90 82 112 72 L112 52" fill="#FDD835" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between select-none ${className}`}
      style={{
        background: `linear-gradient(145deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        boxShadow:
          'inset 4px 0 8px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.85), 0 8px 18px -4px rgba(15,23,42,0.12)',
      }}
    >
      {/* Left Book Spine Binding Realism */}
      <div
        className="absolute top-0 bottom-0 left-0 w-3.5 bg-black/10 border-r border-white/40"
        aria-hidden="true"
      />

      {/* Top Header Row: Kush Art Kids Mini Brand & Sample Tag */}
      <div className="pl-2 flex items-center justify-between gap-1.5 z-10">
        <div className="flex items-center gap-1 bg-white/85 backdrop-blur-xs px-1.5 py-0.5 rounded-lg shadow-2xs shrink-0">
          {!logoError ? (
            <img
              src={BRAND_INFO.logoUrl}
              alt="Kush Art Kids logo"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className={compact ? 'h-3.5 w-auto object-contain' : 'h-4.5 w-auto object-contain'}
            />
          ) : (
            <span className="text-[9px] font-bold tracking-tight text-slate-800 whitespace-nowrap">
              KUSH ART
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-medium text-slate-700 bg-white/80 px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
          {product.pageCount}p · {product.ageRange.replace(' Years', 'y')}
        </span>
      </div>

      {/* Center Illustration */}
      <div className="pl-2 my-0.5 flex flex-col items-center justify-center z-10 overflow-hidden">
        <div className={`w-full ${svgHeightClass} flex items-center justify-center`}>
          {renderMotifIllustration()}
        </div>
      </div>

      {/* Custom Personalization Banner if active */}
      {(customChildName || customSchoolName) && (
        <div className="pl-2 mb-1 z-10">
          <div className="bg-white/95 rounded-lg px-2 py-0.5 text-center shadow-2xs border border-amber-200">
            <p className="text-[10px] font-semibold text-slate-800 truncate">
              {customChildName
                ? `For ${customChildName}`
                : `${customSchoolName}`}
            </p>
          </div>
        </div>
      )}

      {/* Book Cover Title Footer */}
      <div className={`pl-2 z-10 bg-white/90 backdrop-blur-xs rounded-xl ${compact ? 'p-1.5' : 'p-2.5'} shadow-2xs`}>
        {!compact && (
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 truncate"
            style={{ color: accent }}
          >
            {product.category}
          </p>
        )}
        <p className={`font-display ${compact ? 'text-[11px]' : 'text-xs sm:text-sm'} font-bold text-slate-900 leading-tight line-clamp-2`}>
          {product.name.replace(' (Sample)', '')}
        </p>
      </div>
    </div>
  );
};
