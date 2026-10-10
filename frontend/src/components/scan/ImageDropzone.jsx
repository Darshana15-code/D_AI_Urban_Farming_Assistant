import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageDropzone({ selectedFile, previewUrl, onFileSelect, onClear }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndProcessFile = (file) => {
    setError(null);
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Unsupported format (${file.type || 'unknown'}). Please upload a JPG, PNG, or WebP image.`);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onFileSelect(file, objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 bg-stone-900 group shadow-soft">
          <img
            src={previewUrl}
            alt="Leaf preview"
            className="w-full h-72 md:h-80 object-contain mx-auto"
          />
          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-md hover:bg-stone-100 transition-colors"
            >
              {t('commonChangeBtn', 'Replace Photo')}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-rose-700 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('commonDelete', 'Remove')}</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-md text-white text-xs px-3 py-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{selectedFile?.name || 'Leaf Image Loaded'}</span>
            </div>
            <span className="text-[11px] text-stone-300 shrink-0 ml-2">
              {(selectedFile?.size / 1024).toFixed(0)} KB
            </span>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/50 scale-[1.01]'
              : 'border-stone-300 hover:border-emerald-700 hover:bg-stone-50/80 bg-white'
          }`}
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 mb-3 shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-bold text-stone-900">
            {t('scannerDropzoneTitle')}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {t('scannerDropzoneSub')}
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>{t('scannerUploadBtn')}</span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files?.[0] && validateAndProcessFile(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
