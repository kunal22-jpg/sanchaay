import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, FastForward, Info } from 'lucide-react';
import { NeoButton } from './ui/NeoButton';

interface DemoControllerProps {
  onNavigate: (page: Page) => void;
  onLogAction: (action: string, xp: number, co2: number, icon: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({ onNavigate, onLogAction, isActive, setIsActive }) => {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");

  const steps = [
    { 
      msg: "Welcome to Sustain-a-thon! Let's start at the Dashboard.", 
      action: () => onNavigate(Page.DASHBOARD),
      delay: 3000 
    },
    { 
      msg: "Here we see real-time data. Look at the Global Temp rise.", 
      action: () => {}, 
      delay: 4000 
    },
    { 
      msg: "Now, let's track a new action. Switching to Tracker...", 
      action: () => onNavigate(Page.TRACKER), 
      delay: 3000 
    },
    { 
      msg: "Simulating: 'Biked to School' (+100 XP)", 
      action: () => onLogAction("Biked to School", 100, 2.5, "🚲"), 
      delay: 4000 
    },
    { 
      msg: "Education is key. Explore climate modules in 'Learn'.", 
      action: () => onNavigate(Page.EDUCATION), 
      delay: 3500 
    },
    { 
      msg: "Wait! We just unlocked a badge! Check the notification.", 
      action: () => {}, 
      delay: 3000 
    },
    { 
      msg: "Need help? Our AI Assistant is always ready.", 
      action: () => onNavigate(Page.ASSISTANT), 
      delay: 3000 
    },
    { 
      msg: "And finally, test your knowledge in the Eco-Quiz. Zero reloads!", 
      action: () => onNavigate(Page.QUIZ), 
      delay: 3500 
    },
    { 
      msg: "Complete Weekly Missions for massive XP boosts.", 
      action: () => onNavigate(Page.MISSIONS), 
      delay: 3000 
    },
    { 
      msg: "Demo Finished. You're ready to pitch Sanchaay! 🚀", 
      action: () => setIsActive(false), 
      delay: 2000 
    }
  ];

  useEffect(() => {
    let timeout: any;
    if (isActive && step < steps.length) {
      setMessage(steps[step].msg);
      steps[step].action();
      
      timeout = setTimeout(() => {
        setStep(prev => prev + 1);
      }, steps[step].delay);
    }
    return () => clearTimeout(timeout);
  }, [isActive, step]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] w-[90%] max-w-sm">
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        className="bg-neo-black text-white p-6 rounded-2xl border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-black text-neo-yellow">
            <Play size={20} fill="currentColor" />
            PITCH DEMO ACTIVE
          </div>
          <button onClick={() => setIsActive(false)} className="hover:text-neo-pink transition-colors">
            <Square size={20} fill="currentColor" />
          </button>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl border-2 border-white/20 mb-4 h-20 flex items-center justify-center text-center">
          <p className="text-lg font-bold">"{message}"</p>
        </div>

        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-neo-green h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};
