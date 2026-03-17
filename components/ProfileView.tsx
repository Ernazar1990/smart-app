
import React, { useState } from 'react';
import { UserProgress } from '../types';
import SkillRadar from './SkillRadar';
import { supabase } from '../supabaseClient';

interface ProfileViewProps {
  user: UserProgress;
  onLogout: () => void;
  onSelectView?: (view: any) => void;
  onUpdateUser?: (user: UserProgress) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onSelectView, onUpdateUser }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState('');

  const handleActivatePremium = async () => {
    if (activationCode.length !== 6) return;
    setIsActivating(true);
    setActivationError('');
    try {
      // Find user with this code
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('subscriptionCode', activationCode.toUpperCase())
        .single();

      if (profileError || !profile) {
        setActivationError('Код қате немесе мерзімі өткен');
        return;
      }

      // Check expiry
      if (profile.subscriptionExpiresAt && new Date(profile.subscriptionExpiresAt) < new Date()) {
        setActivationError('Жазылым мерзімі аяқталды');
        return;
      }

      // If we found a profile with this code, it means this code is valid.
      // In a real app, we'd probably link the current user to this premium status.
      // For this app, we'll update the current user with the premium data from that code.
      
      const updatedUser = {
        ...user,
        subscription: profile.subscription || 'Premium',
        subscriptionExpiresAt: profile.subscriptionExpiresAt,
        activeSubjects: profile.activeSubjects || [],
        subscriptionCode: profile.subscriptionCode
      };

      // Update in DB for the current user's email
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          subscription: updatedUser.subscription,
          subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
          activeSubjects: updatedUser.activeSubjects,
          subscriptionCode: updatedUser.subscriptionCode
        })
        .eq('email', user.email);

      if (updateError) throw updateError;

      onUpdateUser?.(updatedUser);
      setActivationCode('');
      alert('Premium статус сәтті белсендірілді!');
    } catch (err: any) {
      setActivationError('Белсендіру кезінде қате кетті');
    } finally {
      setIsActivating(false);
    }
  };

  // Mock data for the radar chart
  const radarData = [
    { subject: 'Органика', A: 85, fullMark: 100 },
    { subject: 'Бейорганика', A: 60, fullMark: 100 },
    { subject: 'Есептер', A: 45, fullMark: 100 },
    { subject: 'Теория', A: 90, fullMark: 100 },
    { subject: 'Металдар', A: 70, fullMark: 100 },
    { subject: 'Байланыс', A: 55, fullMark: 100 },
  ];

  const stats = [
    { label: 'Жинаған балл', value: user.points, icon: 'fa-coins', color: 'text-amber-500' },
    { label: 'Аяқталған сабақ', value: `${user.completedLessons.length}/${user.totalLessons}`, icon: 'fa-check-circle', color: 'text-emerald-500' },
    { label: 'Сенімділік', value: '85%', icon: 'fa-shield-heart', color: 'text-blue-500' },
  ];

  const achievements = [
    { id: 1, icon: 'fa-fire', label: 'Strike Master', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 2, icon: 'fa-brain', label: 'AI Expert', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 3, icon: 'fa-flask', label: 'Chemist', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('kk-KZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* Premium Activation Section */}
      {user.subscription !== 'Premium' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 text-2xl">
              <i className="fas fa-key"></i>
            </div>
            <div className="text-left">
              <h4 className="font-black text-slate-800 dark:text-white font-outfit">Premium белсендіру</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">6 таңбалы кодты енгізіңіз</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              className="flex-1 px-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl text-center font-black text-xl tracking-[0.5em] outline-none focus:border-amber-500 transition-all"
              value={activationCode}
              onChange={e => setActivationCode(e.target.value.toUpperCase())}
            />
            <button 
              onClick={handleActivatePremium}
              disabled={isActivating || activationCode.length !== 6}
              className="px-8 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {isActivating ? '...' : 'Белсендіру'}
            </button>
          </div>
          {activationError && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{activationError}</p>}
        </div>
      )}

      {/* Admin Quick Access - Тек админ үшін */}
      {user.isAdmin && (
        <button 
          onClick={() => onSelectView?.('admin')}
          className="w-full bg-slate-900 dark:bg-slate-800 p-6 rounded-[40px] border border-slate-700 shadow-xl flex items-center justify-between group transition-all active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="text-left">
              <h4 className="text-white font-black font-outfit">Админ панелі</h4>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Контентті басқару</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-white opacity-50 group-hover:opacity-100 transition-opacity">
            <i className="fas fa-arrow-right"></i>
          </div>
        </button>
      )}

      {/* 1. Ranking Card */}
      <button 
        onClick={() => onSelectView?.('rating')}
        className="w-full bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[40px] text-white shadow-xl flex items-center justify-between relative overflow-hidden group"
      >
        <div className="absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-12 transition-transform group-hover:scale-110">
          <i className="fas fa-trophy"></i>
        </div>
        <div className="relative z-10 space-y-3 text-left">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 font-outfit">Рейтингтегі орныңыз</span>
          </div>
          <div className="flex items-end gap-3">
            <h4 className="text-5xl font-black font-outfit leading-none">#14</h4>
            <div className="pb-1 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 font-outfit">Қазақстан бойынша</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-bold text-emerald-300 font-outfit uppercase">ЖОҒАРҒЫ НӘТИЖЕ</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
          <i className="fas fa-chevron-right"></i>
        </div>
      </button>

      {/* 2. Knowledge Radar */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 font-outfit text-left">Білім картасы</h4>
        <SkillRadar data={radarData} />
        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl">
           <p className="text-[10px] text-gray-500 leading-relaxed text-center font-medium font-outfit">
             <i className="fas fa-magic text-emerald-500 mr-1"></i>
             AI талдау: Сенің <b>Теория</b> жағың өте мықты, бірақ <b>Есептерге</b> көбірек көңіл бөлу керек.
           </p>
        </div>
      </div>

      {/* 3. Achievements */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm">
        <h4 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2 font-outfit text-left">Жетістіктерім</h4>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div key={ach.id} className={`${ach.bg} dark:bg-slate-900/50 p-4 rounded-[25px] flex flex-col items-center gap-2 border border-white dark:border-slate-700`}>
              <i className={`fas ${ach.icon} ${ach.color} text-xl`}></i>
              <span className="text-[8px] font-black text-gray-500 uppercase text-center font-outfit">{ach.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 text-center shadow-sm relative overflow-hidden">
        <div className="w-28 h-28 bg-emerald-50 dark:bg-emerald-900/20 rounded-[35px] mx-auto mb-6 flex items-center justify-center relative border border-emerald-100 dark:border-emerald-800">
          <i className="fas fa-user-graduate text-5xl text-emerald-600"></i>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{user.name}</h3>
        <div className="flex justify-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
            user.role === 'super-admin' ? 'bg-indigo-100 text-indigo-600' :
            user.role === 'teacher' ? 'bg-emerald-100 text-emerald-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {user.role === 'super-admin' ? 'Админ' : user.role === 'teacher' ? 'Куратор' : 'Оқушы'}
          </span>
          {user.subscription !== 'none' && (
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-600">
              {user.subscription}
            </span>
          )}
        </div>
        <p className="text-gray-400 dark:text-slate-500 text-sm mt-1 mb-4 font-outfit">{user.email || 'Пошта көрсетілмеген'}</p>
        
        {user.pin && (
          <div className="mb-6 inline-block px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Жылдам кіру коды (PIN)</p>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-[0.2em] font-outfit">{user.pin}</p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-900 p-3 rounded-2xl text-center">
              <i className={`fas ${stat.icon} ${stat.color} mb-1`}></i>
              <p className="text-xs font-black text-gray-900 dark:text-white font-outfit">{stat.value}</p>
              <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter font-outfit">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full py-5 text-red-500 font-black bg-white dark:bg-slate-800 rounded-3xl border border-red-50 dark:border-red-900/30 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-3 font-outfit"
      >
        <i className="fas fa-sign-out-alt"></i>
        Жүйеден шығу
      </button>
    </div>
  );
};

export default ProfileView;
