
import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, School, GraduationCap, BookOpen, Bot, User, Map } from 'lucide-react';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const tabs = [
    { id: 'home', icon: LayoutGrid, label: 'Лента' },
    { id: 'roadmap', icon: Map, label: 'Дайындық жоспары' },
    { id: 'uni-list', icon: School, label: 'ЖОО' },
    { id: 'subject-selection', icon: GraduationCap, label: 'Мамандық' },
    { id: 'ai-tools-hub', icon: Bot, label: 'AI Хаб' },
  ];

  return (
    <div className="relative w-full md:w-auto">
      <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] md:rounded-[32px] md:border"></div>
      
      <div className="relative flex md:flex-col justify-around md:justify-center items-center py-3 px-2 md:py-6 md:px-3 md:gap-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id || 
                          (tab.id === 'roadmap' && (currentView === 'lesson-detail' || currentView === 'module-list' || currentView === 'roadmap')) ||
                          (tab.id === 'ai-tools-hub' && ['ai-tools-hub', 'scanner', 'ai-tutor', 'periodic-table', 'solubility-table', 'reactivity-series', 'multiplication-table', 'glossary', 'formulas'].includes(currentView));

          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as AppView)}
              className={`flex flex-col items-center gap-1.5 flex-1 lg:flex-none transition-all duration-300 relative group ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50'}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`text-[7px] font-black tracking-tight transition-all font-outfit uppercase ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}>
                {tab.label}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 md:bottom-auto md:-left-2 w-1 h-1 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      <div className="h-6 md:hidden bg-white/95 dark:bg-slate-900/95"></div>
    </div>
  );
};

export default BottomNav;
