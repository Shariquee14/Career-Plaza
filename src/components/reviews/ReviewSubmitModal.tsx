import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Send, 
  ShieldCheck 
} from 'lucide-react';
import { submitStudentReview } from '../../services/storage';
import { AdmissionCategory } from '../../types';
import logoBlack from '../../assets/logo-black.png';

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [studentName, setStudentName] = useState('');
  const [course, setCourse] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState<AdmissionCategory>('Study Abroad');
  const [rating, setRating] = useState(5);
  const [writtenExperience, setWrittenExperience] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentName.trim()) {
      setErrorMessage('Please enter your name or preferred pseudonym.');
      return;
    }
    if (!course.trim()) {
      setErrorMessage('Please enter your course or programme.');
      return;
    }
    if (!destination.trim()) {
      setErrorMessage('Please enter your study destination or institution.');
      return;
    }
    if (writtenExperience.trim().length < 20) {
      setErrorMessage('Please provide at least 20 characters describing your experience.');
      return;
    }
    if (!consentGiven) {
      setErrorMessage('Please consent to publishing your feedback after moderation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitStudentReview({
        studentName: studentName.trim(),
        course: course.trim(),
        destination: destination.trim(),
        category,
        rating,
        writtenExperience: writtenExperience.trim(),
      });

      if (res.success) {
        setSuccessMessage(res.message);
        onSubmitted?.();
      } else {
        setErrorMessage('Failed to submit review. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setStudentName('');
    setCourse('');
    setDestination('');
    setWrittenExperience('');
    setConsentGiven(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Experience Submitted!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed px-4">
              {successMessage}
            </p>
            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-800 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Moderation Protocol:</strong> To maintain strict authenticity, reviews are checked by our administration before appearing on the public portal.
              </span>
            </div>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <img src={logoBlack} alt="" className="w-4 h-4 object-contain inline-block" />
                <span>Student Voice</span>
              </div>
              <h3 id="modal-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Share Your Experience
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Help future aspirants by sharing how CAREER PLAZA assisted your educational path.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:text-amber-400 focus:outline-hidden transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Aryan S. / Rohan Sharma"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
              <span className="text-[11px] text-slate-400">
                You may use your first name or initials for privacy.
              </span>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admission Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AdmissionCategory)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Study Abroad">Study Abroad</option>
                <option value="Medical">Medical Admissions</option>
                <option value="Engineering">Engineering & Technology</option>
                <option value="MBA / Management">MBA & Management</option>
                <option value="Other Courses">Other Courses & Degrees</option>
              </select>
            </div>

            {/* Course & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course / Programme *
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Study Destination *
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Germany or Bengaluru, India"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Written Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Written Experience *
              </label>
              <textarea
                value={writtenExperience}
                onChange={(e) => setWrittenExperience(e.target.value)}
                rows={4}
                placeholder="Describe your counselling session, university selection support, and how the team assisted you..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  I consent to the publication of this feedback on the CAREER PLAZA website after verification by the administration team.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Review...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Experience for Moderation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
