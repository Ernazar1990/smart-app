
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
    <div className="min-h-screen bg-warm-paper dark:bg-warm-900 flex flex-col transition-colors duration-400">
      {/* Top Bar - Скриншот стилінде */}
      {!hideNav && (
        <header className="sticky top-0 z-40 bg-warm-paper/90 dark:bg-warm-950/90 backdrop-blur-xl border-b border-warm-100 dark:border-warm-800 px-4 md:px-10 py-4 flex justify-between items-center shadow-[0_1px_15px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-primary-200 dark:shadow-none rotate-3">
              <i className="fas fa-book-open"></i>
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-slate-900 dark:text-warm-50 tracking-tight font-outfit leading-none text-xl">
                ҰБТ <span className="text-primary-600">Академия</span>
              </h1>
              <span className="text-[9px] font-bold text-warm-400 dark:text-warm-500 uppercase tracking-[0.25em] mt-1">Білімге жолың осы жерден</span>
            </div>
          </div>
          
          <div className="hidden md:flex flex-wrap items-center gap-4 lg:gap-6 xl:gap-8">
            {[
              { id: 'home', label: 'Басты бет' },
              { id: 'roadmap', label: 'Жоспар' },
              { id: 'module-list', label: 'Пәндер' },
              { id: 'rating', label: 'Рейтинг' },
              { id: 'uni-list', label: 'ЖОО' },
              { id: 'subject-selection', label: 'Мамандық' },
              { id: 'ai-tools-hub', label: 'AI Хаб' },
              ...(user.isAdmin ? [{ id: 'admin-home', label: 'Админ' }] : [])
            ].map((item) => {
              const isItemActive = currentView === item.id || 
                (item.id === 'roadmap' && (currentView === 'lesson-detail' || currentView === 'module-list' || currentView === 'roadmap')) ||
                (item.id === 'ai-tools-hub' && ['ai-tools-hub', 'scanner', 'ai-tutor', 'periodic-table', 'solubility-table', 'reactivity-series', 'multiplication-table', 'glossary', 'formulas'].includes(currentView)) ||
                (item.id === 'admin-home' && currentView.startsWith('admin'));

              return (
                <button 
                  key={item.id}
                  onClick={() => setView(item.id as AppView)}
                  className={`text-[10px] xl:text-[11px] font-black uppercase tracking-wider xl:tracking-widest transition-all relative py-1 ${
                    isItemActive 
                      ? 'text-primary-600 dark:text-warm-100' 
                      : 'text-warm-400 hover:text-warm-600 dark:hover:text-warm-300'
                  }`}
                >
                  {item.label}
                  {isItemActive && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-warm-400/50 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <div className="flex bg-orange-50 dark:bg-orange-950/20 px-3 py-2 rounded-2xl border border-orange-100 dark:border-orange-850/30 items-center gap-2">
              <i className="fas fa-fire text-orange-500 text-sm animate-pulse"></i>
              <span className="text-sm font-black text-orange-700 dark:text-orange-400">{user.streak || 0}</span>
            </div>

            <div className="hidden sm:flex bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800/30 items-center gap-2.5">
              <i className="fas fa-medal text-amber-500 text-sm"></i>
              <span className="text-sm font-black text-amber-700 dark:text-amber-400">{user.points}</span>
            </div>
            
            <button 
              onClick={() => setView('profile')}
              className="flex items-center gap-2 group relative"
            >
              <div className="w-11 h-11 bg-warm-50 dark:bg-warm-900 p-0.5 rounded-2xl transition-all border border-warm-100 dark:border-warm-800 group-hover:border-primary-400">
                <div className="w-full h-full bg-white dark:bg-warm-800 rounded-[14px] flex items-center justify-center text-warm-400 group-hover:text-primary-600 overflow-hidden">
                  <i className="fas fa-user-circle text-2xl"></i>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-warm-950 rounded-full"></div>
            </button>
          </div>
        </header>
      )}
      
      <main className="flex-1 p-3 md:p-6 pb-24">
        <div className="max-w-7xl mx-auto w-full">
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
            className="fixed bottom-0 left-0 right-0 md:hidden z-[70]"
          >
            <BottomNav currentView={currentView} setView={setView} user={user} />
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
