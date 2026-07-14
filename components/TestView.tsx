import React, { useState, useEffect, useRef } from 'react';
import { MOCK_QUESTIONS, SUBJECTS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { generateSubjectVariantTest } from '../geminiService';
import { ArrowLeft, BookOpen, Clock, Settings, Volume2, VolumeX, Sparkles, AlertTriangle, Check, X, Bookmark, BookmarkCheck, HelpCircle, Trophy, BarChart2, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TestViewProps {
  onComplete: (score: number) => void;
  onClose?: () => void;
  selectedSubjects?: string[]; // e.g., ['chem', 'bio']
  testType?: 'full' | 'chapter' | 'monthly';
  subjectId?: string | null;
  onAnswerQuestion?: () => void;
}

type TestTheme = 'midnight' | 'emerald' | 'light' | 'royal';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export const TestView: React.FC<TestViewProps> = ({ 
  onComplete, 
  onClose, 
  selectedSubjects = ['chem', 'bio'], 
  testType: initialTestType = 'full', 
  subjectId: initialSubjectId, 
  onAnswerQuestion 
}) => {
  // Config & Settings State
  const [testType, setTestType] = useState<'full' | 'subject'>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId || selectedSubjects[0] || 'chem');
  const [selectedVariant, setSelectedVariant] = useState<number>(1);
  const [useAiGenerator, setUseAiGenerator] = useState<boolean>(true);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [testStarted, setTestStarted] = useState(false);
  const [theme, setTheme] = useState<TestTheme>('midnight');
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Core Test Simulation State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<number, number[]>>({}); // question index -> selected option indices
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]); // list of flagged question indices
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // End of Test Results State
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});
  const [aiExplanationCache, setAiExplanationCache] = useState<Record<number, string>>({});
  const [loadingAiExp, setLoadingAiExp] = useState<Record<number, boolean>>({});

  // Navigation Panel Slideover
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  // Audio synthesis using browser AudioContext (no external mp3 files required!)
  const playSynthesizedSound = (type: 'correct' | 'incorrect' | 'click' | 'complete') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'correct') {
        // Double sweet note
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
      } else if (type === 'incorrect') {
        // Low sad buzzer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'complete') {
        // Majestic chord
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.6);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        });
      }
    } catch (e) {
      console.warn("Sound synthesis failed", e);
    }
  };

  // Timer Tick effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // Auto submit when time runs out
      setIsTimerActive(false);
      handleFinishTest();
    }
    return () => clearInterval(interval);
  }, [timeLeft, isTimerActive]);

  // Mix questions deterministically based on variant number to give 10 unique variants even on local mock data
  const mixQuestionsByVariant = (questionsList: any[], variant: number) => {
    const shuffled = [...questionsList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Deterministic pseudo-random index based on variant and index
      const j = Math.floor(Math.abs(Math.sin(variant * 10 + i) * 10000) % (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  };

  // Load selected test configurations
  const handleStartTest = async () => {
    setGenerationError(null);
    let finalQuestions: any[] = [];
    const subjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name || selectedSubject;

    if (testType === 'subject' && useAiGenerator) {
      setLoadingQuestions(true);
      try {
        const aiQuestions = await generateSubjectVariantTest(selectedSubject, subjectName, selectedVariant);
        if (aiQuestions && aiQuestions.length > 0) {
          // Map to match structure expected by the app
          finalQuestions = aiQuestions.map((q: any, index: number) => ({
            id: `ai-${selectedSubject}-v${selectedVariant}-${index}`,
            text: q.text,
            options: q.options,
            correctAnswer: q.isMulti && q.correctAnswers ? q.correctAnswers : (q.correctAnswer ?? 0),
            isMulti: q.isMulti || false,
            subject: selectedSubject,
            explanation: q.explanation || "Жауап дұрыс таңдалды."
          }));
        } else {
          throw new Error("Empty questions returned");
        }
      } catch (e: any) {
        console.error("AI Generation failed, falling back to local database", e);
        setGenerationError("AI арқылы нұсқаны жүктеу мүмкін болмады (интернет байланысы немесе кілт қатесі). Жергілікті база іске қосылды.");
        
        // Fallback to local
        const localFiltered = MOCK_QUESTIONS.filter(q => q.subject === selectedSubject);
        finalQuestions = mixQuestionsByVariant(localFiltered.length > 0 ? localFiltered : MOCK_QUESTIONS.filter(q => q.subject === 'chem'), selectedVariant);
      } finally {
        setLoadingQuestions(false);
      }
    } else {
      // Local Mode or Full Test
      if (testType === 'full') {
        const subjectsToLoad = [...selectedSubjects, 'history-kz', 'reading-lit', 'math-lit'];
        const fullFiltered = MOCK_QUESTIONS.filter(q => q.subject && subjectsToLoad.includes(q.subject));
        finalQuestions = mixQuestionsByVariant(fullFiltered, selectedVariant);
        setTimeLeft(120 * 60); // 2 hours for practice UNT
      } else {
        const localFiltered = MOCK_QUESTIONS.filter(q => q.subject === selectedSubject);
        finalQuestions = mixQuestionsByVariant(localFiltered.length > 0 ? localFiltered : MOCK_QUESTIONS.filter(q => q.subject === 'chem'), selectedVariant);
        setTimeLeft(40 * 60); // 40 minutes for single subject
      }
    }

    if (finalQuestions.length === 0) {
      finalQuestions = MOCK_QUESTIONS.filter(q => q.subject === 'chem');
    }

    setQuestions(finalQuestions);
    setCurrentIdx(0);
    setUserSelections({});
    setFlaggedQuestions([]);
    setTestStarted(true);
    setIsTimerActive(true);
    playSynthesizedSound('click');
  };

  // Option select handler
  const handleOptionClick = (optIdx: number) => {
    const q = questions[currentIdx];
    if (!q) return;

    playSynthesizedSound('click');

    const currentSelected = userSelections[currentIdx] || [];
    let updated: number[] = [];

    if (!q.isMulti) {
      // Single choice
      updated = [optIdx];
    } else {
      // Multiple choice (multi selection up to 3)
      if (currentSelected.includes(optIdx)) {
        updated = currentSelected.filter(idx => idx !== optIdx);
      } else {
        if (currentSelected.length < 3) {
          updated = [...currentSelected, optIdx];
        } else {
          updated = [...currentSelected.slice(1), optIdx];
        }
      }
    }

    setUserSelections(prev => ({
      ...prev,
      [currentIdx]: updated
    }));

    if (onAnswerQuestion) onAnswerQuestion();
  };

  // Bookmark / Flag toggle
  const toggleFlag = () => {
    playSynthesizedSound('click');
    if (flaggedQuestions.includes(currentIdx)) {
      setFlaggedQuestions(prev => prev.filter(idx => idx !== currentIdx));
    } else {
      setFlaggedQuestions(prev => [...prev, currentIdx]);
    }
  };

  // Calculate score & submit test
  const calculateQuestionScore = (idx: number, selections: number[]): number => {
    const q = questions[idx];
    if (!q) return 0;
    
    const correctAns = q.correctAnswer;
    if (typeof correctAns === 'number') {
      return selections[0] === correctAns ? 1 : 0;
    } else if (Array.isArray(correctAns)) {
      // Multi-choice scoring model
      const correctSelections = selections.filter(s => correctAns.includes(s));
      const wrongSelections = selections.filter(s => !correctAns.includes(s));
      
      if (correctSelections.length === correctAns.length && wrongSelections.length === 0) return 2;
      if (correctSelections.length >= correctAns.length - 1 && wrongSelections.length <= 1 && selections.length > 0) return 1;
      return 0;
    }
    return 0;
  };

  const handleFinishTest = async () => {
    setIsTimerActive(false);
    playSynthesizedSound('complete');

    let finalScore = 0;
    questions.forEach((_, idx) => {
      const selections = userSelections[idx] || [];
      finalScore += calculateQuestionScore(idx, selections);
    });

    setTotalScore(finalScore);
    const xp = finalScore * 25 + 50; // Points and bonus XP
    setXpGained(xp);
    setShowResult(true);
    onComplete(finalScore);

    // Call AI Performance analysis in background
    await generateAiAnalysis(finalScore);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      playSynthesizedSound('click');
    } else {
      handleFinishTest();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      playSynthesizedSound('click');
    }
  };

  // Generate Gemini feedback based on scores
  const generateAiAnalysis = async (finalScore: number) => {
    setLoadingAi(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (window as any).GEMINI_API_KEY;
      if (!apiKey) {
        setAiAnalysis("Сіз тестті сәтті аяқтадыңыз! AI талдауын қосу үшін Secrets бөлімінде GEMINI_API_KEY орнатыңыз.");
        setLoadingAi(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const maxScore = questions.length;
      const percent = Math.round((finalScore / maxScore) * 100);
      
      const prompt = `Студент ҰБТ симуляторынан ${finalScore}/${maxScore} (${percent}%) балл жинады. 
      Пән/Нұсқа: ${testType === 'full' ? 'Толық ҰБТ (Аралас)' : SUBJECTS.find(s=>s.id===selectedSubject)?.name || selectedSubject}.
      Оған қазақ тілінде қысқаша (3-4 сөйлем) кәсіби, жігерлендіретін және қателерін қалай түзетуге болатыны туралы кеңес пен аналитика жазып бер.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });
      setAiAnalysis(response.text || "Керемет көрсеткіш! Талдау сәтті аяқталды.");
    } catch (e) {
      console.error(e);
      setAiAnalysis("Баллдарыңыз сақталды. Тәжірибе жинақтауды жалғастырыңыз!");
    }
    setLoadingAi(false);
  };

  // AI-powered theory tutor for specific question
  const askAiForExplanation = async (qIdx: number, questionText: string) => {
    if (aiExplanationCache[qIdx]) return;
    
    setLoadingAiExp(prev => ({ ...prev, [qIdx]: true }));
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || (window as any).GEMINI_API_KEY;
      if (!apiKey) {
        setAiExplanationCache(prev => ({
          ...prev,
          [qIdx]: "Түсіндірме алу үшін Gemini API кілті қажет."
        }));
        setLoadingAiExp(prev => ({ ...prev, [qIdx]: false }));
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const q = questions[qIdx];
      const correctText = Array.isArray(q.correctAnswer) 
        ? q.correctAnswer.map((idx: number) => q.options[idx]).join(', ')
        : q.options[q.correctAnswer];

      const prompt = `Химия/Биология/Тарих пәнінің тәжірибелі мұғалімі ретінде мына ҰБТ сұрағының шешуін қазақ тілінде өте қарапайым әрі түсінікті етіп түсіндіріп бер. Сұрақ пен теорияны толық қамты:
      Сұрақ: "${questionText}"
      Нұсқалар: ${q.options.join(', ')}
      Дұрыс жауап: "${correctText}"
      Түсіндірмені 4-5 сөйлемнен асырмай, маңызды формулалар немесе фактілерді қалың (bold) қаріппен жаз.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });
      
      setAiExplanationCache(prev => ({
        ...prev,
        [qIdx]: response.text || "Түсіндірме дайындауда қате шықты."
      }));
    } catch (e) {
      console.error(e);
      setAiExplanationCache(prev => ({
        ...prev,
        [qIdx]: "Желілік қателік орын алды. Қайтадан көріңіз."
      }));
    }
    setLoadingAiExp(prev => ({ ...prev, [qIdx]: false }));
  };

  // Helper formatting for timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl md:text-2xl';
      default: return 'text-base';
    }
  };

  // Dynamic Theme Styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'emerald':
        return {
          bg: 'bg-slate-50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100',
          card: 'bg-white dark:bg-emerald-900/30 border border-emerald-500/10 dark:border-emerald-500/20',
          accent: 'emerald',
          gradient: 'from-emerald-500 to-teal-600',
          textAccent: 'text-emerald-600 dark:text-emerald-400',
          btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          btnAccent: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-500/20 text-teal-700 dark:text-teal-300'
        };
      case 'royal':
        return {
          bg: 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100',
          card: 'bg-white dark:bg-slate-900 border border-blue-500/10 dark:border-blue-500/20',
          accent: 'blue',
          gradient: 'from-blue-600 to-indigo-700',
          textAccent: 'text-blue-600 dark:text-blue-400',
          btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          btnAccent: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-700 dark:text-blue-300'
        };
      case 'light':
        return {
          bg: 'bg-slate-50 text-slate-900',
          card: 'bg-white border border-slate-200/80 shadow-md shadow-slate-100/30',
          accent: 'indigo',
          gradient: 'from-indigo-600 to-purple-600',
          textAccent: 'text-indigo-600',
          btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          btnAccent: 'bg-indigo-50 border border-indigo-100 text-indigo-700'
        };
      default: // midnight cosmos
        return {
          bg: 'bg-slate-950 text-slate-100',
          card: 'bg-slate-900/80 border border-slate-800 backdrop-blur-md',
          accent: 'violet',
          gradient: 'from-violet-600 to-indigo-600',
          textAccent: 'text-violet-400',
          btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20',
          btnAccent: 'bg-slate-800/80 border border-slate-700 text-slate-300'
        };
    }
  };

  const st = getThemeStyles();

  // Loading Screen for AI test generation
  if (loadingQuestions) {
    const subjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name || selectedSubject;
    return (
      <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${theme === 'light' ? 'text-slate-900 bg-slate-50' : 'text-white bg-slate-950'} font-sans`}>
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-500/15 blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-bounce" />
          </div>
        </div>
        
        <h2 className="text-xl md:text-2xl font-black tracking-tight font-outfit uppercase">
          AI ҰБТ Симуляторы 🤖
        </h2>
        <p className="text-xs md:text-sm text-indigo-400 font-extrabold mt-2 uppercase tracking-widest animate-pulse">
          {subjectName} • {selectedVariant}-нұсқа құрастырылуда
        </p>
        
        <div className="max-w-md bg-white/5 dark:bg-slate-900/60 border border-white/10 dark:border-slate-800 p-6 rounded-[32px] mt-8 space-y-4">
          <div className="flex gap-3 text-left">
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-bold">1</span>
            <p className="text-xs text-slate-400 leading-normal">
              <strong>Академиялық сұрақтар:</strong> Gemini 3.5 Flash ҰБТ мемлекеттік стандартына толық сай келетін сұрақтар жинағын құрастырады.
            </p>
          </div>
          <div className="flex gap-3 text-left">
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-bold">2</span>
            <p className="text-xs text-slate-400 leading-normal">
              <strong>Көптік және жалғыз жауаптар:</strong> Сұрақтардың құрылымына бір және бірнеше дұрыс жауабы бар күрделі тапсырмалар қамтылады.
            </p>
          </div>
          <div className="flex gap-3 text-left">
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400 font-bold">3</span>
            <p className="text-xs text-slate-400 leading-normal">
              <strong>AI Түсіндірмелер:</strong> Әр сұрақтың дұрыс жауабына теориялық түсіндірме қоса жүктеледі.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-black mt-12 uppercase tracking-wider animate-pulse">
          Әдетте жүктеу 3-7 секунд уақыт алады...
        </p>
      </div>
    );
  }

  // 1. WELCOME / SETUP SCREEN
  if (!testStarted && !showResult) {
    return (
      <div className={`p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 min-h-[80vh] ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-slate-900 dark:hover:bg-slate-800 border border-white/10 dark:border-slate-800 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight font-outfit">ҰБТ Дайын Тестер Хабы</h1>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Платформаның бірыңғай тестілеу симуляторы</p>
            </div>
          </div>

          {/* Quick theme toggler in Setup */}
          <div className="flex items-center gap-2 bg-white/5 dark:bg-slate-900/50 p-2 rounded-2xl border border-white/10 dark:border-slate-800">
            {(['midnight', 'emerald', 'royal', 'light'] as TestTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTheme(t); playSynthesizedSound('click'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all ${
                  theme === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {generationError && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-[24px] flex items-start gap-3 text-amber-500 dark:text-amber-400 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-black uppercase tracking-wider">Жүйелік Ескерту</p>
              <p className="opacity-90 mt-0.5 leading-relaxed">{generationError}</p>
            </div>
          </div>
        )}

        {/* Setup Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main settings options */}
          <div className={`md:col-span-7 rounded-[32px] p-8 ${st.card} space-y-8`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">1-ҚАДАМ: ТЕСТ ТҮРІН ТАҢДАҢЫЗ</span>
              <h2 className="text-xl font-bold mt-1">Дайындық режимі</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => { setTestType('subject'); playSynthesizedSound('click'); }}
                className={`p-6 rounded-3xl text-left border-2 transition-all space-y-4 ${
                  testType === 'subject' 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-white/5 bg-white/5 dark:bg-slate-900/40 hover:border-white/10'
                }`}
              >
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center text-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Жеке пән тесті</h3>
                  <p className="text-xs text-slate-400 mt-1">Тек бір таңдаған пәніңізден 20-40 сұрақ аралығында тереңдетілген сынақ.</p>
                </div>
              </button>

              <button
                onClick={() => { setTestType('full'); playSynthesizedSound('click'); }}
                className={`p-6 rounded-3xl text-left border-2 transition-all space-y-4 ${
                  testType === 'full' 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-white/5 bg-white/5 dark:bg-slate-900/40 hover:border-white/10'
                }`}
              >
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center text-xl">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Толық ҰБТ (Профилді)</h3>
                  <p className="text-xs text-slate-400 mt-1">Бейіндік және міндетті пәндерді біріктірген толық нұсқа симуляторы.</p>
                </div>
              </button>
            </div>

            {testType === 'subject' && (
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">2-ҚАДАМ: ПӘНДІ ТАҢДАҢЫЗ</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUBJECTS.filter(s => ['chem', 'bio', 'history-kz', 'math-lit', 'reading-lit'].includes(s.id)).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => { setSelectedSubject(sub.id); playSynthesizedSound('click'); }}
                      className={`p-4 rounded-2xl text-left border text-xs font-black transition-all flex items-center gap-3 ${
                        selectedSubject === sub.id
                          ? 'border-indigo-500 bg-indigo-500/10 text-white'
                          : 'border-white/5 bg-white/5 dark:bg-slate-900/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl ${sub.color} text-white flex items-center justify-center text-sm shadow-md`}>
                        <i className={`fas ${sub.icon}`}></i>
                      </span>
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {testType === 'subject' && (
              <div className="space-y-3 pt-4 border-t border-white/5 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">3-ҚАДАМ: НҰСҚАНЫ ТАҢДАҢЫЗ (1-10)</span>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                    <button
                      key={v}
                      onClick={() => { setSelectedVariant(v); playSynthesizedSound('click'); }}
                      className={`py-3 rounded-2xl text-xs font-black border transition-all ${
                        selectedVariant === v
                          ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-md'
                          : 'border-white/5 bg-white/5 dark:bg-slate-900/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}-нұсқа
                    </button>
                  ))}
                </div>
              </div>
            )}

            {testType === 'subject' && (
              <div className="space-y-3 pt-4 border-t border-white/5 dark:border-slate-800/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">СҰРАҚТАРДЫҢ КӨЗІ (РЕЖИМ)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => { setUseAiGenerator(true); playSynthesizedSound('click'); }}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                      useAiGenerator
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                        : 'border-white/5 bg-white/5 dark:bg-slate-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-black">🤖 AI Симулятор (Ұсынылады)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Gemini 3.5 Flash арқылы нағыз жаңа ҰБТ сұрақтарын генерациялау</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setUseAiGenerator(false); playSynthesizedSound('click'); }}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                      !useAiGenerator
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                        : 'border-white/5 bg-white/5 dark:bg-slate-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-black">💾 Жергілікті База</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Оффлайн жүйедегі бар сұрақтарды нұсқа бойынша араластыріп беру</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats & Custom Settings */}
          <div className="md:col-span-5 space-y-6">
            {/* Design Preferences Sidebar card */}
            <div className={`rounded-[32px] p-8 ${st.card} space-y-6`}>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-sm">Интерактивті реттеулер</h3>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 dark:bg-slate-900/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  <div>
                    <p className="text-xs font-extrabold">Дыбыс эффектілері</p>
                    <p className="text-[10px] text-slate-400">Синтезделген жауап дыбысы</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSoundEnabled(!soundEnabled); playSynthesizedSound('click'); }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Font Size Selector */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Сұрақтардың мәтін өлшемі</p>
                <div className="grid grid-cols-4 gap-2">
                  {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFontSize(f); playSynthesizedSound('click'); }}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        fontSize === f 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white/5 dark:bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ready Test Info */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-amber-500 dark:text-amber-400">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold">ҰБТ Симулятор артықшылығы</p>
                  <p className="text-[10px] mt-1 leading-relaxed opacity-80">
                    Дайын тест сұрақтары мемлекеттік база деңгейінде құрылған. Сұрақтан кейін AI талдауын алуға болады.
                  </p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartTest}
              className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${st.btnPrimary}`}
            >
              Сынақты Бастау <i className="fas fa-play ml-2 text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE TEST IN PROGRESS SCREEN
  if (testStarted && !showResult) {
    const q = questions[currentIdx];
    const isQuestionFlagged = flaggedQuestions.includes(currentIdx);
    const answeredCount = Object.keys(userSelections).length;

    return (
      <div className={`min-h-[85vh] p-4 md:p-6 ${theme === 'light' ? 'text-slate-900 bg-slate-50' : 'text-white bg-slate-950'} font-sans`}>
        {/* Top Control Panel */}
        <div className={`p-4 md:p-6 rounded-3xl ${st.card} mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsTimerActive(false); setTestStarted(false); }}
              className="px-4 py-2 bg-white/5 dark:bg-slate-800 hover:bg-white/10 dark:hover:bg-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-white/5"
            >
              <i className="fas fa-sign-out-alt mr-1"></i> Тоқтату
            </button>
            <div className="h-6 w-px bg-white/10 dark:bg-slate-800 hidden md:block"></div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Режим</span>
              <p className="text-xs font-black uppercase text-indigo-400">
                {testType === 'full' ? 'Simulated Full UNT' : `${SUBJECTS.find(s=>s.id===selectedSubject)?.name} Тесті`}
              </p>
            </div>
          </div>

          {/* Real-time Ticking Countdown clock with visual urgency */}
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${
            timeLeft < 300 
              ? 'bg-red-500/20 border-red-500/50 text-red-500 animate-pulse' 
              : 'bg-white/5 dark:bg-slate-900 border-white/10 dark:border-slate-800'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm font-black tracking-widest">{formatTime(timeLeft)}</span>
          </div>

          {/* Navigation drawer toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFlag}
              className={`p-3 rounded-xl border transition-all ${
                isQuestionFlagged 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                  : 'bg-white/5 dark:bg-slate-900 border-white/10 dark:border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Bookmark for review"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowQuestionGrid(!showQuestionGrid)}
              className="px-4 py-2.5 bg-white/5 dark:bg-slate-900 border border-white/10 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-2"
            >
              <i className="fas fa-th"></i> Навигация ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>

        {/* Dynamic Question Navigation Grid Drawer */}
        <AnimatePresence>
          {showQuestionGrid && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`p-6 rounded-3xl mb-6 border ${st.card} shadow-inner space-y-4 overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Сұрақтар навигациясының картасы</h4>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Жауап берілген</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Белгіленген</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-800"></span> Бос</span>
                </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {questions.map((_, idx) => {
                  const isAns = !!userSelections[idx]?.length;
                  const isFlg = flaggedQuestions.includes(idx);
                  const isCurrent = currentIdx === idx;
                  
                  let cellBg = 'bg-slate-800 text-slate-400 border border-slate-700';
                  if (isAns) cellBg = 'bg-emerald-600 text-white border border-emerald-500';
                  if (isFlg) cellBg = 'bg-amber-500 text-slate-950 border border-amber-400';
                  if (isCurrent) cellBg += ' ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950';

                  return (
                    <button
                      key={idx}
                      onClick={() => { setCurrentIdx(idx); setShowQuestionGrid(false); playSynthesizedSound('click'); }}
                      className={`p-3 rounded-xl text-xs font-black transition-all ${cellBg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[50vh]">
          {/* Main Question Description */}
          <div className={`md:col-span-8 p-8 rounded-[36px] ${st.card} space-y-6 flex flex-col justify-between shadow-xl`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-indigo-500/10">
                  Сұрақ {currentIdx + 1} / {questions.length}
                </span>
                {q?.isMulti && (
                  <span className="text-[9px] bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-orange-500/10">
                    Көптік таңдау (1-3 жауап)
                  </span>
                )}
                {isQuestionFlagged && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-amber-500/10">
                    Талдау белгісі қойылды
                  </span>
                )}
              </div>

              <h2 className={`font-extrabold tracking-normal leading-relaxed text-gray-800 dark:text-white ${getFontSizeClass()}`}>
                {q?.text}
              </h2>
            </div>

            {/* Bottom mini-navigation */}
            <div className="flex items-center justify-between border-t border-white/5 dark:border-slate-800/80 pt-6 mt-10">
              <button
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className={`px-6 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
                  currentIdx === 0 
                    ? 'border-transparent text-slate-600 cursor-not-allowed' 
                    : 'border-white/10 dark:border-slate-800 hover:bg-white/5 dark:hover:bg-slate-900 text-slate-300'
                }`}
              >
                <i className="fas fa-chevron-left"></i> Артқа
              </button>

              <button
                disabled={!userSelections[currentIdx]?.length}
                onClick={handleNext}
                className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                  !userSelections[currentIdx]?.length
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-indigo-600 text-white shadow-indigo-600/10 hover:bg-indigo-700'
                }`}
              >
                {currentIdx === questions.length - 1 ? 'Тестіні аяқтау' : 'Келесі'} <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>

          {/* Options Panel */}
          <div className="md:col-span-4 flex flex-col gap-3 justify-center">
            {q?.options.map((opt: string, idx: number) => {
              const isSelected = userSelections[currentIdx]?.includes(idx);
              let optionBg = 'bg-white dark:bg-slate-900 border-white/5 dark:border-slate-800 text-slate-400 hover:border-white/10';
              if (isSelected) optionBg = 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/5';

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${optionBg}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-850 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs md:text-sm font-bold leading-normal text-slate-800 dark:text-slate-200">{opt}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-500 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. COMPLETE & RESULTS EVALUATION VIEW
  if (showResult) {
    const totalQuestionsCount = questions.length;
    const correctAnswersCount = questions.filter((_, idx) => {
      const q = questions[idx];
      const correct = q.correctAnswer;
      const selections = userSelections[idx] || [];
      if (typeof correct === 'number') {
        return selections[0] === correct;
      } else {
        return selections.length === correct.length && selections.every(s => correct.includes(s));
      }
    }).length;

    const percentage = Math.round((correctAnswersCount / totalQuestionsCount) * 100);

    return (
      <div className={`max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500 pb-32 font-sans ${theme === 'light' ? 'text-slate-900 bg-slate-50' : 'text-white bg-slate-950'}`}>
        {/* Results Header Card */}
        <div className={`rounded-[40px] p-8 md:p-12 ${st.card} flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl overflow-hidden relative border-2 border-indigo-500/10`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="text-center md:text-left space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5" /> Сынақ Аяқталды
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-outfit">Тамаша Нәтиже!</h1>
            <p className="text-xs text-slate-400 font-semibold max-w-sm leading-relaxed">
              Жинаған ұпайларыңыз рейтинг кестесіне сәтті қосылды. Қателеріңізді төменде толығырақ талдай аласыз.
            </p>

            {/* Reward Badges */}
            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-2 text-indigo-400 text-xs font-black">
                <i className="fas fa-coins text-xs"></i> +{totalScore * 5} Ұпай
              </div>
              <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center gap-2 text-violet-400 text-xs font-black">
                <i className="fas fa-bolt text-xs"></i> +{xpGained} XP Тәжірибе
              </div>
            </div>
          </div>

          {/* Dynamic Circle Progress Rings */}
          <div className="flex flex-col items-center justify-center gap-2 relative z-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer SVG circle */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  className="stroke-slate-150 dark:stroke-slate-800"
                  strokeWidth="10" 
                  fill="transparent" 
                />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  className="stroke-indigo-500"
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * percentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black font-mono">{totalScore} / {totalQuestionsCount}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-1">Дұрыс Жауап</p>
              </div>
            </div>
            <div className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/15 mt-2">
              Пайыздық көрсеткіш: {percentage}%
            </div>
          </div>
        </div>

        {/* Gemini AI Performance Report */}
        <div className="p-8 rounded-[36px] bg-gradient-to-tr from-indigo-900 to-indigo-950 text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mr-12 -mb-12"></div>
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-indigo-100">AI Тьютордың Жігерлендіру Және Талдау Есебі</h3>
          </div>
          
          {loadingAi ? (
            <div className="space-y-3 animate-pulse relative z-10">
              <div className="h-4 bg-white/15 rounded w-full"></div>
              <div className="h-4 bg-white/15 rounded w-5/6"></div>
              <div className="h-4 bg-white/15 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed opacity-90 italic relative z-10 font-medium">
              "{aiAnalysis || 'Талдау жүктелуде...'}"
            </p>
          )}
        </div>

        {/* Deep analysis of questions with explanations & custom AI Tutor on-demand helper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight">Сұрақтар Талдауы Мен Қателермен Жұмыс</h2>
            <span className="text-xs text-slate-400 font-semibold">Жауаптарды көру үшін сұрақты басыңыз</span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const selections = userSelections[idx] || [];
              const correct = q.correctAnswer;
              
              let isCorrect = false;
              if (typeof correct === 'number') {
                isCorrect = selections[0] === correct;
              } else if (Array.isArray(correct)) {
                isCorrect = selections.length === correct.length && selections.every(s => correct.includes(s));
              }

              const isExpanded = expandedExplanations[idx];

              return (
                <div 
                  key={idx} 
                  className={`rounded-3xl border overflow-hidden transition-all duration-350 ${st.card}`}
                >
                  {/* Summary Bar */}
                  <div 
                    onClick={() => setExpandedExplanations(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className="p-6 flex items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-4">
                      {/* Check mark badge */}
                      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs ${
                        isCorrect 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Сұрақ {idx + 1} • {q.subject === 'chem' ? 'Химия' : q.subject === 'bio' ? 'Биология' : 'Сауаттылық'}</span>
                        <p className="text-xs font-extrabold line-clamp-1 mt-1">{q.text}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isCorrect ? 'Дұрыс' : 'Қате'}</span>
                      <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-xs text-slate-400`}></i>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="p-6 border-t border-white/5 dark:border-slate-800 bg-slate-900/10 dark:bg-slate-950/20 space-y-6">
                      {/* Question Text */}
                      <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Толық Сұрақ Мәтіні</p>
                        <p className="text-sm font-extrabold leading-relaxed text-gray-800 dark:text-slate-100">{q.text}</p>
                      </div>

                      {/* Options status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isCorrectOpt = Array.isArray(correct) ? correct.includes(optIdx) : correct === optIdx;
                          const isSelectedOpt = selections.includes(optIdx);

                          let labelStyle = 'bg-white/5 border-white/5 text-slate-400';
                          if (isCorrectOpt) {
                            labelStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
                          } else if (isSelectedOpt && !isCorrectOpt) {
                            labelStyle = 'bg-red-500/10 border-red-500/30 text-red-500';
                          }

                          return (
                            <div 
                              key={optIdx} 
                              className={`p-4 rounded-2xl border text-xs font-extrabold flex items-center gap-3 ${labelStyle}`}
                            >
                              <span className={`w-6 h-6 rounded-lg text-[10px] flex items-center justify-center font-black ${
                                isCorrectOpt 
                                  ? 'bg-emerald-500 text-white shadow-md' 
                                  : isSelectedOpt 
                                    ? 'bg-red-500 text-white shadow-md' 
                                    : 'bg-white/10 dark:bg-slate-800'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                              {isCorrectOpt && <Check className="w-4 h-4 ml-auto" />}
                              {isSelectedOpt && !isCorrectOpt && <X className="w-4 h-4 ml-auto" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Base Explanation & Dynamic AI Tutor button */}
                      <div className="space-y-4 pt-4 border-t border-white/5 dark:border-slate-800/60">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Шешілуі мен теориясы</h4>
                            <p className="text-xs mt-1 font-semibold text-slate-400">
                              Төменде осы сұрақ бойынша негізгі түсіндірме мен шешу алгоритмі жазылған.
                            </p>
                          </div>

                          {/* Dynamic AI explainer invocation on demand */}
                          <button
                            onClick={() => { askAiForExplanation(idx, q.text); }}
                            className="px-4 py-2.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> AI Түсіндіруін Сұрау
                          </button>
                        </div>

                        {/* Traditional Explanation text */}
                        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 font-medium">
                          <p>
                            <strong>Дұрыс жауабы:</strong> {Array.isArray(correct) ? correct.map(c=>q.options[c]).join(', ') : q.options[correct]}. 
                            Осы сұрақ бойынша дұрыс тұжырым ҰБТ теориялық бағдарламасына толықтай негізделген.
                          </p>
                        </div>

                        {/* Render AI Dynamic Explanation if fetched */}
                        {(loadingAiExp[idx] || aiExplanationCache[idx]) && (
                          <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black mb-1">
                              <Sparkles className="w-4 h-4 animate-spin-slow" />
                              <span>AI Түсіндірме Тьюторы</span>
                            </div>
                            {loadingAiExp[idx] ? (
                              <div className="space-y-2 animate-pulse">
                                <div className="h-3 bg-indigo-500/15 rounded w-full"></div>
                                <div className="h-3 bg-indigo-500/15 rounded w-5/6"></div>
                              </div>
                            ) : (
                              <p className="font-semibold">{aiExplanationCache[idx]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => onClose ? onClose() : window.location.reload()}
          className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl"
        >
          {onClose ? 'Жабу және басты бетке өту' : 'Қайта оралу'}
        </button>
      </div>
    );
  }

  return null;
};

export default TestView;
