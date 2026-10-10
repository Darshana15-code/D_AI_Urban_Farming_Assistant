import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  CloudSun,
  Droplet,
  Info,
  CheckCircle2,
  MapPin,
  Clock,
  AlertTriangle,
  HelpCircle,
  Plus
} from 'lucide-react';
import { usePlants } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getSavedLocation, LOCATION_CHANGED_EVENT } from '../services/locationService';
import { fetchWeatherForecast, calculateWateringRecommendation } from '../services/weather';
import { LogWateringModal } from '../components/plants/LogWateringModal';
import { LocationModal } from '../components/common/LocationModal';
import { HealthBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export function CarePlannerPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { plants, wateringLogs, logWatering } = usePlants();

  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [selectedPlantForWatering, setSelectedPlantForWatering] = useState(null);
  const [activeLocation, setActiveLocation] = useState(() => getSavedLocation(user));
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const loadWeather = (loc = activeLocation) => {
    setLoadingWeather(true);
    fetchWeatherForecast(loc?.latitude, loc?.longitude).then((res) => {
      setWeatherData(res);
      setLoadingWeather(false);
    });
  };

  useEffect(() => {
    const loc = getSavedLocation(user);
    setActiveLocation(loc);
    loadWeather(loc);

    const handleLocChange = (e) => {
      const newLoc = e.detail;
      setActiveLocation(newLoc);
      loadWeather(newLoc);
    };

    window.addEventListener(LOCATION_CHANGED_EVENT, handleLocChange);
    return () => {
      window.removeEventListener(LOCATION_CHANGED_EVENT, handleLocChange);
    };
  }, [user]);

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'water_today': return t('carePlannerUrgencyWater', 'Water Needed Today');
      case 'skip_today': return t('carePlannerUrgencySkip', 'Skip Watering Today');
      default: return t('carePlannerUrgencyCheck', 'Check Soil Moisture');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold mb-2.5 border border-sky-100">
          <Droplet className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
          <span>{t('carePlannerBadge', 'Microclimate Hydration Engine')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('carePlannerTitle', 'Weather-Informed Care & Irrigation Planner')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          {t('carePlannerSubtitle', 'Contextual irrigation guidance calculated from real-time Open-Meteo forecasts, container physics, and balcony micro-climates.')}
        </p>
      </div>

      {/* Weather & Balcony Explainer Banner */}
      <div className="bg-gradient-to-br from-sky-950 via-sky-900 to-emerald-950 rounded-3xl p-6 text-white shadow-elevated">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Weather Highlights */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <CloudSun className="w-4 h-4" />
              <span>
                {t('carePlannerWeatherHighlights', 'Current Forecast')} •{' '}
                {activeLocation?.locationName || t('locSetLocation', 'Set Location')}
              </span>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="ml-1 text-[11px] underline text-sky-200 hover:text-white"
              >
                ({t('locChangeBtn', 'Change')})
              </button>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold tracking-tight">
                {weatherData?.current?.temp ?? 28}°C
              </span>
              <span className="text-sm font-semibold text-sky-200">
                {weatherData?.current?.conditionText ?? 'Fair Weather'}
              </span>
            </div>

            <p className="mt-2 text-xs text-sky-100/80 leading-relaxed max-w-xl">
              {t('weatherHumidity', 'Humidity')}: {weatherData?.current?.humidity ?? 65}% •{' '}
              {t('weatherWind', 'Wind')}: {weatherData?.current?.windSpeed ?? 12} km/h •{' '}
              {t('weatherRain', 'Precipitation')}: {weatherData?.current?.precipitation ?? 0} mm
            </p>
          </div>

          {/* Balcony Science Note */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs text-sky-100">
            <div className="flex items-center gap-1.5 font-bold text-white mb-1.5">
              <Info className="w-4 h-4 text-sky-300" />
              <span>{t('carePlannerShelterNoteTitle', 'The Balcony Shelter Factor')}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-sky-100/90">
              {t('carePlannerShelterNoteDesc', 'Balcony ceilings block natural rain. Always check container soil directly rather than assuming rain hydrated your plant.')}
            </p>
          </div>
        </div>
      </div>

      {/* Plant Watering Recommendations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-stone-900">
            {t('carePlannerPlantGuidanceTitle', 'Plant-by-Plant Watering Advice')} ({plants.length})
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {weatherData?.current?.temp ?? 28}°C • {activeLocation?.locationName || ''}
          </span>
        </div>

        {plants.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500 text-xs">
            {t('carePlannerNoPlants', 'Add plants to view personalized watering recommendations.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plants.map((plant) => {
              const reco = calculateWateringRecommendation(plant, weatherData);
              const isWaterToday = reco.urgency === 'water_today';
              const isSkip = reco.urgency === 'skip_today';

              return (
                <div
                  key={plant.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={plant.image_url || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80'}
                          alt={plant.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-stone-900">{plant.name}</h3>
                          <p className="text-xs text-stone-500">
                            {plant.growing_location === 'balcony' ? t('locBalcony', 'Balcony') : t('locTerrace', 'Terrace')}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isWaterToday
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : isSkip
                            ? 'bg-stone-100 text-stone-700 border-stone-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {getUrgencyText(reco.urgency)}
                      </span>
                    </div>

                    {/* Recommendation Action */}
                    <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                      <p className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Droplet className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                        <span>{reco.suggestedAction}</span>
                      </p>
                      <ul className="text-[11px] text-stone-500 space-y-1 mt-1 pl-4 list-disc">
                        {reco.reasons.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">
                      {plant.last_watered
                        ? `${t('plantCardWateredAgo', 'Last watered')}: ${new Date(plant.last_watered).toLocaleDateString()}`
                        : t('plantCardNeedsWater', 'Never watered')}
                    </span>

                    <button
                      onClick={() => setSelectedPlantForWatering(plant)}
                      className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Droplet className="w-3.5 h-3.5" />
                      <span>{t('dashboardWaterNowBtn', 'Log Watering')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
        <h3 className="font-bold text-sm text-stone-900 pb-3 border-b border-stone-100">
          {t('plantDetailWaterHistory', 'Recent Irrigation Logs')}
        </h3>

        <div className="mt-3 divide-y divide-stone-100">
          {wateringLogs.slice(0, 6).map((log) => {
            const p = plants.find((item) => item.id === log.plant_id);
            return (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-800">
                    {p ? p.name : 'Tomato Plant'} — {log.amount_ml} mL
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {log.notes && `${log.notes}`}
                  </p>
                </div>
                <span className="text-[11px] text-stone-400">
                  {new Date(log.logged_at).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <LogWateringModal
        isOpen={Boolean(selectedWateringPlant)}
        onClose={() => setSelectedWateringPlant(null)}
        plant={selectedWateringPlant}
        onLogWatering={logWatering}
      />

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
