import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export function AddPlantModal({ isOpen, onClose, onAddPlant }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    variety: 'Cherry Tomato (Super Sweet 100)',
    planting_date: new Date().toISOString().split('T')[0],
    growing_location: 'balcony',
    container_type: 'terracotta_pot',
    sunlight: 'full_sun',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      await onAddPlant(formData);
      onClose();
      setFormData({
        name: '',
        variety: 'Cherry Tomato (Super Sweet 100)',
        planting_date: new Date().toISOString().split('T')[0],
        growing_location: 'balcony',
        container_type: 'terracotta_pot',
        sunlight: 'full_sun',
        notes: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('addPlantTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            {t('addPlantNameLabel')} *
          </label>
          <input
            type="text"
            required
            placeholder={t('addPlantNamePlaceholder')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {t('addPlantTypeLabel')}
            </label>
            <select
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="Cherry Tomato (Super Sweet 100)">Cherry Tomato (Sweet 100)</option>
              <option value="Roma VF (Plum Tomato)">Roma VF (Plum Tomato)</option>
              <option value="Micro-Tom (Windowsill Dwarf)">Micro-Tom (Windowsill Dwarf)</option>
              <option value="Pusa Ruby (Indian Desi Cultivar)">Pusa Ruby (Desi Cultivar)</option>
              <option value="Beefsteak Heirloom">Beefsteak Heirloom</option>
              <option value="San Marzano">San Marzano</option>
              <option value="Other Tomato Cultivar">Other Tomato Variety</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {t('plantDetailSpecs', 'Planting Date')}
            </label>
            <input
              type="date"
              value={formData.planting_date}
              onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {t('addPlantLocationLabel')}
            </label>
            <select
              value={formData.growing_location}
              onChange={(e) => setFormData({ ...formData, growing_location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="balcony">Balcony (Sheltered)</option>
              <option value="terrace">Rooftop Terrace (Exposed)</option>
              <option value="indoor_window">Kitchen / Window Sill</option>
              <option value="patio">Patio</option>
              <option value="garden_bed">Garden Bed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {t('addPlantContainerLabel')}
            </label>
            <select
              value={formData.container_type}
              onChange={(e) => setFormData({ ...formData, container_type: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
            >
              <option value="terracotta_pot">{t('plantCardTerracotta')}</option>
              <option value="grow_bag">{t('plantCardGrowBag')}</option>
              <option value="plastic_pot">{t('plantCardPlastic')}</option>
              <option value="raised_bed">Raised Bed</option>
              <option value="ground">Direct Ground Soil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            {t('addPlantSunlightLabel')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'full_sun', label: t('plantCardSunHigh') },
              { id: 'partial_shade', label: t('plantCardSunMed') },
              { id: 'low_light', label: t('plantCardSunLow') }
            ].map((sun) => (
              <label
                key={sun.id}
                className={`flex items-center justify-center text-center p-2 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                  formData.sunlight === sun.id
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="sunlight"
                  value={sun.id}
                  checked={formData.sunlight === sun.id}
                  onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                  className="sr-only"
                />
                <span className="truncate">{sun.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            {t('logWateringNotesLabel')}
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Using homemade compost, staked on bamboo pole."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('addPlantCancelBtn')}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isLoading ? t('addPlantSaving') : t('addPlantSubmitBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
