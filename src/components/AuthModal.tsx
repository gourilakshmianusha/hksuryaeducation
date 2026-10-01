import React, { useState } from 'react';
import { Logo } from './Logo';
import { api } from '../services/api';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: any) => void;
  adminRequested?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
  adminRequested = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await api.auth.login({ email, password });
        localStorage.setItem('hksurya_token', res.token);
        localStorage.setItem('hksurya_user', JSON.stringify(res.user));
        setSuccessMsg(`Welcome back, ${res.user.name}!`);
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 800);
      } else {
        const res = await api.auth.register({
          name,
          email,
          password,
          role: adminRequested ? 'admin' : 'student',
        });
        localStorage.setItem('hksurya_token', res.token);
        localStorage.setItem('hksurya_user', JSON.stringify(res.user));
        setSuccessMsg(`Account created! Welcome, ${res.user.name}!`);
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@hksuryalearning.com');
      setPassword('Student@2026');
      setName('Alex Chen');
      setMode('login');
    } else {
      setEmail('admin@hksuryalearning.com');
      setPassword('Admin@Hksurya2026');
      setName('Administrator');
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#091129] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGO IN LOGIN PAGE */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-3 shadow-inner">
            <Logo size="md" variant="dark" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {adminRequested
              ? 'HKSURYA Staff & Admin Gate'
              : mode === 'login'
              ? 'Sign In to Your Learning Portal'
              : 'Create Your Student Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {adminRequested
              ? 'Authorized institutional credentials required'
              : mode === 'login'
              ? 'Access 3D spatial labs, quizzes, and live mentors'
              : 'Join over 50,000 engineers building the future'}
          </p>
        </div>

        {/* Mode Switcher */}
        {!adminRequested && (
          <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#00D2FF] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#E65100] text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMsg ? (
          <div className="py-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">{successMsg}</div>
            <p className="text-xs text-slate-400">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work or Academic Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        alert('Enter your email above first.');
                        return;
                      }
                      await api.auth.forgotPassword(email);
                      alert('Password reset instructions dispatched to your email.');
                    }}
                    className="text-[11px] text-[#00D2FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill shortcuts */}
            <div className="pt-2">
              <div className="text-[11px] text-slate-400 mb-1.5">Database Demo Accounts:</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('student')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                >
                  Quick Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-[#FF7A00] border border-orange-500/20 transition-colors"
                >
                  Quick Admin Demo
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#00D2FF] via-[#38BDF8] to-[#00F0FF] hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign In to Portal' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
