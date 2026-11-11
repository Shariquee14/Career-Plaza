import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Check, 
  Trash2, 
  Download, 
  Database, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { 
  getStoredApplications, 
  updateApplicationStatus, 
  deleteApplication,
  getAllReviews,
  moderateReview,
  deleteReview,
  BACKEND_CONFIG
} from '../../services/storage';
import { ApplicationSubmission, StudentReview } from '../../types';
import logoWhite from '../../assets/logo-white.png';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'reviews' | 'backend'>('applications');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const applications = getStoredApplications();
  const allReviews = getAllReviews();
  const pendingReviews = allReviews.filter(r => r.status === 'pending');

  const filteredApps = applications.filter(app =>
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.mobileNumber.includes(searchTerm) ||
    app.preferredAdmissionCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      applications,
      reviews: allReviews,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `A_MARKED_data_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#0b1b3d] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/60 p-1 flex items-center justify-center border border-white/20 shrink-0">
              <img src={logoWhite} alt="CAREER PLAZA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                CAREER PLAZA Admin & Lead Management
              </h3>
              <p className="text-xs text-slate-400">
                Data Verification, Applications & Review Moderation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Applications ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reviews ({allReviews.length})</span>
              {pendingReviews.length > 0 && (
                <span className="bg-amber-500 text-slate-900 px-1.5 py-0.2 rounded-full font-extrabold">
                  {pendingReviews.length} pending
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('backend')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'backend'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backend Config</span>
            </button>
          </div>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1 text-slate-600 hover:text-blue-700 font-semibold cursor-pointer"
            title="Export all data to JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* TAB 1: APPLICATIONS LIST */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone or stream..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              {filteredApps.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No applications recorded yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    When visitors submit the form on the Apply Now page, their detailed profiles appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApps.map((app) => (
                    <div 
                      key={app.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{app.fullName}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              app.status === 'New' ? 'bg-amber-100 text-amber-800' :
                              app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            ID: <span className="font-mono text-slate-700">{app.id}</span> • {new Date(app.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Status Updater */}
                        <div className="flex items-center gap-1.5">
                          <select
                            value={app.status}
                            onChange={(e) => {
                              updateApplicationStatus(app.id, e.target.value as any);
                              onDataChanged?.();
                            }}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50"
                          >
                            <option value="New">New</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Contacted">Contacted</option>
                          </select>
                          <button
                            onClick={() => {
                              if (confirm('Delete this application record?')) {
                                deleteApplication(app.id);
                                onDataChanged?.();
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact & Location */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                        <div>📞 {app.mobileNumber}</div>
                        <div>✉️ {app.emailAddress}</div>
                        <div>📍 {app.currentCity}, {app.currentState} ({app.country})</div>
                        <div>🎓 {app.highestQualification} ({app.currentOrCompletedStream})</div>
                      </div>

                      {/* Preferences */}
                      <div className="text-xs text-slate-700">
                        <strong>Preferences:</strong> <span className="text-blue-700 font-semibold">{app.preferredAdmissionCategory}</span> • {app.preferredCourseOrProgramme} • Location: {app.preferredStudyLocation} ({app.preferredStateOrCountry}) • Target Year: {app.preferredAdmissionYear}
                      </div>

                      {/* Notes / Career Goals */}
                      {app.careerGoals && (
                        <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                          "Career Goals: {app.careerGoals}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Moderation Policy:</strong> Only reviews marked as <em>approved</em> will render on the public website. Sample development reviews are clearly indicated.
                </span>
              </div>

              <div className="space-y-3">
                {allReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      rev.status === 'pending'
                        ? 'bg-amber-50/60 border-amber-300'
                        : rev.status === 'approved'
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rev.studentName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            rev.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {rev.status.toUpperCase()}
                          </span>
                          {rev.isSample && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              Demo Seed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {rev.course} • {rev.destination} • {rev.category} ({rev.rating} ★)
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => {
                              moderateReview(rev.id, 'approved');
                              onDataChanged?.();
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Approve for public view"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              moderateReview(rev.id, 'rejected');
                              onDataChanged?.();
                            }}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Delete review permanently?')) {
                              deleteReview(rev.id);
                              onDataChanged?.();
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 italic bg-white/80 p-2.5 rounded-xl border border-slate-100">
                      "{rev.writtenExperience}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BACKEND CONFIGURATION GUIDE */}
          {activeTab === 'backend' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Backend Storage Status</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-emerald-800">
                    Local Persistent Browser Storage Active (HTML5 localStorage)
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Applications and reviews are securely recorded in the local environment and persist across page refreshes.
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2.5">
                <h4 className="font-bold text-blue-900 text-sm">
                  Connecting to Supabase or Webhook Service
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  To stream submissions to a remote database or external admission CRM, provide the following environment variables in your <code>.env</code> file:
                </p>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`# .env configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUBMISSION_WEBHOOK=https://your-crm-webhook-endpoint.com/admissions`}
                </pre>
                <p className="text-[11px] text-slate-500">
                  When configured, submissions will automatically be forwarded to your external endpoint while preserving local access.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>CAREER PLAZA Admission Administrative Suite</span>
          <button
            onClick={onClose}
            className="text-blue-600 font-bold hover:underline"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
