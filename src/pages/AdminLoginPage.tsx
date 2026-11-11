import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { loginAdmin, checkAdminSession } from '../services/adminAuth';
import { BrandLogo } from '../components/ui/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect immediately to /admin
  useEffect(() => {
    checkAdminSession().then(user => {
      if (user) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both Admin ID and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginAdmin(username.trim(), password);

      if (res.success) {
        // Successful login
        const destination = (location.state as any)?.from?.pathname || '/admin';
        navigate(destination, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid Admin ID or Password. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Unable to connect to security server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1b3d] via-[#0f2857] to-[#143775] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 relative overflow-hidden select-none">
      
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full border border-blue-400" />
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full border border-cyan-400" />
      </div>

      {/* Return to Public Site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Brand Emblem */}
        <div className="flex flex-col items-center text-center space-y-3">
          <BrandLogo variant="white" size="lg" showText={false} />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Desk Portal
          </h1>
          <p className="text-xs text-blue-200">
            CAREER PLAZA Authorised Administration & Admissions Console
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-slate-800 backdrop-blur-md">
          
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Authorised Sign-In
              </h2>
              <p className="text-[11px] text-slate-500">
                Enter your administrative credentials to continue
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="leading-snug font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin ID field */}
            <div>
              <label 
                htmlFor="admin-username" 
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Admin ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter authorized Admin ID"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field with Show/Hide toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password" 
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Sign In to Admin Desk</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Strictly restricted to designated administrative personnel.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
