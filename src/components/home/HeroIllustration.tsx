import React from 'react';
import { Award, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';
import heroStudentsImg from '../../assets/hero-students.png';
import logoWhite from '../../assets/logo-white.png';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto flex items-center justify-center select-none py-2 sm:py-4 lg:py-0">
      {/* Decorative Ambient Glow Orbs */}
      <div className="absolute -top-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-56 sm:w-72 h-56 sm:h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Main Glass Illustration Canvas */}
      <div className="relative z-10 w-full min-h-[250px] xs:min-h-[290px] sm:min-h-[380px] md:min-h-[440px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/15 via-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-2xl flex flex-col justify-end overflow-hidden pt-4 xs:pt-6 sm:pt-10 px-2 sm:px-4 pb-0">
        
        {/* Soft radial inner glow behind students */}
        <div className="absolute inset-0 bg-radial from-blue-400/10 via-transparent to-transparent pointer-events-none" />

        {/* Top-Left Floating Official Brand Emblem Badge (Dark Glass Background -> White Logo) */}
        <div className="absolute top-2.5 left-2.5 sm:top-6 sm:left-6 z-20 animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-slate-900/85 border border-white/25 backdrop-blur-md flex items-center justify-center p-1.5 sm:p-2 shadow-xl">
            <img 
              src={logoWhite} 
              alt="CAREER PLAZA Emblem" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Main Students Image (Image 2) */}
        <div className="relative z-10 w-full flex items-end justify-center pt-3 xs:pt-4 sm:pt-8">
          <img
            src={heroStudentsImg}
            alt="Students engaged in career guidance and academic study"
            className="w-full max-h-[210px] xs:max-h-[250px] sm:max-h-[350px] md:max-h-[390px] object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.02]"
            loading="eager"
          />
        </div>

        {/* Floating Interactive Badge 1: Verified Guidance (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 sm:top-5 sm:right-6 z-20 bg-white/95 rounded-xl sm:rounded-2xl shadow-xl border border-blue-100 p-1.5 xs:p-2 sm:p-3.5 flex items-center gap-1.5 xs:gap-2 sm:gap-3 backdrop-blur-md animate-pulse" style={{ animationDuration: '4s' }}>
          <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-5 sm:h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-slate-800">Verified Guidance</span>
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 fill-emerald-100" />
            </div>
            <p className="text-[8px] xs:text-[9px] sm:text-[11px] text-slate-500 font-medium">India & 15+ Global Destinations</p>
          </div>
        </div>

        {/* Floating Interactive Badge 2: Global & Domestic Paths (Bottom-Left) */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-6 sm:left-6 z-20 bg-white/95 rounded-xl sm:rounded-2xl shadow-xl border border-teal-100 p-1.5 xs:p-2 sm:p-3 flex items-center gap-1.5 xs:gap-2 sm:gap-3 backdrop-blur-md">
          <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Globe2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] xs:text-[11px] sm:text-sm font-bold text-slate-800">Global & Domestic Paths</span>
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
            </div>
            <p className="text-[8px] xs:text-[9px] sm:text-[11px] text-slate-500 font-medium">Personalised Roadmaps</p>
          </div>
        </div>

      </div>
    </div>
  );
};
