import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { 
  IconInquire3D, 
  IconApply3D, 
  IconReview3D, 
  IconEnroll3D, 
  LargeJourneyGraphic3D 
} from './JourneyIcons3D';

interface JourneyStepItem {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const StudentJourneySection: React.FC = () => {
  const steps: JourneyStepItem[] = [
    {
      number: '1',
      title: 'INQUIRE',
      subtitle: 'Request information',
      icon: <IconInquire3D className="w-20 h-20 sm:w-24 sm:h-24" />,
    },
    {
      number: '2',
      title: 'APPLY',
      subtitle: 'Submit Application',
      icon: <IconApply3D className="w-20 h-20 sm:w-24 sm:h-24" />,
    },
    {
      number: '3',
      title: 'REVIEW',
      subtitle: 'Interview & Assessment',
      icon: <IconReview3D className="w-20 h-20 sm:w-24 sm:h-24" />,
    },
    {
      number: '4',
      title: 'ENROLL',
      subtitle: 'Confirmation',
      icon: <IconEnroll3D className="w-20 h-20 sm:w-24 sm:h-24" />,
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-[#eaf4fe] via-[#f3f8fd] to-[#f8fbff] relative overflow-hidden select-none">
      
      {/* Soft Ambient Light Reflections */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Matching Reference Image */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0f172a] tracking-tight leading-tight uppercase">
            YOUR JOURNEY WITH CAREER PLAZA
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto mt-2.5 leading-relaxed">
            A seamless four-step guidance process designed to eliminate confusion and help you gain admission into your ideal institution.
          </p>
        </div>

        {/* =========================================================================
            MAIN JOURNEY FLOW: 4-Step Stepper & Right 3D Illustration Graphic
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* LEFT: 4 Horizontal Step Cards with Continuous Connecting Line */}
          <div className="w-full lg:flex-1 relative">
            
            {/* Desktop Horizontal Connecting Line with Arrow pointing right */}
            <div className="hidden lg:flex items-center absolute top-[98px] left-[7%] right-0 pointer-events-none z-0">
              <div className="flex-1 h-[2px] bg-sky-300/80" />
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[10px] border-l-sky-400 -ml-1" />
            </div>

            {/* Steps Container */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 relative z-10">
              {steps.map((step) => (
                <div 
                  key={step.number}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Number on Top-Left */}
                  <div className="w-full max-w-[130px] sm:max-w-[150px] text-left mb-1.5 pl-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#155e75] group-hover:text-blue-600 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* 3D Icon Card (Soft Squircle with Glass Light Gradient & Soft Shadow) */}
                  <div className="w-28 h-28 xs:w-32 xs:h-32 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[26px] bg-gradient-to-b from-white via-[#f7fbff] to-[#e4f0fa] border-[1.5px] border-white shadow-[0_12px_28px_rgba(25,85,155,0.10)] hover:shadow-[0_18px_34px_rgba(37,99,235,0.18)] flex items-center justify-center p-3 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-blue-200">
                    <div className="transition-transform duration-300 group-hover:scale-108">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Subtitle Below the Card */}
                  <div className="mt-4 flex flex-col items-center">
                    <h3 className="text-sm sm:text-[15px] font-black text-slate-900 tracking-wider uppercase group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-snug">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: Large 3D Clipboard Illustration with Interactive Action Card */}
          <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 flex flex-col items-center justify-center pt-2 lg:pt-0">
            <div className="relative flex flex-col items-center">
              
              {/* 3D Large Clipboard Graphic matching reference */}
              <div className="transition-transform duration-500 hover:scale-105">
                <LargeJourneyGraphic3D className="w-68 sm:w-76 lg:w-84 h-68 sm:h-76 lg:h-84" />
              </div>

              {/* Action Button: Start Application */}
              <div className="mt-2 w-full max-w-xs text-center">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Begin Your Journey Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[10px] text-slate-500 mt-2 font-medium">
                  Submit preferences & connect with our counselling desk
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
