export type AdmissionCategory = 
  | 'Study Abroad'
  | 'Medical'
  | 'Engineering'
  | 'MBA / Management'
  | 'Other Courses'
  | 'B.Tech'
  | 'Medical / MBBS';

export type StudyLocationPreference = 'India' | 'Abroad' | 'Open to Both';

export interface StatisticItem {
  id: string;
  label: string;
  value: string;
  placeholderKey: string;
  description: string;
  iconName: 'GraduationCap' | 'BookOpen' | 'Users' | 'Award' | 'Building2';
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cardColor: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
    buttonBg: string;
  };
  includes: string[];
  ctaLabel: string;
  iconName: string;
}

export interface IndianStateOpportunity {
  name: string;
  capital: string;
  popularStreams: string[];
  keyHubs: string[];
  description: string;
  colorScheme: string;
}

export interface AbroadCountryDestination {
  name: string;
  flagEmoji: string;
  currency: string;
  popularCourses: string[];
  keyIntakes: string[];
  overview: string;
  visaGuidanceHighlight: string;
}

export interface JourneyStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  iconName: 'ClipboardList' | 'FileCheck2' | 'UserCheck' | 'GraduationCap';
}

export interface StudentReview {
  id: string;
  studentName: string;
  course: string;
  destination: string;
  category: AdmissionCategory | string;
  rating: number; // 1-5
  writtenExperience: string;
  avatarSeed: string; // Used to generate cheerful cartoon/abstract student avatar
  avatarColor: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  isSample?: boolean;
  university?: string;
}

export interface ApplicationSubmission {
  id: string;
  // Section A - Student Information
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  currentCity: string;
  currentState: string;
  country: string;

  // Section B - Educational Background
  highestQualification: string;
  currentOrCompletedStream: string;
  currentOrLastCourse: string;
  passingYear: string;
  academicStatus: string;

  // Section C - Admission Preferences
  preferredAdmissionCategory: AdmissionCategory;
  preferredStudyLocation: StudyLocationPreference;
  preferredStateOrCountry: string;
  preferredCourseOrProgramme: string;
  preferredAdmissionYear: string;
  preferredCollegeOrUniversity?: string;

  // Section D - Additional Information
  careerGoals: string;
  preferredCollegesList?: string;
  guidanceNeeded: string;
  additionalNotes?: string;

  privacyConsent: boolean;
  createdAt: string;
  status: 'New' | 'Under Review' | 'Contacted';
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed';

export interface ContactEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  serviceInterest: string;
  message: string;
  createdAt: string;
  status?: EnquiryStatus;
  emailDeliveryStatus?: 'sent' | 'failed' | 'pending' | 'mock_delivered' | 'smtp_not_configured';
  emailDeliveryError?: string;
  notes?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  imageUrl: string;
  aspectRatio?: string;
}
