
import React from 'react';
import { AppView, UserProgress } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user?: UserProgress;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const menuItems: { id: AppView, icon: string, label: string }[] = [
    { id: 'home', icon: 'fa-chart-line', label: 'Басты бет' },
    { id: 'module-list', icon: 'fa-book-open', label: 'Курстар' },
    { id: 'marathon', icon: 'fa-fire', label: 'Марафон' },
    { id: 'test', icon: 'fa-vial', label: 'Тестілеу' },
    { id: 'uni-list', icon: 'fa-university', label: 'Uni Hub' },
    { id: 'periodic-table', icon: 'fa-table-cells', label: 'Периодтық кесте' },
    { id: 'ai-tutor', icon: 'fa-robot', label: 'AI Тьютор' },
  ];

  if (user?.isAdmin) {
    menuItems.push({ id: 'admin', icon: 'fa-user-shield', label: 'Админ' });
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col p-4 z-30">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl">
          <i className="fas fa-flask"></i>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Smart App <span className="text-emerald-600">Chem</span></h1>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Грант мүмкіндігі</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-600">93 232 грант</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
