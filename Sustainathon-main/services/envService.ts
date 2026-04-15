/**
 * Environmental Data Service
 * Fetches real-time air quality data from AQICN API.
 */

const API_TOKEN = '853cff424493f9b4f899bd1ffb72b0fb0fa99a98';
const BASE_URL = 'https://api.waqi.info/feed';

export interface AqiData {
  aqi: number;
  city: string;
  source: string;
  time: string;
  dominantPol: string;
  geo?: [number, number]; // [lat, lon]
}

export interface SearchResult {
  name: string;
  aqi: string;
  url: string;
  geo: [number, number] | null; // [lat, lon] from station data
}

/**
 * Fetch real-time AQI data.
 * - Pass 'here' for IP-based auto-detect
 * - Pass 'geo:lat;lon' for GPS-based location
 * - Pass a city name like 'delhi' for city-based lookup
 */
export const fetchRealTimeAqi = async (query: string = 'here'): Promise<AqiData> => {
  try {
    // Use encodeURIComponent for city names, but keep specialized queries like 'geo:lat;lon' or 'here' mostly intact.
    // The WAQI API handles encoded keywords perfectly.
    const encodedQuery = query.startsWith('geo:') ? query : encodeURIComponent(query);
    const url = `${BASE_URL}/${encodedQuery}/?token=${API_TOKEN}`;
    console.log('[AQI] Fetching:', url);
    const response = await fetch(url);
    const json = await response.json();

    console.log('[AQI] Response status:', json.status, 'aqi:', json.data?.aqi);

    if (json.status !== 'ok' || typeof json.data?.aqi !== 'number') {
      throw new Error(`AQI API error: ${json.status} - ${JSON.stringify(json.data)}`);
    }

    const geo: [number, number] | undefined = json.data.city?.geo
      ? [json.data.city.geo[0], json.data.city.geo[1]]
      : undefined;

    return {
      aqi: json.data.aqi,
      city: json.data.city?.name || query,
      source: json.data.attributions?.[0]?.name || 'Global Sensor Network',
      time: json.data.time?.s || new Date().toISOString(),
      dominantPol: json.data.dominentpol || 'pm25',
      geo
    };
  } catch (error) {
    console.error("[AQI Fetch Error]:", error);
    return {
      aqi: -1,
      city: 'Unavailable',
      source: 'Offline - Could not reach AQI service',
      time: new Date().toISOString(),
      dominantPol: 'pm25'
    };
  }
};

/**
 * Search for AQI stations by city name using the WAQI search API.
 * Returns results with actual station geo coordinates for accurate map positioning.
 */
export const searchCityAqi = async (keyword: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`https://api.waqi.info/search/?keyword=${encodeURIComponent(keyword)}&token=${API_TOKEN}`);
    const json = await response.json();

    if (json.status !== 'ok') {
      throw new Error('Search failed');
    }

    return json.data.map((item: any) => ({
      name: item.station?.name || keyword,
      aqi: item.aqi != null ? String(item.aqi) : '-',
      url: item.station?.url || '',
      geo: item.station?.geo ? [item.station.geo[0], item.station.geo[1]] : null
    }));
  } catch (error) {
    console.error("[AQI Search Error]:", error);
    return [];
  }
};

export const getAqiLevel = (aqi: number) => {
  if (aqi < 0) return { label: 'Offline', color: '#9ca3af', description: 'Could not fetch air quality data. Check your connection.' };
  if (aqi <= 50) return { label: 'Good', color: '#4ade80', description: 'Air quality is satisfactory.' };
  if (aqi <= 100) return { label: 'Moderate', color: '#facc15', description: 'Air quality is acceptable.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#fb923c', description: 'Members of sensitive groups may experience health effects.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', description: 'Everyone may begin to experience health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7', description: 'Health alert: everyone may experience more serious health effects.' };
  return { label: 'Hazardous', color: '#7f1d1d', description: 'Health warning of emergency conditions. The entire population is likely to be affected.' };
};
