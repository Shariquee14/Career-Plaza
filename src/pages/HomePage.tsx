import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { StatisticsSection } from '../components/home/StatisticsSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { StudentJourneySection } from '../components/home/StudentJourneySection';
import { ReviewsCarouselSection } from '../components/home/ReviewsCarouselSection';
import { CtaBannerSection } from '../components/home/CtaBannerSection';
import { StudentReview } from '../types';

interface HomePageProps {
  approvedReviews: StudentReview[];
  onRefreshReviews?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  approvedReviews,
  onRefreshReviews,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO / MAIN BANNER */}
      <HeroSection />

      {/* SECTION 2: ACHIEVEMENTS AND STATISTICS */}
      <StatisticsSection />

      {/* SECTION 3: OUR EDUCATION SERVICES — FIVE MAIN CATEGORIES */}
      <ServicesSection />

      {/* SECTION 4: HOW IT WORKS — STUDENT JOURNEY */}
      <StudentJourneySection />

      {/* SECTION 5: STUDENT REVIEWS AND COMMUNITY FEEDBACK */}
      <ReviewsCarouselSection 
        reviews={approvedReviews} 
        onRefreshReviews={onRefreshReviews}
      />

      {/* SECTION 6: READY TO JOIN US — CALL TO ACTION */}
      <CtaBannerSection />
    </div>
  );
};
