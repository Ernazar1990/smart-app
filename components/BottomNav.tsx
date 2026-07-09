
import React from 'react';
import { AppView, UserProgress } from '../types';
import { LayoutGrid, School, GraduationCap, Bot, Map } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user?: UserProgress;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, user }) => {
  const tabs = [
    { id: 'home', icon: LayoutGrid, label: 'Басты бет' },
    { id: 'roadmap', icon: Map, label: 'Жоспар' },
    { id: 'uni-list', icon: School, label: 'ЖОО' },
    { id: 'subject-selection', icon: GraduationCap, label: 'Мамандық' },
    { id: 'ai-tools-hub', icon: Bot, label: 'AI Хаб' },
  ];

  if (user?.isAdmin) {
    tabs.push({ id: 'admin-home', icon: LayoutGrid, label: 'Админ' } as any);
  }

  return (
    <div className="relative w-full md:w-auto">
      {/* Background with glass effect and stronger shadow */}
      <div className="absolute inset-0 bg-warm-paper/90 dark:bg-warm-950/90 backdrop-blur-3xl border-t md:border-t-0 md:border-l border-warm-100 dark:border-warm-800 shadow-[0_-10px_50px_rgba(188,108,37,0.1)] md:rounded-[40px] md:border md:shadow-2xl"></div>
      
      <div className="relative flex md:flex-col justify-around md:justify-center items-center py-5 px-4 md:py-10 md:px-3 md:gap-7">
        {tabs.map((tab) => {
          const Icon = (tab as any).icon;
          const isActive = currentView === tab.id || 
                          (tab.id === 'roadmap' && (currentView === 'lesson-detail' || currentView === 'module-list' || currentView === 'roadmap')) ||
                          (tab.id === 'ai-tools-hub' && ['ai-tools-hub', 'scanner', 'ai-tutor', 'periodic-table', 'solubility-table', 'reactivity-series', 'multiplication-table', 'glossary', 'formulas'].includes(currentView)) ||
                          (tab.id === 'admin-home' && currentView.startsWith('admin'));

          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as AppView)}
              title={tab.label}
              className={`flex flex-col items-center flex-1 lg:flex-none transition-all duration-500 relative group ${
                isActive ? 'text-primary-600 dark:text-warm-200' : 'text-warm-400 dark:text-warm-500 hover:text-warm-600 dark:hover:text-warm-300'
              }`}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-2xl transition-all duration-500 relative ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-none' 
                    : 'bg-transparent group-hover:bg-warm-50 dark:group-hover:bg-warm-900/50'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Active Indicator Glow */}
                {isActive && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary-400 blur-lg opacity-20 -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
              
              {/* Active Indicator Bar for Desktop */}
              {isActive && (
                <motion.div 
                  layoutId="active-nav-indicator"
                  className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-8 bg-warm-400 rounded-full shadow-[0_0_15px_rgba(212,163,115,0.6)]"
                />
              )}

              {/* Active Indicator Bar for Mobile */}
              {isActive && (
                <motion.div 
                  layoutId="active-nav-indicator-mobile"
                  className="md:hidden absolute -bottom-3 w-8 h-1.5 bg-warm-400 rounded-full shadow-[0_0_15px_rgba(212,163,115,0.6)]"
                />
              )}
            </button>
          );
        })}
      </div>
      {/* Safe area for mobile home indicator */}
      <div className="h-8 md:hidden bg-transparent"></div>
    </div>
  );
};

export default BottomNav;
