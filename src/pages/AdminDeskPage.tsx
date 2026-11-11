import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  ShieldCheck, 
  LogOut, 
  FileText, 
  MessageSquare, 
  Check, 
  Trash2, 
  Download, 
  FileSpreadsheet,
  Search, 
  Filter, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Inbox,
  CheckCircle2,
  X,
  Send,
  HelpCircle,
  RotateCw
} from 'lucide-react';
import { checkAdminSession, logoutAdmin, AdminUser } from '../services/adminAuth';
import { 
  fetchServerApplications, 
  fetchServerAdminReviews, 
  fetchServerEnquiries,
  getStoredApplications,
  getStoredEnquiries,
  updateApplicationStatus, 
  deleteApplication, 
  updateEnquiryStatus,
  deleteEnquiry,
  resendEnquiryEmail,
  moderateReview, 
  deleteReview 
} from '../services/storage';
import { ApplicationSubmission, StudentReview, ContactEnquiry, EnquiryStatus } from '../types';
import { BrandLogo } from '../components/ui/BrandLogo';

export const AdminDeskPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'enquiries' | 'reviews' | 'security'>('applications');

  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Applications tab filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Enquiries tab filters & state
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryServiceFilter, setEnquiryServiceFilter] = useState('All');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [isExportingEnquiriesExcel, setIsExportingEnquiriesExcel] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);

  // Verify authentication on mount & protect route
  useEffect(() => {
    let isMounted = true;

    checkAdminSession().then((user) => {
      if (!isMounted) return;
      if (!user) {
        navigate('/admin/login', { replace: true, state: { from: { pathname: '/admin' } } });
      } else {
        setCurrentUser(user);
        setIsVerifying(false);
        loadData();
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [apps, revs, enqs] = await Promise.all([
        fetchServerApplications(),
        fetchServerAdminReviews(),
        fetchServerEnquiries(),
      ]);
      setApplications(apps);
      setReviews(revs);
      setEnquiries(enqs);
    } catch (err) {
      console.error('Error loading admin records', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const handleExportJSON = () => {
    const backup = {
      exportedBy: currentUser?.id,
      exportedAt: new Date().toISOString(),
      applications,
      enquiries,
      reviews,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAREER_PLAZA_Admin_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportEnquiriesExcel = async () => {
    try {
      setIsExportingEnquiriesExcel(true);
      let allEnqs: ContactEnquiry[] = [];
      try {
        allEnqs = await fetchServerEnquiries();
      } catch (err) {
        console.warn('Backend fetch failed, falling back to local storage', err);
      }

      if (!allEnqs || allEnqs.length === 0) {
        allEnqs = getStoredEnquiries();
      }

      if (!allEnqs || allEnqs.length === 0) {
        alert('No enquiries found to export.');
        return;
      }

      const rows = allEnqs.map((enq) => ({
        'Enquiry ID': enq.id || '',
        'Submission Date & Time': enq.createdAt ? new Date(enq.createdAt).toLocaleString('en-IN') : '',
        'Status': enq.status || 'New',
        'Full Name': enq.fullName || '',
        'Contact Phone': enq.phone ? String(enq.phone) : '',
        'Email Address': enq.email || '',
        'Service Interest': enq.serviceInterest || '',
        'Subject / Target Course': enq.subject || '',
        'Student Message / Question': enq.message || '',
        'Email Notification Status': enq.emailDeliveryStatus || 'pending',
        'Admin Notes': enq.notes || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const phoneCell = XLSX.utils.encode_cell({ r: R, c: 4 });
        if (worksheet[phoneCell]) {
          worksheet[phoneCell].t = 's';
        }
      }

      worksheet['!cols'] = [
        { wch: 18 }, // Enquiry ID
        { wch: 24 }, // Submission Date
        { wch: 14 }, // Status
        { wch: 22 }, // Full Name
        { wch: 18 }, // Contact Phone
        { wch: 30 }, // Email Address
        { wch: 24 }, // Service Interest
        { wch: 30 }, // Subject
        { wch: 50 }, // Message
        { wch: 24 }, // Email Notification Status
        { wch: 30 }, // Admin Notes
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Admission Enquiries');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `CAREER_PLAZA_Enquiries_${dateStr}.xlsx`);
    } catch (err) {
      console.error('Failed to export enquiries to Excel:', err);
      alert('An error occurred while generating the enquiries Excel export.');
    } finally {
      setIsExportingEnquiriesExcel(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);

      // Fetch all application records from actual storage / database
      let allApps: ApplicationSubmission[] = [];
      try {
        allApps = await fetchServerApplications();
      } catch (err) {
        console.warn('Backend fetch failed, falling back to local storage', err);
      }

      if (!allApps || allApps.length === 0) {
        allApps = getStoredApplications();
      }

      if (!allApps || allApps.length === 0) {
        alert('No applications found to export.');
        return;
      }

      // Map all fields into clear, human-readable column headings
      const rows = allApps.map((app) => ({
        'Reference ID': app.id || '',
        'Application Date': app.createdAt ? new Date(app.createdAt).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : '',
        'Application Status': app.status || 'New',
        'Student Full Name': app.fullName || '',
        'Phone Number': String(app.mobileNumber || ''),
        'Email Address': app.emailAddress || '',
        'Location / City': app.currentCity || '',
        'State': app.currentState || '',
        'Country': app.country || 'India',
        'Education Level': app.highestQualification || '',
        'Stream / Discipline': app.currentOrCompletedStream || '',
        'Last Course / School / College': app.currentOrLastCourse || '',
        'Passing Year': app.passingYear || '',
        'Academic Status': app.academicStatus || '',
        'Target Stream': app.preferredAdmissionCategory || '',
        'Course / Programme': app.preferredCourseOrProgramme || '',
        'Location Preference': app.preferredStudyLocation || '',
        'Preferred State or Country': app.preferredStateOrCountry || '',
        'Target Intake': app.preferredAdmissionYear || '',
        'Preferred College / University': app.preferredCollegeOrUniversity || 'Not specified',
        'Career Aspirations': app.careerGoals || '',
        'Preferred Colleges List': app.preferredCollegesList || 'None',
        'Guidance Needed': app.guidanceNeeded || '',
        'Additional Notes': app.additionalNotes || 'None',
        'Privacy Consent': app.privacyConsent ? 'Granted' : 'No'
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Explicitly format Phone Number (column E, 0-indexed 4) as string text
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const phoneCell = XLSX.utils.encode_cell({ r: R, c: 4 });
        if (worksheet[phoneCell]) {
          worksheet[phoneCell].t = 's';
          worksheet[phoneCell].z = '@';
        }
      }

      // Column widths for readable formatting
      worksheet['!cols'] = [
        { wch: 22 }, // Reference ID
        { wch: 22 }, // Application Date
        { wch: 18 }, // Application Status
        { wch: 24 }, // Student Full Name
        { wch: 20 }, // Phone Number
        { wch: 28 }, // Email Address
        { wch: 18 }, // Location / City
        { wch: 18 }, // State
        { wch: 14 }, // Country
        { wch: 20 }, // Education Level
        { wch: 22 }, // Stream / Discipline
        { wch: 26 }, // Last Course / School / College
        { wch: 14 }, // Passing Year
        { wch: 16 }, // Academic Status
        { wch: 20 }, // Target Stream
        { wch: 26 }, // Course / Programme
        { wch: 22 }, // Location Preference
        { wch: 24 }, // Preferred State or Country
        { wch: 16 }, // Target Intake
        { wch: 28 }, // Preferred College / University
        { wch: 32 }, // Career Aspirations
        { wch: 26 }, // Preferred Colleges List
        { wch: 32 }, // Guidance Needed
        { wch: 26 }, // Additional Notes
        { wch: 16 }, // Privacy Consent
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'All Applications');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `CAREER_PLAZA_Applications_${dateStr}.xlsx`);
    } catch (err) {
      console.error('Failed to export applications to Excel:', err);
      alert('An error occurred while generating the Excel export. Please try again.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#0b1b3d] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-blue-200">
          Verifying Administrator Session with Backend Security Server...
        </p>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending');

  const newEnquiriesCount = enquiries.filter(e => (e.status || 'New') === 'New').length;
  const contactedEnquiriesCount = enquiries.filter(e => e.status === 'Contacted').length;
  const inProgressEnquiriesCount = enquiries.filter(e => e.status === 'In Progress').length;
  const completedEnquiriesCount = enquiries.filter(e => e.status === 'Completed').length;

  const filteredEnquiries = enquiries.filter((enq) => {
    const q = enquirySearch.toLowerCase();
    const matchesSearch =
      enq.fullName.toLowerCase().includes(q) ||
      enq.email.toLowerCase().includes(q) ||
      enq.phone.toLowerCase().includes(q) ||
      (enq.subject && enq.subject.toLowerCase().includes(q)) ||
      (enq.id && enq.id.toLowerCase().includes(q)) ||
      (enq.message && enq.message.toLowerCase().includes(q));

    const matchesService =
      enquiryServiceFilter === 'All' || enq.serviceInterest === enquiryServiceFilter;

    const enqStatus = enq.status || 'New';
    const matchesStatus =
      enquiryStatusFilter === 'All' || enqStatus === enquiryStatusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  const handleUpdateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSaveEnquiryNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    try {
      await updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status || 'New', adminNotes);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, notes: adminNotes } : e))
      );
      setSelectedEnquiry((prev) => (prev ? { ...prev, notes: adminNotes } : null));
      alert('Admin notes saved successfully.');
    } catch (err) {
      alert('Failed to save notes.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleResendEnquiryEmail = async (id: string) => {
    setResendingEmailId(id);
    try {
      const res = await resendEnquiryEmail(id);
      alert(res.message);
      loadData();
    } catch (err) {
      alert('Failed to resend notification.');
    } finally {
      setResendingEmailId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.mobileNumber.includes(searchTerm) ||
      app.preferredCourseOrProgramme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.preferredAdmissionCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = filterCategory === 'All' || app.preferredAdmissionCategory === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      
      {/* Top Admin Console Navigation Bar */}
      <header className="bg-[#0b1b3d] text-white px-4 sm:px-6 lg:px-8 py-4 shadow-lg sticky top-0 z-30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Portal Tag */}
          <div className="flex items-center gap-3">
            <BrandLogo variant="white" size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight">
                  CAREER PLAZA Admin Desk
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Secure Intake Management & Review Moderation System
              </p>
            </div>
          </div>

          {/* User Session & Logout Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-200 block">
                {currentUser?.name}
              </span>
              <span className="text-[10px] text-blue-300 font-mono">
                ID: {currentUser?.id} ({currentUser?.role})
              </span>
            </div>

            <Link
              to="/"
              className="text-xs text-slate-300 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors hidden md:inline-block"
            >
              Public Site
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              title="End session and securely log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Workplace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-sm">
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Applications ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'enquiries'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Enquiries ({enquiries.length})</span>
              {newEnquiriesCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {newEnquiriesCount} New
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reviews Moderation ({reviews.length})</span>
              {pendingReviews.length > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {pendingReviews.length} Pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Accounts</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap sm:flex-nowrap">
            <button
              onClick={loadData}
              disabled={isLoadingData}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {activeTab === 'enquiries' ? (
              <button
                onClick={handleExportEnquiriesExcel}
                disabled={isExportingEnquiriesExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors cursor-pointer disabled:opacity-50"
                title="Export all admission enquiries to Excel (.xlsx)"
              >
                <FileSpreadsheet className={`w-3.5 h-3.5 text-emerald-600 ${isExportingEnquiriesExcel ? 'animate-pulse' : ''}`} />
                <span>{isExportingEnquiriesExcel ? 'Exporting...' : 'Export Enquiries Excel'}</span>
              </button>
            ) : (
              <button
                onClick={handleExportExcel}
                disabled={isExportingExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors cursor-pointer disabled:opacity-50"
                title="Export all applications to Excel (.xlsx)"
              >
                <FileSpreadsheet className={`w-3.5 h-3.5 text-emerald-600 ${isExportingExcel ? 'animate-pulse' : ''}`} />
                <span>{isExportingExcel ? 'Exporting...' : 'Export Excel'}</span>
              </button>
            )}

            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>

        </div>

        {/* TAB 1: APPLICATIONS INTAKE */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applicants by name, email, phone, or course..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:outline-hidden"
              >
                <option value="All">All Categories</option>
                <option value="Study Abroad">Study Abroad</option>
                <option value="Medical">Medical Admissions</option>
                <option value="Engineering">Engineering</option>
                <option value="MBA / Management">MBA / Management</option>
                <option value="Other Courses">Other Courses</option>
              </select>
            </div>

            {filteredApps.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-700">No applications found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When visitors submit the Apply Now form, their comprehensive profiles appear here for administrative follow-up.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-base">
                            {app.fullName}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            app.status === 'New' ? 'bg-amber-100 text-amber-800' :
                            app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            Ref: {app.id}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>Submitted: {new Date(app.createdAt).toLocaleString()}</span>
                        </span>
                      </div>

                      {/* Status Update Controls */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <select
                          value={app.status}
                          onChange={async (e) => {
                            await updateApplicationStatus(app.id, e.target.value as any);
                            loadData();
                          }}
                          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-bold"
                        >
                          <option value="New">Status: New</option>
                          <option value="Under Review">Status: Under Review</option>
                          <option value="Contacted">Status: Contacted</option>
                        </select>

                        <button
                          onClick={async () => {
                            if (confirm(`Delete application record for ${app.fullName}?`)) {
                              await deleteApplication(app.id);
                              loadData();
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Application Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Contact & Location Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <a href={`tel:${app.mobileNumber}`} className="font-semibold hover:underline">
                          {app.mobileNumber}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <a href={`mailto:${app.emailAddress}`} className="hover:underline truncate">
                          {app.emailAddress}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{app.currentCity}, {app.currentState} ({app.country})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{app.highestQualification} ({app.currentOrCompletedStream})</span>
                      </div>
                    </div>

                    {/* Academic & Preference Summary */}
                    <div className="text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Target Stream:</strong> <span className="text-blue-700 font-bold">{app.preferredAdmissionCategory}</span> — {app.preferredCourseOrProgramme}
                      </div>
                      <div>
                        <strong>Location Preference:</strong> {app.preferredStudyLocation} ({app.preferredStateOrCountry}) • Target Intake: {app.preferredAdmissionYear}
                      </div>
                      {app.preferredCollegeOrUniversity && (
                        <div>
                          <strong>Target Institutes:</strong> {app.preferredCollegeOrUniversity}
                        </div>
                      )}
                    </div>

                    {/* Career Goals / Guidance Notes */}
                    {app.careerGoals && (
                      <div className="text-xs bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 text-slate-700 italic">
                        <strong>Career Aspirations:</strong> "{app.careerGoals}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ADMISSION ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Enquiries</span>
                <span className="text-2xl font-extrabold text-slate-900">{enquiries.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-2xs">
                <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">New / Pending</span>
                <span className="text-2xl font-extrabold text-amber-600">{newEnquiriesCount}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-blue-200/90 shadow-2xs">
                <span className="text-xs text-blue-700 font-bold uppercase tracking-wider block">Contacted</span>
                <span className="text-2xl font-extrabold text-blue-600">{contactedEnquiriesCount}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-200/90 shadow-2xs">
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Completed</span>
                <span className="text-2xl font-extrabold text-emerald-600">{completedEnquiriesCount}</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search enquiries by name, email, phone, or question..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <select
                    value={enquiryServiceFilter}
                    onChange={(e) => setEnquiryServiceFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-700 focus:outline-hidden text-xs cursor-pointer"
                  >
                    <option value="All">All Services</option>
                    <option value="Study Abroad">Study Abroad</option>
                    <option value="Medical Admissions">Medical Admissions</option>
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="MBA & Management">MBA & Management</option>
                    <option value="Other Courses & Degrees">Other Degree Courses</option>
                    <option value="General Counselling">General Counselling</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-700 focus:outline-hidden text-xs cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Completed">Status: Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enquiries Records List */}
            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-700">No admission enquiries found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When prospective students submit the Admission Enquiry form, their requests appear here and trigger an alert to careerplaza.work@gmail.com.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enq) => {
                  const currentStatus = enq.status || 'New';
                  return (
                    <div
                      key={enq.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-200 transition-all space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-base">
                              {enq.fullName}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                currentStatus === 'New'
                                  ? 'bg-amber-100 text-amber-800'
                                  : currentStatus === 'Contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : currentStatus === 'In Progress'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {currentStatus.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              Ref: {enq.id}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Submitted: {new Date(enq.createdAt).toLocaleString('en-IN')}</span>
                          </span>
                        </div>

                        {/* Status Update & Actions */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 font-bold focus:outline-hidden"
                          >
                            <option value="New">Status: New</option>
                            <option value="Contacted">Status: Contacted</option>
                            <option value="In Progress">Status: In Progress</option>
                            <option value="Completed">Status: Completed</option>
                          </select>

                          <button
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setAdminNotes(enq.notes || '');
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={async () => {
                              if (confirm(`Delete enquiry from ${enq.fullName}?`)) {
                                await deleteEnquiry(enq.id);
                                loadData();
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Enquiry Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact & Service Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <a href={`tel:${enq.phone}`} className="font-semibold hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <a href={`mailto:${enq.email}`} className="hover:underline truncate">
                            {enq.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-500">Service:</span>
                          <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {enq.serviceInterest || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-slate-500">Target:</span>
                          <span className="font-semibold text-slate-900 truncate" title={enq.subject}>
                            {enq.subject || 'General'}
                          </span>
                        </div>
                      </div>

                      {/* Student Message */}
                      <div className="text-xs bg-white p-3.5 rounded-xl border border-slate-200/80 text-slate-800 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Student Question / Message:
                        </span>
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {enq.message}
                        </p>
                      </div>

                      {/* Footer Notification Status & Quick Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {enq.emailDeliveryStatus === 'sent' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Notification Email: Sent to careerplaza.work@gmail.com</span>
                            </span>
                          ) : enq.emailDeliveryStatus === 'failed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                              <span>Email Delivery Failed</span>
                              <button
                                onClick={() => handleResendEnquiryEmail(enq.id)}
                                disabled={resendingEmailId === enq.id}
                                className="underline font-bold ml-1 hover:text-red-900 cursor-pointer"
                              >
                                {resendingEmailId === enq.id ? 'Retrying...' : 'Retry'}
                              </button>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200" title="Notification recorded in backend database. Configure SMTP_USER/PASS in .env to deliver live emails.">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span>Notification Logged (SMTP not configured in .env)</span>
                              <button
                                onClick={() => handleResendEnquiryEmail(enq.id)}
                                disabled={resendingEmailId === enq.id}
                                className="text-blue-600 font-bold hover:underline ml-1 cursor-pointer"
                              >
                                {resendingEmailId === enq.id ? 'Sending...' : 'Send Alert'}
                              </button>
                            </span>
                          )}

                          {enq.notes && (
                            <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Note: {enq.notes}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${enq.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Student</span>
                          </a>
                          <a
                            href={`mailto:${enq.email}?subject=CAREER%20PLAZA%20Admission%20Enquiry%20Follow-up%20[${enq.id}]`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Reply Email</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Review Moderation Policy:</strong>
                <span>
                  Only reviews marked as <strong>Approved</strong> are rendered on the public website. Submissions marked as Pending remain private until an authorized administrator verifies them.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-3 ${
                    rev.status === 'pending'
                      ? 'border-amber-400 ring-2 ring-amber-100'
                      : rev.status === 'approved'
                      ? 'border-slate-200'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {rev.studentName}
                          </h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            rev.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {rev.status.toUpperCase()}
                          </span>
                          {rev.isSample && (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md">
                              Demo Seed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {rev.course} • {rev.destination}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={async () => {
                              await moderateReview(rev.id, 'approved');
                              loadData();
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Approve for public listing"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {rev.status !== 'rejected' && (
                          <button
                            onClick={async () => {
                              await moderateReview(rev.id, 'rejected');
                              loadData();
                            }}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                            title="Reject review"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            if (confirm('Delete review permanently?')) {
                              await deleteReview(rev.id);
                              loadData();
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                      <span className="text-[11px] text-slate-400 ml-1">
                        ({rev.rating} of 5 Stars)
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{rev.writtenExperience}"
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Category: {rev.category}</span>
                    <span>Date: {rev.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: SYSTEM SECURITY & 4 PERMANENT ACCOUNTS */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Backend Cryptographic Security Status</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Password Encryption</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed">
                    Bcrypt (Cost Factor 12). Plaintext passwords are never stored or logged.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Session Architecture</span>
                  </div>
                  <p className="text-blue-700 leading-relaxed">
                    HttpOnly Cookie + Cryptographic 256-bit Token with 2-hour inactivity timeout.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
                  <div className="font-bold text-purple-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Brute-Force Guard</span>
                  </div>
                  <p className="text-purple-700 leading-relaxed">
                    Express Rate-Limiting enabled (max 10 login attempts per 15 minutes per IP).
                  </p>
                </div>
              </div>
            </div>

            {/* Four Authorised Accounts Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Four Permanent Authorised Admin Accounts
                  </h3>
                  <p className="text-xs text-slate-500">
                    These 4 accounts are provisioned on the secure backend and operate independently.
                  </p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  Fixed Provisioning
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Admin Account 1</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">SUPER_ADMIN</span>
                  </div>
                  <div>Admin ID: <code className="bg-white px-2 py-0.5 rounded font-bold text-blue-700">atif1234</code></div>
                  <div className="text-slate-500 text-[11px]">Status: Active & Authenticated</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Admin Account 2</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">SUPER_ADMIN</span>
                  </div>
                  <div>Admin ID: <code className="bg-white px-2 py-0.5 rounded font-bold text-blue-700">sharique2002</code></div>
                  <div className="text-slate-500 text-[11px]">Status: Active & Authenticated</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Admin Account 3</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">ADMIN</span>
                  </div>
                  <div>Admin ID: <code className="bg-white px-2 py-0.5 rounded font-bold text-blue-700">admin9877</code></div>
                  <div className="text-slate-500 text-[11px]">Status: Active & Authenticated</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Admin Account 4</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">ADMIN</span>
                  </div>
                  <div>Admin ID: <code className="bg-white px-2 py-0.5 rounded font-bold text-blue-700">admin8766</code></div>
                  <div className="text-slate-500 text-[11px]">Status: Active & Authenticated</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* DETAILED ENQUIRY MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="bg-[#0b1b3d] text-white p-6 flex items-start justify-between">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                  Admission Enquiry Dossier
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {selectedEnquiry.fullName}
                </h3>
                <p className="text-xs text-blue-200 font-mono mt-1">
                  Ref ID: {selectedEnquiry.id} • Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Status Update Banner */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700">Workflow Status:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['New', 'Contacted', 'In Progress', 'Completed'] as EnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        (selectedEnquiry.status || 'New') === st
                          ? st === 'New'
                            ? 'bg-amber-500 text-slate-900 shadow-xs'
                            : st === 'Contacted'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : st === 'In Progress'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Contact Phone</span>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">{selectedEnquiry.phone}</span>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700"
                    >
                      Call
                    </a>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Email Address</span>
                  <div className="flex items-center justify-between truncate gap-2">
                    <span className="font-semibold text-slate-900 truncate">{selectedEnquiry.email}</span>
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=CAREER%20PLAZA%20Admission%20Follow-up%20[${selectedEnquiry.id}]`}
                      className="px-2.5 py-1 rounded-md bg-slate-700 text-white text-[11px] font-bold hover:bg-slate-800 shrink-0"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Target Stream & Interest */}
              <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">Service Interest:</span>
                  <span className="bg-white px-2.5 py-0.5 rounded-full border border-blue-200 font-bold text-blue-700">
                    {selectedEnquiry.serviceInterest || 'General Counselling'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-blue-900">Subject / Target Course: </span>
                  <span className="text-slate-800">{selectedEnquiry.subject || 'Not specified'}</span>
                </div>
              </div>

              {/* Student Message / Query */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Student Message & Guidance Requirements:
                </span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Email Notification Status & Resend */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-slate-700">Notification Alert Status:</span>
                  {selectedEnquiry.emailDeliveryStatus === 'sent' ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Dispatched to careerplaza.work@gmail.com
                    </span>
                  ) : selectedEnquiry.emailDeliveryStatus === 'failed' ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Failed: {selectedEnquiry.emailDeliveryError || 'SMTP Error'}
                    </span>
                  ) : (
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Logged to server (SMTP pending configuration in .env)
                    </span>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleResendEnquiryEmail(selectedEnquiry.id)}
                    disabled={resendingEmailId === selectedEnquiry.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{resendingEmailId === selectedEnquiry.id ? 'Sending...' : 'Resend Email Alert to careerplaza.work@gmail.com'}</span>
                  </button>
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Internal Admin Follow-up Notes
                  </label>
                  <button
                    onClick={handleSaveEnquiryNotes}
                    disabled={isSavingNotes}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record counsellor notes, follow-up calls, student preferences, or next action steps..."
                  rows={3}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
