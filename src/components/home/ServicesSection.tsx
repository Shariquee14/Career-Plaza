import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Stethoscope, 
  Cpu, 
  Briefcase, 
  BookMarked, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  X
} from 'lucide-react';
import { EDUCATION_SERVICES } from '../../data/config';
import { ServiceCategory } from '../../types';

interface ServiceTheme {
  cardBg: string;
  border: string;
  hoverRing: string;
  iconContainer: string;
  focusTextColor: string;
  particleColor: string;
  nebulaGlow: string;
  modalGradient: string;
  accentBar: string;
}

export const ServicesSection: React.FC = () => {
  // Active service selected for the premium focused detail overlay
  const [activeService, setActiveService] = useState<ServiceCategory | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveService(null);
      }
    };
    if (activeService) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeService]);

  // Distinct category color identities & galaxy theme configurations
  const getServiceTheme = (index: number): ServiceTheme => {
    switch (index) {
      case 0: // Study Abroad — Soft Premium Green (Teal/Emerald Glow)
        return {
          cardBg: 'bg-gradient-to-br from-teal-50/90 via-emerald-50/60 to-white',
          border: 'border-teal-200/90 hover:border-teal-400',
          hoverRing: 'hover:ring-teal-400/30',
          iconContainer: 'bg-teal-100/90 text-teal-700 border border-teal-200/70',
          focusTextColor: 'text-teal-700',
          particleColor: '#0d9488',
          nebulaGlow: 'bg-teal-400/15',
          modalGradient: 'from-teal-50 via-white to-white',
          accentBar: 'from-teal-500 to-cyan-600',
        };
      case 1: // Medical Admissions — Soft Blue (Clinical Cyan & Deep Blue Glow)
        return {
          cardBg: 'bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-white',
          border: 'border-blue-200/90 hover:border-blue-400',
          hoverRing: 'hover:ring-blue-400/30',
          iconContainer: 'bg-blue-100/90 text-blue-700 border border-blue-200/70',
          focusTextColor: 'text-blue-700',
          particleColor: '#2563eb',
          nebulaGlow: 'bg-blue-400/15',
          modalGradient: 'from-blue-50 via-white to-white',
          accentBar: 'from-blue-600 to-indigo-600',
        };
      case 2: // Engineering & Technology — Warm Orange (Amber & Tech Glow)
        return {
          cardBg: 'bg-gradient-to-br from-orange-50/90 via-amber-50/60 to-white',
          border: 'border-amber-200/90 hover:border-amber-400',
          hoverRing: 'hover:ring-amber-400/30',
          iconContainer: 'bg-amber-100/90 text-amber-700 border border-amber-200/70',
          focusTextColor: 'text-amber-800',
          particleColor: '#ea580c',
          nebulaGlow: 'bg-amber-400/15',
          modalGradient: 'from-orange-50 via-white to-white',
          accentBar: 'from-amber-500 to-orange-500',
        };
      case 3: // MBA & Management — Soft Purple (Cosmic Violet & Lavender)
        return {
          cardBg: 'bg-gradient-to-br from-purple-50/90 via-violet-50/60 to-white',
          border: 'border-purple-200/90 hover:border-purple-400',
          hoverRing: 'hover:ring-purple-400/30',
          iconContainer: 'bg-purple-100/90 text-purple-700 border border-purple-200/70',
          focusTextColor: 'text-purple-700',
          particleColor: '#9333ea',
          nebulaGlow: 'bg-purple-400/15',
          modalGradient: 'from-purple-50 via-white to-white',
          accentBar: 'from-purple-600 to-indigo-700',
        };
      case 4: // Other Courses & Degrees — Distinct Green (Botanical Jade/Emerald)
      default:
        return {
          cardBg: 'bg-gradient-to-br from-emerald-50/95 via-green-100/50 to-white',
          border: 'border-emerald-300/90 hover:border-emerald-500',
          hoverRing: 'hover:ring-emerald-500/30',
          iconContainer: 'bg-emerald-100/90 text-emerald-800 border border-emerald-300/70',
          focusTextColor: 'text-emerald-800',
          particleColor: '#059669',
          nebulaGlow: 'bg-emerald-500/15',
          modalGradient: 'from-emerald-50 via-white to-white',
          accentBar: 'from-emerald-600 to-teal-700',
        };
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />;
      case 'BookMarked':
        return <BookMarked className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />;
      default:
        return <BookMarked className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />;
    }
  };

  // Render a balanced, non-stretched square card
  const renderSquareCard = (service: ServiceCategory, index: number) => {
    const theme = getServiceTheme(index);

    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`${service.title} - ${service.tagline}. Click to open complete details.`}
        onClick={() => setActiveService(service)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveService(service);
          }
        }}
        className={`group relative aspect-square w-full rounded-2xl sm:rounded-3xl ${theme.cardBg} border ${theme.border} hover:ring-2 ${theme.hoverRing} hover:shadow-xl hover:shadow-slate-300/60 transition-all duration-300 cursor-pointer select-none overflow-hidden flex flex-col justify-between p-3.5 xs:p-4 sm:p-6 lg:p-7 xl:p-4.5 2xl:p-6 text-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500`}
      >
        {/* Subtle Top Accent Ribbon */}
        <div className={`h-1.5 sm:h-2 w-full absolute top-0 left-0 bg-gradient-to-r ${theme.accentBar}`} />

        {/* Galaxy Constellation & Nebula Ambient Atmosphere */}
        <div className={`absolute -top-8 -right-8 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl ${theme.nebulaGlow} pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
        <div className={`absolute -bottom-8 -left-8 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl ${theme.nebulaGlow} pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

        {/* Micro-Drifting Celestial Particle Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45 group-hover:opacity-90 transition-opacity duration-300">
          <span 
            className="absolute top-[18%] left-[16%] w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full animate-ping" 
            style={{ backgroundColor: theme.particleColor, animationDuration: '3.2s' }} 
          />
          <span 
            className="absolute top-[28%] right-[18%] w-1 h-1 rounded-full animate-pulse" 
            style={{ backgroundColor: theme.particleColor, animationDuration: '2.4s' }} 
          />
          <span 
            className="absolute bottom-[24%] left-[20%] w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full animate-pulse" 
            style={{ backgroundColor: theme.particleColor, animationDuration: '4.1s' }} 
          />
          <span 
            className="absolute bottom-[32%] right-[22%] w-1 h-1 rounded-full animate-ping" 
            style={{ backgroundColor: theme.particleColor, animationDuration: '3.6s' }} 
          />
          <span 
            className="absolute top-[62%] left-[12%] w-1 h-1 rounded-full animate-pulse" 
            style={{ backgroundColor: theme.particleColor, animationDuration: '2.8s' }} 
          />
        </div>

        {/* TOP: Category Icon Badge */}
        <div className="relative z-10 flex justify-center mt-0.5 sm:mt-1">
          <div className={`w-11 h-11 xs:w-12 xs:h-12 sm:w-15 sm:h-15 lg:w-16 lg:h-16 xl:w-13 xl:h-13 2xl:w-15 2xl:h-15 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${theme.iconContainer}`}>
            {getIcon(service.iconName)}
          </div>
        </div>

        {/* MIDDLE: Category Title & Focus Area Directly Below */}
        <div className="relative z-10 my-auto py-1">
          <h3 className="text-xs xs:text-sm sm:text-lg lg:text-xl xl:text-base 2xl:text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-slate-950 transition-colors">
            {service.title}
          </h3>

          <p className={`text-[10px] xs:text-[11px] sm:text-xs lg:text-sm xl:text-xs 2xl:text-sm font-semibold mt-1 sm:mt-1.5 leading-snug line-clamp-2 ${theme.focusTextColor}`}>
            {service.tagline}
          </p>
        </div>

        {/* BOTTOM: Subtle View Details Indicator */}
        <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
          <span>View Details</span>
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 animate-pulse" />
        </div>

      </div>
    );
  };

  const activeIndex = activeService 
    ? EDUCATION_SERVICES.findIndex(s => s.id === activeService.id) 
    : -1;
  const activeTheme = activeIndex >= 0 ? getServiceTheme(activeIndex) : null;

  return (
    <section id="services" className="py-12 sm:py-20 bg-[#f8fbff] relative scroll-mt-20">
      
      {/* Decorative background glow accents */}
      <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Academic Excellence & Guidance</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            EXPLORE YOUR EDUCATIONAL POSSIBILITIES
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Targeted admission roadmaps, university selection, and end-to-end procedural support tailored to your career ambitions.
          </p>
        </div>

        {/* =========================================================================
            MOBILE & TABLET: TWO + TWO + ONE CENTRED FORMATION (Screens < 1280px)
            Strictly Unchanged for Mobile (320px - 430px) and Tablet (768px, 1024px)
           ========================================================================= */}
        <div className="block xl:hidden max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6">
          
          {/* Row 1: 2 Cards */}
          <div className="flex justify-center items-center gap-3 xs:gap-4 sm:gap-6">
            <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[calc(50%-12px)] max-w-[190px] sm:max-w-[310px] lg:max-w-[340px]">
              {renderSquareCard(EDUCATION_SERVICES[0], 0)}
            </div>
            <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[calc(50%-12px)] max-w-[190px] sm:max-w-[310px] lg:max-w-[340px]">
              {renderSquareCard(EDUCATION_SERVICES[1], 1)}
            </div>
          </div>

          {/* Row 2: 2 Cards */}
          <div className="flex justify-center items-center gap-3 xs:gap-4 sm:gap-6">
            <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[calc(50%-12px)] max-w-[190px] sm:max-w-[310px] lg:max-w-[340px]">
              {renderSquareCard(EDUCATION_SERVICES[2], 2)}
            </div>
            <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[calc(50%-12px)] max-w-[190px] sm:max-w-[310px] lg:max-w-[340px]">
              {renderSquareCard(EDUCATION_SERVICES[3], 3)}
            </div>
          </div>

          {/* Row 3: 1 Card Strictly Centred */}
          <div className="flex justify-center items-center">
            <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[calc(50%-12px)] max-w-[190px] sm:max-w-[310px] lg:max-w-[340px]">
              {renderSquareCard(EDUCATION_SERVICES[4], 4)}
            </div>
          </div>

        </div>

        {/* =========================================================================
            DESKTOP & LAPTOP: ALL FIVE CARDS IN ONE SINGLE HORIZONTAL ROW (>= 1280px)
            Study Abroad | Medical Admissions | Engineering & Tech | MBA & Management | Other Courses
            (Equal widths, perfectly aligned, matching the Statistics Section format)
           ========================================================================= */}
        <div className="hidden xl:grid xl:grid-cols-5 gap-4 2xl:gap-5 max-w-7xl mx-auto items-stretch">
          {EDUCATION_SERVICES.map((service, index) => (
            <div key={service.id} className="w-full flex">
              {renderSquareCard(service, index)}
            </div>
          ))}
        </div>

        {/* Bottom Detailed Services Navigation Banner */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-colors border border-blue-200"
          >
            <span>View Complete Curricula, Documentation & Admission Criteria</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

      </div>

      {/* =========================================================================
          PREMIUM FOCUSED DETAIL OVERLAY (Background Blur + Dimming)
          The selected card rises into clear visual focus while the page blurs.
         ========================================================================= */}
      {activeService && activeTheme && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
          onClick={() => setActiveService(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Floating Focused Panel */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg sm:max-w-2xl rounded-3xl bg-gradient-to-b ${activeTheme.modalGradient} border ${activeTheme.border} p-6 sm:p-8 shadow-2xl shadow-slate-950/50 text-slate-900 animate-in zoom-in-95 duration-200 overflow-hidden my-auto`}
          >
            {/* Top Accent Ribbon */}
            <div className={`h-2 sm:h-2.5 w-full absolute top-0 left-0 bg-gradient-to-r ${activeTheme.accentBar}`} />

            {/* Subtle Celestial Glow Nebula */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl ${activeTheme.nebulaGlow} pointer-events-none`} />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveService(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200/90 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close details panel"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Header: Icon + Title + Focus Area */}
            <div className="flex items-start gap-4 sm:gap-5 pb-5 border-b border-slate-200/80">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${activeTheme.iconContainer}`}>
                {getIcon(activeService.iconName)}
              </div>
              
              <div className="pr-8">
                <h3 id="modal-title" className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {activeService.title}
                </h3>
                <p className={`text-xs sm:text-sm font-bold mt-1 ${activeTheme.focusTextColor}`}>
                  {activeService.tagline}
                </p>
              </div>
            </div>

            {/* Description Overview */}
            <div className="mt-5 space-y-4">
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Advisory & Guidance Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeService.description}
                </p>
              </div>

              {/* Complete Key Programmes List (All 6 un-truncated) */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                  Key Programmes Covered ({activeService.includes.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeService.includes.map((programme, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-white/70 p-2 sm:p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{programme}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close Panel
              </button>

              <Link
                to={`/apply?stream=${encodeURIComponent(activeService.title)}`}
                onClick={() => setActiveService(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 transition-transform hover:-translate-y-0.5"
              >
                <span>Apply for {activeService.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
