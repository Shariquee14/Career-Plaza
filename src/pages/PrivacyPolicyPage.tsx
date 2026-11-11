import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { BRAND_CONFIG } from '../data/config';

export const PrivacyPolicyPage: React.FC = () => {
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
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Data Protection & Confidentiality</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy — {BRAND_CONFIG.name}
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: November 2026 • Effective for all counselling inquiries and student profile submissions
          </p>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you submit an application, schedule a counselling appointment, or send an enquiry on <strong>{BRAND_CONFIG.name}</strong>, we collect personal and academic information necessary to provide tailored guidance:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li><strong>Contact Identifiers:</strong> Student full name, email address, mobile number, and city/state of residence.</li>
              <li><strong>Academic History:</strong> Highest educational qualification, completed stream, passing year, and academic status.</li>
              <li><strong>Admission Preferences:</strong> Target course/programme, preferred institutions, target admission year, and domestic or international study preferences.</li>
              <li><strong>Student Reviews & Feedback:</strong> Written experiences, ratings, and course details voluntarily submitted for community guidance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              <span>2. How Your Information Is Utilised</span>
            </h2>
            <p>
              Your data is collected strictly for admission counselling and educational advisory operations:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>Assessing candidate eligibility against university entrance benchmarks and stream criteria.</li>
              <li>Communicating customized college shortlists, application deadlines, and scholarship options.</li>
              <li>Moderating and verifying community testimonials prior to publication.</li>
              <li>Preventing fraudulent inquiries and duplicate applications.</li>
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <strong>Notice:</strong> We do not sell, rent, or lease student contact numbers or academic profiles to commercial bulk-marketing brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>3. Review Moderation & Privacy Avatars</span>
            </h2>
            <p>
              To protect student identity and prevent fraudulent marketing, all feedback submitted via "Share Your Experience" undergoes human moderation. Public reviews feature stylized cartoon avatars and initials rather than personal photographs or sensitive contact details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              4. Data Retention & Student Rights
            </h2>
            <p>
              You have the right to request access to the information you have submitted, update incomplete records, or request deletion of your profile from our counselling records. Inquiries can be forwarded to <a href={`mailto:${BRAND_CONFIG.contact.supportEmail}`} className="text-blue-600 underline font-semibold">{BRAND_CONFIG.contact.supportEmail}</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
