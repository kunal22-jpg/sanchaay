import React, { useState } from 'react';
import { MISSIONS } from '../constants';
import { NeoCard } from '../components/ui/NeoCard';
import { CheckCircle2, Circle, Share2, Plus, Trash2, Calendar, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CustomMission } from '../types';
import { NeoButton } from '../components/ui/NeoButton';

interface MissionsProps {
  stats: any;
  onToggleMission: (id: string, reward: number) => void;
  onAddCustomGoal: (title: string, type: 'daily' | 'weekly') => void;
  onToggleCustomGoal: (id: string, reward: number) => void;
  onDeleteCustomGoal: (id: string) => void;
}

export const Missions: React.FC<MissionsProps> = ({ 
  stats, onToggleMission, onAddCustomGoal, onToggleCustomGoal, onDeleteCustomGoal 
}) => {
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionType, setNewMissionType] = useState<'daily' | 'weekly'>('daily');

  const customMissions: CustomMission[] = stats?.customMissions || [];
  const completedMissions: string[] = stats?.completedMissions || [];

  const handleAddGoal = () => {
    if (!newMissionTitle.trim()) return;
    onAddCustomGoal(newMissionTitle, newMissionType);
    setNewMissionTitle('');
  };

  const handleShare = (missionTitle: string) => {
    const text = `I just completed the "${missionTitle}" mission on Sanchaay! 🌿 #FixTheFuture`;
    if (navigator.share) {
      navigator.share({ title: 'Mission Accomplished!', text, url: window.location.href }).catch(console.error);
    } else {
      alert(`Share this achievement:\n\n"${text}"`);
    }
  };


  return (
    <div className="space-y-12 pb-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Official Missions</h2>
        <p className="text-xl text-gray-600 font-bold italic">Complete global challenges to earn massive XP boosts.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MISSIONS.map((mission) => {
          const isDone = completedMissions.includes(mission.id);
          return (
            <NeoCard 
              key={mission.id} 
              color={isDone ? 'green' : 'white'}
              className="group hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded border-2 border-black ${mission.type === 'weekly' ? 'bg-neo-pink text-white' : 'bg-neo-blue text-white'}`}>
                      {mission.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-black uppercase text-gray-400">+{mission.rewardXP} XP</span>
                  </div>
                  <h3 className={`text-2xl font-black mb-2 leading-tight ${isDone ? 'line-through opacity-40' : ''}`}>
                    {mission.title}
                  </h3>
                  <p className="font-bold text-gray-500 text-sm">{mission.description}</p>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <button onClick={() => onToggleMission(mission.id, mission.rewardXP)} className="hover:scale-110 transition-transform">
                    {isDone ? <CheckCircle2 size={36} className="fill-neo-green text-black" /> : <Circle size={36} className="text-gray-200 hover:text-neo-green" />}
                  </button>
                  {isDone && (
                    <button onClick={() => handleShare(mission.title)} className="bg-neo-black text-white p-2 rounded-lg border-2 border-neo-black hover:bg-white hover:text-black transition-all">
                      <Share2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </NeoCard>
          );
        })}
      </div>


      {/* Custom Goals Section */}
      <div className="space-y-8 pt-8 border-t-4 border-black border-dashed">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">My Personal Goals</h2>
            <p className="text-gray-500 font-bold">Define your own path to sustainability.</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-2 bg-white p-2 rounded-2xl border-4 border-black shadow-neo-sm">
            <input 
              type="text" 
              placeholder="E.g. Use cloth bags..." 
              className="flex-1 md:w-64 px-4 py-2 font-bold focus:outline-none"
              value={newMissionTitle}
              onChange={(e) => setNewMissionTitle(e.target.value)}
            />
            <select 
              className="px-2 font-black uppercase text-xs border-x-2 border-gray-100"
              value={newMissionType}
              onChange={(e) => setNewMissionType(e.target.value as 'daily' | 'weekly')}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <NeoButton size="sm" onClick={handleAddGoal}>
               <Plus size={18} /> Add Goal
            </NeoButton>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {customMissions.length === 0 ? (
            <div className="md:col-span-2 p-12 text-center bg-gray-50 border-4 border-dashed border-gray-200 rounded-3xl font-black text-gray-300 italic">
              "Every big change starts with a small personal goal. Add your first one above!"
            </div>
          ) : (
            customMissions.map((m) => (
              <div key={m.id} className={`p-4 border-4 border-black rounded-2xl flex items-center justify-between transition-all ${m.completed ? 'bg-neo-yellow/20' : 'bg-white shadow-neo-sm'}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => onToggleCustomGoal(m.id, 50)}>
                    {m.completed ? <CheckCircle2 size={28} className="text-neo-green" /> : <Circle size={28} className="text-gray-200" />}
                  </button>
                  <div>
                    <div className={`font-black uppercase italic ${m.completed ? 'line-through opacity-30 text-gray-400' : ''}`}>{m.title}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                      <Calendar size={10} /> {m.type}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteCustomGoal(m.id)}
                  className="p-2 text-gray-300 hover:text-neo-pink transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};