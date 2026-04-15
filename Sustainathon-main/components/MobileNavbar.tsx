import React from 'react';
import { Page } from '../types';
import { Home, BarChart3, Target, BookOpen, MessageSquare, Menu, X, Play } from 'lucide-react';

interface MobileNavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  onLogout: () => void;
  onStartDemo: () => void;
  user: any;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ 
  currentPage, setPage, onLogout, onStartDemo, user 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const items = [
    { id: Page.HOME, label: 'Home', icon: Home },
    { id: Page.DASHBOARD, label: 'Impact', icon: BarChart3 },
    { id: Page.TRACKER, label: 'Tracker', icon: Target },
    { id: Page.MISSIONS, label: 'Goals', icon: Target },
    { id: Page.EDUCATION, label: 'Learn', icon: BookOpen },
    { id: Page.QUIZ, label: 'Quiz', icon: BookOpen },
    { id: Page.ASSISTANT, label: 'AI', icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Top Floating Header for Mobile */}
      <div className="absolute bottom-[unset] top-[-100vh] left-0 right-0 h-16 bg-white border-b-4 border-black flex items-center justify-between px-6 shadow-neo-sm">
         <span className="font-black italic text-xl">SANCHAAY</span>
         <div className="flex items-center gap-3">
            <button onClick={onStartDemo} className="bg-neo-black text-white px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                <Play size={12} fill="currentColor" /> DEMO
            </button>
            <div className="w-8 h-8 rounded-full border-2 border-black bg-neo-yellow flex items-center justify-center font-bold text-xs">
                {user?.username?.[0]?.toUpperCase()}
            </div>
         </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-white border-t-4 border-black px-2 py-3 flex justify-around items-center mb-0 pb-safe shadow-[0_-8px_0_0_rgba(0,0,0,0.05)]">
        {items.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${currentPage === item.id ? 'text-neo-pink scale-110' : 'text-gray-400'}`}
          >
            <item.icon size={24} className={currentPage === item.id ? 'stroke-[3px]' : 'stroke-[2px]'} />
            <span className="text-[10px] font-black uppercase">{item.label}</span>
          </button>
        ))}
        <button 
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <Menu size={24} />
          <span className="text-[10px] font-black uppercase">More</span>
        </button>
      </div>

      {/* Full Screen Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-neo-black z-[101] p-8 text-white animate-in fade-in zoom-in duration-200">
           <div className="flex justify-between items-center mb-12">
              <span className="text-3xl font-black italic">MENU</span>
              <button onClick={() => setIsOpen(false)} className="bg-neo-pink p-3 border-4 border-white rounded-2xl">
                <X size={32} />
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {items.map(item => (
                <button
                    key={item.id}
                    onClick={() => { setPage(item.id); setIsOpen(false); }}
                    className={`flex items-center gap-6 p-6 rounded-3xl border-4 text-2xl font-black transition-all ${currentPage === item.id ? 'bg-neo-yellow text-black border-white' : 'bg-white/10 border-white/20'}`}
                >
                    <item.icon size={32} />
                    {item.label.toUpperCase()}
                </button>
              ))}
              <button
                onClick={onLogout}
                className="mt-8 flex items-center gap-6 p-6 rounded-3xl border-4 border-neo-pink bg-neo-pink/20 text-neo-pink text-2xl font-black"
              >
                <X size={32} /> LOGOUT
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
