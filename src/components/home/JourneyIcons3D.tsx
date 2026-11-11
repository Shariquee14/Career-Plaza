import React from 'react';

// =========================================================================
// 3D ICON 1: INQUIRE (3D Clipboard with Checklist and Leaning Pencil)
// =========================================================================
export const IconInquire3D: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} drop-shadow-[0_8px_12px_rgba(37,99,235,0.22)]`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Clipboard back gradient */}
      <linearGradient id="inq-board" x1="20" y1="15" x2="80" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="50%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      {/* Paper gradient */}
      <linearGradient id="inq-paper" x1="26" y1="22" x2="74" y2="84" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f1f5f9" />
      </linearGradient>
      {/* Gold clip gradient */}
      <linearGradient id="inq-clip" x1="38" y1="10" x2="62" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
      {/* Pencil gradient */}
      <linearGradient id="inq-pencil" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* Clipboard Base with 3D bevel */}
    <rect x="22" y="16" width="56" height="70" rx="10" fill="url(#inq-board)" />
    <rect x="23" y="17" width="54" height="68" rx="9" fill="none" stroke="#bfdbfe" strokeWidth="1.2" opacity="0.8" />

    {/* Paper Sheet */}
    <rect x="27" y="24" width="46" height="58" rx="6" fill="url(#inq-paper)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />

    {/* Checklist lines & checkmarks */}
    {/* Row 1 */}
    <rect x="33" y="33" width="7" height="7" rx="2" fill="#3b82f6" />
    <path d="M35 36.5 L36.5 38 L38.5 34.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="43" y="34.5" width="23" height="4" rx="2" fill="#94a3b8" />

    {/* Row 2 */}
    <rect x="33" y="44" width="7" height="7" rx="2" fill="#3b82f6" />
    <path d="M35 47.5 L36.5 49 L38.5 45.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="43" y="45.5" width="20" height="4" rx="2" fill="#94a3b8" />

    {/* Row 3 */}
    <rect x="33" y="55" width="7" height="7" rx="2" fill="#3b82f6" />
    <path d="M35 58.5 L36.5 60 L38.5 56.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="43" y="56.5" width="22" height="4" rx="2" fill="#94a3b8" />

    {/* Row 4 */}
    <rect x="33" y="66" width="7" height="7" rx="2" fill="#60a5fa" />
    <path d="M35 69.5 L36.5 71 L38.5 67.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="43" y="67.5" width="16" height="4" rx="2" fill="#cbd5e1" />

    {/* Gold Clip */}
    <rect x="39" y="12" width="22" height="11" rx="4" fill="url(#inq-clip)" filter="drop-shadow(0 2px 3px rgba(180,83,9,0.3))" />
    <rect x="44" y="9" width="12" height="6" rx="2.5" fill="#fef08a" />

    {/* 3D Pencil Leaning on Right */}
    <g transform="translate(68, 52) rotate(24)">
      {/* Pencil Body */}
      <rect x="-4" y="-22" width="8" height="34" rx="2" fill="url(#inq-pencil)" filter="drop-shadow(2px 3px 4px rgba(0,0,0,0.25))" />
      {/* Wood tip */}
      <polygon points="-4,-22 0,-30 4,-22" fill="#fed7aa" />
      {/* Graphite Lead */}
      <polygon points="-1.5,-27 0,-30 1.5,-27" fill="#1e293b" />
      {/* Metal band */}
      <rect x="-4" y="9" width="8" height="4" fill="#cbd5e1" />
      {/* Pink Eraser */}
      <rect x="-4" y="13" width="8" height="6" rx="2" fill="#fb7185" />
    </g>
  </svg>
);

// =========================================================================
// 3D ICON 2: APPLY (3D Resume / Application Document with Avatar Card)
// =========================================================================
export const IconApply3D: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} drop-shadow-[0_8px_14px_rgba(234,88,12,0.18)]`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="app-paper" x1="24" y1="16" x2="76" y2="82" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
      <linearGradient id="app-badge" x1="42" y1="24" x2="68" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fed7aa" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
      <linearGradient id="app-roll" x1="22" y1="72" x2="78" y2="86" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="50%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>

    {/* Paper Sheet with 3D soft perspective */}
    <rect x="25" y="16" width="50" height="60" rx="8" fill="url(#app-paper)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.08))" />
    <rect x="25.5" y="16.5" width="49" height="59" rx="7.5" fill="none" stroke="#ffffff" strokeWidth="1" />

    {/* Avatar / Profile Box */}
    <rect x="48" y="24" width="20" height="18" rx="4" fill="url(#app-badge)" filter="drop-shadow(0 2px 4px rgba(249,115,22,0.25))" />
    {/* Head & shoulders */}
    <circle cx="58" cy="30" r="3.5" fill="#ffffff" />
    <path d="M52 40 C52 35.5, 64 35.5, 64 40" fill="#ffffff" />

    {/* Top left text lines beside avatar */}
    <rect x="31" y="26" width="13" height="4" rx="2" fill="#3b82f6" />
    <rect x="31" y="34" width="10" height="3" rx="1.5" fill="#94a3b8" />

    {/* Body text lines */}
    <rect x="31" y="47" width="38" height="3.5" rx="1.5" fill="#3b82f6" opacity="0.8" />
    <rect x="31" y="53" width="34" height="3" rx="1.5" fill="#94a3b8" />
    <rect x="31" y="58.5" width="36" height="3" rx="1.5" fill="#94a3b8" />
    <rect x="31" y="64" width="26" height="3" rx="1.5" fill="#cbd5e1" />

    {/* 3D Curled Bottom Edge */}
    <path
      d="M24 73 C30 79, 70 79, 76 73 C78 77, 72 84, 50 84 C28 84, 22 77, 24 73 Z"
      fill="url(#app-roll)"
      filter="drop-shadow(0 3px 4px rgba(0,0,0,0.12))"
    />
  </svg>
);

// =========================================================================
// 3D ICON 3: REVIEW (3D Meeting Avatars with Interview Assessment Board)
// =========================================================================
export const IconReview3D: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} drop-shadow-[0_8px_14px_rgba(13,148,136,0.22)]`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="rev-board" x1="38" y1="18" x2="62" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      {/* Center avatar (Navy/Slate) */}
      <linearGradient id="rev-av-center" x1="42" y1="46" x2="58" y2="78" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0f766e" />
        <stop offset="100%" stopColor="#115e59" />
      </linearGradient>
      {/* Left avatar (Blue) */}
      <linearGradient id="rev-av-left" x1="22" y1="52" x2="40" y2="78" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      {/* Right avatar (Orange/Warm) */}
      <linearGradient id="rev-av-right" x1="60" y1="52" x2="78" y2="78" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Background Assessment Board / Card */}
    <rect x="36" y="20" width="28" height="20" rx="5" fill="url(#rev-board)" filter="drop-shadow(0 3px 5px rgba(22,163,74,0.3))" />
    {/* Stars / checkmarks on board */}
    <circle cx="43" cy="30" r="2.5" fill="#ffffff" />
    <circle cx="50" cy="30" r="2.5" fill="#fef08a" />
    <circle cx="57" cy="30" r="2.5" fill="#ffffff" />

    {/* Left Student Figure (Blue) */}
    <circle cx="32" cy="48" r="8" fill="#fed7aa" />
    <path d="M26 44 C27 41, 37 41, 38 44 C38 46, 36 49, 32 49 C28 49, 26 46, 26 44 Z" fill="#475569" />
    <path d="M22 75 C22 62, 42 62, 42 75 Z" fill="url(#rev-av-left)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))" />

    {/* Right Student Figure (Orange) */}
    <circle cx="68" cy="48" r="8" fill="#fed7aa" />
    <path d="M62 44 C63 41, 73 41, 74 44 C74 46, 72 49, 68 49 C64 49, 62 46, 62 44 Z" fill="#92400e" />
    <path d="M58 75 C58 62, 78 62, 78 75 Z" fill="url(#rev-av-right)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))" />

    {/* Center Lead Figure (Teal / Prominent in foreground) */}
    <circle cx="50" cy="44" r="9.5" fill="#fed7aa" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
    <path d="M43 39 C44 35, 56 35, 57 39 C57 41, 55 45, 50 45 C45 45, 43 41, 43 39 Z" fill="#1e293b" />
    <path d="M36 78 C36 62, 64 62, 64 78 Z" fill="url(#rev-av-center)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.18))" />
  </svg>
);

// =========================================================================
// 3D ICON 4: ENROLL (3D Royal Blue Open Envelope with Golden '@' Seal)
// =========================================================================
export const IconEnroll3D: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} drop-shadow-[0_8px_16px_rgba(29,78,216,0.25)]`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="enr-env-back" x1="20" y1="28" x2="80" y2="76" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="enr-letter" x1="28" y1="20" x2="72" y2="54" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f1f5f9" />
      </linearGradient>
      <linearGradient id="enr-env-front" x1="20" y1="44" x2="80" y2="78" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="enr-gold" x1="40" y1="28" x2="60" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>

    {/* Envelope Back Shell */}
    <rect x="22" y="34" width="56" height="42" rx="8" fill="url(#enr-env-back)" />

    {/* Letter emerging from envelope */}
    <rect x="28" y="20" width="44" height="34" rx="5" fill="url(#enr-letter)" filter="drop-shadow(0 -2px 4px rgba(0,0,0,0.06))" />
    <rect x="34" y="26" width="32" height="3.5" rx="1.5" fill="#3b82f6" />
    <rect x="34" y="33" width="24" height="3" rx="1.5" fill="#94a3b8" />
    <rect x="34" y="39" width="28" height="3" rx="1.5" fill="#cbd5e1" />

    {/* Golden '@' or Admission Medal floating above letter */}
    <circle cx="50" cy="38" r="10" fill="url(#enr-gold)" filter="drop-shadow(0 3px 6px rgba(180,83,9,0.35))" />
    <circle cx="50" cy="38" r="9" fill="none" stroke="#fffbeb" strokeWidth="1" />
    <text
      x="50"
      y="42"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="12"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="bold"
    >
      @
    </text>

    {/* Envelope Front Body with V-Fold */}
    <path
      d="M22 42 L50 62 L78 42 L78 70 C78 74.4 74.4 78 70 78 L30 78 C25.6 78 22 74.4 22 70 Z"
      fill="url(#enr-env-front)"
      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.14))"
    />
    {/* Left and Right inner folds */}
    <path d="M22 42 L46 60 L22 76 Z" fill="#2563eb" opacity="0.4" />
    <path d="M78 42 L54 60 L78 76 Z" fill="#1d4ed8" opacity="0.4" />
  </svg>
);

// =========================================================================
// RIGHT-HAND LARGE 3D HERO GRAPHIC
// (3D Clipboard + Orange Chat Bubble + Green Curved Arrow + Writing Pencil)
// =========================================================================
export const LargeJourneyGraphic3D: React.FC<{ className?: string }> = ({ className = 'w-72 sm:w-80 h-72 sm:h-80' }) => (
  <svg
    viewBox="0 0 320 320"
    className={`${className} drop-shadow-[0_20px_35px_rgba(37,99,235,0.18)] select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Clipboard base gradient */}
      <linearGradient id="lg-board" x1="70" y1="40" x2="250" y2="280" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="40%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>

      {/* Paper gradient */}
      <linearGradient id="lg-paper" x1="90" y1="65" x2="230" y2="265" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f8fafc" />
      </linearGradient>

      {/* Clip gold gradient */}
      <linearGradient id="lg-gold" x1="120" y1="20" x2="200" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>

      {/* Speech bubble orange */}
      <linearGradient id="lg-bubble" x1="30" y1="50" x2="105" y2="120" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>

      {/* Green circular arrow */}
      <linearGradient id="lg-green" x1="60" y1="180" x2="140" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>

      {/* 3D Pencil gradient */}
      <linearGradient id="lg-pencil" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>

    {/* ============================================================
        1. FLOATING 3D ORANGE CHAT BUBBLE (Top Left)
       ============================================================ */}
    <g filter="drop-shadow(0 8px 12px rgba(234,88,12,0.3))">
      {/* Rounded bubble body */}
      <rect x="36" y="52" width="70" height="52" rx="16" fill="url(#lg-bubble)" />
      {/* Speech tail */}
      <path d="M48 100 L38 114 L58 102 Z" fill="#ea580c" />
      {/* 3 White Dots */}
      <circle cx="56" cy="78" r="4" fill="#ffffff" />
      <circle cx="71" cy="78" r="4" fill="#ffffff" />
      <circle cx="86" cy="78" r="4" fill="#ffffff" />
    </g>

    {/* ============================================================
        2. MAIN 3D CLIPBOARD
       ============================================================ */}
    {/* Base Board with depth drop shadow */}
    <rect
      x="85"
      y="48"
      width="165"
      height="225"
      rx="24"
      fill="url(#lg-board)"
      filter="drop-shadow(0 15px 25px rgba(37,99,235,0.25))"
    />
    <rect x="87" y="50" width="161" height="221" rx="22" fill="none" stroke="#dbeafe" strokeWidth="2" opacity="0.7" />

    {/* White Paper Sheet */}
    <rect
      x="98"
      y="66"
      width="139"
      height="194"
      rx="16"
      fill="url(#lg-paper)"
      filter="drop-shadow(0 4px 8px rgba(0,0,0,0.06))"
    />

    {/* Top User Profile Card on the paper */}
    <rect x="115" y="85" width="30" height="26" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
    <circle cx="130" cy="94" r="4.5" fill="#3b82f6" />
    <path d="M121 106 C121 101, 139 101, 139 106" fill="#3b82f6" />

    {/* Document Header lines beside profile card */}
    <rect x="155" y="88" width="62" height="6" rx="3" fill="#3b82f6" />
    <rect x="155" y="99" width="48" height="5" rx="2.5" fill="#93c5fd" />

    {/* Checklist Rows on paper */}
    <rect x="115" y="125" width="102" height="5" rx="2.5" fill="#cbd5e1" />
    <rect x="115" y="140" width="90" height="5" rx="2.5" fill="#cbd5e1" />
    <rect x="115" y="155" width="96" height="5" rx="2.5" fill="#cbd5e1" />
    <rect x="115" y="170" width="75" height="5" rx="2.5" fill="#cbd5e1" />
    <rect x="115" y="185" width="85" height="5" rx="2.5" fill="#cbd5e1" />

    {/* Gold Clip on Top */}
    <rect
      x="135"
      y="35"
      width="65"
      height="26"
      rx="8"
      fill="url(#lg-gold)"
      filter="drop-shadow(0 4px 6px rgba(180,83,9,0.35))"
    />
    <rect x="152" y="27" width="31" height="15" rx="5" fill="#fef08a" />
    <circle cx="167.5" cy="48" r="3.5" fill="#78350f" />

    {/* ============================================================
        3. 3D GREEN CURVED ARROW (Circling Around Left to Bottom)
       ============================================================ */}
    <g filter="drop-shadow(0 6px 10px rgba(34,197,94,0.35))">
      {/* 3D Curved Arrow Tube */}
      <path
        d="M62 175 C52 225, 95 245, 135 220"
        stroke="url(#lg-green)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Arrow Head */}
      <path
        d="M130 200 L154 218 L130 236 Z"
        fill="#22c55e"
      />
    </g>

    {/* ============================================================
        4. 3D WRITING PENCIL (Pointing at paper on the right)
       ============================================================ */}
    <g transform="translate(230, 205) rotate(42)" filter="drop-shadow(4px 6px 8px rgba(0,0,0,0.22))">
      {/* Main Pencil Body */}
      <rect x="-7" y="-55" width="14" height="75" rx="4" fill="url(#lg-pencil)" />
      {/* Wood sharpened cone */}
      <polygon points="-7,-55 0,-74 7,-55" fill="#fed7aa" />
      {/* Graphite Lead Tip */}
      <polygon points="-2.5,-67 0,-74 2.5,-67" fill="#1e293b" />
      {/* Silver Ferrule Band */}
      <rect x="-7" y="14" width="14" height="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
      {/* Pink Rubber Eraser */}
      <rect x="-7" y="22" width="14" height="12" rx="4" fill="#fb7185" />
    </g>
  </svg>
);
