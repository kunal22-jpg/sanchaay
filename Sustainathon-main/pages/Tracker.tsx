import React, { useState } from 'react';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { NeoModal } from '../components/ui/NeoModal';
import { Plus, History, Leaf, TrendingUp, Cpu, Sparkles, Loader2, Database } from 'lucide-react';
import { ActionLog, UserStats } from '../types';
import axios from 'axios';

interface TrackerProps {
  stats: UserStats;
  logs: ActionLog[];
  onLogAction: (actionName: string, xp: number, co2: number, icon: string) => void;
}

export const Tracker: React.FC<TrackerProps> = ({ stats, logs, onLogAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [aiPredicting, setAiPredicting] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [manualKg, setManualKg] = useState('');
  const [manualExplanation, setManualExplanation] = useState('');
  const [prediction, setPrediction] = useState<{ kg: number, explanation: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!customAction.trim()) return;
    setAiPredicting(true);
    setPrediction(null);
    setError(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/predict-co2`, { activity: customAction });
      if (res.data.error) {
        throw new Error(res.data.details || 'AI Error');
      }
      setPrediction(res.data);
    } catch (err: any) {
      console.error('AI Prediction error', err);
      setError('AI is unavailable right now. Try Manual Entry instead!');
    } finally {
      setAiPredicting(false);
    }
  };

  const handleLogCustom = () => {
    if (isManual) {
      if (!customAction || !manualKg) return;
      onLogAction(customAction, Math.round(Number(manualKg) * 10), Number(manualKg), '📝');
      resetModal();
    } else if (prediction) {
      onLogAction(customAction, Math.round(prediction.kg * 10), prediction.kg, '✨');
      resetModal();
    }
  };

  const resetModal = () => {
      setIsModalOpen(false);
      setCustomAction('');
      setPrediction(null);
      setIsManual(false);
      setManualKg('');
      setManualExplanation('');
      setError(null);
  };

  const quickActions = [
    { name: 'Used Public Transport', xp: 50, co2: 2.1, icon: '🚌' },
    { name: 'Plant-Based Meal', xp: 30, co2: 0.8, icon: '🥗' },
    { name: 'Biked to Work', xp: 80, co2: 1.5, icon: '🚲' },
    { name: 'Avoided Single-use Plastic', xp: 20, co2: 0.2, icon: '♻️' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Impact Tracker</h2>
          <p className="text-gray-500 font-bold">Log actions and calculate your verified CO₂ offset.</p>
        </div>
        <NeoButton onClick={() => setIsModalOpen(true)} size="lg" className="shadow-neo scale-110">
          <Plus size={24} /> Log Custom Action
        </NeoButton>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {quickActions.map(action => (
          <NeoCard key={action.name} color="white" className="group cursor-pointer hover:-translate-y-1 transition-transform border-neo-pink/30 hover:border-neo-pink">
            <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{action.icon}</div>
            <h3 className="font-black text-lg mb-2 leading-tight">{action.name}</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-neo-green">+{action.xp} XP</span>
              <span className="font-bold text-gray-500">{action.co2}kg CO₂</span>
            </div>
            <NeoButton 
              size="sm" 
              className="w-full mt-4" 
              onClick={() => onLogAction(action.name, action.xp, action.co2, action.icon)}
            >
              Quick Log
            </NeoButton>
          </NeoCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <History className="text-neo-blue" />
            <h3 className="text-2xl font-black uppercase italic tracking-widest">Action History</h3>
            <div className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
               <Database size={12} /> Synced with MongoDB
            </div>
          </div>
          
          <div className="space-y-4">
            {logs.length === 0 ? (
                <div className="p-12 text-center border-4 border-dashed border-gray-200 rounded-3xl font-bold text-gray-400">
                    No actions logged yet. Start saving the planet!
                </div>
            ) : logs.map(log => (
              <div key={log.id} className="bg-white border-4 border-black p-4 rounded-2xl flex items-center justify-between shadow-neo-sm hover:translate-x-1 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neo-green/10 rounded-full flex items-center justify-center text-2xl border-2 border-neo-green/20">
                    {log.icon || '🍃'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black italic uppercase leading-none mb-1 truncate">{log.type}</h4>
                    <span className="text-xs font-bold text-gray-400 uppercase">{log.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-neo-green">+{log.xpReward} XP</div>
                  <div className="text-xs font-bold uppercase text-gray-500">{log.co2Impact}kg saved</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-neo-yellow" />
            <h3 className="text-2xl font-black uppercase italic tracking-widest">Impact Summary</h3>
          </div>
          <NeoCard color="blue" className="text-white !p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={20} className="text-neo-green" />
              <span className="font-black uppercase tracking-widest text-xs opacity-70">Total CO₂ Offset</span>
            </div>
            <div className="text-6xl font-black mb-2 italic">{stats.co2Saved.toFixed(1)}</div>
            <div className="text-lg font-bold opacity-80 uppercase tracking-tighter">Kilograms Saved YTD</div>
            
            <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
               <div>
                  <div className="text-sm font-bold opacity-60">Global Rank</div>
                  <div className="text-xl font-black">#1,240</div>
               </div>
               <div>
                  <div className="text-sm font-bold opacity-60">Streak</div>
                  <div className="text-xl font-black">{stats.streak} Days</div>
               </div>
            </div>
          </NeoCard>
          
          <NeoCard color="white" className="border-neo-yellow border-4">
             <div className="flex items-center gap-2 mb-4 text-neo-yellow">
               <TrendingUp size={20} />
               <span className="font-black uppercase tracking-widest text-xs">Sustainability Goal</span>
             </div>
             <p className="font-bold text-gray-600 mb-4">You are {Math.max(0, 100 - stats.co2Saved).toFixed(0)}kg away from your monthly goal of 100kg!</p>
             <div className="h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-black">
                <div className="h-full bg-neo-yellow" style={{ width: `${Math.min(100, stats.co2Saved)}%` }}></div>
             </div>
          </NeoCard>
        </div>
      </div>

      <NeoModal
        isOpen={isModalOpen}
        onClose={resetModal}
        title={isManual ? "Manual Impact Entry" : "Predict CO₂ Impact"}
      >
        <div className="space-y-6">
          {!isManual ? (
            <>
              <div>
                <label className="block font-black uppercase text-xs mb-2">What did you do?</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    className="flex-1 border-4 border-black rounded-xl p-4 font-bold focus:outline-none focus:ring-4 ring-neo-blue"
                    placeholder="e.g. Recycled 5 aluminum cans"
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                  />
                  <NeoButton onClick={handlePredict} disabled={aiPredicting} className="whitespace-nowrap">
                    {aiPredicting ? <Loader2 className="animate-spin" /> : <Cpu size={20} />} AI Predict
                  </NeoButton>
                </div>
                {error && <p className="text-neo-pink font-bold mt-2 text-sm">{error}</p>}
              </div>

              {prediction && (
                <div className="bg-neo-blue/10 border-4 border-neo-blue p-6 rounded-2xl animate-bounce-in">
                  <div className="flex items-center gap-2 mb-3 text-neo-blue">
                    <Sparkles size={20} />
                    <span className="font-black uppercase italic tracking-widest">Scientific Analysis Result</span>
                  </div>
                  <div className="text-5xl font-black mb-3">{prediction.kg} <span className="text-xl">kg CO₂</span></div>
                  <p className="font-bold text-gray-700 leading-relaxed italic">"{prediction.explanation}"</p>
                  
                  <NeoButton onClick={handleLogCustom} color="blue" className="w-full mt-6 shadow-none">
                    Accept Prediction & Log Action
                  </NeoButton>
                </div>
              )}

              <div className="pt-4 border-t-2 border-dashed border-gray-200 text-center">
                 <button 
                  onClick={() => setIsManual(true)}
                  className="text-xs font-black uppercase text-gray-400 hover:text-neo-blue transition-colors underline underline-offset-4"
                 >
                   Cannot use AI? Switch to Manual Entry
                 </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
               <div>
                  <label className="block font-black uppercase text-xs mb-2">Action Name</label>
                  <input 
                    className="w-full border-4 border-black rounded-xl p-4 font-bold focus:outline-none"
                    placeholder="e.g. Composted kitchen waste"
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase text-xs mb-2">CO₂ Impact (kg)</label>
                    <input 
                      type="number"
                      className="w-full border-4 border-black rounded-xl p-4 font-bold focus:outline-none"
                      placeholder="e.g. 5.5"
                      value={manualKg}
                      onChange={(e) => setManualKg(e.target.value)}
                    />
                  </div>
                  <div>
                     <label className="block font-black uppercase text-xs mb-2">Scientific Basis</label>
                     <input 
                      className="w-full border-4 border-black rounded-xl p-4 font-bold focus:outline-none"
                      placeholder="Optional explanation"
                      value={manualExplanation}
                      onChange={(e) => setManualExplanation(e.target.value)}
                    />
                  </div>
               </div>
               <div className="pt-4 flex flex-col gap-3">
                  <NeoButton onClick={handleLogCustom} color="green" className="w-full">
                    Log Action (+{Math.round(Number(manualKg) * 10) || 0} XP)
                  </NeoButton>
                  <button 
                    onClick={() => setIsManual(false)}
                    className="text-xs font-black uppercase text-gray-400 hover:text-neo-pink transition-colors"
                  >
                    ← Back to AI Predict
                  </button>
               </div>
            </div>
          )}
        </div>
      </NeoModal>
    </div>
  );
};