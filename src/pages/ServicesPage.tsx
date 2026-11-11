import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Globe, 
  Stethoscope, 
  Cpu, 
  Briefcase, 
  BookMarked, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';
import { EDUCATION_SERVICES } from '../data/config';

export const ServicesPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-8 h-8 text-teal-600" />;
      case 'Stethoscope':
        return <Stethoscope className="w-8 h-8 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-8 h-8 text-amber-600" />;
      case 'Briefcase':
        return <Briefcase className="w-8 h-8 text-purple-600" />;
      case 'BookMarked':
        return <BookMarked className="w-8 h-8 text-emerald-600" />;
      default:
        return <BookMarked className="w-8 h-8 text-blue-600" />;
    }
  };

  return (
    <div className="py-16 bg-[#f8fbff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Comprehensive Advisory Scope</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            OUR EDUCATION SERVICES
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Expert career guidance, university shortlisting, and admission assistance across five dedicated educational faculties.
          </p>
        </div>

        {/* Five Services Detailed Sections */}
        <div className="space-y-12">
          {EDUCATION_SERVICES.map((service, index) => (
            <div
              key={service.id}
              id={service.slug}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 scroll-mt-24 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-xs">
                    {getIcon(service.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Faculty Stream 0{index + 1}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/apply?stream=${encodeURIComponent(service.title)}`}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-md transition-transform hover:scale-105 ${service.cardColor.buttonBg}`}
                >
                  <span>Apply for {service.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Description & Advisory Scope */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Overview & Guidance Scope
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our counsellors evaluate your academic transcripts, entrance examination percentiles, budget parameters, and location preferences to assemble a high-probability shortlist of accredited institutions.
                  </p>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Key Mentoring Deliverables:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Curriculum & Specialisation Analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Eligibility & Cutoff Review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Scholarship & Financial Aid Help</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Application & SOP Vetting</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Academic Programmes List */}
                <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Programmes & Specialisations</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="text-center pt-8">
          <Link
            to="/apply"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
          >
            <span>Book Your Free Career Counselling Session</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
