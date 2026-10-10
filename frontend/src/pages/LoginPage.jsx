import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Button } from '../components/common/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInDemo, resetPassword, isConfigured, demoGardener } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Target path if redirected by ProtectedRoute
  const destination = location.state?.from?.pathname || '/dashboard';
  const noticeMsg = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || t('errorLoginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setDemoLoading(true);
    try {
      await signInDemo();
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setDemoLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(demoGardener.email);
    setPassword('urbanfarm123');
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResetLoading(true);
    try {
      const res = await resetPassword(resetEmail || email);
      setShowResetModal(false);
      setSuccessMsg(res.message || 'Password reset link sent to your email.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset link.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-forest-100 selection:text-forest-900">
      
      {/* Top Language & Back Navigation */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex items-center justify-between mb-6">
        <Link
          to="/"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
        >
          &larr; <span>{t('navHome')}</span>
        </Link>
        <LanguageSelector variant="light" />
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center text-white text-2xl mx-auto shadow-md shadow-forest-950/15 group-hover:scale-105 transition-transform">
            🌱
          </div>
        </Link>
        <h1 className="mt-4 text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          {t('loginTitle')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-600 font-normal max-w-sm mx-auto">
          {t('loginSubtitle')}
        </p>
      </div>

      {/* Main Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-stone-200/90 shadow-card">
          
          {/* Protected route notice */}
          {noticeMsg && (
            <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{noticeMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Transparent Mode Badge & Explanation */}
          {isConfigured ? (
            <div className="mb-5 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/70 text-xs text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Cloud Supabase Authentication Active</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Production</span>
            </div>
          ) : (
            <div className="mb-5 p-3.5 bg-forest-50/80 rounded-2xl border border-forest-200/70 text-xs text-forest-950">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-200/60 text-forest-900 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-forest-700" />
                  {t('demoNoticeBadge')}
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] font-bold text-forest-800 underline hover:text-forest-950"
                >
                  {t('demoQuickFill')}
                </button>
              </div>
              <p className="text-[11px] text-forest-800 leading-relaxed">
                {t('demoNoticeText')}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-[#FBFBF9]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {t('passwordLabel')}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowResetModal(true);
                  }}
                  className="text-[11px] font-semibold text-forest-800 hover:text-forest-950 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-[#FBFBF9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center !py-2.5 font-bold text-sm shadow-sm mt-2"
            >
              {loading ? 'Signing in...' : t('loginButton')}
            </Button>
          </form>

          {/* Quick Demo One-Click Login (Development Tool) */}
          <div className="mt-5 pt-5 border-t border-stone-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-forest-300 bg-forest-50/70 hover:bg-forest-100/80 text-forest-900 text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-forest-700" />
              <span>{demoLoading ? 'Loading Demo...' : t('quickDemoButton')}</span>
            </button>
            <p className="mt-1.5 text-center text-[10px] text-stone-400">
              {t('quickDemoDesc')}
            </p>
          </div>

          {/* Switch to Signup */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>{t('dontHaveAccount')} </span>
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="font-bold text-forest-800 hover:text-forest-950 underline"
            >
              {t('signUpLink')}
            </Link>
          </div>

        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-elevated border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-900">Reset Password</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Enter your account email. We will send a secure link to reset your garden credentials.
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-forest-800 bg-[#FBFBF9]"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={resetLoading}
                  className="text-xs !py-1.5 !px-3 font-semibold"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
