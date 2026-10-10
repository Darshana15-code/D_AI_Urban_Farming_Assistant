import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  CalendarCheck2,
  Settings,
  LogOut,
  Menu,
  X,
  CloudSun,
  ShieldAlert,
  Plus,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { fetchWeatherForecast } from '../../services/weather';
import { getSavedLocation, LOCATION_CHANGED_EVENT } from '../../services/locationService';
import { LocationModal } from '../common/LocationModal';

export function AppShell() {
  const { user, signOut, isConfigured } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [weatherSnippet, setWeatherSnippet] = useState(null);
  const [activeLocation, setActiveLocation] = useState(() => getSavedLocation(user));
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadWeather = (loc = activeLocation) => {
    fetchWeatherForecast(loc?.latitude, loc?.longitude).then((res) => {
      if (res && res.success && res.current) {
        setWeatherSnippet(res.current);
      } else {
        setWeatherSnippet(null);
      }
    });
  };

  useEffect(() => {
    const loc = getSavedLocation(user);
    setActiveLocation(loc);
    loadWeather(loc);

    const handleLocationChange = (e) => {
      const newLoc = e.detail;
      setActiveLocation(newLoc);
      loadWeather(newLoc);
    };

    window.addEventListener(LOCATION_CHANGED_EVENT, handleLocationChange);
    return () => {
      window.removeEventListener(LOCATION_CHANGED_EVENT, handleLocationChange);
    };
  }, [user]);

  const navLinks = [
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/plants', label: t('navPlants'), icon: Sprout },
    { to: '/scan', label: t('navScanner'), icon: ScanLine, highlight: true },
    { to: '/care', label: t('navCare'), icon: CalendarCheck2 },
    { to: '/settings', label: t('navSettings'), icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200/80 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-white font-bold shadow-sm">
            🌱
          </div>
          <span className="font-bold text-stone-900 tracking-tight">FloraPulse</span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector variant="light" />
          {weatherSnippet && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-forest-50 rounded-lg text-xs font-medium text-forest-800 border border-forest-100">
              <CloudSun className="w-3.5 h-3.5 text-forest-600" />
              <span>{weatherSnippet.temp}°C</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/80 shrink-0 sticky top-0 h-screen">
        {/* Brand Area */}
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center text-white text-xl shadow-md shadow-forest-900/15">
                🌱
              </div>
              <div>
                <h1 className="font-bold text-base text-stone-900 tracking-tight flex items-center gap-1.5">
                  FloraPulse <span className="text-[10px] uppercase font-extrabold tracking-wider bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded">AI</span>
                </h1>
                <p className="text-xs text-stone-500 font-medium">Urban Farming Assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Scan Action Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => navigate('/scan')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-forest-800 to-forest-900 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-sm shadow-forest-950/20 hover:from-forest-900 hover:to-forest-950 transition-all active:scale-[0.98]"
          >
            <ScanLine className="w-4 h-4 text-forest-300" />
            <span>Scan Tomato Leaf</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-forest-50 text-forest-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forest-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Language & Storage Status Widget */}
        <div className="px-4 py-3 mx-3 mb-2 bg-stone-50 rounded-xl border border-stone-200/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Language</span>
            <LanguageSelector variant="light" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-stone-200/50">
            <span className="text-stone-500 font-medium">Storage</span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              isConfigured ? 'bg-forest-100 text-forest-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isConfigured ? 'Supabase Sync' : 'Local Demo Mode'}
            </span>
          </div>
          <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-stone-600">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-forest-800 transition-colors truncate max-w-[145px] text-left"
              title={t('locChangeBtn', 'Change Location')}
            >
              <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
              <span className="truncate font-medium text-[11px]">
                {activeLocation?.locationName || t('locSetLocation', 'Set Location')}
              </span>
            </button>
            {weatherSnippet && (
              <span className="font-semibold text-stone-800 shrink-0 text-xs">{weatherSnippet.temp}°C</span>
            )}
          </div>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center font-bold text-xs text-forest-900 shrink-0">
              {user?.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : 'G'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {user?.user_metadata?.full_name || 'Balcony Gardener'}
              </p>
              <p className="text-[11px] text-stone-500 truncate">{user?.email || 'gardener@urbanfarming.org'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={t('navLogout')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm">
          <div className="w-4/5 max-w-xs bg-white h-full p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-white font-bold">
                    🌱
                  </div>
                  <span className="font-bold text-stone-900">FloraPulse AI</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      <Icon className="w-4 h-4 text-stone-500" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Language</span>
                <LanguageSelector variant="light" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-stone-600 w-full py-2 hover:text-stone-900"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('navLogout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200/90 py-1.5 px-3 flex items-center justify-around z-30">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
              isActive ? 'text-forest-800 font-bold' : 'text-stone-500'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/plants"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
              isActive ? 'text-forest-800 font-bold' : 'text-stone-500'
            }`
          }
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span>Plants</span>
        </NavLink>
        <NavLink
          to="/scan"
          className="flex flex-col items-center py-1 px-3 -mt-4 bg-forest-800 text-white rounded-2xl shadow-lg shadow-forest-950/20 text-[10px] font-bold"
        >
          <ScanLine className="w-5 h-5 mb-0.5" />
          <span>Scan</span>
        </NavLink>
        <NavLink
          to="/care"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
              isActive ? 'text-forest-800 font-bold' : 'text-stone-500'
            }`
          }
        >
          <CalendarCheck2 className="w-5 h-5 mb-0.5" />
          <span>Care</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
              isActive ? 'text-forest-800 font-bold' : 'text-stone-500'
            }`
          }
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSaved={(loc) => {
          setActiveLocation(loc);
          loadWeather(loc);
        }}
      />
    </div>
  );
}
