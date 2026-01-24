
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const tabs: { id: AppView; icon: string; label: string }[] = [
    { id: 'home', icon: 'fa-layer-group', label: 'Лента' },
    { id: 'uni-list', icon: 'fa-university', label: 'ЖОО' },
    { id: 'subject-selection', icon: 'fa-id-card', label: 'Мамандық' },
    { id: 'module-list', icon: 'fa-book-open', label: 'Дайындық' },
    { id: 'ai-tools-hub', icon: 'fa-robot', label: 'AI Хаб' },
    { id: 'profile', icon: 'fa-user-circle', label: 'Профиль' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-gray-100 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"></div>
      
      <div className="relative flex justify-around items-center py-3 px-2 max-w-5xl mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id || 
                          (tab.id === 'module-list' && (currentView === 'lesson-detail' || currentView === 'module-list')) ||
                          (tab.id === 'ai-tools-hub' && ['ai-tools-hub', 'scanner', 'ai-tutor', 'periodic-table', 'solubility-table', 'reactivity-series', 'multiplication-table', 'glossary', 'formulas'].includes(currentView));

          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex flex-col items-center gap-1.5 flex-1 transition-all duration-300 relative ${
                isActive ? 'text-emerald-600 dark:text-emerald-400 scale-105' : 'text-gray-400 dark:text-slate-500 hover:text-gray-500'
              }`}
            >
              {isActive && (
                <div className="absolute -top-3 w-8 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-in zoom-in"></div>
              )}
              
              <div className={`text-xl transition-transform ${isActive ? 'translate-y-[-2px]' : ''}`}>
                <i className={`fas ${tab.icon}`}></i>
              </div>
              <span className={`text-[9px] font-bold tracking-tight transition-all font-outfit ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-6 bg-white/95 dark:bg-slate-900/95"></div>
    </div>
  );
};

export default BottomNav;
