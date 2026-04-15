import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2, ExternalLink, Navigation } from 'lucide-react';
import { searchCityAqi, fetchRealTimeAqi, getAqiLevel, SearchResult, AqiData } from '../services/envService';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WAQI_TOKEN = '853cff424493f9b4f899bd1ffb72b0fb0fa99a98';

// Component that adds the WAQI AQI tile overlay to the map
const AqiTileOverlay = () => {
    const map = useMap();

    useEffect(() => {
        const waqiLayer = L.tileLayer(
            `https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${WAQI_TOKEN}`,
            {
                attribution: 'Air Quality Tiles &copy; <a href="https://waqi.info">waqi.info</a>',
                opacity: 0.75,
            }
        );
        waqiLayer.addTo(map);

        return () => {
            map.removeLayer(waqiLayer);
        };
    }, [map]);

    return null;
};

// Fix map container size on load (solves partial rendering)
const MapResizeFix = () => {
    const map = useMap();
    useEffect(() => {
        // invalidateSize after the container has settled
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        // Also fix on window resize
        const handleResize = () => map.invalidateSize();
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [map]);
    return null;
};

// Component to fly map to a location
const MapFlyTo = ({ center, zoom }: { center: [number, number] | null; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

interface LiveMapProps {
    onStationSelect?: (data: AqiData) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ onStationSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedStation, setSelectedStation] = useState<{
        name: string;
        aqi: number;
        aqiInfo: ReturnType<typeof getAqiLevel>;
        geo: [number, number];
    } | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [mapZoom, setMapZoom] = useState(5);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim().length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            const results = await searchCityAqi(value);
            setSearchResults(results.slice(0, 10));
            setShowResults(true);
            setIsSearching(false);
        }, 400);
    };

    const handleCitySelect = async (result: SearchResult) => {
        setShowResults(false);
        setSearchQuery(result.name);

        let finalData: AqiData | null = null;

        // Try to fetch by station name/keyword first. This is much more accurate for city-matching
        // than raw coordinates alone, which often jump to the nearest IP-based station (Navi Mumbai).
        const data = await fetchRealTimeAqi(result.name);
        
        if (data.city !== 'Unavailable') {
            finalData = data;
            const aqiInfo = getAqiLevel(data.aqi);
            
            // Update local map state
            // Use result.geo for map positioning, but use the fetched data for details
            const geoToUse = data.geo || result.geo;
            if (geoToUse) {
                setSelectedStation({
                    name: data.city || result.name,
                    aqi: data.aqi,
                    aqiInfo,
                    geo: geoToUse
                });
                setMapCenter(geoToUse);
                setMapZoom(13);
            }
        } else if (result.geo) {
            // Fallback for UI if fetch failed but search gave coordinates
            const coords: [number, number] = [result.geo[0], result.geo[1]];
            setMapCenter(coords);
            setMapZoom(13);
        }

        // Notify parent (Dashboard) so the card updates accurately
        if (finalData && onStationSelect) {
            onStationSelect(finalData);
        }
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getAqiColor = (aqi: string) => {
        const num = parseInt(aqi);
        if (isNaN(num) || num < 0) return '#9ca3af';
        if (num <= 50) return '#4ade80';
        if (num <= 100) return '#facc15';
        if (num <= 150) return '#fb923c';
        if (num <= 200) return '#ef4444';
        if (num <= 300) return '#a855f7';
        return '#7f1d1d';
    };

    // Custom marker icon for selected station
    const selectedIcon = selectedStation ? L.divIcon({
        className: 'selected-station-marker',
        html: `<div style="
            background-color: ${selectedStation.aqiInfo.color};
            width: 28px; height: 28px;
            border-radius: 50%;
            border: 4px solid black;
            box-shadow: 3px 3px 0px black;
            display: flex; align-items: center; justify-content: center;
            font-weight: 900; font-size: 10px; color: black;
        ">${selectedStation.aqi}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    }) : undefined;

    return (
        <div className="relative">
            {/* City Search Bar — above the map */}
            <div ref={searchContainerRef} className="mb-4 relative z-[1001]">
                <div className="flex items-center gap-2 bg-white border-4 border-black rounded-2xl px-4 py-3 shadow-neo-sm focus-within:ring-4 ring-neo-blue transition-all">
                    {isSearching ? (
                        <Loader2 size={20} className="animate-spin text-gray-400" />
                    ) : (
                        <Search size={20} className="text-gray-400" />
                    )}
                    <input
                        id="map-search-input"
                        type="text"
                        className="flex-1 font-bold text-sm focus:outline-none bg-transparent"
                        placeholder="Search any city or station... (e.g. Pune Katraj, Delhi, London)"
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    />
                    <a
                        href="https://aqicn.org/map/india/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-neo-blue transition-colors uppercase whitespace-nowrap"
                    >
                        <ExternalLink size={12} /> aqicn.org
                    </a>
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black rounded-2xl shadow-neo overflow-hidden z-[1002] max-h-[400px] overflow-y-auto">
                        {searchResults.map((result, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCitySelect(result)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-neo-green/10 transition-colors border-b-2 border-black/5 last:border-0 cursor-pointer text-left"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                    <span className="font-bold text-sm truncate">
                                        {result.name}
                                    </span>
                                </div>
                                <div
                                    className="px-3 py-1 rounded-full text-xs font-black border-2 border-black min-w-[65px] text-center flex-shrink-0 ml-3"
                                    style={{
                                        backgroundColor: getAqiColor(result.aqi),
                                        color: parseInt(result.aqi) > 200 ? 'white' : 'black'
                                    }}
                                >
                                    AQI {result.aqi}
                                </div>
                            </button>
                        ))}
                        <a
                            href={`https://aqicn.org/city/all/?q=${encodeURIComponent(searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-4 py-3 text-center text-xs font-black text-neo-blue hover:bg-neo-blue/5 transition-colors uppercase"
                        >
                            View all results on aqicn.org →
                        </a>
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="h-[500px] w-full border-4 border-neo-black rounded-xl overflow-hidden shadow-neo-lg bg-gray-100 relative group">
                <div className="absolute top-4 right-4 z-[1000] bg-white border-2 border-black p-2 rounded-lg shadow-neo-sm font-bold text-xs uppercase cursor-default pointer-events-none">
                    🔴 Live AQI Sensors
                </div>

                {/* Selected Station Info Overlay */}
                {selectedStation && (
                    <div className="absolute bottom-4 left-4 z-[1000] bg-white border-3 border-black rounded-xl p-4 shadow-neo-sm max-w-[300px]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm truncate flex-1">{selectedStation.name}</span>
                            <button
                                onClick={() => setSelectedStation(null)}
                                className="text-gray-400 hover:text-black font-black ml-2 cursor-pointer text-lg"
                            >×</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-3xl font-black">{selectedStation.aqi}</div>
                            <div
                                className="px-3 py-1 rounded-full text-xs font-black border-2 border-black"
                                style={{ backgroundColor: selectedStation.aqiInfo.color }}
                            >
                                {selectedStation.aqiInfo.label}
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-2 font-medium">{selectedStation.aqiInfo.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-bold">
                            <Navigation size={10} />
                            {selectedStation.geo[0].toFixed(4)}, {selectedStation.geo[1].toFixed(4)}
                        </div>
                    </div>
                )}

                <MapContainer
                    center={[22.5, 78.9629]}
                    zoom={5}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <AqiTileOverlay />
                    <MapResizeFix />
                    {mapCenter && <MapFlyTo center={mapCenter} zoom={mapZoom} />}

                    {/* Marker for selected station */}
                    {selectedStation && selectedIcon && (
                        <Marker position={selectedStation.geo} icon={selectedIcon}>
                            <Popup>
                                <div className="font-sans">
                                    <strong className="text-base">{selectedStation.name}</strong>
                                    <div className="mt-1">
                                        <span className="font-bold">AQI: {selectedStation.aqi}</span>
                                        <span
                                            className="ml-2 px-2 py-0.5 rounded text-xs font-bold"
                                            style={{ backgroundColor: selectedStation.aqiInfo.color }}
                                        >
                                            {selectedStation.aqiInfo.label}
                                        </span>
                                    </div>
                                    <p className="text-xs mt-1 text-gray-600">{selectedStation.aqiInfo.description}</p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};
