import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Tracker } from './pages/Tracker';
import { Education } from './pages/Education';
import { Community } from './pages/Community';
import { AiAssistant } from './pages/AiAssistant';
import { Missions } from './pages/Missions';
import { Quiz } from './pages/Quiz';
import { Loader } from './components/ui/Loader';
import { DemoController } from './components/DemoController';
import { Page, UserStats, ActionLog } from './types';
import { INITIAL_USER_STATS, RECENT_LOGS } from './constants';
import { AnimatePresence, motion } from 'framer-motion';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import { MobileUI } from './components/MobileUI';

const CarbonClock = () => {
  // Target: Jan 1, 2026
  // Rate: 1,185.3 tonnes/second (IEA 2024 Global Trend)
  const START_DATE = new Date('2026-01-01T00:00:00Z').getTime();
  const EMISSION_RATE = 1185.3;

  const calculateEmissions = () => {
    const secondsPassed = (Date.now() - START_DATE) / 1000;
    return secondsPassed * EMISSION_RATE;
  };

  const [emissions, setEmissions] = useState(calculateEmissions());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEmissions(calculateEmissions());
    }, 100); // Faster update for smooth ticker
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-2xl font-black font-mono">
      {Math.floor(emissions).toLocaleString()} <span className="text-sm">TONS YTD (2026)</span>
    </span>
  );
};

function App() {
  const { isAuthenticated, user, logout, syncStats } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // Stats state
  const [stats, setStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [logs, setLogs] = useState<ActionLog[]>(RECENT_LOGS);

  const getCleanStats = (s: UserStats): UserStats => {
    return {
      xp: s.xp,
      level: s.level,
      co2Saved: s.co2Saved,
      streak: s.streak,
      badges: s.badges || [],
      completedModules: s.completedModules || [],
      completedMissions: s.completedMissions || [],
      customMissions: s.customMissions || [],
      logs: s.logs || []
    };
  };

  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // DATA ISOLATION GUARD: Reset state when switching users or logging out
  useEffect(() => {
    if (!user) {
      setStats(INITIAL_USER_STATS);
      setLogs(RECENT_LOGS);
      setIsInitialLoadDone(false);
      localStorage.removeItem('sanchaay_stats_fallback');
    } else {
      // If we have a new user but hydration isn't triggered, reset lock
      setIsInitialLoadDone(false);
    }
  }, [user?.username]); 

  useEffect(() => {
    if (user && isAuthenticated && !isInitialLoadDone) {
      // Hydrate state from user object (Source of Truth - ONLY ONCE PER LOGIN)
      const hydratedStats = getCleanStats(user);
      setStats(hydratedStats);
      setIsInitialLoadDone(true);

      // Sync Logs State
      if (user.logs && user.logs.length > 0) {
        setLogs(user.logs);
      }
    }
  }, [user, isAuthenticated, isInitialLoadDone]);

  // LOCAL STORAGE FALLBACK - Safety Net for Pitch
  useEffect(() => {
    if (isInitialLoadDone) {
        localStorage.setItem('sanchaay_stats_fallback', JSON.stringify(stats));
    }
  }, [stats, isInitialLoadDone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handleLogAction = (actionName: string, xp: number, co2: number, icon: string) => {
    const newLog: ActionLog = {
      id: Date.now().toString(),
      type: actionName,
      co2Impact: co2,
      xpReward: xp,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      icon
    };
    
    setLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      setStats(prevStats => {
        const nextStats = { 
            ...prevStats, 
            xp: prevStats.xp + xp, 
            level: Math.floor((prevStats.xp + xp) / 1000) + 1,
            co2Saved: prevStats.co2Saved + co2,
            logs: updatedLogs
        };
        if (isAuthenticated) {
          syncStats(getCleanStats(nextStats));
        }
        return nextStats;
      });
      return updatedLogs;
    });
  };

  const handleAddXpOnly = (xp: number) => {
    setStats(prev => {
        const nextXp = prev.xp + xp;
        const nextStats = { 
            ...prev, 
            xp: nextXp, 
            level: Math.floor(nextXp / 1000) + 1 
        };
        if (isAuthenticated) {
          syncStats(getCleanStats(nextStats));
        }
        return nextStats;
    });
  };

  const handleCompleteModule = (moduleId: string, xp: number) => {
    setStats(prev => {
        if (prev.completedModules.includes(moduleId)) return prev;
        const nextCompleted = [...prev.completedModules, moduleId];
        const nextXp = prev.xp + xp;
        const nextStats = {
          ...prev,
          xp: nextXp,
          level: Math.floor(nextXp / 1000) + 1,
          completedModules: nextCompleted
        };
        if (isAuthenticated) {
          syncStats(getCleanStats(nextStats));
        }
        return nextStats;
    });
  };

  const handleToggleMission = (id: string, rewardValue: number) => {
    setStats(prev => {
        const isDone = prev.completedMissions.includes(id);
        const nextMissions = isDone 
            ? prev.completedMissions.filter(mId => mId !== id)
            : [...prev.completedMissions, id];
        const nextXp = isDone ? prev.xp : prev.xp + rewardValue;
        const nextStats = {
            ...prev,
            xp: nextXp,
            level: Math.floor(nextXp / 1000) + 1,
            completedMissions: nextMissions
        };
        if (isAuthenticated) {
          syncStats(getCleanStats(nextStats));
        }
        return nextStats;
    });
  };

  const handleAddCustomMission = (title: string, type: 'daily' | 'weekly') => {
    const newMission = {
      id: Date.now().toString(),
      title,
      type,
      completed: false
    };
    setStats(prev => {
        const nextStats = {
            ...prev,
            customMissions: [newMission, ...(prev.customMissions || [])]
        };
        if (isAuthenticated) {
          syncStats(getCleanStats(nextStats));
        }
        return nextStats;
    });
  };

  const handleToggleCustomMission = (id: string, rewardValue: number) => {
    setStats(prev => {
        let xpGained = 0;
        const nextCustom = (prev.customMissions || []).map(m => {
            if (m.id === id) {
                if (!m.completed) xpGained = rewardValue;
                return { ...m, completed: !m.completed };
            }
            return m;
        });
        const nextXp = prev.xp + xpGained;
        const nextStats = {
            ...prev,
            xp: nextXp,
            level: Math.floor(nextXp / 1000) + 1,
            customMissions: nextCustom
        };
        if (isAuthenticated) {
          syncStats(getCleanStats(nextStats));
        }
        return nextStats;
    });
  };

  const handleDeleteCustomMission = (id: string) => {
    setStats(prev => {
        const nextStats = {
            ...prev,
            customMissions: (prev.customMissions || []).filter(m => m.id !== id)
        };
        if (isAuthenticated) syncStats(getCleanStats(nextStats));
        return nextStats;
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-neo-black selection:bg-neo-pink selection:text-white pb-8">
      {!isAuthenticated ? (
        <Login />
      ) : isMobile ? (
        <MobileUI 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            stats={stats}
            logs={logs}
            handleLogAction={handleLogAction}
            handleCompleteModule={handleCompleteModule}
            handleAddXpOnly={handleAddXpOnly}
            handleToggleMission={handleToggleMission}
            handleAddCustomMission={handleAddCustomMission}
            handleToggleCustomMission={handleToggleCustomMission}
            handleDeleteCustomMission={handleDeleteCustomMission}
            user={user}
            logout={logout}
            setIsDemoActive={setIsDemoActive}
        />
      ) : (
        <>
          <Navbar 
            currentPage={currentPage} 
            setPage={setCurrentPage} 
            onStartDemo={() => setIsDemoActive(true)} 
            onLogout={logout}
            user={user}
          />
          <DemoController 
            isActive={isDemoActive} 
            setIsActive={setIsDemoActive} 
            onNavigate={setCurrentPage}
            onLogAction={handleLogAction}
          />
          <main className="max-w-7xl mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
          
          <footer className="mt-12 bg-neo-black text-white p-6 border-t-4 border-neo-pink">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                <span className="font-black italic uppercase tracking-widest text-neo-pink">Live Global CO₂ Emissions:</span>
                <CarbonClock />
              </div>
              <div className="text-xs font-bold text-gray-500">
                Data Source: NOAA / Global Carbon Project (Simulated Real-time)
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;