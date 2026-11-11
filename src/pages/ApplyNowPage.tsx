import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Globe2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { saveApplicationSubmission } from '../services/storage';
import { AdmissionCategory, StudyLocationPreference } from '../types';
import { BRAND_CONFIG } from '../data/config';
import { BrandLogo } from '../components/ui/BrandLogo';

export const ApplyNowPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Form Fields State
  // Section A - Student Info
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [country, setCountry] = useState('India');

  // Section B - Educational Background
  const [highestQualification, setHighestQualification] = useState('Class 12');
  const [currentOrCompletedStream, setCurrentOrCompletedStream] = useState('Science');
  const [currentOrLastCourse, setCurrentOrLastCourse] = useState('');
  const [passingYear, setPassingYear] = useState('2026');
  const [academicStatus, setAcademicStatus] = useState('Currently Studying');

  // Section C - Admission Preferences
  const [preferredAdmissionCategory, setPreferredAdmissionCategory] = useState<AdmissionCategory>('Study Abroad');
  const [preferredStudyLocation, setPreferredStudyLocation] = useState<StudyLocationPreference>('Open to Both');
  const [preferredStateOrCountry, setPreferredStateOrCountry] = useState('');
  const [preferredCourseOrProgramme, setPreferredCourseOrProgramme] = useState('');
  const [preferredAdmissionYear, setPreferredAdmissionYear] = useState('2026');
  const [preferredCollegeOrUniversity, setPreferredCollegeOrUniversity] = useState('');

  // Section D - Additional Info
  const [careerGoals, setCareerGoals] = useState('');
  const [preferredCollegesList, setPreferredCollegesList] = useState('');
  const [guidanceNeeded, setGuidanceNeeded] = useState('Complete Admission & University Selection Support');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-populate from URL query params if present (e.g. ?stream=Medical%20Admissions)
  useEffect(() => {
    const streamParam = searchParams.get('stream');
    const locationParam = searchParams.get('location');
    const destParam = searchParams.get('dest');

    if (streamParam) {
      if (streamParam.includes('Medical')) setPreferredAdmissionCategory('Medical');
      else if (streamParam.includes('Engineering')) setPreferredAdmissionCategory('Engineering');
      else if (streamParam.includes('MBA') || streamParam.includes('Management')) setPreferredAdmissionCategory('MBA / Management');
      else if (streamParam.includes('Abroad')) setPreferredAdmissionCategory('Study Abroad');
      else setPreferredAdmissionCategory('Other Courses');
    }

    if (locationParam) {
      if (locationParam === 'India') setPreferredStudyLocation('India');
      else if (locationParam === 'Abroad') setPreferredStudyLocation('Abroad');
    }

    if (destParam) {
      setPreferredStateOrCountry(destParam);
    }

    window.scrollTo(0, 0);
  }, [searchParams]);

  // Validation function
  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }

    // Phone validation (flexible Indian and international format)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!mobileNumber.trim() || !phoneRegex.test(mobileNumber.replace(/\s+/g, ''))) {
      setErrorMessage('Please provide a valid contact mobile number with country code (e.g. +91 0000000000).');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress.trim() || !emailRegex.test(emailAddress)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (!currentCity.trim() || !currentState.trim()) {
      setErrorMessage('Please provide your current city and state.');
      return false;
    }

    if (!currentOrLastCourse.trim()) {
      setErrorMessage('Please specify your current or last completed course/schooling.');
      return false;
    }

    if (!preferredCourseOrProgramme.trim()) {
      setErrorMessage('Please specify your preferred course or programme of study.');
      return false;
    }

    if (!preferredStateOrCountry.trim()) {
      setErrorMessage('Please indicate your target state or study destination country.');
      return false;
    }

    if (!privacyConsent) {
      setErrorMessage('Please agree to the privacy policy and counselling consent terms.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await saveApplicationSubmission({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        emailAddress: emailAddress.trim(),
        currentCity: currentCity.trim(),
        currentState: currentState.trim(),
        country: country.trim(),
        highestQualification,
        currentOrCompletedStream,
        currentOrLastCourse: currentOrLastCourse.trim(),
        passingYear,
        academicStatus,
        preferredAdmissionCategory,
        preferredStudyLocation,
        preferredStateOrCountry: preferredStateOrCountry.trim(),
        preferredCourseOrProgramme: preferredCourseOrProgramme.trim(),
        preferredAdmissionYear,
        preferredCollegeOrUniversity: preferredCollegeOrUniversity.trim(),
        careerGoals: careerGoals.trim(),
        preferredCollegesList: preferredCollegesList.trim(),
        guidanceNeeded,
        additionalNotes: additionalNotes.trim(),
        privacyConsent,
      });

      if (res.success) {
        setSubmissionSuccess({ id: res.id, message: res.message });
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#0d9488', '#f59e0b', '#8b5cf6'],
        });
        window.scrollTo({ top: 150, behavior: 'smooth' });
      } else {
        setErrorMessage('Failed to submit application. Please check your connection and retry.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while saving your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-blue-50/70 via-white to-blue-50/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3">
          <div className="flex justify-center mb-1">
            <BrandLogo variant="black" size="lg" showText={false} />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Official Application & Profile Intake</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            START YOUR JOURNEY WITH CAREER PLAZA
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Share a few details with us so we can better understand your educational goals and counselling requirements.
          </p>
        </div>

        {/* Success Confirmation View */}
        {submissionSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-emerald-100 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Application Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome to CAREER PLAZA, {fullName}!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {submissionSuccess.message}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-left text-xs text-slate-700 space-y-1">
              <div><strong>Application Reference ID:</strong> <span className="font-mono text-blue-700 font-bold">{submissionSuccess.id}</span></div>
              <div><strong>Target Stream:</strong> {preferredAdmissionCategory} — {preferredCourseOrProgramme}</div>
              <div><strong>Location Preference:</strong> {preferredStudyLocation} ({preferredStateOrCountry})</div>
              <div><strong>Contact Email:</strong> {emailAddress}</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold transition-colors"
              >
                Back to Homepage
              </Link>
              <a
                href={BRAND_CONFIG.socialLinks.whatsAppChat}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Instant WhatsApp Priority Connect</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Multi-Section Comprehensive Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 space-y-10">
            
            {/* Top error banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Please review your submission:</strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* =========================================================
                SECTION A: STUDENT INFORMATION
               ========================================================= */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  A
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Section A — Student Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your personal contact details for admission correspondence.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aryan Kumar / Rohan Sharma"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 0000000000"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Include country code for international numbers.
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="careerplaza.work@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* Current City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="e.g. Ranchi / Mumbai / Patna / Delhi"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Current State & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentState}
                      onChange={(e) => setCurrentState(e.target.value)}
                      placeholder="e.g. Jharkhand"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* =========================================================
                SECTION B: EDUCATIONAL BACKGROUND
               ========================================================= */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                  B
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Section B — Educational Background
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your current or completed schooling and degree status.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Highest Qualification */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Highest Educational Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={highestQualification}
                    onChange={(e) => setHighestQualification(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Current / Completed Stream */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current / Completed Stream <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentOrCompletedStream}
                    onChange={(e) => setCurrentOrCompletedStream(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Science (PCM)">Science (PCM / Math)</option>
                    <option value="Science (PCB)">Science (PCB / Medical)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts / Humanities">Arts / Humanities</option>
                    <option value="Medical">Medical / Healthcare</option>
                    <option value="Engineering">Engineering / Tech</option>
                    <option value="Management">Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Current / Last Completed Course */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current / Last Completed Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentOrLastCourse}
                    onChange={(e) => setCurrentOrLastCourse(e.target.value)}
                    placeholder="e.g. CBSE 12th / B.Sc Chemistry / B.Com"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Passing Year & Academic Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Passing Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Academic Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={academicStatus}
                      onChange={(e) => setAcademicStatus(e.target.value)}
                      className="w-full px-2.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="Currently Studying">Currently Studying</option>
                      <option value="Completed">Completed</option>
                      <option value="Awaiting Results">Awaiting Results</option>
                      <option value="Planning Further Studies">Planning Further Studies</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* =========================================================
                SECTION C: ADMISSION PREFERENCES
               ========================================================= */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                  C
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Section C — Admission Preferences
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tell us where and what discipline you aspire to pursue.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Admission Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={preferredAdmissionCategory}
                    onChange={(e) => setPreferredAdmissionCategory(e.target.value as AdmissionCategory)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-semibold text-blue-900"
                  >
                    <option value="Study Abroad">Study Abroad (Global Universities)</option>
                    <option value="Medical">Medical Admissions (MBBS, BDS, Allied)</option>
                    <option value="Engineering">Engineering & Technology (B.Tech, AI, etc.)</option>
                    <option value="MBA / Management">MBA / Management & Business</option>
                    <option value="Other Courses">Other Courses & Degrees (Commerce, Law, Humanities)</option>
                  </select>
                </div>

                {/* Preferred Study Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Study Location <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['India', 'Abroad', 'Open to Both'] as StudyLocationPreference[]).map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => setPreferredStudyLocation(loc)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          preferredStudyLocation === loc
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred State / Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred State / Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={preferredStateOrCountry}
                    onChange={(e) => setPreferredStateOrCountry(e.target.value)}
                    placeholder="e.g. Karnataka, Maharashtra / Germany, UK, Canada"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Preferred Course / Programme */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Course / Programme <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={preferredCourseOrProgramme}
                    onChange={(e) => setPreferredCourseOrProgramme(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science / MBBS / MBA Marketing"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Preferred Admission Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Admission Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={preferredAdmissionYear}
                    onChange={(e) => setPreferredAdmissionYear(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="2026">2026 (Immediate Upcoming Intakes)</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>

                {/* Preferred College / University (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred College / University <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={preferredCollegeOrUniversity}
                    onChange={(e) => setPreferredCollegeOrUniversity(e.target.value)}
                    placeholder="e.g. Top 20 NIRF / Russell Group / Any suitable option"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

              </div>
            </div>

            {/* =========================================================
                SECTION D: ADDITIONAL INFORMATION
               ========================================================= */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  D
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Section D — Goals & Guidance Needs
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clarify your objectives so our advisors can prepare a bespoke evaluation.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 1. What are your future career goals? */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. What are your future career goals?
                  </label>
                  <textarea
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    rows={2}
                    placeholder="e.g. Aspiring to work in AI Research / Clinical Medicine / Investment Banking / Entrepreneurship..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* 2. Do you have any preferred colleges or universities? */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Do you have any specific colleges, universities or institutes in mind?
                  </label>
                  <input
                    type="text"
                    value={preferredCollegesList}
                    onChange={(e) => setPreferredCollegesList(e.target.value)}
                    placeholder="e.g. Manipal, RVCE, Vellore, TU Munich, University of Toronto, etc."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* 3. What kind of educational guidance are you looking for? */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. What kind of educational guidance are you looking for?
                  </label>
                  <select
                    value={guidanceNeeded}
                    onChange={(e) => setGuidanceNeeded(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Complete Admission & University Selection Support">
                      Complete Admission & University Selection Support
                    </option>
                    <option value="Career Counselling & Stream Discovery">
                      Career Counselling & Stream Discovery
                    </option>
                    <option value="Scholarship & Financial Aid Guidance">
                      Scholarship & Financial Aid Guidance
                    </option>
                    <option value="Visa & Overseas Documentation Check">
                      Visa & Overseas Documentation Check
                    </option>
                    <option value="College Transfer & Branch Upgrade Review">
                      College Transfer & Branch Upgrade Review
                    </option>
                  </select>
                </div>

                {/* 4. Is there anything else you would like our counselling team to know? */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    4. Is there anything else you would like our counselling team to know?
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={2}
                    placeholder="Any budget considerations, entrance scores (NEET, JEE, SAT, IELTS), or specific queries..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-sm text-blue-600 focus:ring-blue-500 border-slate-300"
                  required
                />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  I agree to the use of my submitted information for admission counselling and follow-up communication, in accordance with the{' '}
                  <Link to="/privacy" target="_blank" className="text-blue-600 underline font-semibold">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Recording Your Application Securely...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>Submit Admission Application</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your information is strictly protected and never shared with unsolicited third parties.</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
