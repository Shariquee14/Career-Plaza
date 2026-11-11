import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ApplyNowPage } from './pages/ApplyNowPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDeskPage } from './pages/AdminDeskPage';

import { getApprovedReviews, getPendingReviews, fetchServerApprovedReviews } from './services/storage';
import { StudentReview } from './types';

// Scroll to top or target hash helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const [approvedReviews, setApprovedReviews] = useState<StudentReview[]>(() => getApprovedReviews());
  const [pendingCount, setPendingCount] = useState<number>(() => getPendingReviews().length);

  const reloadData = async () => {
    try {
      const serverApproved = await fetchServerApprovedReviews();
      if (serverApproved && serverApproved.length > 0) {
        setApprovedReviews(serverApproved);
      } else {
        setApprovedReviews(getApprovedReviews());
      }
    } catch {
      setApprovedReviews(getApprovedReviews());
    }
    setPendingCount(getPendingReviews().length);
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbff] text-slate-800">
      {/* Public Navigation Bar - Hidden on /admin routes */}
      {!isAdminPath && (
        <Navbar pendingReviewsCount={pendingCount} />
      )}

      {/* Dynamic Route Pages */}
      <main className="flex-1 w-full">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                approvedReviews={approvedReviews} 
                onRefreshReviews={reloadData} 
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route 
            path="/reviews" 
            element={
              <ReviewsPage 
                approvedReviews={approvedReviews} 
                onRefreshReviews={reloadData} 
              />
            } 
          />
          <Route path="/apply" element={<ApplyNowPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Admin Desk Authentication & Management Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDeskPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage approvedReviews={approvedReviews} onRefreshReviews={reloadData} />} />
        </Routes>
      </main>

      {/* Public Footer - Hidden on /admin routes */}
      {!isAdminPath && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
