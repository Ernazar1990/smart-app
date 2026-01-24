
import React, { useState } from 'react';
import { MOCK_QUESTIONS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface TestViewProps {
  onComplete: (score: number) => void;
}

const TestView: React.FC<TestViewProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const calculateQuestionScore = (idx: number, selections: number[]): number => {
    const q = MOCK_QUESTIONS[idx];
    if (!q.isMulti) {
      return selections[0] === q.correctAnswer ? 1 : 0;
    } else {
      const correctAnswers = q.correctAnswer as number[];
      const correctSelections = selections.filter(s => correctAnswers.includes(s));
      const wrongSelections = selections.filter(s => !correctAnswers.includes(s));
      
      // Multi-choice scoring (standard UBT)
      // 2 points if all correct and no wrong
      // 1 point if partially correct and no wrong, or all correct but 1 wrong
      if (correctSelections.length === correctAnswers.length && wrongSelections.length === 0) return 2;
      if (correctSelections.length >= correctAnswers.length - 1 && wrongSelections.length <= 1) return 1;
      return 0;
    }
  };

  const handleNext = async () => {
    const questionScore = calculateQuestionScore(currentIdx, selectedOptions);
    const newTotalScore = totalScore + questionScore;

    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setTotalScore(newTotalScore);
      setCurrentIdx(currentIdx + 1);
      setSelectedOptions([]);
    } else {
      setTotalScore(newTotalScore);
      setShowResult(true);
      onComplete(newTotalScore);
      await generateAiAnalysis(newTotalScore);
    }
  };

  const handleOptionClick = (idx: number) => {
    const q = MOCK_QUESTIONS[currentIdx];
    if (!q.isMulti) {
      setSelectedOptions([idx]);
    } else {
      if (selectedOptions.includes(idx)) {
        setSelectedOptions(selectedOptions.filter(o => o !== idx));
      } else if (selectedOptions.length < 3) {
        setSelectedOptions([...selectedOptions, idx]);
      }
    }
  };

  const generateAiAnalysis = async (finalScore: number) => {
    setLoadingAi(true);
    try {
      // Create fresh instance of GoogleGenAI before the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Студент ҰБТ химия тестінен ${finalScore}/50 балл алды. Оған мотивация беріп, қазақ тілінде қысқаша талдау жаса.`;
      const response = await ai.models.generateContent({
        // Using 'gemini-3-pro-preview' for complex STEM feedback and reasoning.
        model: 'gemini-3-pro-preview',
        contents: prompt
      });
      setAiAnalysis(response.text || null);
    } catch (e) {
      console.error(e);
    }
    setLoadingAi(false);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-in slide-in-from-bottom duration-500">
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl text-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[30px] flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
            <i className="fas fa-flag-checkered"></i>
          </div>
          <h2 className="text-3xl font-black text-gray-900">Нәтиже: {totalScore} / 50 балл</h2>
          <p className="text-gray-500 mt-2 font-medium">Керемет! Сіз ҰБТ-ның толық бір нұсқасын талдап шықтыңыз.</p>
        </div>

        <div className="bg-emerald-600 p-8 rounded-[40px] text-white relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-robot text-xl"></i>
            <h3 className="font-black">AI Тьютордың талдауы</h3>
          </div>
          {loadingAi ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed italic opacity-90">"{aiAnalysis || 'Талдау дайындалуда...'}"</p>
          )}
          <i className="fas fa-brain absolute -right-6 -bottom-6 text-8xl text-white/10 rotate-12"></i>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          Басты бетке оралу
        </button>
      </div>
    );
  }

  const q = MOCK_QUESTIONS[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-5 rounded-3xl flex justify-between items-center shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-600">
            <i className="fas fa-stopwatch font-black"></i>
          </div>
          <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Уақыт</p>
             <p className="text-sm font-black text-gray-700">90:00</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Прогресс: {currentIdx + 1} / 40</p>
           <div className="w-32 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <div className="h-full bg-emerald-500" style={{ width: `${((currentIdx + 1) / 40) * 100}%` }}></div>
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8 min-h-[400px]">
        <div className="space-y-2">
          {q.isMulti && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">Бірнеше жауап (2 балл)</span>}
          <h3 className="text-xl font-black text-gray-900 leading-relaxed">{q.text}</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center gap-5 ${
                selectedOptions.includes(idx) 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md' 
                  : 'border-gray-50 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                selectedOptions.includes(idx) ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-sm font-bold">{opt}</span>
              {selectedOptions.includes(idx) && <i className="fas fa-check-circle ml-auto text-emerald-600"></i>}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-24 left-4 right-4 max-w-xl mx-auto md:max-w-4xl">
        <button
          disabled={selectedOptions.length === 0}
          onClick={handleNext}
          className={`w-full py-5 rounded-[30px] font-black shadow-2xl transition-all ${
            selectedOptions.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 text-white hover:scale-[1.02] active:scale-95'
          }`}
        >
          {currentIdx === MOCK_QUESTIONS.length - 1 ? 'Тестіні аяқтау' : 'Келесі сұрақ'}
        </button>
      </div>
    </div>
  );
};

export default TestView;
