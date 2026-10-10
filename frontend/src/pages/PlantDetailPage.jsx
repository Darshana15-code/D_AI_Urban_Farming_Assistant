import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ScanLine,
  Droplet,
  Trash2,
  Calendar,
  Sun,
  Home,
  Box,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { usePlants } from '../context/PlantContext';
import { useLanguage } from '../context/LanguageContext';
import { HealthBadge, LocationBadge, ContainerBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LogWateringModal } from '../components/plants/LogWateringModal';
import { getConditionDetails } from '../services/careDatabase';

export function PlantDetailPage() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const { getPlantById, getScansForPlant, getWateringLogsForPlant, deletePlant, logWatering } = usePlants();
  const { t, language } = useLanguage();

  const plant = getPlantById(plantId);
  const scans = getScansForPlant(plantId);
  const wateringLogs = getWateringLogsForPlant(plantId);

  const [isWateringModalOpen, setIsWateringModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!plant) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-stone-900">{t('plantsEmptyTitle', 'Plant Not Found')}</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          {t('plantDetailDeleteWarning', 'The requested plant profile could not be located or may have been removed.')}
        </p>
        <Button variant="secondary" onClick={() => navigate('/plants')}>
          {t('plantDetailBack')}
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`${t('plantDetailConfirmDelete')} (${plant.name})`)) {
      setIsDeleting(true);
      await deletePlant(plant.id);
      navigate('/plants');
    }
  };

  const latestScan = scans[0];
  const conditionGuidance = latestScan ? getConditionDetails(latestScan.condition_code, language) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/plants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('plantDetailBack')}</span>
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('plantDetailDeleteBtn')}</span>
        </button>
      </div>

      {/* Hero Plant Profile Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Image */}
          <div className="relative h-64 md:h-auto bg-stone-100">
            <img
              src={plant.image_url || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <HealthBadge status={plant.health_status} />
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900 tracking-tight">{plant.name}</h1>
                  <p className="text-xs font-medium text-stone-500 mt-1">
                    <em>{plant.species}</em> — {plant.variety}
                  </p>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-5">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    {t('plantDetailLocation')}
                  </span>
                  <span className="text-xs font-bold text-stone-800 capitalize mt-0.5 block">
                    {plant.growing_location.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    {t('plantDetailContainer')}
                  </span>
                  <span className="text-xs font-bold text-stone-800 capitalize mt-0.5 block">
                    {plant.container_type.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    {t('plantDetailSpecs')}
                  </span>
                  <span className="text-xs font-bold text-stone-800 mt-0.5 block">
                    {new Date(plant.planting_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {plant.notes && (
                <div className="mt-4 p-3 bg-stone-50/70 rounded-xl text-xs text-stone-600 border border-stone-200/50">
                  <span className="font-semibold text-stone-800">Notes: </span>
                  {plant.notes}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                icon={ScanLine}
                onClick={() => navigate(`/scan?plantId=${plant.id}`)}
              >
                {t('plantDetailScanBtn')}
              </Button>

              <Button
                variant="secondary"
                icon={Droplet}
                onClick={() => setIsWateringModalOpen(true)}
              >
                {t('plantDetailLogWaterBtn')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Health/Guidance + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Latest Health Status & Care Guidance */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="font-bold text-sm text-stone-900">{t('diagnosisTitle')}</h2>
            <HealthBadge status={plant.health_status} />
          </div>

          {latestScan && conditionGuidance ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{conditionGuidance.name}</h4>
                    <p className="text-[11px] text-stone-500 italic mt-0.5">
                      {conditionGuidance.scientificName}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {(latestScan.confidence * 100).toFixed(0)}% {t('diagnosisCalibratedConfidence')}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {conditionGuidance.summary}
                </p>
              </div>

              {/* Immediate recommended action */}
              <div>
                <h5 className="text-xs font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('diagnosisWhatToDoTitle')}</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-stone-600 pl-5 list-disc">
                  {conditionGuidance.immediateActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/scan/${latestScan.id}`)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <span>{t('diagnosisSymptomsTitle')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-500">
              <ScanLine className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-semibold text-stone-700">{t('plantDetailNoScansForPlant')}</p>
              <p className="mt-0.5">{t('dashboardNoScansYet')}</p>
              <div className="mt-4">
                <Button variant="subtle" size="sm" onClick={() => navigate(`/scan?plantId=${plant.id}`)}>
                  {t('plantDetailScanBtn')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Watering Timeline & Previous Scans */}
        <div className="space-y-6">
          {/* Watering History */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-sky-600 fill-sky-600" />
                <h2 className="font-bold text-sm text-stone-900">{t('plantDetailWaterHistory')}</h2>
              </div>
              <button
                onClick={() => setIsWateringModalOpen(true)}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900"
              >
                + {t('plantDetailLogWaterBtn')}
              </button>
            </div>

            <div className="mt-3 divide-y divide-stone-100">
              {wateringLogs.length === 0 ? (
                <p className="py-4 text-center text-xs text-stone-400">{t('dashboardNoPendingTasks')}</p>
              ) : (
                wateringLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-800">{log.amount_ml} mL</p>
                      <p className="text-[11px] text-stone-500">
                        {log.soil_condition_before?.replace('_', ' ')}
                        {log.notes && ` • ${log.notes}`}
                      </p>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      {new Date(log.logged_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Previous Scans Strip */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
            <h2 className="font-bold text-sm text-stone-900 pb-3 border-b border-stone-100">
              {t('plantDetailRecentScans')} ({scans.length})
            </h2>

            <div className="mt-3 space-y-2">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => navigate(`/scan/${scan.id}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={scan.image_url}
                      alt="Leaf"
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                        {scan.condition_name}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {new Date(scan.created_at).toLocaleDateString()} • {(scan.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LogWateringModal
        isOpen={isWateringModalOpen}
        onClose={() => setIsWateringModalOpen(false)}
        plant={plant}
        onLogWatering={logWatering}
      />
    </div>
  );
}
