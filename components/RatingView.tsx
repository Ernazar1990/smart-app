
import React, { useState } from 'react';
import { UserProgress } from '../types';

interface RatingEntry {
  rank: number;
  name: string;
  points: number;
  lessons: number;
  streak: number;
  isMe?: boolean;
}

const MOCK_RATINGS: Record<string, RatingEntry[]> = {
  republic: [
    { rank: 1, name: 'Айдын Нұрлан', points: 5420, lessons: 358, streak: 95 },
    { rank: 2, name: 'Қуаныш Әлия', points: 5280, lessons: 342, streak: 89 },
    { rank: 3, name: 'Дәурен Сара', points: 4950, lessons: 325, streak: 82 },
    { rank: 4, name: 'Бекзат Асель', points: 4680, lessons: 308, streak: 75 },
    { rank: 9, name: 'Оқушы', points: 250, lessons: 12, streak: 4, isMe: true },
  ],
  region: [
    { rank: 1, name: 'Қуаныш Әлия', points: 5280, lessons: 342, streak: 89 },
    { rank: 5, name: 'Оқушы', points: 250, lessons: 12, streak: 4, isMe: true },
  ],
  district: [
    { rank: 1, name: 'Дәурен Сара', points: 4950, lessons: 325, streak: 82 },
    { rank: 3, name: 'Оқушы', points: 250, lessons: 12, streak: 4, isMe: true },
  ],
  school: [
    { rank: 1, name: 'Бекзат Асель', points: 4680, lessons: 308, streak: 75 },
    { rank: 2, name: 'Оқушы', points: 250, lessons: 12, streak: 4, isMe: true },
  ]
};

interface RatingViewProps {
  user: UserProgress;
  onBack: () => void;
}

const RatingView: React.FC<RatingViewProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'republic' | 'region' | 'district' | 'school'>('republic');

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { icon: <i className="fas fa-crown text-amber-400"></i>, bg: 'bg-amber-50/20' };
    if (rank === 2) return { icon: <i className="fas fa-medal text-slate-300"></i>, bg: 'bg-slate-50/20' };
    if (rank === 3) return { icon: <i className="fas fa-medal text-warm-300"></i>, bg: 'bg-warm-50/20' };
    return { icon: <span className="text-warm-300 dark:text-warm-700 font-black text-sm">#{rank}</span>, bg: 'bg-warm-50/5' };
  };

  const currentData = MOCK_RATINGS[activeTab].sort((a, b) => a.rank - b.rank);
  const myEntry = currentData.find(e => e.isMe);

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700 max-w-2xl mx-auto">
      
      {/* 1. Header */}
      <div className="text-center space-y-2">
         <h1 className="text-3xl font-black text-slate-900 dark:text-warm-50 font-outfit tracking-tight">Рейтинг кестесі</h1>
         <p className="text-warm-400 dark:text-warm-500 text-[11px] font-bold uppercase tracking-widest">Үздік оқушылар тізімі</p>
      </div>

      {/* 2. My Rank Summary Card */}
      <div className="bg-primary-50/50 dark:bg-primary-950/20 p-8 rounded-[40px] border border-primary-100 dark:border-primary-900/30 flex items-center gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-5 text-6xl text-primary-600">
          <i className="fas fa-chart-line"></i>
        </div>
        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary-200 dark:shadow-none z-10 border-4 border-white dark:border-warm-800">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 z-10">
          <h3 className="font-extrabold text-slate-900 dark:text-warm-50 font-outfit text-xl">{user.name}</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-amber-600 dark:text-amber-400 text-sm font-black flex items-center gap-1.5">
              <i className="fas fa-star"></i> {user.points} балл
            </span>
            <span className="text-emerald-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <i className="fas fa-arrow-trend-up"></i> ↑ 9-орын
            </span>
          </div>
        </div>
        <div className="text-right z-10">
          <p className="text-4xl font-black text-primary-600 dark:text-primary-400 font-outfit leading-none">#{myEntry?.rank}</p>
          <p className="text-[10px] font-black text-warm-400 uppercase tracking-widest mt-2">Ағымдағы</p>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex bg-warm-100/50 dark:bg-warm-900/50 p-1.5 rounded-full border border-warm-100 dark:border-warm-800/50">
        {[
          { id: 'republic', label: 'Қазақстан' },
          { id: 'region', label: 'Облыс' },
          { id: 'district', label: 'Аудан' },
          { id: 'school', label: 'Мектеп' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-warm-800 text-primary-600 dark:text-warm-200 shadow-xl' 
                : 'text-warm-400 dark:text-warm-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Leaderboard List */}
      <div className="bg-white dark:bg-warm-800 rounded-[48px] border border-warm-100 dark:border-warm-700 shadow-sm overflow-hidden p-3">
        <div className="space-y-2">
          {currentData.map((item) => {
            const style = getRankStyle(item.rank);
            return (
              <div 
                key={item.rank + item.name}
                className={`p-6 rounded-[40px] flex items-center gap-6 transition-all ${item.isMe ? 'ring-2 ring-primary-100 dark:ring-primary-900/30 bg-primary-50/30' : style.bg}`}
              >
                {/* Rank indicator */}
                <div className="w-10 flex justify-center shrink-0">
                  {style.icon}
                </div>
                
                {/* Avatar with initial */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black shadow-sm shrink-0 border-4 border-white dark:border-warm-800 ${
                  item.rank === 1 ? 'bg-amber-400 shadow-amber-100' : 
                  item.rank === 2 ? 'bg-slate-400 shadow-slate-100' : 
                  item.rank === 3 ? 'bg-warm-400 shadow-warm-100' : 'bg-warm-100 text-warm-400 border-warm-50'
                }`}>
                  {item.name.charAt(0)}
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-extrabold text-slate-800 dark:text-warm-50 text-base truncate font-outfit">
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-bold text-warm-400 flex items-center gap-1.5 uppercase tracking-tighter">
                      <i className="fas fa-eye text-[9px]"></i> {item.lessons} сабақ
                    </span>
                    <span className="text-[10px] font-bold text-warm-400 flex items-center gap-1.5 uppercase tracking-tighter">
                      <i className="fas fa-fire text-amber-500 text-[9px]"></i> {item.streak} күн
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <i className="fas fa-star text-amber-500 text-xs"></i>
                    <span className="text-base font-black text-slate-900 dark:text-warm-50 font-outfit">{item.points}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button or Info Footer */}
      <button onClick={onBack} className="w-full text-gray-400 font-black text-[10px] uppercase tracking-widest py-4">
        Оралу
      </button>

    </div>
  );
};

export default RatingView;
