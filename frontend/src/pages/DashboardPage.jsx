import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  CalendarCheck2,
  Plus,
  ArrowRight,
  Droplet,
  MapPin,
  Sparkles
} from 'lucide-react';
import { usePlants } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getSavedLocation, LOCATION_CHANGED_EVENT } from '../services/locationService';
import { StatCard } from '../components/common/StatCard';
import { HealthBadge } from '../components/common/Badge';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import { AddPlantModal } from '../components/plants/AddPlantModal';
import { LogWateringModal } from '../components/plants/LogWateringModal';
import { LocationModal } from '../components/common/LocationModal';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { plants, scans, addPlant, logWatering } = usePlants();

  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [selectedWateringPlant, setSelectedWateringPlant] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(() => getSavedLocation(user));

  useEffect(() => {
    setCurrentLocation(getSavedLocation(user));

    const handleLocChange = (e) => {
      setCurrentLocation(e.detail);
    };
    window.addEventListener(LOCATION_CHANGED_EVENT, handleLocChange);
    return () => {
      window.removeEventListener(LOCATION_CHANGED_EVENT, handleLocChange);
    };
  }, [user]);

  const healthyCount = plants.filter((p) => p.health_status === 'healthy').length;
  const attentionCount = plants.filter((p) => p.health_status === 'attention_needed' || p.health_status === 'critical').length;
  const recentScans = scans.slice(0, 3);

  // Suggested pending care tasks based on elapsed time since last watering
  const tasksDue = plants.filter((plant) => {
    if (!plant.last_watered) return true;
    const hours = (Date.now() - new Date(plant.last_watered).getTime()) / (1000 * 60 * 60);
    return hours >= 24;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-7">
      
      {/* Onboarding Banner if no location is configured */}
      {!currentLocation && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-950">
                {t('dashboardLocationBannerTitle', 'Set Your Garden Location')}
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 max-w-2xl leading-relaxed">
                {t('dashboardLocationBannerDesc', 'Enter your city and locality (e.g. Rajkot, Kalawad Road) to receive actual weather readings and avoid overwatering.')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm transition-all"
          >
            {t('locSetLocation', 'Set Location')}
          </button>
        </div>
      )}

      {/* Editorial Hero Banner — LuxeLoom & PlantZone Inspired */}
      <div className="bg-gradient-to-br from-[#122A1D] via-[#1A3828] to-[#0E2016] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-elevated relative overflow-hidden border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3.5 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sans">
              {currentLocation ? `${currentLocation.locationName} • ` : ''}
              {t('brandName', 'FloraPulse AI')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight">
            {t('heroTitle', 'Cultivate Vitality in Every Container.')}
          </h1>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed max-w-xl font-sans">
            {t('heroSubtitle', 'Precision tomato diagnostics powered by calibrated computer vision, paired with microclimate-aware watering guidance for balconies and terraces.')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/scan')}
              className="px-5 py-3 bg-[#E5ECE4] text-[#122A1D] font-bold text-xs sm:text-sm rounded-2xl shadow-lg hover:bg-white transition-all flex items-center gap-2 active:scale-95"
            >
              <ScanLine className="w-4 h-4 text-[#1A3828]" />
              <span>{t('dashboardScanCta', 'Scan Tomato Leaf')}</span>
            </button>
            <button
              onClick={() => setIsAddPlantOpen(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-2xl border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('dashboardAddPlantCta', 'Add New Plant')}</span>
            </button>
          </div>
        </div>

        {/* Status Chip */}
        <div className="absolute top-6 right-6 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-[11px] text-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{t('archCloudBadge', 'Supabase Cloud Sync')}</span>
        </div>

        {/* Ambient botanical glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title={t('dashboardStatsTotalPlants', 'Total Plants')}
          value={plants.length}
          subtitle={t('statConditions', 'Vines under care')}
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title={t('dashboardStatsHealthy', 'Healthy Canopy')}
          value={healthyCount}
          subtitle={`${Math.round((healthyCount / (plants.length || 1)) * 100)}%`}
          icon={CheckCircle2}
          color="emerald"
          trend={t('commonOptimal', 'Optimal')}
        />
        <StatCard
          title={t('dashboardStatsAttention', 'Attention Needed')}
          value={attentionCount}
          subtitle={t('commonAttention', 'Spots or symptoms')}
          icon={AlertTriangle}
          color={attentionCount > 0 ? 'amber' : 'stone'}
          trend={attentionCount > 0 ? t('commonAttention', 'Review') : t('commonHealthy', 'All clear')}
        />
        <StatCard
          title={t('dashboardStatsWateringDue', 'Watering Tasks')}
          value={tasksDue.length}
          subtitle={t('plantCardNeedsWater', 'Moisture check due')}
          icon={CalendarCheck2}
          color="blue"
        />
      </div>

      {/* Main Grid: Weather + Today's Care Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weather Microclimate Widget */}
        <div className="lg:col-span-5 space-y-6">
          <WeatherWidget />

          {/* PlantZone Style Botanical Insight */}
          <div className="bg-sage-100/60 border border-sage-200/80 rounded-3xl p-5 text-xs text-stone-700">
            <div className="flex items-center gap-2 font-bold text-forest-900 mb-1.5">
              <span>🌿</span>
              <span className="font-serif text-sm">{t('carePlannerShelterNoteTitle', 'Balcony Overhead Science')}</span>
            </div>
            <p className="leading-relaxed text-stone-600">
              {t('carePlannerShelterNoteDesc', 'Balcony ceilings block natural rain. Always check container soil directly rather than assuming rain hydrated your plant.')}
            </p>
          </div>
        </div>

        {/* Right: Care Queue & Recent Scans */}
        <div className="lg:col-span-7 space-y-6">
          {/* Actionable Watering Queue */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-600 fill-sky-600" />
                <h2 className="font-serif font-bold text-base text-stone-900">
                  {t('dashboardPendingTasksTitle', "Today's Moisture & Care Queue")}
                </h2>
              </div>
              <button
                onClick={() => navigate('/care')}
                className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1"
              >
                <span>{t('navCare', 'Full Planner')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3.5 divide-y divide-stone-100">
              {tasksDue.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-stone-800">
                    {t('dashboardNoPendingTasks', 'All containers checked!')}
                  </p>
                  <p className="mt-0.5 text-stone-500">
                    {t('commonOptimal', 'No overdue irrigation for today.')}
                  </p>
                </div>
              ) : (
                tasksDue.slice(0, 3).map((plant) => (
                  <div key={plant.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={plant.image_url || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80'}
                        alt={plant.name}
                        className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-stone-200"
                      />
                      <div>
                        <h3 className="font-bold text-xs text-stone-900">{plant.name}</h3>
                        <p className="text-[11px] text-stone-500">
                          {plant.growing_location === 'balcony' ? t('locBalcony', 'Balcony') : t('locTerrace', 'Terrace')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HealthBadge status={plant.health_status} size="sm" />
                      <button
                        onClick={() => setSelectedWateringPlant(plant)}
                        className="px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-xl border border-sky-100 transition-colors"
                      >
                        {t('dashboardWaterNowBtn', 'Log Water')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Scans Strip */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-forest-700" />
                <h2 className="font-serif font-bold text-base text-stone-900">
                  {t('dashboardRecentScansTitle', 'Recent Model Scans')}
                </h2>
              </div>
              <button
                onClick={() => navigate('/scan')}
                className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1"
              >
                <span>{t('diagnosisScanAnother', 'New Scan')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentScans.length === 0 ? (
                <div className="col-span-3 py-6 text-center text-xs text-stone-400">
                  {t('dashboardNoScansYet', 'No scans recorded yet. Upload a leaf to test the model.')}
                </div>
              ) : (
                recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => navigate(`/scan/${scan.id}`)}
                    className="bg-canvas-100 hover:bg-sage-50 p-3 rounded-2xl border border-stone-200/70 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={scan.image_url}
                        alt={scan.condition_name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-xs text-stone-900 group-hover:text-forest-800 truncate">
                          {scan.condition_name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium">
                          {(scan.confidence * 100).toFixed(0)}% {t('diagnosisCalibratedConfidence', 'calibrated')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-stone-500">
                      <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                      <span className="font-semibold text-forest-700 group-hover:underline">
                        {t('commonOptimal', 'Guidance →')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPlantModal
        isOpen={isAddPlantOpen}
        onClose={() => setIsAddPlantOpen(false)}
        onAddPlant={addPlant}
      />

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
          setCurrentLocation(loc);
        }}
      />
    </div>
  );
}
