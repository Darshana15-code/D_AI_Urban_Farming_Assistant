/**
 * FloraPulse AI — Location Management & Geocoding Service
 * Connects to Open-Meteo Geocoding API (free, public, no API keys exposed).
 * Persists selected location in localStorage for visitors and Supabase profile for authenticated users.
 */

import { supabase, isSupabaseConfigured } from './supabase';

export const LOCATION_CHANGED_EVENT = 'flora_location_changed';

/**
 * Searches for matching cities/localities using Open-Meteo Geocoding API.
 * @param {string} query - City or locality name to search for (e.g. "Rajkot", "Ahmedabad")
 * @returns {Promise<Array>} List of matched locations with coordinates and formatted names
 */
export async function searchCities(query) {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=6&language=en&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Geocoding failed with status: ${res.status}`);

    const data = await res.json();
    if (!data.results || !data.results.length) return [];

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: Number(item.latitude.toFixed(4)),
      longitude: Number(item.longitude.toFixed(4)),
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', ')
    }));
  } catch (err) {
    console.warn('Geocoding search failed:', err.message);
    return [];
  }
}

/**
 * Resolves a city and optional area/locality into verified coordinates.
 * Tries the city name first, or searches area + city.
 * @param {string} city - e.g. "Rajkot"
 * @param {string} area - e.g. "Kalawad Road"
 */
export async function resolveLocation(city, area = '') {
  const cleanCity = (city || '').trim();
  const cleanArea = (area || '').trim();

  if (!cleanCity) {
    throw new Error('Please enter a valid city name.');
  }

  // 1. Try combined query first if area is provided
  if (cleanArea) {
    const combinedQuery = `${cleanArea} ${cleanCity}`;
    const combinedResults = await searchCities(combinedQuery);
    if (combinedResults.length > 0) {
      const top = combinedResults[0];
      return {
        city: cleanCity,
        area: cleanArea,
        locationName: `${cleanArea}, ${cleanCity}`,
        displayName: `${cleanArea}, ${top.displayName}`,
        latitude: top.latitude,
        longitude: top.longitude,
        country: top.country,
        admin1: top.admin1
      };
    }
  }

  // 2. Resolve city
  const cityResults = await searchCities(cleanCity);
  if (!cityResults.length) {
    throw new Error(`Could not find coordinates for city "${cleanCity}". Please verify spelling or try a nearby city.`);
  }

  // Prioritize Indian results if multiple
  const indiaMatch = cityResults.find((r) => r.countryCode === 'IN');
  const matched = indiaMatch || cityResults[0];

  const locationName = cleanArea ? `${cleanArea}, ${matched.name}` : matched.name;
  const displayName = cleanArea ? `${cleanArea}, ${matched.displayName}` : matched.displayName;

  return {
    city: matched.name,
    area: cleanArea,
    locationName,
    displayName,
    latitude: matched.latitude,
    longitude: matched.longitude,
    country: matched.country,
    admin1: matched.admin1
  };
}

/**
 * Requests device GPS coordinates with explicit user permission.
 * Never forces permission and handles denials cleanly.
 */
export async function getDeviceCoordinates() {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lon = Number(pos.coords.longitude.toFixed(4));

        // Attempt reverse geocoding to give a human-readable city name
        let locationName = `GPS (${lat}°, ${lon}°)`;
        let city = 'Current Location';
        try {
          // Open-Meteo reverse geocoding or bigdatacloud free client
          const revRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
            { signal: AbortSignal.timeout(4000) }
          );
          if (revRes.ok) {
            const revData = await revRes.json();
            const revCity = revData.city || revData.locality || revData.principalSubdivision;
            if (revCity) {
              city = revCity;
              locationName = revData.locality && revData.locality !== revCity
                ? `${revData.locality}, ${revCity}`
                : `${revCity}${revData.principalSubdivision ? ', ' + revData.principalSubdivision : ''}`;
            }
          }
        } catch (e) {
          // fallback to coordinate string
        }

        resolve({
          city,
          area: '',
          locationName,
          displayName: locationName,
          latitude: lat,
          longitude: lon
        });
      },
      (err) => {
        let msg = 'Could not access device location.';
        if (err.code === 1) {
          msg = 'Location permission was denied. You can enter your city manually above.';
        } else if (err.code === 2) {
          msg = 'Device location is currently unavailable.';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Please enter your city manually.';
        }
        reject(new Error(msg));
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

/**
 * Retrieves the active location from the user's Supabase profile or local storage.
 * Does NOT default to Mumbai. If no location has been chosen, returns null.
 */
export function getSavedLocation(user = null) {
  // 1. From authenticated user metadata / profile
  if (user?.user_metadata?.latitude && user?.user_metadata?.longitude) {
    return {
      city: user.user_metadata.city || user.user_metadata.location_name || '',
      area: user.user_metadata.area || '',
      locationName: user.user_metadata.location_name || `${user.user_metadata.city || 'My Garden'}`,
      displayName: user.user_metadata.location_name || '',
      latitude: Number(user.user_metadata.latitude),
      longitude: Number(user.user_metadata.longitude)
    };
  }

  // 2. From localStorage
  try {
    const raw = localStorage.getItem('flora_user_location');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    // ignore parse error
  }

  return null;
}

/**
 * Saves location to local storage and syncs with Supabase if authenticated.
 */
export async function saveUserLocation(locationData, user = null) {
  if (!locationData || typeof locationData.latitude !== 'number' || typeof locationData.longitude !== 'number') {
    throw new Error('Invalid location data to save.');
  }

  // 1. Save locally for visitors & immediate offline availability
  localStorage.setItem('flora_user_location', JSON.stringify(locationData));

  // 2. Sync to Supabase profile & auth metadata if authenticated
  if (user && isSupabaseConfigured && supabase) {
    try {
      // Update auth user metadata
      await supabase.auth.updateUser({
        data: {
          location_name: locationData.locationName,
          city: locationData.city,
          area: locationData.area,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        }
      });

      // Update public.profiles table
      await supabase
        .from('profiles')
        .update({
          location_name: locationData.locationName,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } catch (err) {
      console.warn('Could not sync location to Supabase profile:', err.message);
    }
  }

  // 3. Dispatch event so any open widgets immediately update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LOCATION_CHANGED_EVENT, { detail: locationData }));
  }

  return locationData;
}
