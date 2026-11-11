import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, BookOpen } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/config';
import { HeroIllustration } from './HeroIllustration';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e214d] via-[#122e6b] to-[#1a4499] text-white pt-8 pb-20 sm:pt-12 sm:pb-28 md:pt-16 md:pb-36 lg:pb-40">
      
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full border border-blue-400/30" />
        <div className="absolute -top-40 -right-20 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full border border-blue-300/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            MOBILE & TABLET HERO COMPOSITION (Screens <= 1024px)
            Visual Priority: Circular Guidance Visual -> Student Study Image -> Hero Heading -> Description -> CTAs -> Trust
            (Strictly isolated to Mobile and Tablet viewports)
           ========================================================================= */}
        <div className="block min-[1025px]:hidden text-center">
          
          {/* 1. "Your Future Path / Our Guidance" Circular Icon / Visual Pill */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-blue-200 shadow-sm animate-fade-in max-w-full">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '12s' }} />
              <span className="truncate">{BRAND_CONFIG.tagline}</span>
            </div>
          </div>

          {/* 2. Student Study Image — Brought directly higher up as the primary visual focus */}
          <div className="w-full max-w-md xs:max-w-lg sm:max-w-xl mx-auto mb-5 sm:mb-7">
            <HeroIllustration />
          </div>

          {/* 3. Hero Heading: "Your Future Begins with the Right Guidance" */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight px-1 max-w-2xl mx-auto">
            YOUR FUTURE BEGINS <br className="hidden xs:inline" />
            WITH THE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
              RIGHT GUIDANCE.
            </span>
          </h1>

          {/* 4. Supporting Description Text */}
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-blue-100/90 leading-relaxed max-w-xl mx-auto mt-2.5 sm:mt-3.5 px-2">
            {BRAND_CONFIG.secondaryHeroText}
          </p>

          {/* 5. Primary and Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 mt-5 sm:mt-6 w-full max-w-sm sm:max-w-md mx-auto px-2">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold text-slate-900 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
            </Link>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 text-cyan-300" />
              <span>Explore Our Services</span>
            </a>
          </div>

          {/* 6. Remaining Supporting Information (Trust Highlights) */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-5 text-[11px] xs:text-xs sm:text-sm text-blue-200/80 font-medium px-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Zero Cost Initial Profile Assessment
            </span>
            <span className="hidden xs:inline text-blue-300/40">•</span>
            <span>100% Unbiased Counselling</span>
          </div>

        </div>

        {/* =========================================================================
            DESKTOP & LAPTOP HERO COMPOSITION (Screens >= 1025px)
            Strictly Unchanged 2-Column Side-by-Side Desktop Layout
           ========================================================================= */}
        <div className="hidden min-[1025px]:grid min-[1025px]:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Bold Typography & CTAs */}
          <div className="min-[1025px]:col-span-6 text-left space-y-4 sm:space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold text-blue-200 shadow-sm animate-fade-in max-w-full">
              <Compass className="w-4 h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '12s' }} />
              <span className="truncate">{BRAND_CONFIG.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
              YOUR FUTURE BEGINS <br className="hidden sm:inline" />
              WITH THE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300">
                RIGHT GUIDANCE.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base lg:text-lg xl:text-xl text-blue-100/90 leading-relaxed max-w-xl">
              {BRAND_CONFIG.secondaryHeroText}
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-start gap-4 pt-2 w-full">
              <Link
                to="/apply"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-slate-900 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4 text-cyan-300" />
                <span>Explore Our Services</span>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-4 flex items-center justify-start gap-6 text-xs text-blue-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Zero Cost Initial Profile Assessment
              </span>
              <span>•</span>
              <span>100% Unbiased Counselling</span>
            </div>

          </div>

          {/* Right Side: Educational Graphic Illustration */}
          <div className="min-[1025px]:col-span-6 flex justify-center">
            <HeroIllustration />
          </div>

        </div>
      </div>

      {/* Elegant Curved Wave Divider into Statistics Section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-16 md:h-20 fill-[#f8fbff]"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

    </section>
  );
};
