
import React from 'react';
import { AppView } from '../types';

interface AdminSidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userRole?: string;
  userEmail?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, setView, userRole, userEmail }) => {
  const isSuperAdmin = userRole === 'super-admin' || userEmail === 'nur.abuuadi@gmail.com' || userEmail === 'ernazarnurtay@gmail.com';

  const adminMenuItems = [
    { id: 'admin-home', icon: 'fa-home', label: 'Басты бет', superOnly: true },
    { id: 'admin-content', icon: 'fa-book-open', label: 'Сабақтар', superOnly: false },
    { id: 'admin-news', icon: 'fa-rss', label: 'Жаңалықтар', superOnly: true },
    { id: 'admin-users', icon: 'fa-users', label: 'Оқушылар', superOnly: false },
    { id: 'admin-staff', icon: 'fa-user-tie', label: 'Қызметкерлер', superOnly: true },
    { id: 'admin-unis', icon: 'fa-university', label: 'ЖОО', superOnly: true },
    { id: 'admin-ai', icon: 'fa-robot', label: 'AI Hub', superOnly: true },
    { id: 'admin-subscription', icon: 'fa-credit-card', label: 'Жазылым', superOnly: true },
    { id: 'admin-system', icon: 'fa-cog', label: 'Жүйе', superOnly: true },
  ];

  const filteredItems = adminMenuItems.filter(item => isSuperAdmin || !item.superOnly);

  return (
    <div className="w-72 bg-[#0F172A] border-r border-slate-800/80 h-screen fixed left-0 top-0 flex flex-col p-6 z-30 text-slate-300">
      <div className="flex items-center gap-4 mb-10 px-2 shrink-0">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-950/50">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight font-outfit leading-none">SmartAdmin</h1>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mt-2">БАСҚАРУ ОРТАЛЫҒЫ</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        {filteredItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all group ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-sm`}></i>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button onClick={() => setView('home')} className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] bg-slate-800/40 border border-slate-800/60 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
          <i className="fas fa-arrow-left text-sm"></i>
          <span className="text-sm font-bold">Оқу режимі</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
