
import React, { useState, useEffect } from 'react';

const ARENA_QUESTIONS = [
  { text: "Металдардың электр кернеу қатарын кім ашты?", options: ["Н. Бекетов", "Д. Менделеев", "А. Бутлеров", "М. Ломоносов"], correct: 0 },
  { text: "Ең жеңіл газ?", options: ["Оттегі", "Азот", "Сутегі", "Гелий"], correct: 2 },
  { text: "Тұз қышқылының формуласы?", options: ["H2SO4", "HCl", "HNO3", "NaOH"], correct: 1 },
];

const ArenaView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNext(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // Bot logic: semi-random answers
  useEffect(() => {
    if (gameState === 'playing') {
      const botTimer = setTimeout(() => {
        if (Math.random() > 0.4) {
          setBotScore(s => s + 10);
        }
      }, Math.random() * 5000 + 2000);
      return () => clearTimeout(botTimer);
    }
  }, [currentQ, gameState]);

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) setMyScore(s => s + 10);
    
    if (currentQ < ARENA_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(10);
    } else {
      setGameState('end');
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-in slide-in-from-bottom duration-500 max-w-lg mx-auto">
      {gameState === 'start' && (
        <div className="text-center space-y-8 py-20 bg-white dark:bg-slate-800 rounded-[50px] shadow-xl border border-gray-100 dark:border-slate-700">
          <div className="relative inline-block">
             <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl animate-pulse">
               <i className="fas fa-bolt"></i>
             </div>
             <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Live</div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-outfit">Arena Battle</h2>
            <p className="text-gray-500 text-sm px-10">AI Ботпен жылдамдыққа жарыс. Әр дұрыс жауап үшін 10 ұпай.</p>
          </div>
          <button onClick={() => setGameState('playing')} className="bg-red-600 text-white px-12 py-5 rounded-[25px] font-black shadow-lg shadow-red-200 dark:shadow-none hover:scale-105 transition-all">
            ЖАРЫСТЫ БАСТАУ
          </button>
          <button onClick={onBack} className="block w-full text-gray-400 font-black text-[10px] uppercase">Артқа</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Мен</p>
              <p className="text-2xl font-black text-emerald-600">{myScore}</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-red-500 flex items-center justify-center font-black text-red-500 text-xl">
              {timeLeft}
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">AI Бот</p>
              <p className="text-2xl font-black text-red-600">{botScore}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-xl space-y-8">
             <h3 className="text-xl font-black text-center leading-relaxed">{ARENA_QUESTIONS[currentQ].text}</h3>
             <div className="grid grid-cols-1 gap-3">
               {ARENA_QUESTIONS[currentQ].options.map((opt, i) => (
                 <button 
                  key={i} 
                  onClick={() => handleNext(i === ARENA_QUESTIONS[currentQ].correct)}
                  className="w-full p-5 rounded-3xl border-2 border-gray-50 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold transition-all text-left flex items-center gap-4"
                 >
                   <span className="w-8 h-8 bg-gray-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xs font-black">{String.fromCharCode(65+i)}</span>
                   {opt}
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}

      {gameState === 'end' && (
        <div className="text-center space-y-8 py-20 bg-white dark:bg-slate-800 rounded-[50px] shadow-xl border border-gray-100 dark:border-slate-700 animate-in zoom-in">
           <h2 className="text-4xl font-black font-outfit">{myScore >= botScore ? 'ЖЕҢІС! 🏆' : 'КЕЛЕСІ ЖОЛЫ СӘТТІЛІК! 🤖'}</h2>
           <div className="flex justify-center gap-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">Сенің ұпайың</p>
                <p className="text-3xl font-black text-emerald-600">{myScore}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">Бот ұпайы</p>
                <p className="text-3xl font-black text-red-600">{botScore}</p>
              </div>
           </div>
           <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[30px] mx-10 border border-emerald-100 dark:border-emerald-800">
              <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">+ {myScore} XP жиналды!</p>
           </div>
           <button onClick={() => setGameState('start')} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg">ҚАЙТА ОЙНАУ</button>
           <button onClick={onBack} className="block w-full text-gray-400 font-black text-[10px] uppercase">Жабу</button>
        </div>
      )}
    </div>
  );
};

export default ArenaView;
