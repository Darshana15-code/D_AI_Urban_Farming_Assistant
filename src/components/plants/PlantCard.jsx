import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, ScanLine, Calendar, ArrowRight } from 'lucide-react';
import { HealthBadge, LocationBadge, ContainerBadge } from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export function PlantCard({ plant, onLogWatering }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getDaysSincePlanted = (dateStr) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const getWateringStatus = (lastWateredStr) => {
    if (!lastWateredStr) {
      return { text: t('plantCardNeedsWater', 'Needs Water'), color: 'text-amber-700 bg-amber-50' };
    }
    const hours = Math.floor((Date.now() - new Date(lastWateredStr).getTime()) / (1000 * 60 * 60));
    if (hours < 12) {
      return { text: `${t('plantCardWateredAgo', 'Watered')} ${hours}h ${t('commonHoursAgo', 'ago')}`, color: 'text-emerald-700 bg-emerald-50' };
    }
    if (hours < 24) {
      return { text: `${t('plantCardWateredAgo', 'Watered')} ${t('commonToday', 'today')}`, color: 'text-emerald-700 bg-emerald-50' };
    }
    if (hours < 48) {
      return { text: `${t('plantCardWateredAgo', 'Watered')} ${t('commonTomorrow', 'yesterday')}`, color: 'text-stone-700 bg-stone-100' };
    }
    return {
      text: `${t('plantCardWateredAgo', 'Watered')} ${Math.floor(hours / 24)}d ${t('commonDaysAgo', 'ago')}`,
      color: 'text-amber-700 bg-amber-50'
    };
  };

  const daysPlanted = getDaysSincePlanted(plant.planting_date);
  const waterStatus = getWateringStatus(plant.last_watered);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-soft hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image Banner */}
      <div className="relative h-44 overflow-hidden bg-stone-100">
        <img
          src={plant.image_url || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'}
          alt={plant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <HealthBadge status={plant.health_status} />
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border border-current/20 backdrop-blur-md ${waterStatus.color}`}>
            💧 {waterStatus.text}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                {plant.name}
              </h3>
              <p className="text-xs text-stone-500 font-medium italic mt-0.5">
                {plant.variety || 'Solanum lycopersicum'}
              </p>
            </div>
            {daysPlanted !== null && (
              <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/50">
                <Calendar className="w-3 h-3 text-stone-400" />
                {daysPlanted} {t('commonDaysAgo', 'days')}
              </span>
            )}
          </div>

          {/* Badges / Micro-meta */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            <LocationBadge location={plant.growing_location} />
            <ContainerBadge container={plant.container_type} />
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onLogWatering?.(plant)}
              title={t('dashboardWaterNowBtn', 'Log Watering')}
              className="px-2.5 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-100 transition-colors flex items-center gap-1"
            >
              <Droplet className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
              <span>{t('dashboardWaterNowBtn', 'Water')}</span>
            </button>
            <button
              onClick={() => navigate(`/scan?plantId=${plant.id}`)}
              title={t('plantDetailScanBtn', 'Scan Leaf')}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-100 transition-colors flex items-center gap-1"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('plantDetailScanBtn', 'Scan')}</span>
            </button>
          </div>

          <button
            onClick={() => navigate(`/plants/${plant.id}`)}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 py-1 px-1.5 rounded hover:bg-stone-50 transition-colors"
          >
            <span>{t('navPlants', 'Details')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
