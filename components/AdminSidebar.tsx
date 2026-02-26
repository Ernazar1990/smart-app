
import React from 'react';
import { AppView } from '../types';

interface AdminSidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userRole?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, setView, userRole }) => {
  const adminMenuItems = [
    { id: 'admin-home', icon: 'fa-home', label: 'Басты бет' },
    { id: 'admin-content', icon: 'fa-book-open', label: 'Сабақтар' },
    { id: 'admin-news', icon: 'fa-rss', label: 'Жаңалықтар' },
    { id: 'admin-users', icon: 'fa-users', label: 'Оқушылар' },
    { id: 'admin-staff', icon: 'fa-user-tie', label: 'Қызметкерлер' },
    { id: 'admin-unis', icon: 'fa-id-card', label: 'Мамандықтар' },
    { id: 'admin-ai', icon: 'fa-robot', label: 'AI Hub' },
  ];

  return (
    <div className="w-72 bg-[#0F172A] border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col p-6 z-30 text-slate-300">
      <div className="flex items-center gap-4 mb-10 px-2 shrink-0">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-900/20">
          <i className="fas fa-shield-halved"></i>
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight font-outfit leading-none">SmartAdmin</h1>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Басқару орталығы</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {adminMenuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all group ${
                isActive ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-sm`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button onClick={() => setView('home')} className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white transition-all">
          <i className="fas fa-arrow-left text-sm"></i>
          <span className="text-sm font-bold">Оқу режимі</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
