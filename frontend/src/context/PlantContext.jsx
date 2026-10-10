import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  apiGetPlants,
  apiCreatePlant,
  apiUpdatePlant,
  apiDeletePlant,
  apiGetScans,
  apiLogWatering,
  apiGetWateringLogs
} from '../services/api';

const PlantContext = createContext();

// Sample balcony plants for the Demo Garden mode ONLY
const DEMO_GARDEN_PLANTS = [
  {
    id: 'plant-tomato-01',
    user_id: 'demo-user-balcony-01',
    name: 'Balcony Sweet 100',
    species: 'Solanum lycopersicum',
    variety: 'Super Sweet 100 (Cherry)',
    planting_date: '2026-08-15',
    growing_location: 'balcony',
    container_type: 'terracotta_pot',
    sunlight: 'full_sun',
    health_status: 'healthy',
    notes: 'South railing vine. Heavy clusters setting well.',
    image_url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    last_watered: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    created_at: '2026-08-15T10:00:00Z',
  },
  {
    id: 'plant-tomato-02',
    user_id: 'demo-user-balcony-01',
    name: 'Terrace Roma Hybrid',
    species: 'Solanum lycopersicum',
    variety: 'Roma VF (Plum Tomato)',
    planting_date: '2026-08-28',
    growing_location: 'terrace',
    container_type: 'grow_bag',
    sunlight: 'full_sun',
    health_status: 'attention_needed',
    notes: 'Concentric brown spots on lower leaves.',
    image_url: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=600&q=80',
    last_watered: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    created_at: '2026-08-28T14:30:00Z',
  },
  {
    id: 'plant-tomato-03',
    user_id: 'demo-user-balcony-01',
    name: 'Kitchen Window Micro-Tom',
    species: 'Solanum lycopersicum',
    variety: 'Micro-Tom (Dwarf)',
    planting_date: '2026-09-10',
    growing_location: 'indoor_window',
    container_type: 'plastic_pot',
    sunlight: 'partial_shade',
    health_status: 'healthy',
    notes: 'Compact 8-inch dwarf tomato on windowsill.',
    image_url: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=600&q=80',
    last_watered: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    created_at: '2026-09-10T09:15:00Z',
  }
];

export function PlantProvider({ children }) {
  const { session, user } = useAuth();
  const token = session?.access_token || (user ? 'demo-local-token' : null);

  const [plants, setPlants] = useState([]);
  const [scans, setScans] = useState([]);
  const [wateringLogs, setWateringLogs] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);

  // Sync to user-specific local storage cache
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`flora_plants_${user.id}`, JSON.stringify(plants));
    }
  }, [plants, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`flora_scans_${user.id}`, JSON.stringify(scans));
    }
  }, [scans, user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`flora_watering_logs_${user.id}`, JSON.stringify(wateringLogs));
    }
  }, [wateringLogs, user?.id]);

  // Fetch user-scoped real data from FastAPI backend
  const refreshFromBackend = useCallback(async () => {
    if (!user || !token) {
      setPlants([]);
      setScans([]);
      setWateringLogs([]);
      return;
    }

    setIsLoadingPlants(true);

    try {
      const plantsRes = await apiGetPlants(token);
      if (plantsRes && Array.isArray(plantsRes.plants)) {
        // If user is specifically the demo gardener and has 0 backend plants, pre-seed demo plants
        if (user.id === 'demo-user-balcony-01' && plantsRes.plants.length === 0) {
          setPlants(DEMO_GARDEN_PLANTS);
        } else {
          // Real user account: strictly user's own plants (or empty array if new)
          setPlants(plantsRes.plants);
        }
        setBackendConnected(true);
      }
    } catch (err) {
      // Backend offline or unreachable: fall back to user's isolated local cache
      setBackendConnected(false);
      const cached = localStorage.getItem(`flora_plants_${user.id}`);
      if (cached) {
        try {
          setPlants(JSON.parse(cached));
        } catch (e) {
          setPlants(user.id === 'demo-user-balcony-01' ? DEMO_GARDEN_PLANTS : []);
        }
      } else if (user.id === 'demo-user-balcony-01') {
        setPlants(DEMO_GARDEN_PLANTS);
      } else {
        // Brand new real account: completely empty garden
        setPlants([]);
      }
    } finally {
      setIsLoadingPlants(false);
    }

    try {
      const scansRes = await apiGetScans(token);
      if (scansRes && Array.isArray(scansRes.scans)) {
        setScans(scansRes.scans);
      }
    } catch (err) {
      const cachedScans = localStorage.getItem(`flora_scans_${user.id}`);
      if (cachedScans) {
        try {
          setScans(JSON.parse(cachedScans));
        } catch (e) {
          setScans([]);
        }
      }
    }
  }, [token, user]);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  const addPlant = async (plantData) => {
    if (!user) throw new Error('Authentication required to add plants.');

    try {
      const res = await apiCreatePlant(plantData, token);
      if (res && res.id) {
        setPlants((prev) => [res, ...prev]);
        setBackendConnected(true);
        return res;
      }
    } catch (err) {
      console.warn('Backend API addPlant fallback to local:', err.message);
    }

    // Local fallback isolated to current user
    const localPlant = {
      id: 'plant-' + Date.now(),
      user_id: user.id,
      species: plantData.species || 'Solanum lycopersicum',
      variety: plantData.variety || 'Heirloom Plant',
      name: plantData.name || 'Balcony Plant',
      planting_date: plantData.planting_date || new Date().toISOString().split('T')[0],
      growing_location: plantData.growing_location || 'balcony',
      container_type: plantData.container_type || 'terracotta_pot',
      sunlight: plantData.sunlight || 'full_sun',
      health_status: 'unscanned',
      notes: plantData.notes || '',
      image_url: plantData.image_url || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
      last_watered: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...plantData,
    };
    setPlants((prev) => [localPlant, ...prev]);
    return localPlant;
  };

  const updatePlant = async (plantId, updates) => {
    if (!user) return;
    try {
      await apiUpdatePlant(plantId, updates, token);
    } catch (err) {
      console.warn('Backend API updatePlant fallback to local:', err.message);
    }
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    );
  };

  const deletePlant = async (plantId) => {
    if (!user) return;
    try {
      await apiDeletePlant(plantId, token);
    } catch (err) {
      console.warn('Backend API deletePlant fallback to local:', err.message);
    }
    setPlants((prev) => prev.filter((p) => p.id !== plantId));
    setScans((prev) => prev.filter((s) => s.plant_id !== plantId));
    setWateringLogs((prev) => prev.filter((w) => w.plant_id !== plantId));
  };

  const logWatering = async (plantId, logData = {}) => {
    if (!user) return null;
    const nowIso = new Date().toISOString();
    try {
      const res = await apiLogWatering(plantId, logData, token);
      if (res && res.id) {
        setWateringLogs((prev) => [res, ...prev]);
        updatePlant(plantId, { last_watered: res.logged_at });
        return res;
      }
    } catch (err) {
      console.warn('Backend API logWatering fallback to local:', err.message);
    }

    const localLog = {
      id: 'water-' + Date.now(),
      user_id: user.id,
      plant_id: plantId,
      amount_ml: logData.amount_ml || 500,
      soil_condition_before: logData.soil_condition_before || 'dry',
      notes: logData.notes || 'Routine watering',
      logged_at: nowIso,
    };
    setWateringLogs((prev) => [localLog, ...prev]);
    updatePlant(plantId, { last_watered: nowIso });
    return localLog;
  };

  const addScanDirectly = (scanRecord) => {
    setScans((prev) => [scanRecord, ...prev]);
    if (scanRecord.plant_id) {
      const newStatus = (scanRecord.condition_code === 'tomato_healthy' && !scanRecord.is_inconclusive)
        ? 'healthy'
        : 'attention_needed';
      updatePlant(scanRecord.plant_id, { health_status: newStatus });
    }
  };

  const getPlantById = (id) => plants.find((p) => p.id === id);
  const getScansForPlant = (plantId) => scans.filter((s) => s.plant_id === plantId);
  const getWateringLogsForPlant = (plantId) => wateringLogs.filter((w) => w.plant_id === plantId);

  return (
    <PlantContext.Provider
      value={{
        plants,
        scans,
        wateringLogs,
        backendConnected,
        isLoadingPlants,
        refreshFromBackend,
        addPlant,
        updatePlant,
        deletePlant,
        addScanDirectly,
        logWatering,
        getPlantById,
        getScansForPlant,
        getWateringLogsForPlant,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants() {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
}
