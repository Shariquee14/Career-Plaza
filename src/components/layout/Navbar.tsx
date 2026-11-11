import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  PhoneCall, 
  ArrowRight, 
  ShieldCheck, 
  Compass,
  Mail
} from 'lucide-react';
import { BRAND_CONFIG } from '../../data/config';
import { BrandLogo } from '../ui/BrandLogo';

interface NavbarProps {
  onOpenAdminDrawer?: () => void;
  pendingReviewsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAdminDrawer, 
  pendingReviewsCount = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Student Reviews', path: '/reviews' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* Top micro bar for official support */}
      <div className="bg-[#0b1b3d] text-slate-300 text-xs py-1.5 px-4 sm:px-6 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-blue-200">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{BRAND_CONFIG.tagline}</span>
            </span>
            <span className="text-slate-400 hidden lg:inline">
              Official Admission Advisory & Career Counselling Desk
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a 
              href={`mailto:${BRAND_CONFIG.contact.officialEmail}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="Official Email"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{BRAND_CONFIG.contact.officialEmail}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href={`tel:${BRAND_CONFIG.contact.officialPhone}`} 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>{BRAND_CONFIG.contact.officialPhone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
              title="Authorised Admin Desk Login & Console"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300" />
              <span>Admin Desk</span>
              {pendingReviewsCount > 0 && (
                <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingReviewsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80' 
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo — Black Version on Light Background */}
            <Link to="/" className="group flex items-center">
              <BrandLogo variant="black" size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/apply"
                className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-amber-500 sm:hidden"
              >
                Apply
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-semibold transition-colors touch-target flex items-center ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                to="/apply"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-orange-500/20"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex flex-col gap-2 text-xs text-slate-500 px-1 pt-1">
                <a href={`mailto:${BRAND_CONFIG.contact.officialEmail}`} className="hover:text-blue-600 flex items-center gap-1.5 font-medium text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>{BRAND_CONFIG.contact.officialEmail}</span>
                </a>
                <div className="flex items-center justify-between">
                  <a href={`tel:${BRAND_CONFIG.contact.officialPhone}`} className="hover:text-blue-600">
                    Call: {BRAND_CONFIG.contact.officialPhone}
                  </a>
                  <Link 
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-600 font-medium hover:text-blue-600 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Admin Desk</span>
                    {pendingReviewsCount > 0 && (
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {pendingReviewsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
