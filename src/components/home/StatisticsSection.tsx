import React, { useEffect, useRef, useCallback } from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Building2 
} from 'lucide-react';
import { STATISTICS_DATA } from '../../data/config';
import { StatisticItem } from '../../types';

export const StatisticsSection: React.FC = () => {

  // Triple the array to provide an uninterrupted, seamless infinite buffer (15 cards)
  const mobileCards = useRef([
    ...STATISTICS_DATA,
    ...STATISTICS_DATA,
    ...STATISTICS_DATA
  ]).current;

  // Mobile carousel references
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Persistent animation state across re-renders
  const offsetRef = useRef<number>(0);
  const singleSetWidthRef = useRef<number>(1380); // Measured dynamically on mount
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const directionLockRef = useRef<'horizontal' | 'vertical' | null>(null);
  const momentumVelocityRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);

  // Dynamic scrolling speed variables
  const BASE_SPEED = 0.75; // Comfortable, natural auto-scroll speed (~45px/sec)
  const MAX_BOOST = 2.75;  // Maximum additional speed when user scrolls vertically
  const currentSpeedRef = useRef<number>(BASE_SPEED);
  const targetSpeedRef = useRef<number>(BASE_SPEED);
  const lastScrollYRef = useRef<number>(0);
  const scrollDecayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // Measure single set width accurately from DOM elements
  const measureSetWidth = useCallback(() => {
    if (trackRef.current && trackRef.current.children.length >= 6) {
      const card0 = trackRef.current.children[0] as HTMLElement;
      const card5 = trackRef.current.children[5] as HTMLElement;
      const measured = card5.offsetLeft - card0.offsetLeft;
      if (measured > 0) {
        singleSetWidthRef.current = measured;
      }
    }
  }, []);

  // Measure on mount and window resize
  useEffect(() => {
    measureSetWidth();
    const handleResize = () => measureSetWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureSetWidth]);

  // Reduced motion preference check and vertical page-scroll detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        currentSpeedRef.current = 0;
        targetSpeedRef.current = 0;
      } else {
        currentSpeedRef.current = BASE_SPEED;
        targetSpeedRef.current = BASE_SPEED;
      }
    };
    mediaQuery.addEventListener?.('change', handleMotionChange);

    lastScrollYRef.current = window.scrollY;

    const handleWindowScroll = () => {
      if (prefersReducedMotionRef.current) return;

      const currentY = window.scrollY;
      const deltaY = Math.abs(currentY - lastScrollYRef.current);
      lastScrollYRef.current = currentY;

      // Speed increases in right-to-left direction when user scrolls vertically
      const boost = Math.min(deltaY * 0.06, MAX_BOOST);
      targetSpeedRef.current = BASE_SPEED + boost;

      // When vertical scroll pauses, smoothly ease back to normal speed
      if (scrollDecayTimerRef.current) {
        clearTimeout(scrollDecayTimerRef.current);
      }
      scrollDecayTimerRef.current = setTimeout(() => {
        targetSpeedRef.current = BASE_SPEED;
      }, 120);
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener?.('change', handleMotionChange);
      window.removeEventListener('scroll', handleWindowScroll);
      if (scrollDecayTimerRef.current) clearTimeout(scrollDecayTimerRef.current);
    };
  }, []);

  // Main high-performance requestAnimationFrame loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const renderLoop = (timestamp: number) => {
      const elapsed = Math.min(timestamp - lastTimestamp, 50);
      lastTimestamp = timestamp;
      const dt = elapsed / 16.666; // Normalize to 60fps

      // Smooth acceleration and deceleration interpolation (lerp)
      const lerpFactor = targetSpeedRef.current > currentSpeedRef.current ? 0.14 : 0.04;
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * lerpFactor;

      const setWidth = singleSetWidthRef.current;

      if (!isDraggingRef.current) {
        if (Math.abs(momentumVelocityRef.current) > 0.05) {
          // Glide with natural friction after swipe release
          offsetRef.current -= momentumVelocityRef.current * dt;
          momentumVelocityRef.current *= Math.pow(0.92, dt);
        } else {
          // Reset momentum and apply continuous auto-scroll
          momentumVelocityRef.current = 0;
          if (!prefersReducedMotionRef.current) {
            offsetRef.current += currentSpeedRef.current * dt;
          }
        }

        // Seamless infinite wrap: when offset reaches the width of 1 set, wrap modulo setWidth
        if (setWidth > 0) {
          if (offsetRef.current >= setWidth) {
            offsetRef.current = offsetRef.current % setWidth;
          } else if (offsetRef.current < 0) {
            offsetRef.current = (offsetRef.current % setWidth) + setWidth;
          }
        }

        // Hardware-accelerated GPU translation
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    isDraggingRef.current = true;
    directionLockRef.current = null;
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    startOffsetRef.current = offsetRef.current;
    momentumVelocityRef.current = 0;
    lastMoveTimeRef.current = performance.now();
    lastMoveXRef.current = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;

    // Detect gesture direction to avoid hijacking native vertical page scroll
    if (!directionLockRef.current) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          directionLockRef.current = 'horizontal';
        } else {
          directionLockRef.current = 'vertical';
          isDraggingRef.current = false;
          return;
        }
      } else {
        return;
      }
    }

    if (directionLockRef.current === 'horizontal') {
      const now = performance.now();
      const timeDelta = now - lastMoveTimeRef.current;
      if (timeDelta > 0) {
        const moveDelta = touch.clientX - lastMoveXRef.current;
        momentumVelocityRef.current = (moveDelta / timeDelta) * 16.666;
        lastMoveTimeRef.current = now;
        lastMoveXRef.current = touch.clientX;
      }

      let nextOffset = startOffsetRef.current - deltaX;
      const setWidth = singleSetWidthRef.current;
      if (setWidth > 0) {
        if (nextOffset >= setWidth) {
          nextOffset = nextOffset % setWidth;
        } else if (nextOffset < 0) {
          nextOffset = (nextOffset % setWidth) + setWidth;
        }
      }
      offsetRef.current = nextOffset;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${nextOffset}px, 0, 0)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    directionLockRef.current = null;
    // Limit maximum momentum to avoid disorienting fling
    momentumVelocityRef.current = Math.max(-18, Math.min(18, momentumVelocityRef.current));
  };

  // --- MOUSE DRAG HANDLERS (for desktop inspection / emulator drag) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    directionLockRef.current = 'horizontal';
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    momentumVelocityRef.current = 0;
    lastMoveTimeRef.current = performance.now();
    lastMoveXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || directionLockRef.current !== 'horizontal') return;
    const deltaX = e.clientX - startXRef.current;
    const now = performance.now();
    const timeDelta = now - lastMoveTimeRef.current;
    if (timeDelta > 0) {
      const moveDelta = e.clientX - lastMoveXRef.current;
      momentumVelocityRef.current = (moveDelta / timeDelta) * 16.666;
      lastMoveTimeRef.current = now;
      lastMoveXRef.current = e.clientX;
    }

    let nextOffset = startOffsetRef.current - deltaX;
    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      if (nextOffset >= setWidth) {
        nextOffset = nextOffset % setWidth;
      } else if (nextOffset < 0) {
        nextOffset = (nextOffset % setWidth) + setWidth;
      }
    }
    offsetRef.current = nextOffset;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${nextOffset}px, 0, 0)`;
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    directionLockRef.current = null;
    momentumVelocityRef.current = Math.max(-18, Math.min(18, momentumVelocityRef.current));
  };

  // Helper icons and styles
  const getIcon = (name: StatisticItem['iconName']) => {
    switch (name) {
      case 'Users':
        return <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />;
      case 'Award':
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />;
    }
  };

  const getIconBg = (name: StatisticItem['iconName']) => {
    switch (name) {
      case 'Users':
        return 'bg-blue-50 border-blue-200/80';
      case 'GraduationCap':
        return 'bg-teal-50 border-teal-200/80';
      case 'Award':
        return 'bg-amber-50 border-amber-200/80';
      case 'BookOpen':
        return 'bg-purple-50 border-purple-200/80';
      case 'Building2':
        return 'bg-emerald-50 border-emerald-200/80';
    }
  };

  // Card component renderer preserving all visual details
  const renderCardContent = (stat: StatisticItem, isMobileCard = false) => (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group ${
        isMobileCard ? 'w-[250px] xs:w-[270px] shrink-0 select-none mr-3 sm:mr-4' : 'hover:-translate-y-1'
      }`}
    >
      {/* Icon badge */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border ${getIconBg(stat.iconName)} shadow-xs group-hover:scale-110 transition-transform duration-200`}>
          {getIcon(stat.iconName)}
        </div>
        <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />
      </div>

      {/* Number and Label */}
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight transition-all">
          <span>{stat.value}</span>
        </div>

        <div className="text-sm font-bold text-slate-800 mt-1">
          {stat.label}
        </div>

        <p className="text-xs text-slate-500 mt-1.5 leading-snug line-clamp-2">
          {stat.description}
        </p>
      </div>
    </div>
  );

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 md:-mt-16 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================================================
            MOBILE LAYOUT: Continuous, Right-to-Left Auto-Scrolling Carousel
            (Visible on mobile screens < 768px, with touch/drag & dynamic page-scroll speed)
           ========================================================================= */}
        <div
          ref={containerRef}
          className="md:hidden relative w-full overflow-hidden py-2 -mx-4 px-4 touch-pan-y"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Edge fade gradients for seamless visual aesthetic */}
          <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-[#f8fbff] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-[#f8fbff] to-transparent z-10 pointer-events-none" />

          {/* Continuously translating flex track */}
          <div
            ref={trackRef}
            className="flex will-change-transform cursor-grab active:cursor-grabbing"
            style={{ width: 'max-content' }}
          >
            {mobileCards.map((stat, idx) => (
              <React.Fragment key={`${stat.id}-mobile-${idx}`}>
                {renderCardContent(stat, true)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* =========================================================================
            DESKTOP & TABLET LAYOUT: Original 3 to 5 Column Grid
            (Maintained 100% untouched for screens >= 768px)
           ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {STATISTICS_DATA.map((stat) => (
            <React.Fragment key={stat.id}>
              {renderCardContent(stat, false)}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};
