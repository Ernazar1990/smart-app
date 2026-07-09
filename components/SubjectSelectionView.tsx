
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
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);

  const hasInitialSelection = user.chosenElectives && user.chosenElectives.length > 0;

  const handleSave = () => {
    const isSelectionChanged = JSON.stringify(selectedElectives.sort()) !== JSON.stringify(user.chosenElectives.sort());
    
    if (hasInitialSelection && isSelectionChanged && !showPaymentWarning) {
      setShowPaymentWarning(true);
      return;
    }

    onUpdateSubjects(selectedElectives);
    onClose();
  };

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
    <div className="space-y-4 animate-in slide-in-from-bottom duration-700 pb-20 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-40 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

      <header className="text-center space-y-1.5 px-6 pt-1">
        <div className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">
          ҰБТ 2026 • ТАҢДАУ
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none">Болашақ мамандығың 🎯</h2>
        <p className="text-gray-500 text-[10px] md:text-xs max-w-[400px] mx-auto leading-relaxed font-medium">ҰБТ-да тапсыратын бағытыңды таңда. Әр комбинация белгілі бір мамандықтарға жол ашады.</p>
      </header>

      {/* Path Choice: Regular vs Creative */}
      <div className="grid grid-cols-2 gap-3 px-4 max-w-2xl mx-auto w-full">
        <button 
          onClick={() => setIsCreative(false)}
          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all duration-300 relative group overflow-hidden ${
            !isCreative 
              ? 'border-emerald-500 bg-white shadow-md shadow-emerald-500/5 scale-[1.01]' 
              : 'border-gray-100 bg-gray-50/50 hover:border-emerald-200'
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-300 relative z-10 ${!isCreative ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-300 shadow-sm'}`}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="text-center relative z-10">
            <span className={`text-[9px] font-black uppercase tracking-wider block ${!isCreative ? 'text-emerald-700' : 'text-gray-400'}`}>Стандарт</span>
            <span className={`text-[7px] font-bold uppercase tracking-tighter block opacity-60 ${!isCreative ? 'text-emerald-500' : 'text-gray-400'}`}>5 пән</span>
          </div>
          {!isCreative && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>}
          {!isCreative && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>}
        </button>

        <button 
          onClick={selectCreative}
          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all duration-300 relative group overflow-hidden ${
            isCreative 
              ? 'border-indigo-500 bg-white shadow-md shadow-indigo-500/5 scale-[1.01]' 
              : 'border-gray-100 bg-gray-50/50 hover:border-indigo-200'
          }`}
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all duration-300 relative z-10 ${isCreative ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-300 shadow-sm'}`}>
            <i className="fas fa-palette"></i>
          </div>
          <div className="text-center relative z-10">
            <span className={`text-[9px] font-black uppercase tracking-wider block ${isCreative ? 'text-indigo-700' : 'text-gray-400'}`}>Шығармашылық</span>
            <span className={`text-[7px] font-bold uppercase tracking-tighter block opacity-60 ${isCreative ? 'text-indigo-500' : 'text-gray-400'}`}>3 пән</span>
          </div>
          {isCreative && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-50 rounded-full animate-pulse"></div>}
          {isCreative && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>}
        </button>
      </div>

      {!isCreative && (
        <>
          {/* Strategic Combinations */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 px-4">
              <div className="h-0.5 flex-1 bg-gray-100"></div>
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Танымал комбинациялар</h4>
              <div className="h-0.5 flex-1 bg-gray-100"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
              {STRATEGIC_COMBINATIONS.map((combo) => {
                const isSelected = !isCreative && JSON.stringify(selectedElectives.sort()) === JSON.stringify([...combo.subjects].sort());
                return (
                  <button
                    key={combo.id}
                    onClick={() => selectCombination(combo.subjects)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/25 shadow-md scale-[1.01]' 
                        : 'border-gray-100 bg-white hover:border-emerald-100 hover:shadow-sm'
                    }`}
                  >
                    {/* Decorative Background Element */}
                    <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br ${combo.color} opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity`}></div>
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${combo.color} rounded-lg flex items-center justify-center text-white text-base shadow-sm group-hover:rotate-3 transition-transform duration-300`}>
                        <i className={`fas ${combo.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-black text-gray-900 text-xs tracking-tight truncate">{combo.name}</h4>
                          {isSelected && (
                            <div className="bg-emerald-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded">
                              ТАҢДАЛДЫ
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 font-semibold leading-tight line-clamp-1 mt-0.5">{combo.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 text-white rotate-0' : 'bg-gray-50 text-gray-300 -rotate-45 group-hover:rotate-0 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                        <i className={`fas ${isSelected ? 'fa-check' : 'fa-arrow-right'} text-[9px]`}></i>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Individual Subject Selection */}
          <section className="space-y-3">
             <div className="flex items-center justify-between px-6">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Жеке пәндерді таңдау</h4>
              <span className={`text-[8px] font-black px-2.5 py-0.5 rounded-full transition-colors ${
                selectedElectives.length === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {selectedElectives.length} / 2 ТАҢДАЛДЫ
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-2">
              {SUBJECTS.filter(s => s.isElective).map((sub) => {
                const isSelected = !isCreative && selectedElectives.includes(sub.id);
                const colorName = sub.color.replace('bg-', '').split('-')[0];
                
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubject(sub.id)}
                    className={`relative p-3 rounded-xl border-2 flex flex-col items-center gap-2.5 transition-all duration-300 group overflow-hidden ${
                      isSelected 
                        ? `border-${colorName}-500 bg-${colorName}-50/30 shadow-md` 
                        : 'border-gray-100 bg-white hover:border-gray-200 opacity-90'
                    }`}
                  >
                    {/* Background Pattern/Glow */}
                    {isSelected && (
                      <div className={`absolute -right-4 -top-4 w-12 h-12 bg-${colorName}-500/10 rounded-full blur-xl`}></div>
                    )}
                    
                    <div className={`${sub.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-base shadow-sm group-hover:scale-105 transition-transform duration-300 relative z-10`}>
                      <i className={`fas ${sub.icon}`}></i>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <i className={`fas fa-check text-[8px] text-${colorName}-600`}></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center space-y-0.5 relative z-10">
                      <span className={`text-[9px] font-black uppercase tracking-tight leading-tight block ${isSelected ? `text-${colorName}-700` : 'text-gray-700'}`}>
                        {sub.name}
                      </span>
                      <span className={`text-[7px] font-bold uppercase tracking-widest block opacity-60 ${isSelected ? `text-${colorName}-500` : 'text-gray-400'}`}>
                        {isSelected ? 'Таңдалды' : 'Таңдау'}
                      </span>
                    </div>

                    {/* Selection Indicator Bar */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${isSelected ? sub.color : 'bg-transparent'}`}></div>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {isCreative && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center animate-in zoom-in mx-2 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto text-xl shadow-inner">
            <i className="fas fa-palette"></i>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-black text-gray-900">Шығармашылық емтихан бағыты</h4>
            <p className="text-gray-500 text-[11px] leading-relaxed max-w-[280px] mx-auto">
              Бұл бағытта сіз ҰБТ-да тек <b>3 міндетті пәннен</b> (Мат. сауаттылық, Оқу сауаттылығы, Қазақстан тарихы) тест тапсырасыз.
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col gap-1.5">
             <p className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.2em]">Маңызды ақпарат</p>
             <p className="text-[10px] text-indigo-900 font-bold leading-relaxed">
               Екі таңдау пәнінің орнына жоғары оқу орнында екі шығармашылық емтихан тапсырасыз.
             </p>
          </div>
        </div>
      )}

      {showPaymentWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-in zoom-in duration-300">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto text-xl">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-outfit">Пәндерді өзгерту</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Таңдау пәндерін өзгерту үшін қосымша жазылым қажет. Бұл операция ақылы негізде орындалады.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800/50">
               <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Құны</p>
               <p className="text-sm font-black text-slate-900 dark:text-white">2 500 ₸</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleSave}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all"
              >
                Төлем жасау және сақтау
              </button>
              <button 
                onClick={() => setShowPaymentWarning(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-200 transition-all"
              >
                Болдырмау
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
        <button
          disabled={!isCreative && selectedElectives.length < 2}
          onClick={handleSave}
          className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
            !isCreative && selectedElectives.length < 2 
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200' 
              : 'bg-gray-900 text-white hover:scale-[1.01] active:scale-95 shadow-lg shadow-gray-900/10'
          }`}
        >
          {(!isCreative && selectedElectives.length < 2) ? '2 пән таңдаңыз' : 'Таңдауды сақтау'}
          {(!isCreative && selectedElectives.length === 2) || isCreative ? <i className="fas fa-arrow-right text-[10px]"></i> : null}
        </button>
      </div>
    </div>
  );
};

export default SubjectSelectionView;
