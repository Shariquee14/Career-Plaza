import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Target, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Award,
  Users2,
  Mail
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';
import { BrandLogo } from '../components/ui/BrandLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 bg-[#f8fbff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center mb-1">
            <BrandLogo variant="black" size="lg" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Our Guidance Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            ABOUT CAREER PLAZA
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {BRAND_CONFIG.heroDescription}
          </p>
        </div>

        {/* Core Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Our Purpose
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Choosing higher education is one of the most critical turning points in a student's life. At <strong>CAREER PLAZA</strong>, our purpose is to demystify complex admission systems, eliminate misinformation, and empower every student with clarity, realistic options, and personalized roadmaps.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether navigating competitive entrance thresholds across Indian states or understanding post-study visa frameworks across Europe and North America, we stand as an objective advisory partner.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Commitment to Ethical Guidance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We operate under an uncompromising code of transparency: we do not make false guarantees, invent commercial affiliations, or steer students toward courses unaligned with their aptitude.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every recommendation is grounded in factual university eligibility requirements, legitimate accreditation standards, and genuine career trajectories.
            </p>
          </div>
        </div>

        {/* 4 Pillars of the CAREER PLAZA Framework */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The CAREER PLAZA Counselling Framework
            </h2>
            <p className="text-sm text-slate-600">
              A structured methodology built on holistic profile analysis rather than hasty application pushes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Aptitude & Interest Discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluating strengths, academic records, and career inclinations to determine fitting disciplines.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Institutional Shortlisting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comparative analysis of campuses, faculty credentials, accreditation, fee structures, and placement records.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Documentation & Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step assistance with transcripts, SOPs, letters of recommendation, and regulatory compliance.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Enrolment & Transition</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guidance through admission confirmation, fee schedules, educational loans, and pre-departure briefings.
              </p>
            </div>
          </div>
        </div>

        {/* Banner CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Have Questions About Your Options?</h3>
            <p className="text-sm text-blue-100 max-w-xl">
              Connect with our advisory desk for an impartial discussion regarding your prospective courses and university choices, or email us directly at{' '}
              <a href={`mailto:${BRAND_CONFIG.contact.officialEmail}`} className="text-amber-300 font-semibold underline hover:text-amber-200">
                {BRAND_CONFIG.contact.officialEmail}
              </a>.
            </p>
          </div>

          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-slate-900 font-bold text-sm bg-amber-400 hover:bg-amber-300 shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            <span>Get Free Counselling</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
