import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chrome,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Compass,
  CheckCircle2,
  KeyRound,
  X,
  GraduationCap,
  Briefcase,
  UserCheck,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { UserRole } from '../types';

interface LoginPageProps {
  defaultMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const queryRole = searchParams.get('role') as UserRole | null;

  const { login, register, loginWithGoogle } = useAuth();

  const initialMode = defaultMode || (location.pathname === '/register' ? 'register' : 'login');
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isSwitching, setIsSwitching] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(queryRole || 'student');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [otpInput, setOtpInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Sync mode if pathname changes externally
  useEffect(() => {
    const routeMode = location.pathname === '/register' ? 'register' : 'login';
    if (routeMode !== mode) {
      triggerModeSwitch(routeMode);
    }
  }, [location.pathname]);

  const triggerModeSwitch = (newMode: 'login' | 'register') => {
    if (newMode === mode && !isSwitching) return;
    setError('');
    setIsSwitching(true);

    setTimeout(() => {
      setMode(newMode);
      window.history.replaceState(null, '', newMode === 'register' ? '/register' : '/login');
      setIsSwitching(false);
    }, 250);
  };

  const handleSuccessfulAuth = (user?: UserProfile) => {
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (user?.role === 'admin' || role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let user: UserProfile;
      if (mode === 'login') {
        user = await login(email, password);
      } else {
        const fullName = `${firstName} ${lastName}`.trim() || firstName || 'PathSeeker Member';
        user = await register(email, password, fullName, selectedRole, educationLevel);
      }
      handleSuccessfulAuth(user);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message;
      setError(serverMsg || (mode === 'login' ? 'Invalid email or password.' : 'Failed to create account.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const user = await loginWithGoogle(selectedRole);
      handleSuccessfulAuth(user);
    } catch (err: any) {
      if (err.message && !err.message.includes('cancelled')) {
        setError(err.message);
      }
    }
  };

  // Forgot password OTP request
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotErr('');
    setForgotMsg('');
    try {
      const res = await authApi.forgotPassword(forgotEmail);
      setForgotMsg(res.message);
      if (res.otpDemo) {
        setDemoOtp(res.otpDemo);
      }
      setForgotStep('verify');
    } catch (err: any) {
      setForgotErr(err.response?.data?.message || err.message || 'Failed to request OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset password submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || !newPassInput) return;
    setForgotLoading(true);
    setForgotErr('');
    setForgotMsg('');
    try {
      const res = await authApi.resetPassword(forgotEmail, otpInput, newPassInput);
      setForgotMsg(res.message);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStep('request');
        setForgotMsg('');
        setDemoOtp(null);
      }, 1500);
    } catch (err: any) {
      setForgotErr(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-zinc-800 selection:text-white p-2 lg:h-screen lg:overflow-hidden lg:p-4 font-sans text-white">
      {/* LEFT COLUMN: Clean Minimalist Visual & Progress Milestones */}
      <div className="hidden lg:flex w-[48%] relative flex-col items-center justify-between p-12 rounded-3xl overflow-hidden shadow-2xl h-full border border-white/[0.08] bg-zinc-950">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

        {/* Top Logo */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-sm">
              <Compass className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white">
              PathSeeker
            </span>
          </Link>
          <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10 font-mono">
            Aptech TechWiz 6
          </span>
        </div>

        {/* Center Content */}
        <div className="z-10 w-full max-w-sm space-y-6 text-left my-auto">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {mode === 'login' ? 'Access Passport' : 'Initialize Passport'}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {mode === 'login'
                ? 'Sign in to review your saved blueprints, AI assessments, and readiness metrics.'
                : 'Join PathSeeker as a Student, Graduate, or Working Professional.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <StepItem number="01" title="Select Career Persona" desc="Student, Graduate or Professional track" active={true} />
            <StepItem number="02" title="Cloud Profile Synchronization" desc="Verified credentials and skill blueprints" active={mode === 'register'} />
            <StepItem number="03" title="Access Dynamic Career Bank" desc="Tailored salary tiers and masterclasses" active={false} />
          </div>
        </div>

        {/* Bottom Footer Tagline */}
        <div className="relative z-10 text-[11px] text-zinc-500 font-mono">
          Discover What Fits You Best &bull; &copy; 2026 PathSeeker
        </div>
      </div>

      {/* RIGHT COLUMN: Minimalist Form */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Minimal Tab Switcher */}
          <div className="flex items-center justify-center">
            <div className="relative flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl w-full max-w-xs">
              <button
                type="button"
                onClick={() => triggerModeSwitch('login')}
                disabled={isSwitching}
                className={`relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors text-center cursor-pointer ${
                  mode === 'login' ? 'text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode === 'login' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => triggerModeSwitch('register')}
                disabled={isSwitching}
                className={`relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors text-center cursor-pointer ${
                  mode === 'register' ? 'text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode === 'register' && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  />
                )}
                <span className="relative z-10">Create Account</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSwitching ? (
              <div className="space-y-4 py-12 text-center">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
              </div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="space-y-1 text-left">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {mode === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-zinc-400 text-xs">
                    {mode === 'login'
                      ? 'Enter your account credentials to proceed.'
                      : 'Fill in your professional details to get started.'}
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-11 flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-zinc-200 cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-zinc-300" />
                  <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/[0.08] w-full" />
                  <span className="bg-black px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-widest absolute">
                    or
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  {mode === 'register' && (
                    <>
                      {/* Name Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup
                          label="First Name"
                          placeholder="Elena"
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <InputGroup
                          label="Last Name"
                          placeholder="Rostova"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>

                      {/* Role Picker */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-300 block">
                          Career Stage Persona
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'student', label: 'Student', icon: GraduationCap },
                            { id: 'graduate', label: 'Graduate', icon: Briefcase },
                            { id: 'professional', label: 'Professional', icon: UserCheck },
                          ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = selectedRole === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedRole(item.id as UserRole)}
                                className={`p-2.5 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                  isSelected
                                    ? 'bg-white text-black border-white shadow-sm font-semibold'
                                    : 'bg-white/[0.02] text-zinc-400 border-white/[0.08] hover:bg-white/[0.05]'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[11px]">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <InputGroup
                    label="Email Address"
                    placeholder="user@example.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className="space-y-1">
                    <InputGroup
                      label="Password"
                      placeholder="••••••••••••"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />

                    {mode === 'login' && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(email);
                            setIsForgotModalOpen(true);
                          }}
                          className="text-[11px] text-zinc-400 hover:text-white font-medium cursor-pointer underline transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{mode === 'login' ? 'Sign In & Launch' : 'Create Career Passport'}</span>
                    )}
                  </button>
                </form>

                {/* Bottom Switcher */}
                <div className="text-center text-xs text-zinc-400 pt-1">
                  {mode === 'login' ? (
                    <p>
                      New to PathSeeker?{' '}
                      <button
                        type="button"
                        onClick={() => triggerModeSwitch('register')}
                        className="text-white hover:underline font-semibold ml-1 cursor-pointer"
                      >
                        Create Account &rarr;
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => triggerModeSwitch('login')}
                        className="text-white hover:underline font-semibold ml-1 cursor-pointer"
                      >
                        Sign in &rarr;
                      </button>
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD / OTP RESET MODAL */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-white text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-200">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Reset Password via OTP</h3>
                  <p className="text-[11px] text-zinc-400">One-Time Password verification</p>
                </div>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotMsg}</span>
              </div>
            )}

            {demoOtp && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-xs">
                <span>Demo OTP:</span> <span className="font-mono font-bold text-white text-sm ml-1">{demoOtp}</span>
              </div>
            )}

            {forgotErr && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                {forgotErr}
              </div>
            )}

            {forgotStep === 'request' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 block">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {forgotLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Generate Reset OTP &rarr;</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 block">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white text-center tracking-widest font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300 block">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {forgotLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm Password Reset</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

function StepItem({ number, title, desc, active }: { number: string; title: string; desc: string; active?: boolean }) {
  return (
    <div
      className={`p-3.5 rounded-xl flex items-start gap-3 text-xs transition-all border ${
        active
          ? 'bg-white/[0.05] text-white border-white/20'
          : 'bg-white/[0.01] text-zinc-400 border-white/[0.04]'
      }`}
    >
      <span className="font-mono text-[11px] font-semibold text-zinc-400 mt-0.5">{number}</span>
      <div>
        <p className="font-semibold text-white text-xs">{title}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  placeholder,
  type,
  required,
  value,
  onChange,
  rightElement,
}: {
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="space-y-1 text-left w-full">
      <label className="text-xs font-medium text-zinc-300 block">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl h-11 px-4 text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-white focus:outline-none text-xs transition-all"
        />
        {rightElement && (
          <div className="absolute right-3.5 flex items-center">{rightElement}</div>
        )}
      </div>
    </div>
  );
}
