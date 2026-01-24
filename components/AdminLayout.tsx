
import React from 'react';
import AdminSidebar from './AdminSidebar';
import { AppView, UserProgress } from '../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  user: UserProgress;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, setView, user }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:block">
        <AdminSidebar currentView={currentView} setView={setView} userRole={user?.role} />
      </div>
      
      <main className="flex-1 md:ml-72 p-4 md:p-10 min-h-screen">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>

      {/* Mobile Guard */}
      <div className="md:hidden fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-10 text-center text-white">
        <i className="fas fa-desktop text-5xl mb-6 text-indigo-400"></i>
        <h2 className="text-xl font-black mb-2">Админ панель тек компьютерде қолжетімді</h2>
        <button onClick={() => setView('home')} className="mt-8 bg-indigo-600 px-8 py-3 rounded-xl font-bold">Басты бетке қайту</button>
      </div>
    </div>
  );
};

export default AdminLayout;
