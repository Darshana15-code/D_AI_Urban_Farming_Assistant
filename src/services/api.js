/**
 * FloraPulse AI — Unified Backend API Client
 * Connects frontend to the FastAPI backend service (http://localhost:8000/api/v1).
 * Attaches Supabase session bearer token to authenticate requests and enforce user isolation.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

async function request(endpoint, options = {}, token = null) {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type for FormData; browser sets boundary automatically
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `Server error: ${res.status}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.detail || errorMsg;
      } catch (e) {
        // Non-JSON error
      }
      throw new Error(errorMsg);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    throw err;
  }
}

// ----------------------------------------------------------------------------
// HEALTH
// ----------------------------------------------------------------------------
export async function apiCheckHealth() {
  return request('/health');
}

// ----------------------------------------------------------------------------
// PLANTS
// ----------------------------------------------------------------------------
export async function apiGetPlants(token) {
  return request('/plants', { method: 'GET' }, token);
}

export async function apiCreatePlant(plantData, token) {
  return request('/plants', {
    method: 'POST',
    body: JSON.stringify(plantData)
  }, token);
}

export async function apiGetPlantById(plantId, token) {
  return request(`/plants/${plantId}`, { method: 'GET' }, token);
}

export async function apiUpdatePlant(plantId, updates, token) {
  return request(`/plants/${plantId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  }, token);
}

export async function apiDeletePlant(plantId, token) {
  return request(`/plants/${plantId}`, { method: 'DELETE' }, token);
}

// ----------------------------------------------------------------------------
// SCANS (REAL INFERENCE MULTIPART UPLOAD)
// ----------------------------------------------------------------------------
export async function apiUploadScan(file, plantId = null, notes = '', token = null) {
  const formData = new FormData();
  formData.append('file', file);
  if (plantId) formData.append('plant_id', plantId);
  if (notes) formData.append('notes', notes);

  return request('/scans', {
    method: 'POST',
    body: formData
  }, token);
}

export async function apiGetScans(token) {
  return request('/scans', { method: 'GET' }, token);
}

export async function apiGetScanById(scanId, token) {
  return request(`/scans/${scanId}`, { method: 'GET' }, token);
}

// ----------------------------------------------------------------------------
// WATERING LOGS
// ----------------------------------------------------------------------------
export async function apiLogWatering(plantId, logData, token) {
  return request(`/plants/${plantId}/watering-logs`, {
    method: 'POST',
    body: JSON.stringify(logData)
  }, token);
}

export async function apiGetWateringLogs(plantId, token) {
  return request(`/plants/${plantId}/watering-logs`, { method: 'GET' }, token);
}

// ----------------------------------------------------------------------------
// WEATHER & CARE GUIDANCE
// ----------------------------------------------------------------------------
export async function apiGetWeather(lat, lon) {
  const query = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
  return request(`/weather${query}`);
}

export async function apiGetWateringRecommendation(plantId, token) {
  return request(`/weather/recommendation/${plantId}`, { method: 'GET' }, token);
}

export async function apiGetCareGuidance(conditionCode) {
  return request(`/care/${conditionCode}`);
}
