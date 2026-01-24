
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
    if (rank === 1) return { icon: <i className="fas fa-crown text-amber-400"></i>, bg: 'bg-amber-50/50' };
    if (rank === 2) return { icon: <i className="fas fa-medal text-slate-300"></i>, bg: 'bg-slate-50/50' };
    if (rank === 3) return { icon: <i className="fas fa-medal text-orange-300"></i>, bg: 'bg-orange-50/50' };
    return { icon: <span className="text-gray-300 font-black text-xs">#{rank}</span>, bg: 'bg-white' };
  };

  const currentData = MOCK_RATINGS[activeTab].sort((a, b) => a.rank - b.rank);
  const myEntry = currentData.find(e => e.isMe);

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500 max-w-2xl mx-auto">
      
      {/* 1. Header */}
      <div className="text-center space-y-1">
         <h1 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Рейтинг кестесі</h1>
         <p className="text-gray-400 text-xs font-medium">Үздік оқушылар тізімі</p>
      </div>

      {/* 2. My Rank Summary Card */}
      <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[40px] border border-indigo-100 dark:border-indigo-800/30 flex items-center gap-5 shadow-sm">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-gray-900 dark:text-white font-outfit">{user.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-amber-500 text-xs font-black flex items-center gap-1">
              <i className="fas fa-star text-[10px]"></i> {user.points} балл
            </span>
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <i className="fas fa-arrow-trend-up"></i> ↑ 9-орын
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit leading-none">#{myEntry?.rank}</p>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Ағымдағы</p>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-gray-100 dark:border-slate-700/50">
        {[
          { id: 'republic', label: 'Қазақстан' },
          { id: 'region', label: 'Облыс' },
          { id: 'district', label: 'Аудан' },
          { id: 'school', label: 'Мектеп' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-400 dark:text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Leaderboard List */}
      <div className="bg-white dark:bg-slate-800 rounded-[45px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden p-2">
        <div className="space-y-1">
          {currentData.map((item) => {
            const style = getRankStyle(item.rank);
            return (
              <div 
                key={item.rank + item.name}
                className={`p-5 rounded-[35px] flex items-center gap-5 transition-all ${item.isMe ? 'ring-2 ring-indigo-100 dark:ring-indigo-900/30' : ''} ${style.bg}`}
              >
                {/* Rank indicator */}
                <div className="w-8 flex justify-center shrink-0">
                  {style.icon}
                </div>
                
                {/* Avatar with initial */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-black shadow-sm shrink-0 ${
                  item.rank === 1 ? 'bg-amber-400' : 
                  item.rank === 2 ? 'bg-slate-400' : 
                  item.rank === 3 ? 'bg-orange-400' : 'bg-indigo-100 text-indigo-400'
                }`}>
                  {item.name.charAt(0)}
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-black text-gray-800 dark:text-slate-100 text-sm truncate font-outfit">
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                      <i className="fas fa-eye text-[8px]"></i> {item.lessons} сабақ
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                      <i className="fas fa-fire text-orange-400 text-[8px]"></i> {item.streak} күн
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <i className="fas fa-star text-amber-400 text-[10px]"></i>
                    <span className="text-sm font-black text-gray-900 dark:text-white font-outfit">{item.points}</span>
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
