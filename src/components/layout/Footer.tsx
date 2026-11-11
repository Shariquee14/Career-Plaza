import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  Send 
} from 'lucide-react';
import { BRAND_CONFIG, EDUCATION_SERVICES } from '../../data/config';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1b3d] text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info & Mission (Spans 2 on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Logo — White Version on Dark Background */}
            <Link to="/" className="inline-flex items-center group">
              <BrandLogo variant="white" size="md" />
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed max-w-md pt-2">
              {BRAND_CONFIG.heroDescription}
            </p>

            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                Official Working Hours
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{BRAND_CONFIG.contact.businessHours}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Connect With Our Counselling Desk
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={BRAND_CONFIG.socialLinks.whatsAppChat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                  title="WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href={BRAND_CONFIG.socialLinks.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-xs font-medium text-slate-200 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={BRAND_CONFIG.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-pink-600 text-xs font-medium text-slate-200 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={BRAND_CONFIG.socialLinks.youTube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-600 text-xs font-medium text-slate-200 transition-colors"
                >
                  YouTube
                </a>
                <a
                  href={BRAND_CONFIG.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-800 text-xs font-medium text-slate-200 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase border-l-2 border-blue-500 pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400" />
                  <span>Our Services</span>
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400" />
                  <span>Student Reviews</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1">
                  <span>Start Application</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Education Programmes */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase border-l-2 border-teal-500 pl-2.5">
              Education
            </h4>
            <ul className="space-y-2.5 text-sm">
              {EDUCATION_SERVICES.map((s) => (
                <li key={s.id}>
                  <Link 
                    to={`/services#${s.slug}`} 
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-teal-400" />
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources & Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase border-l-2 border-amber-500 pl-2.5">
              Official Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{BRAND_CONFIG.contact.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${BRAND_CONFIG.contact.officialPhone}`} className="hover:text-white">
                  {BRAND_CONFIG.contact.officialPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${BRAND_CONFIG.contact.officialEmail}`} className="hover:text-white">
                  {BRAND_CONFIG.contact.officialEmail}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Legal & Resources
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-slate-400">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <Link to="/contact#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Transparency Note */}
        <div className="py-6 border-b border-slate-800/80 text-slate-400 text-xs leading-relaxed flex flex-col md:flex-row items-start md:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <p>
            <strong className="text-slate-300">Compliance & Advisory Scope:</strong> {BRAND_CONFIG.disclaimers.partnershipsDisclaimer} {BRAND_CONFIG.disclaimers.statDisclaimer}
          </p>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © {currentYear} <span className="text-slate-200 font-semibold">{BRAND_CONFIG.name}</span>. All Rights Reserved.
          </p>
          <p className="text-slate-400 text-center sm:text-right">
            Independent Career Counselling & Admission Consultancy Platform
          </p>
        </div>

      </div>
    </footer>
  );
};
