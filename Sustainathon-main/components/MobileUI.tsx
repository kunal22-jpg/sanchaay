import React from 'react';
import { MobileNavbar } from './MobileNavbar';
import { Page, UserStats, ActionLog } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

// Specialized Mobile Page Views
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { Tracker } from '../pages/Tracker';
import { Education } from '../pages/Education';
import { Community } from '../pages/Community';
import { AiAssistant } from '../pages/AiAssistant';
import { Missions } from '../pages/Missions';
import { Quiz } from '../pages/Quiz';

interface MobileUIProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  stats: UserStats;
  logs: ActionLog[];
  handleLogAction: (actionName: string, xp: number, co2: number, icon: string) => void;
  handleCompleteModule: (moduleId: string, xp: number) => void;
  handleAddXpOnly: (xp: number) => void;
  handleToggleMission: (id: string, reward: number) => void;
  handleAddCustomMission: (title: string, type: 'daily' | 'weekly') => void;
  handleToggleCustomMission: (id: string, reward: number) => void;
  handleDeleteCustomMission: (id: string) => void;
  user: any;
  logout: () => void;
  setIsDemoActive: (active: boolean) => void;
}

export const MobileUI: React.FC<MobileUIProps> = ({
  currentPage, setCurrentPage, stats, logs, handleLogAction, handleCompleteModule, handleAddXpOnly, 
  handleToggleMission, handleAddCustomMission, handleToggleCustomMission, handleDeleteCustomMission,
  user, logout, setIsDemoActive
}) => {
  return (
    <div className="min-h-screen bg-[#f0fdf4] pb-24 relative overflow-x-hidden">
      {/* Scrollable Main Content */}
      <main className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              switch (currentPage) {
                case Page.HOME: return <Home setPage={setCurrentPage} />;
                case Page.DASHBOARD: return <Dashboard userStats={stats} />;
                case Page.TRACKER: return <Tracker stats={stats} logs={logs} onLogAction={handleLogAction} />;
                case Page.EDUCATION: return <Education onProgress={handleCompleteModule} completedModules={stats.completedModules} />;
                case Page.COMMUNITY: return <Community />;
                case Page.ASSISTANT: return <AiAssistant userStats={stats} />;
                case Page.MISSIONS: return (
                    <Missions 
                        stats={stats}
                        onToggleMission={handleToggleMission}
                        onAddCustomGoal={handleAddCustomMission}
                        onToggleCustomGoal={handleToggleCustomMission}
                        onDeleteCustomGoal={handleDeleteCustomMission}
                    />
                );
                case Page.QUIZ: return <Quiz onComplete={handleAddXpOnly} />;
                default: return <Home setPage={setCurrentPage} />;
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileNavbar 
        currentPage={currentPage}
        setPage={setCurrentPage}
        onLogout={logout}
        onStartDemo={() => setIsDemoActive(true)}
        user={user}
      />
    </div>
  );
};
