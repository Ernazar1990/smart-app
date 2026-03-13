
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './BottomNav';
import { AppView, UserProgress } from '../types';

interface StudentLayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserProgress;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  hideNav?: boolean;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, currentView, setView, user, isDarkMode, toggleDarkMode, hideNav }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col transition-colors duration-300">
      {/* Top Bar - Скриншот стилінде */}
      {!hideNav && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
              <i className="fas fa-book-open"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 dark:text-white tracking-tight font-outfit leading-none text-base">
                ҰБТ Академия
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Білімге жол</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            {[
              { id: 'home', label: 'Басты бет' },
              { id: 'roadmap', label: 'Жоспар' },
              { id: 'module-list', label: 'Курстар' },
              { id: 'rating', label: 'Рейтинг' },
              { id: 'uni-list', label: 'ЖОО' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`text-[10px] font-black uppercase tracking-widest transition-all relative py-1 ${
                  currentView === item.id 
                    ? 'text-indigo-600 dark:text-white' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800/50 items-center gap-2">
              <i className="fas fa-medal text-amber-500 text-[10px]"></i>
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">{user.points}</span>
            </div>
            
            <button 
              onClick={() => setView('profile')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-700">
                <i className="fas fa-user text-xs"></i>
              </div>
            </button>

            {user.isAdmin && (
              <button 
                onClick={() => setView('admin-home')}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
              >
                Админ
              </button>
            )}
          </div>
        </header>
      )}
      
      <main className={`flex-1 p-3 md:p-6 pb-24 ${!hideNav ? 'md:pr-24' : ''}`}>
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      <AnimatePresence>
        {!hideNav && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 md:top-auto md:bottom-6 md:right-6 md:left-auto md:w-16 z-[70]"
          >
            <BottomNav currentView={currentView} setView={setView} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <a 
        href="https://wa.me/87771902796" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-24 right-6 lg:right-auto lg:left-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl animate-bounce z-40"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default StudentLayout;
