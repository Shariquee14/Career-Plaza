import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 bg-[#f8fbff] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-3 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Terms of Educational Advisory Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions — {BRAND_CONFIG.name}
          </h1>
          <p className="text-xs text-slate-500">
            Effective as of 2026 Academic Season
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              1. Nature of Advisory Services
            </h2>
            <p>
              <strong>{BRAND_CONFIG.name}</strong> operates as an independent career counselling, academic guidance, and college admission advisory consultancy. Our services include profile evaluation, eligibility review, university shortlisting, documentation check, and application process guidance across India and designated overseas destinations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>2. No Admission Guarantee Disclaimer</span>
            </h2>
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-2">
              <p>
                <strong>IMPORTANT:</strong> Final admission decisions, seat allocations, course concessions, and visa approvals are made exclusively by the respective university, examination board, regulatory body, or immigration department.
              </p>
              <p>
                CAREER PLAZA provides expert procedural guidance and profile optimization; we do not guarantee admissions or fabricate academic qualifications.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              3. Accuracy of Student Information
            </h2>
            <p>
              Applicants and guardians agree that all details submitted through the Apply Now form or during counselling sessions are accurate, truthful, and representative of the student’s actual academic background. Falsification of transcripts or entrance examination percentiles relieves our advisory desk from representation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              4. Review Moderation & Submissions
            </h2>
            <p>
              Submitting a testimonial under "Share Your Experience" gives {BRAND_CONFIG.name} non-exclusive permission to display your feedback, first name, and selected stream for peer community guidance upon verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              5. Contact for Grievances
            </h2>
            <p>
              For concerns regarding our consultancy terms or procedural inquiries, please contact our support desk at{' '}
              <a href={`mailto:${BRAND_CONFIG.contact.officialEmail}`} className="text-blue-600 underline font-semibold">
                {BRAND_CONFIG.contact.officialEmail}
              </a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
