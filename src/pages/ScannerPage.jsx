import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ScanLine,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePlants } from '../context/PlantContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ImageDropzone } from '../components/scan/ImageDropzone';
import { Button } from '../components/common/Button';
import { apiUploadScan } from '../services/api';

export function ScannerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlantId = searchParams.get('plantId');

  const { plants, addScanDirectly } = usePlants();
  const { session } = useAuth();
  const { t } = useLanguage();
  const token = session?.access_token || 'demo-local-token';

  const [selectedPlantId, setSelectedPlantId] = useState(preselectedPlantId || (plants[0]?.id || ''));
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = (file, url) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setErrorMessage('');
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisStep(t('scannerAnalyzingTitle', 'Uploading foliage specimen...'));

    try {
      setTimeout(() => {
        setAnalysisStep(t('scannerAnalyzingDesc', 'Evaluating lesion features & calibrated softmax...'));
      }, 700);

      // Execute real FastAPI ML inference
      const scanResult = await apiUploadScan(selectedFile, selectedPlantId || null, 'Foliage leaf scan', token);

      addScanDirectly(scanResult);
      setIsAnalyzing(false);
      navigate(`/scan/${scanResult.id}`);
    } catch (err) {
      console.warn('Real inference API error, evaluating local fallback:', err.message);
      setErrorMessage(`Inference failed: ${err.message}. Please verify image resolution or network connection.`);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Title Header with Editorial Styling */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 text-forest-800 text-xs font-semibold mb-2.5 border border-forest-200/60">
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          <span>{t('heroBadge', 'Real-Time Convolutional Diagnostic Pipeline')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('scannerTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          {t('scannerSubtitle')}
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Analysis Warning</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Plant Selection */}
        <div className="lg:col-span-7 space-y-5">
          {/* Plant Selection */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              {t('scannerSelectPlantLabel')}
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-canvas-50 text-stone-800 font-medium"
            >
              <option value="">Standalone Leaf (Unlinked)</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.variety || 'Tomato'}) — {p.growing_location}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Dropzone */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft">
            <ImageDropzone
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
            />

            {/* Analysis Action */}
            <div className="mt-5">
              <Button
                variant="primary"
                size="lg"
                icon={ScanLine}
                disabled={!selectedFile || isAnalyzing}
                isLoading={isAnalyzing}
                onClick={handleAnalyze}
                className="w-full bg-forest-900 hover:bg-forest-950 text-white font-medium py-3 rounded-2xl shadow-md"
              >
                {isAnalyzing ? analysisStep : t('scannerAnalyzeBtn')}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Photography Guidelines & Best Practices */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft">
            <div className="flex items-center gap-2 pb-3.5 border-b border-stone-100">
              <Camera className="w-4 h-4 text-forest-700" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                {t('scannerTipsTitle')}
              </h2>
            </div>

            <ul className="mt-4 space-y-3.5 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('scannerTip1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('scannerTip2')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('scannerTip3')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Sharp focus:</strong> Tap screen to focus sharply on leaf edges and lesion borders.
                </span>
              </li>
            </ul>
          </div>

          {/* Model Transparency Disclaimer */}
          <div className="bg-sage-50 rounded-3xl p-5 border border-sage-200/70 text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-forest-900">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              <span>Scientific Diagnostic Integrity</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              FloraPulse AI executes convolutional inference trained on the PlantVillage tomato benchmark dataset with calibrated temperature scaling ($T=1.35$). Predictions represent probabilistic advisory estimates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
