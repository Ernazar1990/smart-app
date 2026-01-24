
import React, { useState } from 'react';
import { UserProgress, UserMarathon } from '../types';
import { MARATHON_TASKS, MOTIVATIONAL_QUOTES } from '../constants';

interface MarathonViewProps {
  user: UserProgress;
  onUpdateMarathon: (marathon: UserMarathon) => void;
}

const MarathonView: React.FC<MarathonViewProps> = ({ user, onUpdateMarathon }) => {
  const marathon = user.marathon;
  const [selectedDuration, setSelectedDuration] = useState<7 | 14 | 30>(7);

  const startMarathon = (duration: 7 | 14 | 30) => {
    const newMarathon: UserMarathon = {
      isActive: true,
      duration,
      startDate: new Date().toISOString(),
      completedDays: [],
      currentStreak: 0
    };
    onUpdateMarathon(newMarathon);
  };

  const completeDay = () => {
    if (!marathon) return;
    const today = new Date();
    const start = new Date(marathon.startDate);
    const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 3600 * 24));
    
    if (!marathon.completedDays.includes(diffDays)) {
      onUpdateMarathon({
        ...marathon,
        completedDays: [...marathon.completedDays, diffDays],
        currentStreak: marathon.currentStreak + 1
      });
    }
  };

  if (!marathon || !marathon.isActive) {
    return (
      <div className="space-y-8 pb-24 animate-in fade-in duration-500">
        <header className="text-center space-y-3">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[30px] flex items-center justify-center text-4xl mx-auto shadow-sm">
            <i className="fas fa-fire"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-900">ҰБТ Марафоны</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">Күнделікті дайындық арқылы грантқа жақында. Шыдамдылығыңды сына!</p>
        </header>

        <div className="grid grid-cols-1 gap-4 px-2">
          {[
            { days: 7, label: 'Жеңіл старт', icon: 'fa-bolt', color: 'bg-blue-500', desc: 'Әдет қалыптастыруға арналған' },
            { days: 14, label: 'Мықты қарқын', icon: 'fa-rocket', color: 'bg-indigo-600', desc: 'Тереңірек дайындалу үшін' },
            { days: 30, label: 'Нағыз чемпион', icon: 'fa-crown', color: 'bg-orange-600', desc: 'Грант иегері болу үшін' },
          ].map((opt) => (
            <button
              key={opt.days}
              onClick={() => setSelectedDuration(opt.days as any)}
              className={`p-6 rounded-[35px] border-2 text-left transition-all flex items-center gap-6 ${
                selectedDuration === opt.days ? 'border-orange-500 bg-orange-50' : 'border-gray-50 bg-white'
              }`}
            >
              <div className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                <i className={`fas ${opt.icon}`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-black text-gray-900">{opt.days} күндік марафон</h4>
                <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-wider">{opt.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedDuration === opt.days ? 'border-orange-500' : 'border-gray-200'}`}>
                {selectedDuration === opt.days && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => startMarathon(selectedDuration)}
          className="w-full bg-gray-900 text-white py-5 rounded-[30px] font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Марафонды бастау
        </button>
      </div>
    );
  }

  const progress = Math.min((marathon.completedDays.length / marathon.duration) * 100, 100);
  const randomQuote = MOTIVATIONAL_QUOTES[marathon.currentStreak % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="space-y-6 pb-32 animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-[45px] text-white shadow-xl relative overflow-hidden">
        <i className="fas fa-fire absolute -right-6 -top-6 text-9xl opacity-10 rotate-12"></i>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Менің марафоным</p>
            <h2 className="text-3xl font-black">{marathon.duration} күн</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Streak</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">{marathon.currentStreak} күн</span>
              <i className="fas fa-fire text-amber-300"></i>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span>Прогресс</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex items-start gap-4 italic text-gray-600">
        <i className="fas fa-quote-left text-orange-400 text-xl"></i>
        <p className="text-sm font-medium leading-relaxed">"{randomQuote}"</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-900 px-2 tracking-tight">Бүгінгі тапсырмалар</h3>
        <div className="bg-white rounded-[35px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {MARATHON_TASKS.map((task, i) => (
            <div key={i} className="p-5 flex items-center gap-4 group">
              <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-emerald-500 transition-colors">
                <i className="far fa-circle text-lg"></i>
              </button>
              <span className="text-sm font-bold text-gray-700">{task}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={completeDay}
        className="w-full bg-emerald-600 text-white py-5 rounded-[30px] font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <i className="fas fa-check-circle"></i>
        Бүгінгі күнді аяқтау
      </button>

      <button
        onClick={() => onUpdateMarathon({ ...marathon, isActive: false })}
        className="w-full text-gray-400 font-bold text-xs py-2"
      >
        Марафоннан бас тарту
      </button>
    </div>
  );
};

export default MarathonView;
