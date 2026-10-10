import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  CloudSun,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Droplets,
  Thermometer,
  Layers,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Button } from '../components/common/Button';

export function HomePage() {
  const navigate = useNavigate();
  const { user, signInDemo, isConfigured, authMode } = useAuth();
  const { t } = useLanguage();
  const [showArchModal, setShowArchModal] = useState(false);
  const [isLaunchingDemo, setIsLaunchingDemo] = useState(false);

  const handleLaunchDemo = async () => {
    setIsLaunchingDemo(true);
    try {
      await signInDemo();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo launch error:', err);
    } finally {
      setIsLaunchingDemo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-900 flex flex-col font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* ----------------------------------------------------------------------- */}
      {/* 1. TOP ANNOUNCEMENT & STATUS BAR */}
      {/* ----------------------------------------------------------------------- */}
      <div className="bg-forest-950 text-forest-100 text-xs py-2 px-4 border-b border-forest-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-800 text-forest-200 shrink-0">
              {isConfigured ? 'Cloud Sync' : 'Local Mode'}
            </span>
            <span className="text-forest-200 truncate">
              {isConfigured
                ? 'Connected to Supabase PostgreSQL & Cloud Storage'
                : 'Running on local SQLite persistence. Plug in Supabase keys anytime via .env'}
            </span>
          </div>

          <button
            onClick={() => setShowArchModal(true)}
            className="shrink-0 underline text-forest-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
          >
            <span>Architecture Info</span>
            <HelpCircle className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. PUBLIC HEADER / NAVIGATION */}
      {/* ----------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center text-white text-xl shadow-md shadow-forest-950/15 group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-stone-900 tracking-tight flex items-center gap-1.5">
                FloraPulse <span className="font-sans text-[10px] uppercase font-extrabold tracking-wider bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded">AI</span>
              </span>
              <p className="text-[11px] text-stone-500 font-medium tracking-wide">Urban Farming Assistant</p>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#features" className="hover:text-forest-800 transition-colors">
              {t('featureSectionPre', 'Features')}
            </a>
            <a href="#how-it-works" className="hover:text-forest-800 transition-colors">
              {t('howItWorksTitle', 'How it Works')}
            </a>
            <a href="#showcase" className="hover:text-forest-800 transition-colors">
              {t('navPlants', 'Tomato Guide')}
            </a>
            <button
              onClick={() => setShowArchModal(true)}
              className="hover:text-forest-800 transition-colors text-left"
            >
              {t('archLocalBadge', 'Architecture')}
            </button>
          </nav>

          {/* Right Actions: Language Selector + Auth CTAs */}
          <div className="flex items-center gap-3">
            <LanguageSelector variant="light" />

            {user ? (
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="gap-2 !py-2 !px-4 text-xs shadow-sm"
              >
                <span>{t('goToDashboard')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Button
                  variant="primary"
                  onClick={() => navigate('/signup')}
                  className="!py-2 !px-4 text-xs shadow-sm font-semibold"
                >
                  {t('navSignup')}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------------- */}
      {/* 3. HERO SECTION (BOTANICAL-TECH EDITORIAL) */}
      {/* ----------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-forest-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-sage-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 text-forest-900 border border-forest-200/60 text-xs font-semibold shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                <span>{t('heroBadge')}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-950 tracking-tight leading-[1.12]">
                {t('heroTitle')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t('heroSubtitle')}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                {user ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    className="w-full sm:w-auto shadow-elevated gap-2 text-sm font-semibold !py-3.5 !px-6"
                  >
                    <span>{t('goToDashboard')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate('/signup')}
                      className="w-full sm:w-auto shadow-elevated gap-2 text-sm font-semibold !py-3.5 !px-6"
                    >
                      <Sprout className="w-4 h-4" />
                      <span>{t('heroCtaPrimary')}</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={handleLaunchDemo}
                      disabled={isLaunchingDemo}
                      className="w-full sm:w-auto gap-2 text-sm font-semibold !py-3.5 !px-5 bg-white border border-stone-200/90 text-stone-800 hover:bg-stone-50"
                    >
                      <Sparkles className="w-4 h-4 text-forest-700" />
                      <span>{isLaunchingDemo ? 'Loading Demo...' : t('heroCtaDemo')}</span>
                    </Button>
                  </>
                )}
              </div>

              {/* Trust Indicators / Stats */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-stone-200/80 text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-forest-900">10</p>
                  <p className="text-xs font-semibold text-stone-700">{t('statConditions')}</p>
                  <p className="text-[10px] text-stone-400 hidden sm:block">{t('statConditionsSub')}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-forest-900">T=1.35</p>
                  <p className="text-xs font-semibold text-stone-700">{t('statInference')}</p>
                  <p className="text-[10px] text-stone-400 hidden sm:block">{t('statInferenceSub')}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-forest-900">Live API</p>
                  <p className="text-xs font-semibold text-stone-700">{t('statMicroclimate')}</p>
                  <p className="text-[10px] text-stone-400 hidden sm:block">{t('statMicroclimateSub')}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Product Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Botanical Product Card */}
                <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-elevated relative overflow-hidden">
                  
                  {/* Plant Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 text-lg font-bold">
                        🍅
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-stone-900">Balcony Sweet 100</h3>
                        <p className="text-[11px] text-stone-500 font-medium">Solanum lycopersicum • Terracotta Pot</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                      Optimal Care
                    </span>
                  </div>

                  {/* Leaf Visual with AI Diagnostics Overlay */}
                  <div className="relative mt-4 rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 border border-stone-200/60 group">
                    <img
                      src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80"
                      alt="Balcony tomato vine"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* AI Scanner HUD Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-xs font-semibold tracking-wide uppercase text-emerald-200">
                            Diagnostic Complete
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">
                          96.4% Confidence
                        </span>
                      </div>
                      <p className="text-sm font-serif font-bold text-white mt-1">
                        Healthy Tomato Foliage
                      </p>
                      <p className="text-[10px] text-stone-300">
                        High chlorophyll index • Zero necrotic lesions detected
                      </p>
                    </div>
                  </div>

                  {/* Microclimate Telemetry Pill */}
                  <div className="mt-4 p-3.5 bg-[#FBFBF9] rounded-2xl border border-stone-200/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <CloudSun className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block">Bandra, Mumbai</span>
                        <span className="text-[11px] text-stone-500">Balcony Sheltered • 29°C</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 font-bold text-forest-800">
                        <Droplets className="w-3.5 h-3.5 text-forest-600" />
                        <span>Water at 5:00 PM</span>
                      </span>
                      <span className="text-[10px] text-stone-400 block">Evaporation rate: Moderate</span>
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Calibrated against PlantVillage</span>
                    </span>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-forest-800 font-bold hover:underline"
                    >
                      Sign In &rarr;
                    </button>
                  </div>
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-elevated flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="block font-bold text-stone-900">Zero Over-Watering</strong>
                    <span className="text-[10px] text-stone-500">Container physics model</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 4. CORE FEATURES SECTION */}
      {/* ----------------------------------------------------------------------- */}
      <section id="features" className="py-20 bg-white border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-50 border border-forest-200/60 px-3 py-1 rounded-full">
              {t('featureSectionPre')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {t('featureSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {t('featureSectionSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-[#FBFBF9] border border-stone-200/80 hover:border-forest-300 transition-all shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mb-5 font-bold shadow-sm">
                  <ScanLine className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('feature1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('feature1Desc')}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-forest-800">
                <span>Calibrated Softmax T=1.35</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-[#FBFBF9] border border-stone-200/80 hover:border-forest-300 transition-all shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 font-bold shadow-sm border border-amber-100">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('feature2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('feature2Desc')}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-amber-800">
                <span>Open-Meteo Telemetry</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-[#FBFBF9] border border-stone-200/80 hover:border-forest-300 transition-all shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mb-5 font-bold shadow-sm border border-stone-200">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('feature3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('feature3Desc')}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-stone-800">
                <span>Porosity & Drainage Physics</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-[#FBFBF9] border border-stone-200/80 hover:border-forest-300 transition-all shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5 font-bold shadow-sm">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('feature4Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('feature4Desc')}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-emerald-800">
                <span>Organic & Non-Toxic</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 4.5 HOW IT WORKS SECTION (PRACTICAL 4-STEP BOTANICAL WORKFLOW) */}
      {/* ----------------------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 bg-[#F4F6F2] border-b border-stone-200/80 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100/70 border border-forest-200 px-3.5 py-1 rounded-full">
              {t('howItWorksPre')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft hover:border-forest-300 transition-all flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 text-forest-800 flex items-center justify-center font-bold text-lg shadow-sm">
                    <Sprout className="w-6 h-6 text-forest-700" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-stone-300 group-hover:text-forest-600 transition-colors">
                    {t('howStep1Num', '01')}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('howStep1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('howStep1Desc')}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-[11px] font-semibold text-forest-800">
                <span>Terracotta • Grow Bag • Plastic</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft hover:border-forest-300 transition-all flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shadow-sm">
                    <ScanLine className="w-6 h-6 text-emerald-700" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-stone-300 group-hover:text-emerald-600 transition-colors">
                    {t('howStep2Num', '02')}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('howStep2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('howStep2Desc')}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-[11px] font-semibold text-emerald-800">
                <span>10 Conditions • Ambiguity Detection</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft hover:border-forest-300 transition-all flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-amber-700" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-stone-300 group-hover:text-amber-600 transition-colors">
                    {t('howStep3Num', '03')}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('howStep3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('howStep3Desc')}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-[11px] font-semibold text-amber-800">
                <span>English • हिन्दी • ગુજરાતી</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft hover:border-forest-300 transition-all flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-800 flex items-center justify-center font-bold text-lg shadow-sm">
                    <CloudSun className="w-6 h-6 text-sky-700" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-stone-300 group-hover:text-sky-600 transition-colors">
                    {t('howStep4Num', '04')}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
                  {t('howStep4Title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                  {t('howStep4Desc')}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-[11px] font-semibold text-sky-800">
                <span>Rajkot • Ahmedabad • Local GPS</span>
              </div>
            </div>

          </div>

          {/* Interactive Flow Action Banner */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif font-bold text-lg text-stone-900">
                Ready to protect your urban tomato vines?
              </h4>
              <p className="text-xs sm:text-sm text-stone-600">
                Set up your potted plants in under 2 minutes or try the preloaded demo.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
              {user ? (
                <Button
                  variant="primary"
                  onClick={() => navigate('/plants')}
                  className="gap-2 text-xs shadow-sm"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{t('howCtaStart', 'Manage Garden Plants')}</span>
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/signup')}
                    className="gap-2 text-xs shadow-sm font-semibold"
                  >
                    <span>{t('howCtaStart', 'Start by Adding a Plant')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleLaunchDemo}
                    disabled={isLaunchingDemo}
                    className="text-xs bg-stone-50 border border-stone-200"
                  >
                    <span>{isLaunchingDemo ? 'Loading...' : t('howCtaDemo', 'Try Interactive Demo')}</span>
                  </Button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 5. URBAN TOMATO SHOWCASE (PLANTZONE AESTHETIC) */}
      {/* ----------------------------------------------------------------------- */}
      <section id="showcase" className="py-20 bg-[#FBFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Balcony Crop Guide
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight mt-1">
                {t('showcaseTitle')}
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                {t('showcaseSubtitle')}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleLaunchDemo}
              className="self-start md:self-auto text-xs gap-1.5"
            >
              <span>Explore Balcony Varieties in Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft group hover:shadow-card transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80"
                  alt="Super Sweet 100 Cherry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold shadow-sm">
                  Terracotta Pot
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-stone-900">Super Sweet 100</h3>
                  <span className="text-xs font-bold text-emerald-800">Healthy</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">Cherry Tomato • South Railing Vine</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Prolific producer suitable for deep vertical railing containers with support trellis.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft group hover:shadow-card transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=600&q=80"
                  alt="Roma VF Plum"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold shadow-sm">
                  Grow Bag (15 Gal)
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-stone-900">Roma VF Plum</h3>
                  <span className="text-xs font-bold text-amber-700">Attention Needed</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">Determinate Paste Tomato • Rooftop Terrace</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Heavy fruit set. Prone to lower leaf splash blight during monsoon shower spells.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-soft group hover:shadow-card transition-all">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=600&q=80"
                  alt="Micro-Tom Dwarf"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold shadow-sm">
                  Compact 8-Inch Pot
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-base text-stone-900">Micro-Tom Dwarf</h3>
                  <span className="text-xs font-bold text-emerald-800">Healthy</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">Miniature Dwarf • Kitchen Windowsill</p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Only 6-8 inches tall. Perfect for apartment windowsill ledges with 4+ hours of sun.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 6. ARCHITECTURE & TRANSPARENCY BANNER */}
      {/* ----------------------------------------------------------------------- */}
      <section className="py-14 bg-forest-900 text-white border-t border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-xs font-semibold text-forest-200">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('archTitle')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Dual-Mode Architecture & Cloud Readiness
              </h2>
              <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed">
                {t('archSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowArchModal(true)}
                className="!bg-forest-800/60 !text-white !border-forest-600 hover:!bg-forest-800 text-xs gap-1.5"
              >
                <span>View Supabase Setup Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/signup')}
                className="!bg-white !text-forest-950 hover:!bg-stone-100 text-xs font-bold shadow-elevated"
              >
                {t('navSignup')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------- */}
      {/* 7. FOOTER */}
      {/* ----------------------------------------------------------------------- */}
      <footer className="py-12 bg-[#F7F9F6] border-t border-stone-200 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forest-900 flex items-center justify-center text-white text-base">
              🌱
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-stone-900">FloraPulse AI</p>
              <p className="text-[11px] text-stone-500">{t('footerTagline')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium text-stone-600">
            <Link to="/login" className="hover:text-forest-900 transition-colors">{t('navLogin')}</Link>
            <Link to="/signup" className="hover:text-forest-900 transition-colors">{t('navSignup')}</Link>
            <button onClick={() => setShowArchModal(true)} className="hover:text-forest-900 transition-colors">
              Setup Guide
            </button>
            <LanguageSelector variant="light" />
          </div>

          <p className="text-stone-400 text-[11px]">
            {t('footerCopyright')}
          </p>
        </div>
      </footer>

      {/* ----------------------------------------------------------------------- */}
      {/* ARCHITECTURE & SETUP MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-elevated border border-stone-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
                  🌱
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">System Architecture & Setup</h3>
                  <p className="text-xs text-stone-500">FloraPulse AI Dual-Mode Engine</p>
                </div>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-stone-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-forest-50 border border-forest-200/80 text-forest-900">
                <strong className="block font-bold mb-1">Current Status: {isConfigured ? 'Cloud Supabase Mode' : 'Local Development Mode'}</strong>
                <span>
                  {isConfigured
                    ? 'Cloud authentication, PostgreSQL database queries, and Supabase Storage bucket are active.'
                    : 'The app is running offline-ready with local SQLite (`flora_local.db`) and browser localStorage. No cloud account required to test!'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">How to Connect Real Supabase Cloud:</h4>
                <ol className="list-decimal pl-4 space-y-1.5 text-stone-600">
                  <li>Create a project on <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">supabase.com</span>.</li>
                  <li>Execute SQL migration: <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">supabase/migrations/20261010000000_create_tables.sql</span>.</li>
                  <li>Execute storage bucket setup: <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">supabase/storage.sql</span>.</li>
                  <li>Add your project URL and keys to <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">frontend/.env</span>:
                    <pre className="mt-1 p-2 bg-stone-900 text-stone-200 rounded-lg text-[10px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                    </pre>
                  </li>
                  <li>Add the same keys to <span className="font-mono bg-stone-100 px-1 py-0.5 rounded">backend/.env</span>.</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setShowArchModal(false)}
                className="text-xs"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
