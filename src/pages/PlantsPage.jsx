import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Sprout, Sparkles } from 'lucide-react';
import { usePlants } from '../context/PlantContext';
import { useLanguage } from '../context/LanguageContext';
import { PlantCard } from '../components/plants/PlantCard';
import { AddPlantModal } from '../components/plants/AddPlantModal';
import { LogWateringModal } from '../components/plants/LogWateringModal';
import { Button } from '../components/common/Button';

export function PlantsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { plants, addPlant, logWatering } = usePlants();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [selectedWateringPlant, setSelectedWateringPlant] = useState(null);

  // Filtered plants
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plant.variety && plant.variety.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'healthy' && plant.health_status === 'healthy') ||
      (statusFilter === 'attention' && (plant.health_status === 'attention_needed' || plant.health_status === 'critical'));

    const matchesLocation =
      locationFilter === 'all' || plant.growing_location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {t('plantsTitle', 'My Urban Garden')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t('plantsSubtitle', 'Manage balcony and container crops, inspect health states, and record irrigation.')}
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddPlantOpen(true)}
          className="self-start sm:self-auto bg-forest-900 hover:bg-forest-950 text-white rounded-2xl shadow-sm"
        >
          {t('plantsAddBtn', 'Add Plant')}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('plantsSearchPlaceholder', 'Search by plant name or cultivar (e.g. Cherry, Roma)...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">{t('plantsFilterAll', 'All Plants')}</option>
            <option value="healthy">{t('plantsFilterHealthy', 'Healthy Only')}</option>
            <option value="attention">{t('plantsFilterAttention', 'Attention Needed')}</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">{t('locAllLocations', 'All Locations')}</option>
            <option value="balcony">{t('locBalcony', 'Balcony')}</option>
            <option value="terrace">{t('locTerrace', 'Terrace')}</option>
            <option value="indoor_window">{t('locWindow', 'Indoor Window')}</option>
          </select>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onLogWatering={(p) => setSelectedWateringPlant(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-soft max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-forest-50 border border-forest-100 flex items-center justify-center mx-auto mb-4 text-forest-800">
            <Sprout className="w-8 h-8 text-forest-700" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
            {t('plantsEmptyTitle', 'No Plants Found')}
          </h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            {t('plantsEmptyDesc', 'Your urban garden is currently empty. Add a container plant to begin precision care.')}
          </p>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsAddPlantOpen(true)}
            className="w-full bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-semibold"
          >
            {t('plantsAddFirstBtn', 'Add Your First Plant')}
          </Button>
        </div>
      )}

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
    </div>
  );
}
