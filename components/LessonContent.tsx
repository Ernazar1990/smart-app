
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, AppView, UserProgress } from '../types';

interface LessonContentProps {
  lesson: Lesson;
  user: UserProgress;
  onComplete: () => void;
  onClose: () => void;
  onOpenView?: (view: AppView) => void;
  onAnswerQuestion?: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, user, onComplete, onClose, onOpenView, onAnswerQuestion }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'presentation' | 'quiz' | 'homework' | 'correction'>('video');
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [videoWatched, setVideoWatched] = useState(false);

  const isLockedForUser = !lesson.isFree && user.subscription === 'Free';

  if (isLockedForUser) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[40px] p-10 text-center space-y-8 shadow-2xl animate-in zoom-in">
          <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-[35px] flex items-center justify-center text-4xl mx-auto shadow-sm">
            <i className="fas fa-lock"></i>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black font-outfit text-slate-900 dark:text-white">Бұл сабақ жабық 🔒</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Бұл сабақты көру үшін <b>Premium</b> жазылымы қажет. Бірінші сабақтар барлығына тегін, ал қалғандары тек жазылушыларға қолжетімді.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => onOpenView?.('subscription')}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-[1.02] transition-all"
            >
              Premium-ға өту
            </button>
            <button 
              onClick={onClose}
              className="w-full py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Артқа
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'video', label: 'Видео', icon: 'fa-play', required: true },
    { id: 'presentation', label: 'Конспект', icon: 'fa-file-alt', required: false },
    { id: 'quiz', label: 'Тест', icon: 'fa-vial', required: true },
    { id: 'homework', label: 'Тапсырма', icon: 'fa-tasks', required: false },
    { id: 'correction', label: 'Талдау', icon: 'fa-history', required: false },
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }
    
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1].id as any;
      setActiveTab(nextTab);
    } else {
      onComplete();
      onClose();
    }
  };

  const canGoNext = activeTab !== 'video' || videoWatched || completedTabs.includes('video');

  const quickTools = [
    { id: 'glossary', label: 'Терминдер', icon: 'fa-spell-check', color: 'text-teal-500' },
    { id: 'formulas', label: 'Формулалар', icon: 'fa-square-root-variable', color: 'text-cyan-600' },
    { id: 'periodic-table', label: 'Кесте', icon: 'fa-table-cells', color: 'text-amber-500' },
  ];

  const handleVideoComplete = () => {
    setVideoWatched(true);
    if (!completedTabs.includes('video')) {
      setCompletedTabs([...completedTabs, 'video']);
    }
  };

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const reinforcement = lesson.reinforcement || [];
  const homework = lesson.homework || [];

  const handleQuizAnswer = (qIdx: number, aIdx: number) => {
    if (showFeedback) return;
    setQuizAnswers({ ...quizAnswers, [qIdx]: aIdx });
    setShowFeedback(true);
    if (onAnswerQuestion) onAnswerQuestion();
  };

  const handleNextQuiz = () => {
    setShowFeedback(false);
    if (quizIndex < reinforcement.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const quizScore = reinforcement.reduce((acc, q, idx) => {
    return acc + (quizAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  const [hwAnswers, setHwAnswers] = useState<Record<number, number>>({});

  const handleHwAnswer = (qIdx: number, aIdx: number) => {
    if (hwAnswers[qIdx] !== undefined) return;
    setHwAnswers({ ...hwAnswers, [qIdx]: aIdx });
    if (onAnswerQuestion) onAnswerQuestion();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col animate-in fade-in">
      <div className="w-full h-full flex flex-col overflow-hidden">
        
        {/* Ultra Compact Header */}
        <header className="px-4 py-2 md:px-6 md:py-3 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all border border-gray-100 dark:border-slate-700">
              <i className="fas fa-times text-xs"></i>
            </button>
            <div>
              <h3 className="text-[10px] md:text-xs font-black text-slate-800 dark:text-white font-outfit leading-tight uppercase tracking-tight">{lesson.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[7px] md:text-[8px] text-slate-400 font-black uppercase tracking-widest">40–60 мин</span>
                <div className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <span className="text-[7px] md:text-[8px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                  <i className="fas fa-coins"></i> 10 балл
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {quickTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => onOpenView?.(tool.id as AppView)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-indigo-500 transition-all group"
              >
                <i className={`fas ${tool.icon} ${tool.color} text-[10px]`}></i>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hidden sm:inline">{tool.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] dark:bg-slate-950 ${activeTab === 'video' ? 'p-0' : 'p-4 md:p-8'}`}>
           {activeTab === 'video' && (
             <div className="h-full flex flex-col animate-in fade-in bg-slate-50 dark:bg-slate-950">
                <div className="flex-1 flex items-center justify-center p-1 md:p-4">
                   <div className="w-full max-w-4xl bg-white dark:bg-slate-900 p-3 md:p-6 rounded-[32px] md:rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <i className="fas fa-video text-indigo-600 text-base"></i>
                        <h4 className="text-[10px] font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-[0.2em]">Бейнесабақты қарау</h4>
                      </div>
                      
                      <div className="w-full aspect-video bg-black rounded-[20px] md:rounded-[28px] overflow-hidden shadow-2xl relative border border-gray-100 dark:border-slate-800">
                        <iframe 
                          className="absolute inset-0 w-full h-full" 
                          src={lesson.videoUrl} 
                          title="Video" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'presentation' && (
             <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in zoom-in duration-500">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm text-center space-y-8">
                  <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-[35px] flex items-center justify-center text-4xl mx-auto shadow-sm">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black font-outfit text-slate-800 dark:text-white">Сабақ конспектісі</h4>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                      Бұл файлда сабақтың барлық маңызды теориялық бөлімі жинақталған. Жүктеп алып, қайталап шығыңыз.
                    </p>
                  </div>
                  <a 
                    href={lesson.presentationUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                  >
                    Файлды жүктеу <i className="fas fa-download"></i>
                  </a>
                </div>
             </div>
           )}

           {activeTab === 'quiz' && (
             <div className="max-w-4xl mx-auto py-10 animate-in fade-in">
                {reinforcement.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm text-center space-y-8">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-[35px] flex items-center justify-center text-4xl mx-auto shadow-sm">
                      <i className="fas fa-vial"></i>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-black font-outfit text-slate-800 dark:text-white">Бекіту тапсырмасы</h4>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                        Бұл сабаққа әлі тест қосылмаған.
                      </p>
                    </div>
                  </div>
                ) : showQuizResult ? (
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm text-center space-y-8">
                    <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-[35px] flex items-center justify-center text-4xl mx-auto shadow-sm">
                      <i className="fas fa-trophy"></i>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-black font-outfit text-slate-800 dark:text-white">Нәтиже</h4>
                      <p className="text-4xl font-black text-indigo-600 font-outfit">{quizScore} / {reinforcement.length}</p>
                      <p className="text-slate-500 text-sm">Тамаша! Сіз сабақты жақсы меңгердіңіз.</p>
                    </div>
                    <button 
                      onClick={() => { setShowQuizResult(false); setQuizAnswers({}); setQuizIndex(0); }}
                      className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                    >
                      Қайта тапсыру
                    </button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-vial text-indigo-500 text-[10px]"></i>
                        <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Бекіту тапсырмасы</h5>
                      </div>
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full uppercase tracking-widest">
                        {quizIndex + 1} / {reinforcement.length}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-black font-outfit text-slate-800 dark:text-white leading-tight">
                      {reinforcement[quizIndex].question}
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {reinforcement[quizIndex].options.map((opt, idx) => {
                        const isSelected = quizAnswers[quizIndex] === idx;
                        const isCorrect = reinforcement[quizIndex].correctAnswer === idx;
                        
                        let buttonClass = 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500';
                        let iconClass = 'bg-white dark:bg-slate-900 text-slate-400';

                        if (showFeedback) {
                          if (isCorrect) {
                            buttonClass = 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none';
                            iconClass = 'bg-white/20 text-white';
                          } else if (isSelected) {
                            buttonClass = 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100 dark:shadow-none';
                            iconClass = 'bg-white/20 text-white';
                          }
                        } else if (isSelected) {
                          buttonClass = 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none';
                          iconClass = 'bg-white/20 text-white';
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(quizIndex, idx)}
                            className={`p-5 rounded-2xl border text-left transition-all flex items-center gap-4 group ${buttonClass}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${iconClass}`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="font-bold text-sm">{opt}</span>
                            {showFeedback && isCorrect && <i className="fas fa-check-circle ml-auto text-white"></i>}
                            {showFeedback && isSelected && !isCorrect && <i className="fas fa-times-circle ml-auto text-white"></i>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between pt-4">
                      <button 
                        disabled={quizIndex === 0 || showFeedback}
                        onClick={() => setQuizIndex(quizIndex - 1)}
                        className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 disabled:opacity-30"
                      >
                        Артқа
                      </button>
                      <button 
                        disabled={quizAnswers[quizIndex] === undefined}
                        onClick={handleNextQuiz}
                        className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${
                          quizAnswers[quizIndex] === undefined 
                            ? 'bg-gray-100 text-gray-400 opacity-50' 
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {quizIndex < reinforcement.length - 1 ? 'Келесі' : 'Аяқтау'}
                      </button>
                    </div>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'homework' && (
             <div className="max-w-4xl mx-auto py-10 animate-in fade-in space-y-6">
                {homework.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm text-center space-y-8">
                    <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-[35px] flex items-center justify-center text-4xl mx-auto shadow-sm">
                      <i className="fas fa-tasks"></i>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-black font-outfit text-slate-800 dark:text-white">Үй жұмысы</h4>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                        Бұл сабаққа әлі үй тапсырмасы қосылмаған.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-6">
                        <i className="fas fa-tasks text-indigo-500 text-[10px]"></i>
                        <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Үй тапсырмасы</h5>
                      </div>
                      <div className="space-y-8">
                        {homework.map((hw, idx) => (
                          <div key={idx} className="space-y-4">
                            <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
                                {idx + 1}
                              </div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{hw.question}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                              {hw.options.map((opt, oIdx) => {
                                const isSelected = hwAnswers[idx] === oIdx;
                                const isCorrect = hw.correctAnswer === oIdx;
                                const hasAnswered = hwAnswers[idx] !== undefined;

                                let statusClass = 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300';
                                if (hasAnswered) {
                                  if (isCorrect) statusClass = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300';
                                  else if (isSelected) statusClass = 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300';
                                  else statusClass = 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 opacity-50';
                                }

                                return (
                                  <button 
                                    key={oIdx} 
                                    disabled={hasAnswered}
                                    onClick={() => handleHwAnswer(idx, oIdx)}
                                    className={`p-4 border rounded-xl text-xs font-medium transition-all text-left flex items-center gap-2 ${statusClass}`}
                                  >
                                    <span className={`font-black ${hasAnswered && isCorrect ? 'text-emerald-500' : 'text-indigo-500'}`}>
                                      {String.fromCharCode(65 + oIdx)})
                                    </span> 
                                    {opt}
                                    {hasAnswered && isCorrect && <i className="fas fa-check-circle ml-auto"></i>}
                                    {hasAnswered && isSelected && !isCorrect && <i className="fas fa-times-circle ml-auto"></i>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-1">
                        <h5 className="text-lg font-black font-outfit">Тапсырманы орындадыңыз ба?</h5>
                        <p className="text-xs text-indigo-100 opacity-80">Жауаптарды дәптерге жазып, кураторға жіберіңіз.</p>
                      </div>
                      <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
                        Кураторға жазу <i className="fab fa-whatsapp ml-2"></i>
                      </button>
                    </div>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'correction' && (
             <div className="max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in">
                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[45px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                   <div className="flex items-center gap-3 px-2">
                      <i className="fas fa-video text-indigo-600 text-lg"></i>
                      <h4 className="text-[11px] font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-[0.2em]">Бейне талдау</h4>
                   </div>
                   
                   <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl relative border border-gray-100 dark:border-slate-800">
                      <iframe 
                        className="absolute inset-0 w-full h-full" 
                        src={lesson.analysisVideoUrl} 
                        title="Analysis" 
                        allowFullScreen
                      ></iframe>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[45px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                   <div className="flex items-center gap-3 px-2">
                      <i className="fas fa-file-invoice text-emerald-600 text-lg"></i>
                      <h4 className="text-[11px] font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-[0.2em]">ПДФ Шешімдер</h4>
                   </div>
                   
                   <div className="flex flex-col items-center justify-center text-center py-6 space-y-6">
                      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-[30px] flex items-center justify-center text-3xl">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <p className="text-xs text-slate-500 font-medium max-w-xs">Әр есептің қадамдық жазбаша шешімі мен түсіндірмесі.</p>
                      <a href={lesson.pdfSolutionUrl} target="_blank" rel="noreferrer" className="w-full max-w-sm bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform">
                        Шешімді ашу <i className="fas fa-external-link-alt ml-2"></i>
                      </a>
                   </div>
                </div>

                {reinforcement.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-tasks text-indigo-500 text-sm"></i>
                      <h5 className="font-black text-sm uppercase tracking-widest text-slate-700 dark:text-slate-200">Тест сұрақтарының талдауы</h5>
                    </div>
                    <div className="space-y-6">
                      {reinforcement.map((q, idx) => (
                        <div key={idx} className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-4">
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{q.question}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                            {q.options.map((opt, oIdx) => (
                              <div 
                                key={oIdx} 
                                className={`p-4 rounded-xl text-xs font-medium border ${
                                  oIdx === q.correctAnswer 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 text-emerald-700 dark:text-emerald-300' 
                                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-slate-400'
                                }`}
                              >
                                <span className={`font-black mr-2 ${oIdx === q.correctAnswer ? 'text-emerald-500' : 'text-slate-300'}`}>
                                  {String.fromCharCode(65 + oIdx)})
                                </span> 
                                {opt}
                                {oIdx === q.correctAnswer && <i className="fas fa-check-circle ml-2 text-emerald-500"></i>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Sticky Footer with Tabs */}
        <footer className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.04)]">
          <div className="flex bg-gray-50 dark:bg-slate-800/50 p-1 rounded-xl border border-gray-100 dark:border-slate-800 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {tabs.map((tab, idx) => {
              const isLocked = idx > 0 && !completedTabs.includes(tabs[idx-1].id);
              const isActive = activeTab === tab.id;
              const isCompleted = completedTabs.includes(tab.id);

              return (
                <button
                  key={tab.id}
                  disabled={isLocked}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[70px] md:min-w-[100px] py-2 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 relative ${
                    isActive 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm border border-gray-100 dark:border-slate-600' 
                      : isLocked 
                        ? 'text-slate-300 cursor-not-allowed opacity-40'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <i className={`fas ${isLocked ? 'fa-lock' : isCompleted ? 'fa-check-circle text-emerald-500' : tab.icon} text-[10px]`}></i>
                  <span className="hidden xs:inline">{tab.label}</span>
                  {isActive && (
                    <motion.div layoutId="tab-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeTab === 'video' && (
              <div className="mr-1">
                {!videoWatched && !completedTabs.includes('video') ? (
                  <button 
                    onClick={handleVideoComplete}
                    className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-3 py-2 rounded-lg font-black text-[8px] uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
                  >
                    Видеоны көрдім <i className="fas fa-check-circle text-[9px]"></i>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                    <i className="fas fa-check-circle text-emerald-500 text-[9px]"></i>
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Көрілді</span>
                  </div>
                )}
              </div>
            )}

            {currentTabIndex > 0 && (
              <button 
                onClick={() => setActiveTab(tabs[currentTabIndex - 1].id as any)}
                className="px-3 py-2 rounded-lg font-black uppercase text-[8px] tracking-widest text-slate-400 hover:text-slate-600 transition-all"
              >
                Артқа
              </button>
            )}
            <button 
              disabled={!canGoNext}
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 group shadow-lg ${
                !canGoNext 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 dark:shadow-none'
              }`}
            >
              {isLastTab ? 'Аяқтау' : 'Келесі'}
              <i className={`fas ${isLastTab ? 'fa-check-circle' : 'fa-arrow-right'} text-[9px] group-hover:translate-x-1 transition-transform`}></i>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LessonContent;
