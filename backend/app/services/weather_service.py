from typing import Dict, Any, List
import httpx

DEFAULT_COORDINATES = {
    "latitude": 20.5937,
    "longitude": 78.9629,
    "cityName": "Urban Garden"
}

WMO_WEATHER_CODES = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy / Mist",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm"
}

class WeatherService:
    async def get_forecast(self, lat: float = DEFAULT_COORDINATES["latitude"], lon: float = DEFAULT_COORDINATES["longitude"]) -> Dict[str, Any]:
        """Fetches forecast from Open-Meteo Forecast API with reliable fallback."""
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&"
            f"current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&"
            f"daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&"
            f"timezone=auto&forecast_days=3"
        )

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    curr = data.get("current", {})
                    daily = data.get("daily", {})
                    
                    w_code = curr.get("weather_code", 1)
                    return {
                        "success": True,
                        "current": {
                            "temp": round(curr.get("temperature_2m", 28)),
                            "humidity": round(curr.get("relative_humidity_2m", 65)),
                            "precipitation": curr.get("precipitation", 0.0),
                            "wind_speed": round(curr.get("wind_speed_10m", 12)),
                            "weather_code": w_code,
                            "condition_text": WMO_WEATHER_CODES.get(w_code, "Fair Weather")
                        },
                        "daily": [
                            {
                                "date": daily.get("time", [])[i],
                                "temp_max": round(daily.get("temperature_2m_max", [30, 30, 30])[i]),
                                "temp_min": round(daily.get("temperature_2m_min", [24, 24, 24])[i]),
                                "precip_prob": round(daily.get("precipitation_probability_max", [10, 10, 10])[i] or 0),
                                "precip_sum": daily.get("precipitation_sum", [0, 0, 0])[i] or 0.0,
                                "weather_code": daily.get("weather_code", [1, 1, 1])[i]
                            }
                            for i in range(min(3, len(daily.get("time", []))))
                        ],
                        "attribution": "Weather data by Open-Meteo.com"
                    }
        except Exception:
            pass

        # Robust offline fallback baseline
        return {
            "success": False,
            "current": {
                "temp": 29,
                "humidity": 65,
                "precipitation": 0.0,
                "wind_speed": 12,
                "weather_code": 1,
                "condition_text": "Partly Cloudy (Seasonal Estimate)"
            },
            "daily": [
                {"date": "Today", "temp_max": 31, "temp_min": 24, "precip_prob": 15, "precip_sum": 0.0, "weather_code": 1},
                {"date": "Tomorrow", "temp_max": 32, "temp_min": 25, "precip_prob": 20, "precip_sum": 0.0, "weather_code": 2},
                {"date": "Day After", "temp_max": 30, "temp_min": 24, "precip_prob": 35, "precip_sum": 0.5, "weather_code": 3}
            ],
            "attribution": "Open-Meteo API (Offline Fallback)"
        }

    def calculate_watering_recommendation(self, plant: Dict[str, Any], weather: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates context-aware, explainable watering recommendations
        considering microclimate, container physics, and balcony overhead shelter.
        """
        curr = weather.get("current", {})
        temp = curr.get("temp", 28)
        humidity = curr.get("humidity", 65)

        daily = weather.get("daily", [{}])
        first_day = daily[0] if daily else {}
        precip_prob = first_day.get("precip_prob", 0)
        precip_sum = first_day.get("precip_sum", 0.0)

        loc = plant.get("growing_location", "balcony")
        container = plant.get("container_type", "terracotta_pot")

        is_sheltered = loc in ["balcony", "terrace", "indoor_window"]
        is_terracotta = container == "terracotta_pot"
        is_growbag = container == "grow_bag"

        urgency = "check_soil"
        label = "Check Soil Moisture"
        suggested_action = "Insert index finger 2 inches into root-zone potting mix. If topsoil is dry, irrigate at base."
        reasons = []

        # Factor 1: Balcony Shelter Alert vs Direct Rainfall
        if precip_prob >= 60 and precip_sum >= 5:
            if is_sheltered:
                urgency = "check_soil"
                label = "Rain Expected, But Check Container"
                reasons.append(
                    f"Outdoor rain forecast is high ({precip_prob}%), but this plant is placed on a {loc}. Balcony overhangs block natural rain; do not assume the potting soil will receive outdoor rainfall."
                )
            else:
                urgency = "skip_today"
                label = "Rain Forecasted — Skip Base Irrigation"
                suggested_action = "Check container drainage holes to ensure no standing water pools around root zone."
                reasons.append(
                    f"Significant rainfall forecasted ({precip_sum}mm, {precip_prob}% chance). Natural precipitation will hydrate open beds."
                )

        # Factor 2: High Ambient Heat
        if temp >= 32:
            reasons.append(f"High temperature ({temp}°C) accelerates transpiration and root water consumption.")
            if urgency != "skip_today":
                urgency = "water_today"
                label = "Water Recommended Today"
                suggested_action = "Water deeply in early morning hours before peak sun to avoid heat stress."

        # Factor 3: Container Material
        if is_terracotta:
            reasons.append("Porous terracotta clay breathes and evaporates moisture from pot walls faster than plastic.")
            if urgency == "check_soil" and temp > 26:
                urgency = "water_today"
                label = "Water Recommended (Terracotta Pot)"
        elif is_growbag:
            reasons.append("Fabric grow bags offer high root aeration; soil perimeter dries quickly while center retains moisture.")

        # Factor 4: Humidity Extremes
        if humidity < 45:
            reasons.append(f"Dry air ({humidity}% relative humidity) increases topsoil evaporation.")
        elif humidity > 85:
            reasons.append(f"High atmospheric humidity ({humidity}%) slows soil drying. Keep foliage dry to prevent fungal spore germination.")

        if not reasons:
            reasons.append(f"Moderate climate ({temp}°C, {humidity}% humidity). Standard tomato hydration protocol applies.")

        return {
            "plant_id": plant.get("id", ""),
            "plant_name": plant.get("name", "Tomato"),
            "urgency": urgency,
            "label": label,
            "suggested_action": suggested_action,
            "reasons": reasons,
            "weather_snapshot": {
                "temp": temp,
                "humidity": humidity,
                "rain_chance": precip_prob
            }
        }

weather_service = WeatherService()
