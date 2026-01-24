
import React, { useState } from 'react';
import { SUBJECTS, STRATEGIC_COMBINATIONS } from '../constants';
import { UserProgress } from '../types';

interface SubjectSelectionViewProps {
  user: UserProgress;
  onUpdateSubjects: (subjects: string[]) => void;
  onClose: () => void;
}

const SubjectSelectionView: React.FC<SubjectSelectionViewProps> = ({ user, onUpdateSubjects, onClose }) => {
  const [selectedElectives, setSelectedElectives] = useState<string[]>(user.chosenElectives);
  const [isCreative, setIsCreative] = useState(user.chosenElectives.length === 1 && user.chosenElectives[0] === 'creative');

  const toggleSubject = (id: string) => {
    if (isCreative) setIsCreative(false);
    
    if (selectedElectives.includes(id)) {
      setSelectedElectives(selectedElectives.filter(s => s !== id));
    } else {
      if (selectedElectives.length < 2) {
        setSelectedElectives([...selectedElectives, id]);
      } else {
        // Replace the last selected if already 2
        setSelectedElectives([selectedElectives[1], id]);
      }
    }
  };

  const selectCombination = (ids: string[]) => {
    setIsCreative(false);
    setSelectedElectives(ids);
  };

  const selectCreative = () => {
    setIsCreative(true);
    setSelectedElectives(['creative']);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-32">
      <header className="text-center space-y-3 px-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Болашақ мамандығың 🎯</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">ҰБТ-да тапсыратын бағытыңды таңда. Әр комбинация белгілі бір мамандықтарға жол ашады.</p>
      </header>

      {/* Path Choice: Regular vs Creative */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <button 
          onClick={() => setIsCreative(false)}
          className={`p-6 rounded-[35px] border-2 flex flex-col items-center gap-3 transition-all relative group ${
            !isCreative ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-100 bg-white hover:border-emerald-200'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${!isCreative ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Стандарт бағыт</span>
          {!isCreative && <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>}
        </button>

        <button 
          onClick={selectCreative}
          className={`p-6 rounded-[35px] border-2 flex flex-col items-center gap-3 transition-all relative group ${
            isCreative ? 'border-indigo-500 bg-indigo-50 shadow-xl shadow-indigo-100' : 'border-gray-100 bg-white hover:border-indigo-200'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${isCreative ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <i className="fas fa-palette"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Шығармашылық</span>
          {isCreative && <div className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>}
        </button>
      </div>

      {!isCreative && (
        <>
          {/* Strategic Combinations */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 px-4">
              <div className="h-0.5 flex-1 bg-gray-100"></div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Танымал комбинациялар</h4>
              <div className="h-0.5 flex-1 bg-gray-100"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 px-2">
              {STRATEGIC_COMBINATIONS.map((combo) => {
                const isSelected = !isCreative && JSON.stringify(selectedElectives.sort()) === JSON.stringify([...combo.subjects].sort());
                return (
                  <button
                    key={combo.id}
                    onClick={() => selectCombination(combo.subjects)}
                    className={`w-full p-6 rounded-[40px] border-2 text-left transition-all relative overflow-hidden group ${
                      isSelected ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-50 bg-white hover:border-emerald-100'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${combo.color} rounded-[24px] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                        <i className={`fas ${combo.icon}`}></i>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-900 text-lg tracking-tight">{combo.name}</h4>
                          {isSelected && <i className="fas fa-check-circle text-emerald-500 animate-in zoom-in"></i>}
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{combo.desc}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                       РЕКОМЕНДАЦИЯ
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Individual Subject Selection */}
          <section className="space-y-5 pt-4">
             <div className="flex items-center justify-between px-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Жеке пәндерді таңдау</h4>
              <span className={`text-[9px] font-black px-3 py-1 rounded-full transition-colors ${
                selectedElectives.length === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {selectedElectives.length} / 2 ТАҢДАЛДЫ
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 px-2">
              {SUBJECTS.filter(s => s.isElective).map((sub) => {
                const isSelected = !isCreative && selectedElectives.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubject(sub.id)}
                    className={`p-5 rounded-[30px] border-2 flex flex-col items-center gap-3 transition-all group ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                        : 'border-gray-50 bg-white hover:border-gray-100 opacity-70 grayscale-[0.5]'
                    }`}
                  >
                    <div className={`${sub.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                      <i className={`fas ${sub.icon}`}></i>
                    </div>
                    <span className="text-[11px] font-black text-gray-800 text-center uppercase tracking-tighter leading-tight">{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {isCreative && (
        <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-sm text-center animate-in zoom-in mx-2 space-y-8">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[35px] flex items-center justify-center mx-auto text-4xl shadow-inner">
            <i className="fas fa-palette"></i>
          </div>
          <div className="space-y-3">
            <h4 className="text-2xl font-black text-gray-900">Шығармашылық емтихан бағыты</h4>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
              Бұл бағытта сіз ҰБТ-да тек <b>3 міндетті пәннен</b> (Мат. сауаттылық, Оқу сауаттылығы, Қазақстан тарихы) тест тапсырасыз.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-[35px] border border-indigo-100 flex flex-col gap-3">
             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Маңызды ақпарат</p>
             <p className="text-xs text-indigo-900 font-bold leading-relaxed">
               Екі таңдау пәнінің орнына жоғары оқу орнында екі шығармашылық емтихан тапсырасыз.
             </p>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-6 right-6 z-50">
        <button
          disabled={!isCreative && selectedElectives.length < 2}
          onClick={() => {
            onUpdateSubjects(selectedElectives);
            onClose();
          }}
          className={`w-full py-6 rounded-[32px] font-black shadow-2xl transition-all flex items-center justify-center gap-3 ${
            !isCreative && selectedElectives.length < 2 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200' 
              : 'bg-gray-900 text-white hover:scale-[1.02] active:scale-95 shadow-gray-300'
          }`}
        >
          {(!isCreative && selectedElectives.length < 2) ? '2 пән таңдаңыз' : 'Таңдауды сақтау'}
          {(!isCreative && selectedElectives.length === 2) || isCreative ? <i className="fas fa-arrow-right text-xs"></i> : null}
        </button>
      </div>
    </div>
  );
};

export default SubjectSelectionView;
