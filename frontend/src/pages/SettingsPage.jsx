import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  MapPin,
  Thermometer,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Database,
  Navigation,
  Globe,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getSavedLocation, saveUserLocation, resolveLocation, getDeviceCoordinates } from '../services/locationService';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Button } from '../components/common/Button';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut, isConfigured } = useAuth();
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || 'Urban Gardener');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [tempUnit, setTempUnit] = useState('celsius');
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loc = getSavedLocation(user);
    if (loc) {
      setCity(loc.city || '');
      setArea(loc.area || '');
    }
  }, [user]);

  const handleUseGps = async () => {
    setGpsLoading(true);
    setErrorMessage('');
    try {
      const loc = await getDeviceCoordinates();
      setCity(loc.city);
      setArea('');
    } catch (err) {
      setErrorMessage(err.message || 'Could not access device location.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      // 1. Resolve and save location if city is entered
      if (city.trim()) {
        const resolved = await resolveLocation(city, area);
        await saveUserLocation(resolved, user);
      }

      // 2. Update display name in Supabase auth metadata if configured
      if (user && isSupabaseConfigured && supabase) {
        await supabase.auth.updateUser({
          data: {
            full_name: fullName.trim(),
            language
          }
        });

        await supabase
          .from('profiles')
          .update({
            full_name: fullName.trim(),
            temp_unit: tempUnit,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Error saving settings. Please verify details.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          {t('settingsTitle', 'System & Account Settings')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {t('settingsSubtitle', 'Configure microclimate location, temperature metrics, profile details, and language preferences.')}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <User className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('settingsProfileTitle', 'Gardener Profile')}</h2>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                {t('settingsNameLabel', 'Display Name')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                {t('settingsEmailLabel', 'Email Address')}
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'gardener@urbanfarming.org'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Location & Microclimate Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('settingsLocationTitle', 'Location & Weather Context')}</h2>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  {t('locCityLabel', 'Balcony City')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('locCityPlaceholder', 'e.g. Rajkot, Ahmedabad, Pune')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  {t('locAreaLabel', 'Area / Locality')}
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={t('locAreaPlaceholder', 'e.g. Kalawad Road, Race Course')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
              <div>
                <p className="text-xs font-bold text-stone-900">{t('settingsGpsTitle', 'Automatic Browser Geolocation')}</p>
                <p className="text-[11px] text-stone-500">
                  {t('settingsGpsDesc', 'Allow browser to detect exact GPS latitude/longitude for weather queries (optional).')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleUseGps}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700"
              >
                {gpsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5 text-forest-700" />
                )}
                <span>{t('locUseCurrentGps', 'Detect GPS')}</span>
              </button>
            </div>

            {/* Units Toggle */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                {t('settingsUnitsTitle', 'Temperature Unit')}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTempUnit('celsius')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    tempUnit === 'celsius'
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  type="button"
                  onClick={() => setTempUnit('fahrenheit')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    tempUnit === 'fahrenheit'
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Globe className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('settingsLanguageTitle', 'Application Language')}</h2>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {availableLanguages.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  language === l.code
                    ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{l.native}</span>
                <span className="text-[10px] opacity-75 font-normal">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Database & Cloud Connection Status */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Database className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('settingsStorageTitle', 'Data Storage Engine')}</h2>
          </div>

          <div className="mt-4 p-4 rounded-xl border flex items-start gap-3 bg-stone-50 border-stone-200">
            <div className={`p-2 rounded-xl shrink-0 ${isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isConfigured ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div className="text-xs">
              <h3 className="font-bold text-stone-900">
                {isConfigured ? 'Supabase PostgreSQL & Auth Active' : 'Local Storage Mode Active'}
              </h3>
              <p className="text-stone-600 mt-1 leading-relaxed">
                {isConfigured
                  ? 'Your plants, diagnostic scans, and irrigation records are securely synced to your cloud Supabase database with Row Level Security enabled.'
                  : 'Running in local mode with persistent session storage.'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('settingsSavedSuccess', 'Settings saved successfully!')}</span>
            </span>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="danger"
              icon={LogOut}
              onClick={handleLogout}
            >
              {t('settingsLogoutBtn', 'Sign Out')}
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? t('locResolving', 'Saving...') : t('settingsSaveBtn', 'Save Settings')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
