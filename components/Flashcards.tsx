
import React, { useState } from 'react';

interface Card {
  id: number;
  front: string;
  back: string;
  category: string;
}

const CHEMISTRY_CARDS: Card[] = [
  { id: 1, front: "H2SO4", back: "Күкірт қышқылы", category: "Формулалар" },
  { id: 2, front: "Авогадро саны", back: "6.02 * 10^23 моль^-1", category: "Тұрақтылар" },
  { id: 3, front: "NaOH", back: "Натрий гидроксиді (Күйдіргіш натр)", category: "Негіздер" },
  { id: 4, front: "Алкандардың жалпы формуласы", back: "CnH2n+2", category: "Органика" },
  { id: 5, front: "CuSO4", back: "Мыс купоросы (Мыс (II) сульфаты)", category: "Тұздар" },
  { id: 6, front: "Бертолле тұзы", back: "KClO3", category: "Тұздар" },
];

interface FlashcardsProps {
  onBack?: () => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);

  const card = CHEMISTRY_CARDS[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((currentIdx + 1) % CHEMISTRY_CARDS.length);
    }, 150);
  };

  const handleMastered = () => {
    if (!mastered.includes(card.id)) {
      setMastered([...mastered, card.id]);
    }
    handleNext();
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="text-center space-y-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Смарт Карточкалар 🧠</h2>
        <p className="text-gray-500 text-xs">Жылдам жаттауға арналған тиімді әдіс</p>
        <div className="flex justify-center gap-2 mt-4">
           <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
             Меңгерілді: {mastered.length} / {CHEMISTRY_CARDS.length}
           </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center gap-10 perspective-1000">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full max-w-sm aspect-[3/4] cursor-pointer transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 bg-white dark:bg-slate-800 border-4 border-emerald-100 dark:border-emerald-900/50 rounded-[50px] shadow-2xl flex flex-col items-center justify-center p-10 backface-hidden">
            <span className="absolute top-8 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{card.category}</span>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white text-center font-outfit leading-tight">
              {card.front}
            </h3>
            <p className="absolute bottom-10 text-[10px] text-gray-300 font-black uppercase tracking-widest animate-pulse">Аудару үшін бас</p>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 bg-emerald-600 rounded-[50px] shadow-2xl flex flex-col items-center justify-center p-10 backface-hidden rotate-y-180 text-white text-center">
            <span className="absolute top-8 text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em]">Жауабы</span>
            <h3 className="text-3xl font-black font-outfit leading-tight">
              {card.back}
            </h3>
            <div className="absolute bottom-12 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
               <i className="fas fa-check text-xl"></i>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <button 
            onClick={handleNext}
            className="flex-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 py-5 rounded-3xl font-black text-gray-400 hover:text-gray-600 transition-all uppercase text-[10px] tracking-widest"
          >
            Келесі
          </button>
          <button 
            onClick={handleMastered}
            className="flex-1 bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-lg shadow-emerald-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
          >
            Жаттадым ✨
          </button>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcards;
