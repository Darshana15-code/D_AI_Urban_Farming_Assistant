import React, { useState } from 'react';
import { Droplet } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export function LogWateringModal({ isOpen, onClose, plant, onLogWatering }) {
  const { t } = useLanguage();
  const [amountMl, setAmountMl] = useState(500);
  const [soilCondition, setSoilCondition] = useState('dry');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plant) return;

    setIsLoading(true);
    try {
      await onLogWatering(plant.id, {
        amount_ml: Number(amountMl),
        soil_condition_before: soilCondition,
        notes: notes.trim(),
      });
      onClose();
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('logWateringTitle')}: ${plant?.name || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 text-sky-700 fill-sky-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-sky-900">
              {t('plantDetailContainer')}: <span className="capitalize">{plant?.container_type?.replace('_', ' ')}</span>
            </p>
            <p className="text-[11px] text-sky-700">
              {t('logWateringSubtitle')}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            {t('logWateringAmountLabel')}
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[250, 500, 750, 1000].map((vol) => (
              <button
                type="button"
                key={vol}
                onClick={() => setAmountMl(vol)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  amountMl === vol
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {vol} ml
              </button>
            ))}
          </div>
          <input
            type="number"
            min="50"
            max="5000"
            step="50"
            value={amountMl}
            onChange={(e) => setAmountMl(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            {t('logWateringSoilLabel')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dry', label: t('soilDry'), desc: 'Needs deep soak' },
              { id: 'slightly_moist', label: t('soilMoist'), desc: 'Light watering' },
              { id: 'wet', label: t('soilSoggy'), desc: 'Caution: root rot' },
            ].map((cond) => (
              <label
                key={cond.id}
                className={`flex flex-col p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                  soilCondition === cond.id
                    ? 'border-sky-600 bg-sky-50/70 text-sky-950 font-semibold ring-1 ring-sky-600'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="soilCondition"
                  value={cond.id}
                  checked={soilCondition === cond.id}
                  onChange={(e) => setSoilCondition(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium text-stone-900">{cond.label}</span>
                <span className="text-[10px] text-stone-500 mt-0.5">{cond.desc}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            {t('logWateringNotesLabel')}
          </label>
          <input
            type="text"
            placeholder="e.g. Added mild organic seaweed fertilizer."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('logWateringCancelBtn')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="bg-sky-700 hover:bg-sky-800 focus:ring-sky-600">
            {t('logWateringSubmitBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
