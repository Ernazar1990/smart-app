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

  // ✅ SAFE reference
  const reinforcement = lesson.reinforcement;

  const handleReinforcementCheck = () => {
    // ✅ егер reinforcement жоқ болса — тек өткізіп жібереміз немесе хабар береміз
    if (!reinforcement) {
      // қаласаң step-ті ауыстырып жіберуге болады:
      setStep(4);
      return;
    }

    if (reinforcementSelected === null) return;

    // ✅ lesson.reinforcement емес, reinforcement қолдан
    if (reinforcementSelected === reinforcement.correctAnswer) {
      setReinforcementResult('correct');
      setTimeout(() => setStep(4), 1000);
    } else {
      setReinforcementResult('wrong');
      alert('Қате! Тағы да ойланып көр.');
      setReinforcementResult(null);
    }
  };

  // ... ары қарай JSX қайтарылады
  return (
    <div>
      {/* мысал: reinforcement сұрағы */}
      {step === 3 && (
        <div>
          {!reinforcement ? (
            <div className="p-4 rounded-xl bg-amber-50 text-amber-800 font-bold">
              Бұл сабақта reinforcement сұрағы жоқ.
            </div>
          ) : (
            <>
              <p className="font-black text-gray-800 mb-4">{reinforcement.question}</p>

              <div className="space-y-2">
                {reinforcement.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setReinforcementSelected(i)}
                    className="w-full text-left p-4 rounded-xl border"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleReinforcementCheck}
                className="mt-4 px-6 py-3 rounded-xl bg-emerald-600 text-white font-black"
              >
                Тексеру
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonContent;
