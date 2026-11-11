import React from 'react';

interface StudentAvatarProps {
  seed: string;
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  seed,
  name,
  color = '#2563eb',
  size = 'md',
  className = '',
}) => {
  // Deterministic avatar visual traits based on seed character codes
  const charCode = (seed || name || 'A').charCodeAt(0);
  const hairStyles = ['style-curly', 'style-straight', 'style-wavy', 'style-short'];
  const hairStyle = hairStyles[charCode % hairStyles.length];
  
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Modern soft pastel background variations
  const bgColors = [
    'from-blue-400 to-indigo-600',
    'from-teal-400 to-emerald-600',
    'from-purple-400 to-pink-600',
    'from-amber-400 to-orange-600',
    'from-sky-400 to-blue-600',
  ];
  const bgGradient = bgColors[charCode % bgColors.length];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${bgGradient} text-white font-bold shadow-md shrink-0 ring-2 ring-white/80 overflow-hidden ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {/* Cartoon stylized character illustration SVG */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-0.5"
      >
        <circle cx="32" cy="32" r="30" fill="currentColor" fillOpacity="0.15" />
        
        {/* Head and neck */}
        <circle cx="32" cy="27" r="14" fill="#fed7aa" />
        <path
          d="M26 38 C26 44, 38 44, 38 38"
          stroke="#ea580c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Eyes & smile */}
        <circle cx="28" cy="26" r="1.8" fill="#1e293b" />
        <circle cx="36" cy="26" r="1.8" fill="#1e293b" />
        <path
          d="M29 30 Q32 33 35 30"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Hair style variation */}
        {hairStyle === 'style-curly' && (
          <path
            d="M18 24 C16 14, 48 14, 46 24 C44 18, 20 18, 18 24 Z"
            fill="#334155"
          />
        )}
        {hairStyle === 'style-straight' && (
          <path
            d="M17 25 C17 14, 47 14, 47 25 C45 20, 19 20, 17 25 Z"
            fill="#475569"
          />
        )}
        {hairStyle === 'style-wavy' && (
          <path
            d="M16 26 C18 12, 46 12, 48 26 C43 18, 21 18, 16 26 Z"
            fill="#0f172a"
          />
        )}
        {hairStyle === 'style-short' && (
          <path
            d="M20 22 C22 15, 42 15, 44 22 C41 18, 23 18, 20 22 Z"
            fill="#1e1b4b"
          />
        )}

        {/* Student hoodie / shirt */}
        <path
          d="M14 62 C14 46, 23 42, 32 42 C41 42, 50 46, 50 62 Z"
          fill="rgba(255, 255, 255, 0.9)"
        />
        <path
          d="M28 42 L32 50 L36 42"
          stroke="#64748b"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Tiny graduation cap tassel accent */}
        <circle cx="48" cy="18" r="3" fill="#f59e0b" />
      </svg>
      
      {/* Small subtle initials overlay badge */}
      <span className="sr-only">{getInitials(name)}</span>
    </div>
  );
};
