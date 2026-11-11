import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Search, 
  MessageSquareHeart, 
  PlusCircle, 
  Quote, 
  ArrowLeft,
  X,
  Sparkles
} from 'lucide-react';
import { StudentAvatar } from '../components/ui/StudentAvatar';
import { ReviewSubmitModal } from '../components/reviews/ReviewSubmitModal';
import { StudentReview } from '../types';
import { getApprovedReviews } from '../services/storage';

interface ReviewsPageProps {
  approvedReviews: StudentReview[];
  onRefreshReviews?: () => void;
}

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Study Abroad':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'B.Tech':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Medical / MBBS':
    case 'Medical':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'MBA / Management':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  approvedReviews,
  onRefreshReviews,
}) => {
  const allReviews = useMemo(() => {
    return approvedReviews && approvedReviews.length > 0 ? approvedReviews : getApprovedReviews();
  }, [approvedReviews]);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const categories = [
    { label: 'All Reviews', value: 'All' },
    { label: 'Study Abroad', value: 'Study Abroad' },
    { label: 'B.Tech', value: 'B.Tech' },
    { label: 'Medical / MBBS', value: 'Medical / MBBS' },
    { label: 'MBA / Management', value: 'MBA / Management' },
  ];

  // Category counts based on actual dataset
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: allReviews.length,
      'Study Abroad': 0,
      'B.Tech': 0,
      'Medical / MBBS': 0,
      'MBA / Management': 0,
    };
    allReviews.forEach((rev) => {
      if (rev.category === 'Study Abroad') counts['Study Abroad']++;
      else if (rev.category === 'B.Tech') counts['B.Tech']++;
      else if (rev.category === 'Medical / MBBS' || rev.category === 'Medical') counts['Medical / MBBS']++;
      else if (rev.category === 'MBA / Management') counts['MBA / Management']++;
    });
    return counts;
  }, [allReviews]);

  // Star counts
  const starCounts = useMemo(() => {
    const counts = { all: allReviews.length, five: 0, four: 0 };
    allReviews.forEach((r) => {
      if (r.rating === 5) counts.five++;
      else if (r.rating === 4) counts.four++;
    });
    return counts;
  }, [allReviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return allReviews.filter((rev) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        rev.studentName.toLowerCase().includes(q) ||
        rev.course.toLowerCase().includes(q) ||
        rev.destination.toLowerCase().includes(q) ||
        rev.writtenExperience.toLowerCase().includes(q);
      
      const matchesCat = 
        selectedCategory === 'All' || 
        rev.category === selectedCategory ||
        (selectedCategory === 'Medical / MBBS' && (rev.category === 'Medical / MBBS' || rev.category === 'Medical'));

      const matchesRating = selectedRating === 0 || rev.rating === selectedRating;

      return matchesSearch && matchesCat && matchesRating;
    });
  }, [allReviews, searchTerm, selectedCategory, selectedRating]);

  return (
    <div className="py-12 bg-[#f8fbff] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link
            to="/#reviews"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all hover:-translate-x-0.5 w-full sm:w-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Return to Testimonials Section</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsSubmitOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto sm:ml-auto"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-200" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Page Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <MessageSquareHeart className="w-3.5 h-3.5 text-blue-600" />
            <span>Student Feedback & Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            ALL STUDENT REVIEWS
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Browse through genuine reviews submitted by students guided across Study Abroad, B.Tech, MBBS, and MBA programmes.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
          
          {/* Category Tabs (Pills) */}
          <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-100">
            {categories.map((cat) => {
              const count = categoryCounts[cat.value] || 0;
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-700/60 text-white' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Star Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, course or Indian state..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Star Rating Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium text-slate-700"
              >
                <option value={0}>All Star Ratings ({starCounts.all})</option>
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars Only ({starCounts.five})</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars Only ({starCounts.four})</option>
              </select>
            </div>

          </div>

          {/* Directory Status Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Showing <strong>{filteredReviews.length}</strong> of <strong>{allReviews.length}</strong> student reviews</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Locations shown by Indian state
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <MessageSquareHeart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No matching reviews found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No reviews match "{searchTerm}". Try clearing your search keyword or switching category tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedRating(0);
              }}
              className="mt-3 px-5 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Header: Avatar, Name (Student) & Course */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <StudentAvatar
                        seed={rev.avatarSeed}
                        name={rev.studentName}
                        color={rev.avatarColor}
                        size="md"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {rev.studentName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {rev.course}
                        </p>
                      </div>
                    </div>
                    <Quote className="w-7 h-7 text-blue-100 group-hover:text-blue-200 transition-colors shrink-0" />
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">
                      {rev.createdAt}
                    </span>
                  </div>

                  {/* Written Experience Message */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    "{rev.writtenExperience}"
                  </p>
                </div>

                {/* Card Footer: Category Badge & Indian State (Strictly State Only) */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(rev.category)}`}>
                    {rev.category}
                  </span>
                  <span className="text-slate-500 font-semibold">
                    {rev.destination}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="text-center pt-8 pb-4">
          <Link
            to="/#reviews"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>Return to Testimonials Carousel</span>
          </Link>
        </div>

      </div>

      {/* Review Submission Modal */}
      <ReviewSubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitted={() => onRefreshReviews?.()}
      />
    </div>
  );
};
