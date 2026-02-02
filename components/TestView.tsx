import React, { useMemo, useState } from "react";
import { MOCK_QUESTIONS } from "../constants";

type TestViewProps = {
  onComplete?: (score: number) => void;
};

const TestView: React.FC<TestViewProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = useMemo(() => MOCK_QUESTIONS[currentIndex], [currentIndex]);

  const isLast = currentIndex >= MOCK_QUESTIONS.length - 1;

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    setSelected(answerIndex);
  };

  const checkAnswer = () => {
    if (selected === null) return;
    setShowResult(true);

    // constants.ts-та MockQuestion: correctIndex
    const correct = selected === currentQuestion.correctIndex;
    if (correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (selected === null) return;

    if (isLast) {
      // Қанша сұрақ дұрыс — соны ұпай ретінде бердік
      const finalScore = score + (selected === currentQuestion.correctIndex ? 1 : 0);
      onComplete?.(finalScore);
      // қайта бастау (қаласаң алып таста)
      setCurrentIndex(0);
      setSelected(null);
      setShowResult(false);
      setScore(0);
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (!currentQuestion) {
    return (
      <div className="p-6">
        <p className="font-bold text-gray-500">Сұрақтар табылмады (MOCK_QUESTIONS бос болуы мүмкін).</p>
      </div>
    );
  }

  const isCorrect = selected !== null && selected === currentQuestion.correctIndex;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
          {currentIndex + 1} / {MOCK_QUESTIONS.length}
        </p>
        <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
          Ұпай: {score}
        </p>
      </div>

      <h2 className="text-xl font-bold">{currentQuestion.text}</h2>

      <div className="space-y-3">
        {currentQuestion.options.map((opt, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full p-3 rounded-lg border transition-all ${
                active ? "bg-emerald-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4">
        {!showResult ? (
          <button
            disabled={selected === null}
            onClick={checkAnswer}
            className={`px-4 py-2 rounded-lg text-white ${
              selected === null ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600"
            }`}
          >
            Жауапты тексеру
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg"
          >
            {isLast ? "Аяқтау" : "Келесі сұрақ"}
          </button>
        )}
      </div>

      {showResult && selected !== null && (
        <div className="mt-4">
          {isCorrect ? (
            <p className="text-green-600 font-bold">Дұрыс жауап!</p>
          ) : (
            <p className="text-red-600 font-bold">
            {typeof currentQuestion.correctIndex === "number"
  ? currentQuestion.options[currentQuestion.correctIndex]
  : ""}

            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TestView;
