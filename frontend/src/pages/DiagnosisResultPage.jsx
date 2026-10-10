import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sprout,
  HelpCircle,
  Clock,
  Lightbulb,
  Check
} from 'lucide-react';
import { usePlants } from '../context/PlantContext';
import { useLanguage } from '../context/LanguageContext';
import { getConditionDetails, GLOSSARY_TERMS } from '../services/careDatabase';
import { Button } from '../components/common/Button';
import { HealthBadge } from '../components/common/Badge';

export function DiagnosisResultPage() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { scans, getPlantById } = usePlants();

  const scan = scans.find((s) => s.id === scanId) || scans[0];

  if (!scan) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <HelpCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-stone-900">{t('diagnosisInconclusiveTitle', 'Scan Result Not Found')}</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          {t('diagnosisInconclusiveDesc', 'The requested leaf diagnosis record does not exist or has expired.')}
        </p>
        <Button variant="primary" onClick={() => navigate('/scan')}>
          {t('diagnosisScanAnother', 'Perform New Scan')}
        </Button>
      </div>
    );
  }

  const associatedPlant = scan.plant_id ? getPlantById(scan.plant_id) : null;
  const condition = getConditionDetails(scan.condition_code, language);
  const confidencePercent = Math.round((scan.confidence || 0) * 100);

  // Calibrated confidence level
  const isHighConfidence = confidencePercent >= 85;
  const isMediumConfidence = confidencePercent >= 65 && confidencePercent < 85;
  const isInconclusive = scan.is_inconclusive || confidencePercent < 65;

  const glossary = GLOSSARY_TERMS[language] || GLOSSARY_TERMS.en;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('diagnosisBackDashboard', 'Back to Dashboard')}</span>
        </Link>

        <div className="flex items-center gap-2">
          {associatedPlant && (
            <Link
              to={`/plants/${associatedPlant.id}`}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{associatedPlant.name}</span>
            </Link>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={ScanLine}
            onClick={() => navigate('/scan')}
          >
            {t('diagnosisScanAnother', 'Scan Another')}
          </Button>
        </div>
      </div>

      {/* Main Diagnosis Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Leaf Photo Panel */}
          <div className="md:col-span-5 bg-stone-950 p-4 flex flex-col justify-between">
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-square md:aspect-auto md:h-80">
              <img
                src={scan.image_url}
                alt="Diagnosed leaf"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold bg-stone-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                  📷 {t('scannerTitle', 'Analyzed Foliage')}
                </span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-stone-400 flex items-center justify-between px-1">
              <span>{new Date(scan.created_at).toLocaleDateString()}</span>
              <span>ID: {scan.id.slice(0, 8)}</span>
            </div>
          </div>

          {/* Diagnosis Header Details */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Status & Calibration pill */}
              <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                <HealthBadge status={condition.status} />

                <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  isHighConfidence
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : isMediumConfidence
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isHighConfidence ? 'bg-emerald-600' : isMediumConfidence ? 'bg-amber-600' : 'bg-rose-600'
                  }`} />
                  <span>{confidencePercent}% {t('diagnosisCalibratedConfidence', 'Calibrated Confidence')}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                {condition.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium italic mt-1 font-mono">
                {condition.scientificName}
              </p>

              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {condition.simpleSummary}
              </p>

              {/* Confidence Meter Bar */}
              <div className="mt-5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                  <span>{t('diagnosisCalibratedConfidence', 'Vision Confidence Match')}</span>
                  <span>{confidencePercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHighConfidence ? 'bg-emerald-600' : isMediumConfidence ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Inconclusive Warning if applicable */}
            {isInconclusive && (
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">{t('diagnosisInconclusiveTitle', 'Inconclusive Visual Sample')}</strong>
                  <span>{t('diagnosisInconclusiveDesc', 'Confidence threshold below 65%. Retake photo in bright daylight or compare physical symptoms below.')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3-Step Action Highlight Card (Priority: What, Why, When) */}
      <div className="bg-gradient-to-br from-forest-900 via-forest-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-emerald-800/30">
        <div className="flex items-center gap-2 mb-4 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>{t('diagnosisWhatToDoTitle', 'What to Do Right Now (Beginner Action Plan)')}</span>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5">
          {condition.whatToDoNow.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/15">
              <span className="w-6 h-6 rounded-xl bg-emerald-400 text-forest-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-stone-100 font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Why & When Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-200 font-semibold mb-0.5">{t('diagnosisWhyItMattersTitle', 'Why This Helps')}:</strong>
              <p className="text-stone-300 leading-relaxed">{condition.whyItMatters}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sky-200 font-semibold mb-0.5">{t('diagnosisWhenToDoTitle', 'When to Do It')}:</strong>
              <p className="text-stone-300 leading-relaxed">{condition.whenToDoIt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Guidance Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms & Visual Identifiers */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('diagnosisSymptomsTitle', 'Diagnostic Symptoms')}</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-stone-600">
            {condition.symptoms.map((symptom, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safe Organic & Bio-controls */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('diagnosisOrganicCareTitle', 'Safe Bio-controls & Organic Care')}</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-stone-600">
            {condition.organicTreatment.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Long-term Cultural Prevention */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('diagnosisPreventionTitle', 'Cultural & Preventive Practices')}</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-xs text-stone-600">
            {condition.prevention.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Simple Gardening Terms Explained */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-sm text-stone-900">{t('diagnosisTermsTitle', 'Gardening Terms in Plain Words')}</h2>
          </div>
          <div className="mt-4 space-y-2.5 text-xs text-stone-600">
            <p className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">{glossary.pruning}</p>
            <p className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">{glossary.bottomWatering}</p>
            <p className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">{glossary.mulching}</p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70 text-xs text-stone-600">
        <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-stone-600" />
          <span>{t('diagnosisChemicalNoticeTitle', 'Household Safety & Standards')}</span>
        </h4>
        <div className="space-y-1.5 text-stone-600">
          <p>
            {condition.chemicalGuidance?.join(' ') || t('diagnosisChemicalNoticeDesc', 'Always prioritize non-toxic organic controls on home balconies.')}
          </p>
        </div>
      </div>
    </div>
  );
}
