import React, { useState, useEffect } from 'react';
import { CloudSun, Droplet, Wind, AlertCircle, RefreshCw, MapPin, Edit2 } from 'lucide-react';
import { fetchWeatherForecast } from '../../services/weather';
import { getSavedLocation, LOCATION_CHANGED_EVENT } from '../../services/locationService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LocationModal } from '../common/LocationModal';

export function WeatherWidget({ onSelectPlant }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState(() => getSavedLocation(user));
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const loadWeather = async (loc = activeLocation) => {
    setLoading(true);
    const data = await fetchWeatherForecast(loc?.latitude, loc?.longitude);
    setWeatherData(data);
    setLoading(false);
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-stone-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-stone-200 rounded w-2/3"></div>
      </div>
    );
  }

  // State 1: No location configured yet
  if (!activeLocation || weatherData?.needsLocationSetup) {
    return (
      <>
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <CloudSun className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('weatherTitle', 'Local Microclimate')}</h2>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
            <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-amber-900">
              {t('weatherNoLocationTitle', 'No Garden Location Selected')}
            </p>
            <p className="text-[11px] text-amber-700 mt-1 max-w-xs mx-auto">
              {t('weatherNoLocationDesc', 'Please enter your city and area to enable context-aware weather telemetry.')}
            </p>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('weatherSetLocationBtn', 'Set Garden Location')}</span>
            </button>
          </div>
        </div>
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onLocationSaved={(loc) => {
            setActiveLocation(loc);
            loadWeather(loc);
          }}
        />
      </>
    );
  }

  // State 2: Fetch error (live API failed)
  if (!weatherData?.success) {
    return (
      <>
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-700" />
              <h2 className="font-bold text-sm text-stone-900">{t('weatherTitle', 'Local Microclimate')}</h2>
            </div>
            <span className="text-[11px] font-medium text-stone-500">{activeLocation.locationName}</span>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <AlertCircle className="w-6 h-6 text-rose-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-rose-900">
              {t('weatherFetchError', 'Unable to retrieve live forecast')}
            </p>
            <p className="text-[11px] text-rose-700 mt-1 max-w-xs mx-auto">
              {weatherData?.message || 'Check your internet connection or verify your city location.'}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => loadWeather()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t('commonRetry', 'Retry')}</span>
              </button>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-900"
              >
                <Edit2 className="w-3 h-3" />
                <span>{t('locChangeBtn', 'Change Location')}</span>
              </button>
            </div>
          </div>
        </div>
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onLocationSaved={(loc) => {
            setActiveLocation(loc);
            loadWeather(loc);
          }}
        />
      </>
    );
  }

  const current = weatherData.current;

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('weatherTitle', 'Local Microclimate')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 transition-colors"
              title={t('locChangeBtn', 'Change Location')}
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span className="truncate max-w-[130px]">{activeLocation.locationName}</span>
              <Edit2 className="w-2.5 h-2.5 text-emerald-600 ml-0.5" />
            </button>
            <button
              onClick={() => loadWeather()}
              title={t('weatherRefresh', 'Refresh weather')}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Temp & Condition */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {current?.temp}°C
              </span>
              <span className="text-xs font-semibold text-stone-500 uppercase">
                {current?.conditionText}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('weatherTranspirationHint', 'Optimal tomato transpiration range: 21°C – 29°C')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 bg-sky-50 px-2 py-1 rounded-md text-sky-900 font-medium border border-sky-100">
              <Droplet className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('weatherHumidity', 'Humidity')}: {current?.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md text-stone-700 font-medium border border-stone-200/60">
              <Wind className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('weatherWind', 'Wind')}: {current?.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* 3-Day Mini Strip */}
        {weatherData?.daily && (
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
            {weatherData.daily.slice(0, 3).map((day, i) => (
              <div key={i} className="bg-stone-50/70 p-2 rounded-xl border border-stone-100">
                <span className="text-[10px] font-semibold text-stone-500 uppercase block">
                  {i === 0 ? t('commonToday', 'Today') : i === 1 ? t('commonTomorrow', 'Tomorrow') : t('commonDayAfter', 'Day 3')}
                </span>
                <span className="text-xs font-bold text-stone-800 block mt-0.5">
                  {day.tempMax}° / {day.tempMin}°
                </span>
                <span className="text-[10px] text-sky-700 font-medium block">
                  💧 {day.precipProb}% {t('weatherRain', 'rain')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Attribution footer */}
        <div className="mt-3 text-[10px] text-stone-400 flex items-center justify-between">
          <span>{t('weatherPhysicsActive', 'Context-aware balcony rules active')}</span>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline hover:text-stone-600"
          >
            Open-Meteo
          </a>
        </div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSaved={(loc) => {
          setActiveLocation(loc);
          loadWeather(loc);
        }}
      />
    </>
  );
}
