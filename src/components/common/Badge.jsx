import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, Home, Box } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function HealthBadge({ status, size = 'md' }) {
  const { t } = useLanguage();

  const configs = {
    healthy: {
      label: t('commonHealthy', 'Healthy'),
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    attention_needed: {
      label: t('commonAttention', 'Attention Needed'),
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      dot: 'bg-amber-500',
    },
    critical: {
      label: t('commonCritical', 'Critical Alert'),
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: AlertOctagon,
      dot: 'bg-rose-500',
    },
    unscanned: {
      label: t('diagnosisInconclusiveTitle', 'Unscanned'),
      bg: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: HelpCircle,
      dot: 'bg-stone-400',
    },
  };

  const config = configs[status] || configs.unscanned;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}

export function LocationBadge({ location }) {
  const { t } = useLanguage();

  const getLabel = (loc) => {
    switch (loc) {
      case 'balcony': return t('locBalcony', 'Balcony');
      case 'terrace': return t('locTerrace', 'Rooftop Terrace');
      case 'indoor_window': return t('locWindow', 'Indoor Window');
      case 'patio': return t('locPatio', 'Patio');
      case 'garden_bed': return t('locGardenBed', 'Garden Bed');
      default: return loc;
    }
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-stone-600 bg-stone-100/80 px-2 py-0.5 rounded-md border border-stone-200/60">
      <Home className="w-3 h-3 text-stone-500" />
      <span>{getLabel(location)}</span>
    </span>
  );
}

export function ContainerBadge({ container }) {
  const { t } = useLanguage();

  const getLabel = (cnt) => {
    switch (cnt) {
      case 'terracotta_pot': return t('plantCardTerracotta', 'Terracotta Pot');
      case 'grow_bag': return t('plantCardGrowBag', 'Grow Bag');
      case 'plastic_pot': return t('plantCardPlastic', 'Plastic Pot');
      case 'raised_bed': return t('plantCardRaisedBed', 'Raised Bed');
      case 'ground': return t('plantCardGround', 'In Ground');
      default: return cnt;
    }
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-stone-600 bg-stone-100/80 px-2 py-0.5 rounded-md border border-stone-200/60">
      <Box className="w-3 h-3 text-stone-500" />
      <span>{getLabel(container)}</span>
    </span>
  );
}
