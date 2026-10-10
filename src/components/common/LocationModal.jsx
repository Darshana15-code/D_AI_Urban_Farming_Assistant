import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Check, X, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { resolveLocation, getDeviceCoordinates, saveUserLocation, getSavedLocation } from '../../services/locationService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './Button';

const POPULAR_CITIES = [
  'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Mumbai',
  'Pune', 'Bengaluru', 'Delhi', 'Jaipur', 'Hyderabad'
];

export function LocationModal({ isOpen, onClose, onLocationSaved }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [resolving, setResolving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewLocation, setPreviewLocation] = useState(null);

  // Initialize with currently saved location on open
  useEffect(() => {
    if (isOpen) {
      const current = getSavedLocation(user);
      if (current) {
        setCity(current.city || '');
        setArea(current.area || '');
        setPreviewLocation(current);
      } else {
        setCity('');
        setArea('');
        setPreviewLocation(null);
      }
      setErrorMsg('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setErrorMsg('');
  };

  const handleUseGps = async () => {
    setGpsLoading(true);
    setErrorMsg('');
    try {
      const loc = await getDeviceCoordinates();
      setCity(loc.city);
      setArea('');
      setPreviewLocation(loc);
    } catch (err) {
      setErrorMsg(err.message || 'Could not access device location.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!city.trim()) {
      setErrorMsg(t('locErrorCityRequired', 'Please enter your city.'));
      return;
    }

    setResolving(true);
    setErrorMsg('');

    try {
      // Resolve coordinates using Open-Meteo Geocoding
      const resolved = await resolveLocation(city, area);
      await saveUserLocation(resolved, user);
      setPreviewLocation(resolved);

      if (onLocationSaved) {
        onLocationSaved(resolved);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Could not find coordinates for this locality. Please try a nearby major city.');
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-stone-200/90 shadow-elevated relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 shrink-0">
              <MapPin className="w-5 h-5 text-forest-700" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {t('locModalTitle', 'Set Garden Location')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t('locModalSubtitle', 'Accurate local weather powers realistic watering calculations.')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {/* City Input */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {t('locCityLabel', 'City')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t('locCityPlaceholder', 'e.g. Rajkot, Ahmedabad, Pune')}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600"
            />
          </div>

          {/* Area / Locality Input */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {t('locAreaLabel', 'Area / Locality (Optional)')}
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setErrorMsg('');
              }}
              placeholder={t('locAreaPlaceholder', 'e.g. Kalawad Road, Race Course, Satellite')}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              {t('locAreaHint', 'Example: City: Rajkot, Area: Kalawad Road')}
            </p>
          </div>

          {/* Quick City Suggestions */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-2">
              {t('locQuickSuggestions', 'Quick Select City:')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CITIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleCitySelect(c)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    city.toLowerCase() === c.toLowerCase()
                      ? 'bg-forest-100 text-forest-900 border-forest-300 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200/80 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Geolocation Option (Explicit User Permission) */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleUseGps}
              disabled={gpsLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors"
            >
              {gpsLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-forest-700" />
                  <span>{t('locDetectingGps', 'Detecting GPS coordinates...')}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 text-forest-700" />
                  <span>{t('locUseCurrentGps', 'Use My Current Device Location (GPS)')}</span>
                </>
              )}
            </button>
          </div>

          {/* Location Preview (if available) */}
          {previewLocation && previewLocation.latitude && (
            <div className="p-3 bg-forest-50/70 border border-forest-100 rounded-xl text-xs text-forest-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">{previewLocation.locationName}</span>
                <span className="text-[11px] text-forest-700 font-mono">
                  {previewLocation.latitude.toFixed(2)}°N, {previewLocation.longitude.toFixed(2)}°E
                </span>
              </div>
              <Check className="w-4 h-4 text-forest-700" />
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={onClose} type="button">
              {t('commonCancel', 'Cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={resolving || !city.trim()}
              className="gap-2"
            >
              {resolving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('locResolving', 'Verifying...')}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('locSaveButton', 'Apply Location')}</span>
                </>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
