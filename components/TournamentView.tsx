
import React, { useState, useEffect } from 'react';

interface Participant {
  id: string;
  name: string;
  score: number;
  isMe?: boolean;
}

const TournamentView: React.FC<{ onBack: () => void; onAnswerQuestion?: () => void }> = ({ onBack, onAnswerQuestion }) => {
  const [phase, setPhase] = useState<'lobby' | 'battle' | 'results'>('lobby');
  const [timer, setTimer] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Айдын Н.', score: 120 },
    { id: '2', name: 'Сара К.', score: 110 },
    { id: '3', name: 'Мен (Сен)', score: 0, isMe: true },
    { id: '4', name: 'Дәурен Б.', score: 95 },
  ]);

  const questions = [
    { text: "Күкірт қышқылының формуласы?", options: ["HCl", "H2SO4", "HNO3", "H3PO4"], correct: 1 },
    { text: "Бертолле тұзының құрамындағы элемент?", options: ["Хлор", "Фтор", "Бром", "Иод"], correct: 0 },
    { text: "Ең белсенді металл?", options: ["Li", "Na", "K", "Cs"], correct: 3 },
  ];

  useEffect(() => {
    if (phase === 'lobby' && timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (phase === 'lobby' && timer === 0) {
      setPhase('battle');
    }
  }, [timer, phase]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setParticipants(prev => prev.map(p => p.isMe ? { ...p, score: p.score + 50 } : p));
    }
    if (onAnswerQuestion) onAnswerQuestion();
    
    // Simulate other participants scoring
    setParticipants(prev => prev.map(p => !p.isMe && Math.random() > 0.5 ? { ...p, score: p.score + Math.floor(Math.random() * 40) } : p));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setPhase('results');
    }
  };

  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6 pb-32 animate-in slide-in-from-bottom duration-500 max-w-lg mx-auto">
      {phase === 'lobby' && (
        <div className="bg-white dark:bg-slate-800 rounded-[50px] p-10 text-center space-y-8 shadow-2xl border border-indigo-100 dark:border-slate-700">
           <div className="w-24 h-24 bg-indigo-600 text-white rounded-[35px] flex items-center justify-center text-4xl mx-auto shadow-xl shadow-indigo-200 dark:shadow-none animate-bounce">
             <i className="fas fa-trophy"></i>
           </div>
           <div className="space-y-2">
             <h2 className="text-3xl font-black font-outfit">Tournament Arena</h2>
             <p className="text-gray-400 text-sm">Турнир басталуына санаулы секундтар қалды...</p>
           </div>
           <div className="text-6xl font-black text-indigo-600 font-outfit animate-pulse">
             {timer}
           </div>
           <div className="flex justify-center -space-x-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 bg-gray-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                  <i className="fas fa-user"></i>
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                +42
              </div>
           </div>
           <button onClick={onBack} className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Бас тарту</button>
        </div>
      )}

      {phase === 'battle' && (
        <div className="space-y-6">
          {/* Real-time Leaderboard Mini */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-[30px] shadow-sm border border-gray-100 dark:border-slate-700 flex gap-2 overflow-x-auto no-scrollbar">
            {sortedParticipants.map((p, i) => (
              <div key={p.id} className={`flex-shrink-0 px-4 py-2 rounded-2xl flex items-center gap-2 border ${p.isMe ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500'}`}>
                <span className="text-[10px] font-black">#{i+1}</span>
                <span className="text-xs font-bold">{p.name.split(' ')[0]}</span>
                <span className="text-xs font-black">{p.score}</span>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-slate-700 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-1000" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Сұрақ {currentQuestion + 1} / {questions.length}</span>
               <div className="w-10 h-10 rounded-full border-2 border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600">15с</div>
             </div>
             <h3 className="text-xl font-black text-center font-outfit leading-relaxed">
               {questions[currentQuestion].text}
             </h3>
             <div className="grid grid-cols-1 gap-3">
               {questions[currentQuestion].options.map((opt, i) => (
                 <button 
                  key={i} 
                  onClick={() => handleAnswer(i === questions[currentQuestion].correct)}
                  className="w-full p-5 rounded-3xl border-2 border-gray-50 dark:border-slate-700 hover:border-indigo-500 font-bold text-left flex items-center gap-4 group transition-all"
                 >
                   <span className="w-8 h-8 bg-gray-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-[10px] font-black group-hover:bg-indigo-600 group-hover:text-white">{String.fromCharCode(65+i)}</span>
                   {opt}
                 </button>
               ))}
             </div>
          </div>
        </div>
      )}

      {phase === 'results' && (
        <div className="bg-white dark:bg-slate-800 rounded-[50px] p-10 text-center space-y-8 shadow-2xl border border-indigo-100 dark:border-slate-700 animate-in zoom-in">
           <h2 className="text-4xl font-black font-outfit uppercase">Турнир аяқталды!</h2>
           <div className="space-y-4">
             {sortedParticipants.map((p, i) => (
               <div key={p.id} className={`p-5 rounded-[30px] flex items-center gap-4 transition-all ${p.isMe ? 'bg-indigo-600 text-white scale-105 shadow-xl' : 'bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 opacity-60'}`}>
                 <span className="text-xl font-black font-outfit w-8">#{i+1}</span>
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black">{p.name.charAt(0)}</div>
                 <div className="flex-1 text-left">
                   <h4 className="font-black text-sm">{p.name}</h4>
                   <p className={`text-[10px] font-bold ${p.isMe ? 'text-indigo-200' : 'text-gray-400'}`}>Мектеп: №178 лицей</p>
                 </div>
                 <span className="font-black text-lg">{p.score}</span>
               </div>
             ))}
           </div>
           <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[35px] border border-amber-100 dark:border-amber-800">
              <p className="text-amber-700 dark:text-amber-400 font-bold text-xs italic">
                <i className="fas fa-gift mr-2"></i>
                Сіз "Күміс Кубок" және +150 XP иелендіңіз!
              </p>
           </div>
           <button onClick={onBack} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black shadow-lg">ЖАБУ</button>
        </div>
      )}
    </div>
  );
};

export default TournamentView;
