
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Award, Brain, CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';
import { generateWeeklyTest } from '../geminiService';
import { Question } from '../types';

interface WeeklyTestViewProps {
  subjectId: string;
  subjectName: string;
  topics: string[];
  onComplete: (score: number, totalPoints: number) => void;
  onClose: () => void;
  onAnswerQuestion?: () => void;
}

const WeeklyTestView: React.FC<WeeklyTestViewProps> = ({ subjectId, subjectName, topics, onComplete, onClose, onAnswerQuestion }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<any[]>([]); // Track user answers
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes for 40 questions
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const generated = await generateWeeklyTest(subjectName, topics);
        setQuestions(generated);
      } catch (error) {
        console.error("Failed to generate test:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectId, subjectName, topics]);

  useEffect(() => {
    if (loading || showResult || isTimeUp) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, showResult, isTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (idx: number) => {
    const q = questions[currentIdx];
    if (q.isMulti) {
      if (selectedOptions.includes(idx)) {
        setSelectedOptions(selectedOptions.filter(o => o !== idx));
      } else if (selectedOptions.length < 3) {
        setSelectedOptions([...selectedOptions, idx].sort());
      }
    } else {
      setSelectedOptions([idx]);
    }
    if (onAnswerQuestion) onAnswerQuestion();
  };

  const calculateScore = () => {
    let score = 0;
    let totalPoints = 0;

    questions.forEach((q, idx) => {
      const userAns = answers[idx] || [];
      if (!q.isMulti) {
        totalPoints += 1;
        if (userAns[0] === q.correctAnswer) score += 1;
      } else {
        totalPoints += 2; // Multi-choice is worth 2 points
        const correct = q.correctAnswers || [];
        const correctCount = userAns.filter((a: number) => correct.includes(a)).length;
        const wrongCount = userAns.filter((a: number) => !correct.includes(a)).length;

        if (correctCount === correct.length && wrongCount === 0) {
          score += 2;
        } else if (correctCount >= 1 && wrongCount === 0 && correctCount >= correct.length - 1) {
          score += 1;
        }
      }
    });

    return { score, totalPoints };
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = selectedOptions;
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOptions(newAnswers[currentIdx + 1] || []);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers: any[]) => {
    setShowResult(true);
    const { score, totalPoints } = calculateScore();
    onComplete(score, totalPoints);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Тест дайындалуда...</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">AI сіздің сабақтарыңыз негізінде арнайы 40 сұрақ құрастыруда</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const { score, totalPoints } = calculateScore();
    const percent = Math.round((score / totalPoints) * 100);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-10 px-4 space-y-8"
      >
        <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 text-center shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-700">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-indigo-600"
            />
          </div>

          <div className="mb-6 inline-flex p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
            <Award size={48} />
          </div>

          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{score} / {totalPoints}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Жалпы ұпай саны</p>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-black text-indigo-600">{percent}%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Пайыз</p>
            </div>
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-black text-emerald-600">+{score * 2}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Рейтинг XP</p>
            </div>
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <p className="text-2xl font-black text-amber-600">{questions.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Сұрақтар</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white px-4">Сұрақтарға шолу</h3>
          <div className="grid grid-cols-8 gap-2 px-2">
            {questions.map((q, idx) => {
              const userAns = answers[idx] || [];
              let isCorrect = false;
              if (!q.isMulti) {
                isCorrect = userAns[0] === q.correctAnswer;
              } else {
                const correct = q.correctAnswers || [];
                isCorrect = userAns.length === correct.length && userAns.every((a: number) => correct.includes(a));
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setShowResult(false);
                    setCurrentIdx(idx);
                    setSelectedOptions(answers[idx] || []);
                  }}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black shadow-sm transition-all hover:scale-110 ${
                    isCorrect 
                      ? 'bg-emerald-500 text-white' 
                      : userAns.length > 0 ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[30px] font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Аяқтау және шығу
        </button>
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-32 pt-4 px-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[30px] shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-4 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{subjectName}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Апталық тест</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Сұрақ {currentIdx + 1} / {questions.length}</p>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-600" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/50">
            <Clock size={16} />
            <span className="text-sm font-black font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Topics Info */}
      <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl flex items-start gap-3 border border-indigo-100 dark:border-indigo-900/30">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-indigo-800 dark:text-indigo-300 font-bold leading-relaxed">
          Тест мына тақырыптарды қамтиды: {topics.join(', ')}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-slate-800 rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 min-h-[450px] relative overflow-hidden"
        >
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Сұрақ {currentIdx + 1}
                </span>
                {q.isMulti && (
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Бірнеше жауап
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {q.text}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {q.options.map((option: string, idx: number) => {
                const isSelected = selectedOptions.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className={`group w-full p-5 rounded-[24px] border-2 text-left transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 shadow-md ring-4 ring-indigo-500/10' 
                        : 'border-slate-50 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-sm font-bold flex-1">{option}</span>
                    {isSelected && <CheckCircle2 className="text-indigo-600" size={20} />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-[100]">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={() => {
              if (currentIdx > 0) {
                const newAnswers = [...answers];
                newAnswers[currentIdx] = selectedOptions;
                setAnswers(newAnswers);
                setCurrentIdx(currentIdx - 1);
                setSelectedOptions(newAnswers[currentIdx - 1] || []);
              }
            }}
            disabled={currentIdx === 0}
            className="px-8 py-5 rounded-[24px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black border border-slate-100 dark:border-slate-700 shadow-xl disabled:opacity-50 active:scale-95 transition-all"
          >
            Артқа
          </button>
          <button
            onClick={handleNext}
            disabled={selectedOptions.length === 0}
            className={`flex-1 py-5 rounded-[24px] font-black text-white shadow-2xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              selectedOptions.length === 0 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
            }`}
          >
            {currentIdx === questions.length - 1 ? 'Тестіні аяқтау' : 'Келесі сұрақ'}
            <ArrowLeft className="rotate-180" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTestView;
