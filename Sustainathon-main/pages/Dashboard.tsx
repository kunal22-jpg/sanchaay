import React, { useState, useEffect, useCallback } from 'react';
import { NeoCard } from '../components/ui/NeoCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Info, Wind, MapPin, Activity, Map as MapIcon, Trees, LocateFixed, Wifi, Search, RefreshCw } from 'lucide-react';
import { UserStats } from '../types';
import { fetchRealTimeAqi, AqiData, getAqiLevel } from '../services/envService';
import { LiveMap } from '../components/LiveMap';
import { motion } from 'framer-motion';

interface DashboardProps {
  userStats: UserStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ userStats }) => {
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationSource, setLocationSource] = useState<'gps' | 'ip' | 'manual'>('ip');

  const fetchWithGPS = useCallback(async () => {
    setLoading(true);
    return new Promise<boolean>((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`[AQI] GPS coords: ${latitude}, ${longitude}`);
          const data = await fetchRealTimeAqi(`geo:${latitude};${longitude}`);
          if (data.city !== 'Unavailable') {
            setAqiData(data);
            setLocationSource('gps');
            setLoading(false);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        () => {
          console.log('[AQI] GPS permission denied or timed out');
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  const fetchWithIP = useCallback(async () => {
    setLoading(true);
    const data = await fetchRealTimeAqi('here');
    setAqiData(data);
    setLocationSource('ip');
    setLoading(false);
  }, []);

  // Initial load: try GPS first, then fall back to IP
  useEffect(() => {
    const init = async () => {
      const gpsSuccess = await fetchWithGPS();
      if (!gpsSuccess) {
        await fetchWithIP();
      }
    };
    init();
  }, [fetchWithGPS, fetchWithIP]);

  const handleMapStationSelect = (data: AqiData) => {
    setAqiData(data);
    setLocationSource('manual');
    // The user is already at the map when selecting, so no scroll needed here
  };

  const handleScrollToSearch = () => {
    const searchBar = document.getElementById('map-search-input');
    if (searchBar) {
      searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Short delay to allow scroll to complete before focusing
      setTimeout(() => {
        searchBar.focus();
      }, 500);
    }
  };

  const tempData = [
    { year: '2020', temp: 0.9 },
    { year: '2021', temp: 0.95 },
    { year: '2022', temp: 1.0 },
    { year: '2023', temp: 1.1 },
    { year: '2024', temp: 1.15 },
    { year: '2025', temp: 1.2 },
  ];

  const impactData = [
    { name: 'Transport', value: 400 + Math.random() * 50 },
    { name: 'Energy', value: 300 + Math.random() * 30 },
    { name: 'Diet', value: 300 + Math.random() * 20 },
    { name: 'Waste', value: 200 + Math.random() * 40 },
  ];

  const aqiInfo = aqiData ? getAqiLevel(aqiData.aqi) : null;
  const locationLabel = locationSource === 'gps' ? '📍 GPS Location' : locationSource === 'manual' ? '🔍 Manual Selection' : '🌐 IP-Based (approx.)';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold mb-2 text-neo-black">Impact Dashboard</h2>
          <p className="text-lg font-medium text-gray-600">Real-time environmental metrics.</p>
        </div>
        <div className="bg-neo-green px-4 py-2 border-2 border-neo-black rounded-lg font-bold shadow-neo-sm flex items-center gap-2">
          <Activity size={18} className="animate-pulse" />
          Live Data Sync Active
        </div>
      </div>

      {/* Live India Map Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <MapIcon size={24} className="text-neo-green" />
           <h3 className="text-2xl font-black italic uppercase">India Environmental Live Feed</h3>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
              <LiveMap onStationSelect={handleMapStationSelect} />
           </div>
           <div className="space-y-4">
              <NeoCard color="white" className="h-full flex flex-col justify-center">
                 {/* Location source badge */}
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-neo-green">
                       <Wind size={20} />
                       <span className="font-bold uppercase tracking-wider text-sm">Local Snapshot</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-black/5 text-gray-500">
                      {locationLabel}
                    </span>
                 </div>

                 {/* City name */}
                 <div className="font-bold text-gray-600 mb-2 text-sm">
                    {loading ? 'Detecting location...' : aqiData?.city || 'Unknown'}
                 </div>

                 {/* AQI value */}
                 <div className="text-7xl font-black mb-2">
                    {loading ? '--' : (aqiData?.aqi && aqiData.aqi > 0 ? aqiData.aqi : (aqiData?.aqi === 0 ? '0' : '--'))}
                 </div>
                 <div className="px-3 py-1 rounded-full font-bold inline-block text-sm mb-4 border-2 border-white shadow-neo-sm" style={{ backgroundColor: aqiInfo?.color, color: 'black' }}>
                    {aqiInfo?.label || 'Loading...'}
                 </div>
                 <p className="text-sm font-medium text-gray-700 leading-relaxed mb-4">
                    {aqiInfo?.description || 'Retrieving local air quality data...'}
                 </p>

                 {/* Action buttons */}
                 <div className="flex flex-wrap gap-2 mt-auto">
                    <button
                       onClick={fetchWithGPS}
                       className="flex items-center gap-1.5 px-3 py-2 bg-neo-blue/10 hover:bg-neo-blue/20 text-neo-blue border-2 border-neo-blue/30 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer"
                    >
                       <LocateFixed size={14} /> Use My GPS
                    </button>
                    <button
                       onClick={handleScrollToSearch}
                       className="flex items-center gap-1.5 px-3 py-2 bg-neo-pink/10 hover:bg-neo-pink/20 text-neo-pink border-2 border-neo-pink/30 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer"
                    >
                       <Search size={14} /> Pick City Above
                    </button>
                    <button
                       onClick={fetchWithIP}
                       className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 border-2 border-gray-200 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer"
                    >
                       <RefreshCw size={14} /> Refresh
                    </button>
                 </div>

                 {/* Source info */}
                 {locationSource === 'ip' && !loading && (
                    <p className="text-[10px] text-gray-400 mt-3 font-bold">
                       ⚠️ Using IP-based location (may be inaccurate). Click "Use My GPS" and allow location access for precise AQI.
                    </p>
                 )}
              </NeoCard>
           </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Global Temp Graph */}
        <NeoCard className="h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Global Temp Rise (°C)
              <div className="group relative">
                <Info size={16} className="text-gray-500 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-black text-white text-xs p-2 rounded z-10 font-normal">
                  Anomaly relative to 1951-1980 average.
                </div>
              </div>
            </h3>
          </div>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{fontFamily: 'inherit'}} />
                <YAxis tick={{fontFamily: 'inherit'}} />
                <Tooltip 
                  contentStyle={{ border: '3px solid black', borderRadius: '12px', boxShadow: '6px 6px 0px 0px black', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="#fee2e2" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NeoCard>

        {/* CO2 Savings Breakdown */}
        <NeoCard className="h-[400px] flex flex-col" color="white">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Community Impact (kg CO₂)</h3>
          </div>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fontFamily: 'inherit'}} />
                <YAxis tick={{fontFamily: 'inherit'}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ border: '3px solid black', borderRadius: '12px', boxShadow: '6px 6px 0px 0px black', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#4ade80" stroke="#000" strokeWidth={3} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeoCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <NeoCard color="blue" className="text-center py-6">
            <div className="text-3xl font-black mb-1">1,240</div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/80">Trees Planted</div>
         </NeoCard>
         <NeoCard color="pink" className="text-center py-6">
            <div className="text-3xl font-black mb-1">45.2k</div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/80">Plastic Saved</div>
         </NeoCard>
         <NeoCard color="yellow" className="text-center py-6">
            <div className="text-3xl font-black mb-1">890</div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/60">Active Missions</div>
         </NeoCard>
         <NeoCard color="green" className="text-center py-6">
            <div className="text-3xl font-black mb-1">{userStats.streak}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/60">Day Streak 🔥</div>
         </NeoCard>
      </div>
    </div>
  );
};