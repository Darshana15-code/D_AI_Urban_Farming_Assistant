import { getSavedLocation } from './locationService';

/**
 * Fetch forecast from Open-Meteo API for specified coordinates or user's active location.
 * Does NOT silently fall back to Mumbai or fabricate weather data.
 */
export async function fetchWeatherForecast(lat = null, lon = null) {
  // If no coordinates passed, attempt to retrieve from user's active saved location
  if (lat == null || lon == null) {
    const saved = getSavedLocation();
    if (saved && typeof saved.latitude === 'number' && typeof saved.longitude === 'number') {
      lat = saved.latitude;
      lon = saved.longitude;
    }
  }

  // If still no location configured, notify the caller to prompt the user
  if (lat == null || lon == null) {
    return {
      success: false,
      needsLocationSetup: true,
      error: 'NO_LOCATION_SET',
      message: 'No location configured yet. Please enter your city and area to load live weather.'
    };
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto&forecast_days=3`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with status: ${response.status}`);
    }
    const data = await response.json();
    return {
      success: true,
      current: {
        temp: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m),
        precipitation: data.current.precipitation,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        conditionText: getWeatherConditionText(data.current.weather_code)
      },
      daily: data.daily.time.map((date, idx) => ({
        date,
        tempMax: Math.round(data.daily.temperature_2m_max[idx]),
        tempMin: Math.round(data.daily.temperature_2m_min[idx]),
        precipProb: data.daily.precipitation_probability_max[idx] || 0,
        precipSum: data.daily.precipitation_sum[idx] || 0,
        weatherCode: data.daily.weather_code[idx]
      })),
      hourly: data.hourly.time.slice(0, 12).map((t, i) => ({
        time: t.split('T')[1].slice(0, 5),
        temp: Math.round(data.hourly.temperature_2m[i]),
        humidity: Math.round(data.hourly.relative_humidity_2m[i]),
        precipProb: data.hourly.precipitation_probability[i] || 0
      })),
      attribution: 'Live weather provided by Open-Meteo.com'
    };
  } catch (err) {
    console.warn('Weather fetch failed for location:', lat, lon, err.message);
    return {
      success: false,
      error: 'FETCH_ERROR',
      message: 'Unable to reach the live weather service. Please check your connection and retry or change location.'
    };
  }
}

/**
 * Weather code to descriptive text mapping (WMO code)
 */
function getWeatherConditionText(code) {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy / Mist';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 80 && code <= 82) return 'Heavy Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Fair Weather';
}

/**
 * Transparent, context-aware rule-based watering decision engine
 */
export function calculateWateringRecommendation(plant, weather) {
  const currentTemp = weather?.current?.temp ?? 28;
  const currentHumidity = weather?.current?.humidity ?? 65;
  const precipProb = weather?.daily?.[0]?.precipProb ?? 0;
  const precipSum = weather?.daily?.[0]?.precipSum ?? 0;

  const isBalconyOrTerrace = ['balcony', 'terrace', 'indoor_window'].includes(plant?.growing_location);
  const isTerracotta = plant?.container_type === 'terracotta_pot';
  const isGrowBag = plant?.container_type === 'grow_bag';
  const isPlastic = plant?.container_type === 'plastic_pot';

  let urgency = 'check_soil'; // 'water_today', 'check_soil', 'skip_today', 'shelter_needed'
  let label = 'Check Soil Moisture';
  let reasoning = [];
  let suggestedAction = 'Insert index finger 2 inches deep into potting soil. If dry, water at base.';

  // Factor 1: Balcony Shelter Alert vs Direct Rain
  if (precipProb >= 60 && precipSum >= 5) {
    if (isBalconyOrTerrace) {
      urgency = 'check_soil';
      label = 'Rain Expected, But Check Container';
      reasoning.push(
        `High rain probability (${precipProb}%), but your plant is on a ${plant.growing_location}. Balcony ceilings usually block natural rain, so do not assume the soil will receive moisture automatically.`
      );
    } else {
      urgency = 'skip_today';
      label = 'Rain Expected — Skip Base Watering';
      reasoning.push(
        `Significant outdoor rainfall forecasted (${precipSum}mm, ${precipProb}% chance). Natural precipitation will hydrate open garden beds.`
      );
      suggestedAction = 'Check container drainage holes to ensure no standing water pools around roots.';
    }
  }

  // Factor 2: High Temperature & Evaporation
  if (currentTemp >= 32) {
    reasoning.push(`High ambient temperature (${currentTemp}°C) accelerates transpiration and root zone water uptake.`);
    if (urgency !== 'skip_today') {
      urgency = 'water_today';
      label = 'Water Needed Today';
      suggestedAction = 'Water thoroughly in the early morning before peak sun to minimize heat stress.';
    }
  }

  // Factor 3: Container Type Physics
  if (isTerracotta) {
    reasoning.push('Terracotta pots are porous and evaporate moisture through the pot walls 30% faster than plastic.');
    if (urgency === 'check_soil' && currentTemp > 26) {
      urgency = 'water_today';
      label = 'Water Recommended (Terracotta Pot)';
    }
  } else if (isGrowBag) {
    reasoning.push('Fabric grow bags have high root aeration; soil perimeter dries faster while center retains moisture.');
  } else if (isPlastic) {
    reasoning.push('Plastic pots trap moisture longer; take care not to overwater to prevent Pythium root rot.');
  }

  // Factor 4: Low Humidity
  if (currentHumidity < 45) {
    reasoning.push(`Low relative humidity (${currentHumidity}%) dries topsoil quickly.`);
  } else if (currentHumidity > 85) {
    reasoning.push(`High atmospheric humidity (${currentHumidity}%) slows drying; leave leaves dry to prevent fungal spores.`);
  }

  // Fallback reasoning if none triggered
  if (reasoning.length === 0) {
    reasoning.push(`Moderate climate (${currentTemp}°C, ${currentHumidity}% humidity). Standard tomato moisture schedule applies.`);
  }

  return {
    urgency,
    label,
    suggestedAction,
    reasons: reasoning,
    weatherSnapshot: {
      temp: currentTemp,
      humidity: currentHumidity,
      rainChance: precipProb
    }
  };
}
