
import React from 'react';
import BottomNav from './BottomNav';
import { AppView, UserProgress } from '../types';

interface StudentLayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserProgress;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, currentView, setView, user, isDarkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0F172A] flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">
            <i className="fas fa-flask"></i>
          </div>
          <span className="font-black text-gray-900 dark:text-white tracking-tighter font-outfit">
            Smart<span className="text-emerald-600">App</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Admin Switcher */}
          {user.isAdmin && (
            <button 
              onClick={() => setView('admin')}
              className="relative flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all animate-pulse"
              title="Админ панелі"
            >
              <i className="fas fa-user-shield text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Админ</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="w-9 h-9 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-amber-400 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110 active:scale-90 shadow-sm"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          
          <button onClick={() => setView('ai-tutor')} className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs transition-transform hover:scale-110">
            <i className="fas fa-robot"></i>
          </button>
          
          <div className="flex flex-col items-end ml-1">
             <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase leading-none font-outfit">Балл</span>
             <span className="text-sm font-black text-gray-900 dark:text-white leading-none font-outfit">{user.points}</span>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-32">
        <div className="max-w-2xl mx-auto md:max-w-5xl">
          {children}
        </div>
      </main>

      {/* Persistent Bottom Nav */}
      <BottomNav currentView={currentView} setView={setView} />
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/87771902796" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce z-40"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default StudentLayout;
