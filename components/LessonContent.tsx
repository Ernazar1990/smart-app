
import React, { useState } from 'react';
import { Lesson } from '../types';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete }) => {
  const [step, setStep] = useState(1);
  const [hwIdx, setHwIdx] = useState(0);
  const [hwAnswers, setHwAnswers] = useState<number[]>([]);
  const [homeworkDone, setHomeworkDone] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [reinforcementSelected, setReinforcementSelected] = useState<number | null>(null);
  const [reinforcementResult, setReinforcementResult] = useState<'correct' | 'wrong' | null>(null);

  const handleReinforcementCheck = () => {
    if (reinforcementSelected === null) return;
    if (reinforcementSelected === lesson.reinforcement.correctAnswer) {
      setReinforcementResult('correct');
      setTimeout(() => setStep(4), 1000);
    } else {
      setReinforcementResult('wrong');
      alert("Қате! Тағы да ойланып көр.");
      setReinforcementResult(null);
    }
  };

  const handleHwNext = () => {
    if (selectedOpt === null) return;
    
    const newAnswers = [...hwAnswers, selectedOpt];
    setHwAnswers(newAnswers);
    setSelectedOpt(null);

    if (hwIdx < lesson.homework.length - 1) {
      setHwIdx(hwIdx + 1);
    } else {
      setHomeworkDone(true);
      onComplete();
    }
  };

  const steps = [
    { id: 1, label: 'Видео', icon: 'fa-play' },
    { id: 2, label: 'Конспект', icon: 'fa-file-alt' },
    { id: 3, label: 'Бекіту', icon: 'fa-vial' },
    { id: 4, label: 'Үй жұмысы', icon: 'fa-tasks' },
  ];

  const score = hwAnswers.reduce((acc, ans, i) => 
    ans === lesson.homework[i].correctAnswer ? acc + 1 : acc, 0
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-24">
      {/* Stepper Header */}
      <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm sticky top-4 z-20">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-100 -z-10"></div>
          {steps.map((s) => {
            const isCompleted = step > s.id || (s.id === 4 && homeworkDone);
            const isCurrent = step === s.id && !(s.id === 4 && homeworkDone);
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs border-4 transition-all ${
                  isCompleted ? 'bg-emerald-500 border-emerald-100 text-white' : 
                  isCurrent ? 'bg-white border-emerald-500 text-emerald-600 scale-110' : 'bg-white border-gray-100 text-gray-300'
                }`}>
                  {isCompleted ? <i className="fas fa-check"></i> : <i className={`fas ${s.icon}`}></i>}
                </div>
                <span className={`text-[9px] font-black uppercase ${isCurrent ? 'text-emerald-600' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[450px]">
        {step === 1 && (
          <div className="animate-in fade-in">
            <div className="aspect-video bg-black">
              <iframe className="w-full h-full" src={lesson.videoUrl} title="Video" allowFullScreen></iframe>
            </div>
            <div className="p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 font-outfit">{lesson.title}</h3>
                <p className="text-gray-500 text-sm mt-1">Видеоны мұқият соңына дейін көріңіз.</p>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-lg">Келесі: Конспект</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 space-y-8 animate-in fade-in text-center">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[35px] flex items-center justify-center mx-auto text-4xl">
               <i className="fas fa-file-pdf"></i>
            </div>
            <h3 className="text-2xl font-black">Сабақ конспектісі</h3>
            <p className="text-gray-500">Презентация мен материалдарды жүктеп алып, дәптерге жазып алыңыз.</p>
            <a href={lesson.presentationUrl} target="_blank" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black">ЖҮКТЕУ (PDF)</a>
            <button onClick={() => setStep(3)} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-lg">Келесі: Бекіту</button>
          </div>
        )}

        {step === 3 && (
          <div className="p-10 space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-black font-outfit">Бекіту сұрағы 🧪</h3>
            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
               <p className="font-black text-gray-800 mb-8 italic text-lg leading-snug font-outfit">"{lesson.reinforcement.question}"</p>
               <div className="grid grid-cols-1 gap-4">
                  {lesson.reinforcement.options.map((opt, i) => (
                    <button key={i} onClick={() => setSelectedOpt(i)} className={`w-full p-5 rounded-3xl border-2 text-left font-bold transition-all flex items-center gap-4 ${
                      selectedOpt === i ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-100'
                    }`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${selectedOpt === i ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{String.fromCharCode(65+i)}</div>
                      {opt}
                    </button>
                  ))}
               </div>
            </div>
            <button disabled={selectedOpt === null} onClick={() => { setReinforcementSelected(selectedOpt); handleReinforcementCheck(); }} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black">Жауапты тексеру</button>
          </div>
        )}

        {step === 4 && (
          <div className="p-10 animate-in fade-in">
            {!homeworkDone ? (
              <div className="space-y-8">
                <div className="flex justify-between items-end px-2">
                   <h3 className="text-2xl font-black font-outfit">Үй жұмысы</h3>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hwIdx + 1} / {lesson.homework.length}</span>
                </div>
                <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                   <p className="font-black text-gray-800 mb-8 text-lg font-outfit">{lesson.homework[hwIdx].text}</p>
                   <div className="grid grid-cols-1 gap-4">
                    {lesson.homework[hwIdx].options.map((opt: string, i: number) => (
                       <button key={i} onClick={() => setSelectedOpt(i)} className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-5 ${
                         selectedOpt === i ? 'border-emerald-500 bg-emerald-50' : 'border-gray-50 hover:bg-white'
                       }`}>
                         <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${selectedOpt === i ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{String.fromCharCode(65+i)}</span>
                         <span className="font-bold">{opt}</span>
                       </button>
                     ))}
                   </div>
                </div>
                <button disabled={selectedOpt === null} onClick={handleHwNext} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-lg">
                  {hwIdx === lesson.homework.length - 1 ? 'Аяқтау' : 'Келесі'}
                </button>
              </div>
            ) : (
              <div className="space-y-10 text-center flex flex-col items-center">
                <div className="bg-emerald-600 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden w-full">
                  <h4 className="text-4xl font-black mb-2 font-outfit">{score} / {lesson.homework.length}</h4>
                  <p className="text-emerald-100">Тамаша! Енді қатемен жұмыс жасайық.</p>
                </div>
                
                <div className="w-full space-y-6">
                   <h4 className="text-xl font-black text-gray-800 text-left font-outfit">Қатемен жұмыс (Талдау)</h4>
                   <div className="aspect-video bg-black rounded-[40px] overflow-hidden">
                      <iframe className="w-full h-full" src={lesson.analysisVideoUrl} title="Analysis" allowFullScreen></iframe>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <a href={lesson.pdfSolutionUrl} target="_blank" className="bg-white border border-gray-100 p-6 rounded-[35px] flex flex-col items-center gap-2">
                        <i className="fas fa-file-pdf text-red-500 text-3xl"></i>
                        <span className="text-[10px] font-black uppercase">PDF Талдау</span>
                      </a>
                      <button onClick={() => window.history.back()} className="bg-slate-900 text-white p-6 rounded-[35px] flex flex-col items-center gap-2">
                        <i className="fas fa-home text-3xl"></i>
                        <span className="text-[10px] font-black uppercase">Басты бет</span>
                      </button>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
