import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, Sparkles, Compass } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/config';

export const CtaBannerSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#f8fbff] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Navy/Teal Gradient Card inspired by reference image */}
        <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-gradient-to-r from-[#0b1b3d] via-[#122e6b] to-[#0f3b75] text-white p-6 sm:p-12 lg:p-16 overflow-hidden shadow-2xl border border-blue-900/50">
          
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admission Guidance 2026 – 2027</span>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                READY TO TAKE THE NEXT STEP?
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl leading-relaxed">
                Your future begins with the right decision. Connect with <strong className="text-amber-300 font-bold">CAREER PLAZA</strong> and explore the educational opportunities waiting for you across India and worldwide.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
                <Link
                  to="/apply"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Talk to Our Team</span>
                </Link>
              </div>
            </div>

            {/* Right Graphic: 3D Golden Bell & Scroll Illustration */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <svg
                  viewBox="0 0 200 180"
                  className="w-48 h-48 drop-shadow-2xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="bellGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="certGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#f1f5f9" />
                    </linearGradient>
                  </defs>

                  {/* Certificate in Background */}
                  <g transform="translate(60, 30) rotate(15)">
                    <rect x="0" y="0" width="100" height="75" rx="8" fill="url(#certGrad)" stroke="#cbd5e1" strokeWidth="2" />
                    <rect x="12" y="14" width="76" height="5" rx="2" fill="#3b82f6" />
                    <rect x="12" y="24" width="55" height="4" rx="2" fill="#94a3b8" />
                    <rect x="12" y="32" width="65" height="4" rx="2" fill="#94a3b8" />
                    <circle cx="70" cy="52" r="10" fill="#f59e0b" />
                    <path d="M68 62 L64 72 L70 69 L76 72 L72 62 Z" fill="#d97706" />
                  </g>

                  {/* 3D Bell in Foreground */}
                  <g transform="translate(15, 20)">
                    {/* Bell Body */}
                    <path
                      d="M60 20 C60 10, 40 10, 40 20 C35 35, 15 75, 10 95 C8 103, 16 110, 25 110 L75 110 C84 110, 92 103, 90 95 C85 75, 65 35, 60 20 Z"
                      fill="url(#bellGrad)"
                      stroke="#b45309"
                      strokeWidth="2"
                    />
                    {/* Top Ring */}
                    <circle cx="50" cy="12" r="7" stroke="#b45309" strokeWidth="3" fill="none" />
                    
                    {/* Clapper / Sound bead */}
                    <circle cx="50" cy="115" r="9" fill="#b45309" />
                    
                    {/* Highlights */}
                    <path d="M30 40 Q35 60 30 85" stroke="#fef3c7" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
