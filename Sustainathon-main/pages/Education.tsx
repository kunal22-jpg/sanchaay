import React, { useState, useEffect } from 'react';
import { EDUCATION_MODULES } from '../constants';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { NeoModal } from '../components/ui/NeoModal';
import { PlayCircle, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { EducationModule } from '../types';

interface EducationProps {
  onProgress: (moduleId: string, xp: number) => void;
  completedModules: string[];
}

export const Education: React.FC<EducationProps> = ({ onProgress, completedModules }) => {
  const [modules, setModules] = useState<EducationModule[]>(() => 
    EDUCATION_MODULES.map(m => ({
      ...m,
      completed: (completedModules || []).includes(m.id)
    }))
  );

  useEffect(() => {
    setModules(prev => prev.map(m => ({
      ...m,
      completed: (completedModules || []).includes(m.id)
    })));
  }, [completedModules]);

  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);

  const completedCount = modules.filter(m => m.completed).length;
  const progressPercent = (completedCount / modules.length) * 100;

  const handleComplete = (moduleId: string) => {
    // 1. Update local state immediately for instant feedback
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, completed: true } : m
    ));
    // 2. Notify parent to sync with DB
    onProgress(moduleId, 50);
  };

  const myths = [
    { q: "Myth: Climate change is just a natural cycle.", a: "Fact: While Earth has cycles, the current warming rate is unprecedented and 100% driven by human greenhouse gas emissions." },
    { q: "Myth: One person can't make a difference.", a: "Fact: Individual actions drive market demand and policy change. Collective action is powerful!" },
    { q: "Myth: Renewable energy is too expensive.", a: "Fact: Solar and wind are now the cheapest sources of new electricity in most of the world." },
  ];

  return (
    <div className="space-y-12 pb-12 transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-neo-black text-white p-8 rounded-2xl shadow-neo border-4 border-black">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black mb-4 italic">Learn. Act. Save.</h2>
          <p className="text-xl font-medium text-gray-400">Master the science of sustainability through our curated course modules.</p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between font-bold text-sm uppercase">
             <span>Your Progress</span>
             <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-6 bg-white/20 border-2 border-white rounded-full overflow-hidden">
             <div className="h-full bg-neo-green transition-all" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-8">
           <PlayCircle className="text-neo-pink" size={32} />
           <h3 className="text-3xl font-black uppercase">Sustainability Core Courses</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod) => (
            <div key={mod.id} className="group relative">
               <div className="absolute inset-0 bg-neo-black rounded-2xl translate-x-3 translate-y-3 group-hover:translate-x-1 group-hover:translate-y-1 transition-all"></div>
               <div className={`relative bg-white border-4 border-neo-black rounded-2xl p-6 h-full flex flex-col ${mod.completed ? 'bg-green-50/50' : ''}`}>
                 <div className="flex justify-between items-start mb-4">
                    <span className="bg-neo-yellow px-3 py-1 border-2 border-black rounded font-black text-xs uppercase">{mod.category}</span>
                    <span className="text-xs font-bold text-gray-500">{mod.readTime}</span>
                 </div>
                 <h4 className="text-2xl font-black mb-3">{mod.title}</h4>
                 <p className="font-medium text-gray-600 mb-6 flex-1">{mod.description}</p>
                 
                 <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-black/5">
                    <NeoButton 
                      size="sm" 
                      variant={mod.completed ? 'outline' : 'primary'} 
                      onClick={() => setSelectedModule(mod)}
                    >
                      {mod.completed ? 'Review Content' : 'Start Lesson'}
                    </NeoButton>
                    {mod.completed && <CheckCircle className="text-neo-green scale-125" />}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neo-blue/10 p-12 rounded-[40px] border-4 border-neo-blue shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]">
        <h3 className="text-3xl font-black mb-8 text-center text-neo-blue uppercase tracking-tighter italic">Climate Myth Busters</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {myths.map((item, idx) => (
            <div 
              key={idx} 
              className="h-72 cursor-pointer perspective-1000 group"
              onClick={() => setFlippedCard(flippedCard === idx ? null : idx)}
            >
              <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${flippedCard === idx ? 'rotate-y-180' : ''}`}>
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full bg-neo-pink border-4 border-black rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-neo group-hover:-translate-y-1 transition-transform">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤔</div>
                    <h4 className="text-xl font-black leading-tight">{item.q}</h4>
                  </div>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="h-full bg-neo-green border-4 border-black rounded-2xl flex items-center justify-center text-center p-8 shadow-neo">
                    <h4 className="text-lg font-bold italic">"{item.a}"</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NeoModal
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        title={selectedModule?.title || ''}
        size="4xl"
      >
        {selectedModule && (() => {
          const currentMod = modules.find(m => m.id === selectedModule.id) || selectedModule;
          return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bento Cell 1: Video Player (Large) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-black shadow-neo-sm bg-black group">
                {currentMod.videoUrl ? (
                  <iframe
                    src={currentMod.videoUrl}
                    title={currentMod.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 italic font-bold">
                    Video Loading...
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-neo-pink text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-black">
                  Live Lesson Video
                </div>
              </div>
            </div>

            {/* Bento Cell 2: Quick Fact (Side) */}
            <div className="space-y-4">
               <div className="h-full bg-neo-blue/10 border-4 border-neo-blue rounded-2xl p-6 shadow-neo-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-neo-blue/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="text-4xl mb-4 animate-bounce">💡</div>
                  <h5 className="text-xs font-black uppercase tracking-tighter text-neo-blue mb-2 italic underline decoration-Wavy">Did you know?</h5>
                  <p className="text-sm font-bold leading-relaxed text-blue-900">
                    {currentMod.fact || "Every small action counts towards a bigger global impact!"}
                  </p>
               </div>
            </div>

            {/* Bento Cell 3: Main Text Content (Full Width) */}
            <div className="lg:col-span-3">
               <div className="prose prose-lg md:prose-xl max-w-none w-full bg-white p-6 md:p-10 rounded-3xl border-4 border-black shadow-neo-sm break-words relative overflow-hidden whitespace-normal">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -z-10 rounded-bl-[100px]"></div>
                  <ReactMarkdown>
                    {currentMod.content.split('\n').map(line => line.trimStart()).join('\n')}
                  </ReactMarkdown>
                  
                  <div className="mt-12 p-8 bg-neo-yellow/30 border-4 border-neo-yellow rounded-3xl text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                     <div className="relative z-10">
                        <p className="font-black text-2xl mb-6 italic uppercase tracking-tighter">Lesson Finished! Ready to claim your points?</p>
                        {!currentMod.completed ? (
                        <NeoButton onClick={() => handleComplete(currentMod.id)} variant="primary" size="lg" className="w-full md:w-auto transform hover:scale-105 active:scale-95 transition-all">
                           Mark as Complete (+50 XP)
                        </NeoButton>
                        ) : (
                        <div className="flex flex-col items-center gap-3 animate-bounce">
                           <div className="w-16 h-16 bg-neo-green rounded-full flex items-center justify-center border-4 border-black text-white">
                              <CheckCircle size={32} strokeWidth={3} />
                           </div>
                           <p className="font-black text-2xl text-neo-green uppercase italic tracking-tighter">Reward Claimed! +50 XP</p>
                        </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )})()}
      </NeoModal>
    </div>
  );
};