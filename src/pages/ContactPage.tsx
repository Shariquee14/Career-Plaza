import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { BRAND_CONFIG, FREQUENTLY_ASKED_QUESTIONS } from '../data/config';
import { saveContactEnquiry } from '../services/storage';
import { BrandLogo } from '../components/ui/BrandLogo';

export const ContactPage: React.FC = () => {
  // Enquiry form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Study Abroad');
  const [message, setMessage] = useState('');

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmittedEnquiryId(null);

    if (honeypot) {
      return; // Silently ignore spam
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your contact phone number.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter your message or question.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveContactEnquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim() || 'General Admission Enquiry',
        serviceInterest,
        message: message.trim(),
      });

      if (res.success) {
        setSubmittedEnquiryId(res.id);
        setSuccessMsg(res.message);
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg(res.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-[#f8fbff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center mb-1">
            <BrandLogo variant="black" size="lg" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Admission Advisory Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            CONTACT CAREER PLAZA
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about admission cutoffs, university eligibility, or career roadmaps? Get in touch with our counselling team.
          </p>
        </div>

        {/* 2-Column: Left Contact Details & WhatsApp / Right Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (Spans 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Official Business Information
              </h2>

              <div className="space-y-5 text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">Central Office Location:</strong>
                    <span className="text-xs text-slate-500 leading-relaxed block">
                      {BRAND_CONFIG.contact.officeAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">Official Lines:</strong>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>Direct: <a href={`tel:${BRAND_CONFIG.contact.officialPhone}`} className="text-blue-600 font-semibold">{BRAND_CONFIG.contact.officialPhone}</a></p>
                      <p>Helpline: <a href={`tel:${BRAND_CONFIG.contact.tollFree}`} className="text-blue-600 font-semibold">{BRAND_CONFIG.contact.tollFree}</a></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">Official Email:</strong>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p><a href={`mailto:${BRAND_CONFIG.contact.officialEmail}`} className="text-blue-600 font-semibold hover:underline">{BRAND_CONFIG.contact.officialEmail}</a></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold mb-0.5">Counselling Desk Hours:</strong>
                    <span className="text-xs text-slate-500 leading-relaxed block">
                      {BRAND_CONFIG.contact.businessHours}
                    </span>
                    <span className="text-[11px] text-amber-700 block mt-1">
                      {BRAND_CONFIG.contact.emergencyHelpline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={BRAND_CONFIG.socialLinks.whatsAppChat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Start Live WhatsApp Counselling</span>
                </a>
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Counselling Centre Map Location
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Placeholder</span>
              </div>

              <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2 shadow-md animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  CAREER PLAZA Central Hub
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                  Academic Enclave, Knowledge Boulevard [Google Maps Embed Ready]
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Send an Enquiry Form (Spans 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Direct Inquiries
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Send an Admission Enquiry
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below or write directly to <a href={`mailto:${BRAND_CONFIG.contact.officialEmail}`} className="text-blue-600 font-semibold underline hover:text-blue-700">{BRAND_CONFIG.contact.officialEmail}</a>.
                </p>
              </div>

              {successMsg && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 font-bold text-base text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Enquiry Submitted Successfully!</span>
                  </div>
                  <p className="leading-relaxed">
                    {successMsg}
                  </p>
                  {submittedEnquiryId && (
                    <div className="bg-white/90 px-3 py-1.5 rounded-lg border border-emerald-200 font-mono text-xs text-blue-700 font-bold inline-block">
                      Reference ID: {submittedEnquiryId}
                    </div>
                  )}
                  <p className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/60">
                    ✉️ Automated alert notification dispatched to <strong>careerplaza.work@gmail.com</strong>. Our counsellor will connect with you soon.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3 animate-in shake duration-200">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Unable to Submit</strong>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot for spam bot mitigation */}
                <input
                  type="text"
                  name="user_website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aryan Kumar"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 0000000000"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="careerplaza.work@gmail.com"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Service Interest
                    </label>
                    <select
                      value={serviceInterest}
                      onChange={(e) => setServiceInterest(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium text-slate-700"
                    >
                      <option value="Study Abroad">Study Abroad Guidance</option>
                      <option value="Medical Admissions">Medical Admissions</option>
                      <option value="Engineering & Technology">Engineering & Technology</option>
                      <option value="MBA & Management">MBA & Management</option>
                      <option value="Other Courses & Degrees">Other Degree Courses</option>
                      <option value="General Counselling">General Counselling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject / Target Course
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Admission for B.Tech CS / MBBS in Europe / MBA 2026"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message / Specific Question *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Please mention your current educational qualification, preferred colleges, and what assistance you require..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry to Counselling Desk...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry to Counselling Desk</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* Section FAQ: Frequently Asked Questions */}
        <div id="faq" className="pt-8 scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers regarding our admission advisory services, eligibility, and procedures.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FREQUENTLY_ASKED_QUESTIONS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
