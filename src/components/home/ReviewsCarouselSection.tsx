import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquareHeart, 
  PlusCircle, 
  ArrowRight
} from 'lucide-react';
import { StudentAvatar } from '../ui/StudentAvatar';
import { ReviewSubmitModal } from '../reviews/ReviewSubmitModal';
import { StudentReview } from '../../types';
import { getApprovedReviews } from '../../services/storage';

interface ReviewsCarouselSectionProps {
  reviews: StudentReview[];
  onRefreshReviews?: () => void;
}

// 15 Curated Featured Reviews representing all 4 categories proportionally
const FEATURED_IDS = [
  'rev-01', // Study Abroad - Aadhya Sen (Jharkhand)
  'rev-18', // B.Tech - Reyansh Verma (Uttar Pradesh)
  'rev-57', // Medical / MBBS - Naman Bhat (Jammu and Kashmir)
  'rev-65', // MBA / Management - Siddharth Bose (West Bengal)
  'rev-02', // Study Abroad - Ayan Mukherjee (West Bengal)
  'rev-20', // B.Tech - Aditi Sharma (Madhya Pradesh)
  'rev-58', // Medical / MBBS - Pritika Nanda (Odisha)
  'rev-03', // Study Abroad - Kavya Iyer (Karnataka)
  'rev-24', // B.Tech - Diya Ghosh (West Bengal)
  'rev-66', // MBA / Management - Apeksha Shetty (Karnataka)
  'rev-08', // Study Abroad - Vihaan Sinha (Bihar)
  'rev-31', // B.Tech - Sanika Pawar (Maharashtra)
  'rev-60', // Medical / MBBS - Ritika Lal (Jharkhand)
  'rev-36', // B.Tech - Manav Agarwal (Haryana)
  'rev-12', // Study Abroad - Devansh Mehta (Gujarat)
];

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

export const ReviewsCarouselSection: React.FC<ReviewsCarouselSectionProps> = ({
  reviews,
  onRefreshReviews,
}) => {
  const allReviews = React.useMemo(() => {
    return reviews && reviews.length > 0 ? reviews : getApprovedReviews();
  }, [reviews]);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulatorRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  // Desktop click & drag tracking
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  // Extract exactly 15 featured reviews from dataset
  const featuredReviews = React.useMemo(() => {
    const map = new Map(allReviews.map((r) => [r.id, r]));
    const list: StudentReview[] = [];
    for (const id of FEATURED_IDS) {
      const found = map.get(id);
      if (found) list.push(found);
    }
    // Fallback if specific IDs are not found
    if (list.length < 15) {
      const remaining = allReviews.filter((r) => !list.some((l) => l.id === r.id));
      list.push(...remaining.slice(0, 15 - list.length));
    }
    return list.slice(0, 15);
  }, [allReviews]);

  // Duplicate for seamless infinite loop (15 + 15 = 30 reviews)
  const displayReviews = React.useMemo(() => {
    return [...featuredReviews, ...featuredReviews];
  }, [featuredReviews]);

  // Continuous auto-scroll loop with sub-pixel float accumulation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    scrollAccumulatorRef.current = container.scrollLeft;

    let animId: number;
    let lastTime = performance.now();

    const step = (currentTime: number) => {
      // Cap delta at 50ms to prevent sudden jumps if browser tab was inactive
      const delta = Math.min(currentTime - lastTime, 50);
      lastTime = currentTime;

      // Only advance when not hovered by mouse, not dragging, and not actively interacting
      if (!isHoveredRef.current && !isInteractingRef.current && container) {
        // ~40 pixels per second (smooth, comfortable continuous movement)
        const speed = 0.04; // px per millisecond
        scrollAccumulatorRef.current += speed * delta;

        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0) {
          if (scrollAccumulatorRef.current >= halfWidth) {
            scrollAccumulatorRef.current -= halfWidth;
          } else if (scrollAccumulatorRef.current < 0) {
            scrollAccumulatorRef.current += halfWidth;
          }
          container.scrollLeft = scrollAccumulatorRef.current;
        }
      }

      // Keep animation frame loop alive at all times
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    // Native DOM listeners to ensure immediate, rock-solid hover pause
    const onEnter = () => {
      isHoveredRef.current = true;
      setIsHovered(true);
    };

    const onLeave = (e: MouseEvent) => {
      if (container && e.relatedTarget && container.contains(e.relatedTarget as Node)) {
        return;
      }
      isHoveredRef.current = false;
      setIsHovered(false);
      isDraggingRef.current = false;
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // Arrow button navigation
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isInteractingRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    const card = container.querySelector<HTMLElement>('.group');
    const cardWidth = card ? card.offsetWidth + 24 : 404;
    const halfWidth = container.scrollWidth / 2;
    let current = container.scrollLeft;

    // Normalize current within [0, halfWidth) if needed
    if (halfWidth > 0) {
      while (current >= halfWidth) current -= halfWidth;
      while (current < 0) current += halfWidth;
      container.scrollLeft = current;
    }

    let target = direction === 'left' ? current - cardWidth : current + cardWidth;

    // Handle seamless backward wrap
    if (halfWidth > 0 && target < 0) {
      current += halfWidth;
      container.scrollLeft = current;
      target += halfWidth;
    }

    container.scrollTo({ left: target, behavior: 'smooth' });
    scrollAccumulatorRef.current = target;

    // Resume auto-scroll after smooth transition settles (700ms)
    resumeTimerRef.current = window.setTimeout(() => {
      if (container) {
        let settled = container.scrollLeft;
        if (halfWidth > 0) {
          while (settled >= halfWidth) settled -= halfWidth;
          while (settled < 0) settled += halfWidth;
          container.scrollLeft = settled;
        }
        scrollAccumulatorRef.current = settled;
      }
      isInteractingRef.current = false;
    }, 700);
  };

  // Hover handlers
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (container && e.relatedTarget && container.contains(e.relatedTarget as Node)) {
      return;
    }
    isHoveredRef.current = false;
    setIsHovered(false);
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile & tablet swipe
  const handleTouchStart = () => {
    isInteractingRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
  };

  const handleTouchEnd = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const halfWidth = container.scrollWidth / 2;
      let current = container.scrollLeft;
      if (halfWidth > 0) {
        while (current >= halfWidth) current -= halfWidth;
        while (current < 0) current += halfWidth;
        container.scrollLeft = current;
      }
      scrollAccumulatorRef.current = current;
    }
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 1200);
  };

  // Mouse drag handlers for desktop click & drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    startXRef.current = e.pageX;
    startScrollRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const walk = (e.pageX - startXRef.current) * 1.2;
    let newPos = startScrollRef.current - walk;
    const halfWidth = container.scrollWidth / 2;
    if (halfWidth > 0) {
      while (newPos < 0) newPos += halfWidth;
      while (newPos >= halfWidth) newPos -= halfWidth;
    }
    container.scrollLeft = newPos;
    scrollAccumulatorRef.current = newPos;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      const container = scrollContainerRef.current;
      if (container) {
        scrollAccumulatorRef.current = container.scrollLeft;
      }
      resumeTimerRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
      }, 1000);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-[#f8fbff] via-white to-[#f0f7ff] relative overflow-hidden">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wide uppercase">
            <MessageSquareHeart className="w-3.5 h-3.5 text-blue-600" />
            <span>Real Student Experiences</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            HEAR FROM OUR COMMUNITY
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover how genuine guidance, transparent admission support, and dedicated mentoring transformed our aspirants' academic pathways.
          </p>
        </div>

        {/* Carousel Controls Bar */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full transition-colors ${isHovered ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span>{isHovered ? 'Auto-scroll paused' : 'Hover to pause auto-scroll'} • Showing 15 featured reviews</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer active:scale-95"
              aria-label="Scroll testimonials left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer active:scale-95"
              aria-label="Scroll testimonials right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Testimonials Carousel Track */}
      <div 
        ref={scrollContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full overflow-x-auto no-scrollbar py-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 px-4 sm:px-6 w-max">
          {displayReviews.map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              className="w-[300px] xs:w-[340px] sm:w-[380px] shrink-0 bg-white rounded-3xl p-5 sm:p-6 shadow-md shadow-slate-200/50 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group select-none pointer-events-auto"
            >
              <div>
                {/* Header: Avatar, Name (Student) & Course, Quote Mark */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <StudentAvatar
                      seed={rev.avatarSeed}
                      name={rev.studentName}
                      color={rev.avatarColor}
                      size="md"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {rev.studentName}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                        {rev.course}
                      </p>
                    </div>
                  </div>

                  <Quote className="w-7 h-7 text-blue-100 group-hover:text-blue-200 transition-colors shrink-0" />
                </div>

                {/* Rating Stars & Review Date */}
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

                {/* Written Review */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic line-clamp-4">
                  "{rev.writtenExperience}"
                </p>
              </div>

              {/* Card Footer: Category Badge & Indian State (No City) */}
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
      </div>

      {/* Bottom Action Buttons: View All Reviews & Share Your Experience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/reviews"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs"
          >
            <span>View All Reviews ({allReviews.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setIsSubmitOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-blue-200" />
            <span>Share Your Experience</span>
          </button>
        </div>
      </div>

      {/* Review Submit Modal */}
      <ReviewSubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitted={() => {
          onRefreshReviews?.();
        }}
      />

    </section>
  );
};
