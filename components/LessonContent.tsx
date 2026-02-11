import React, { useMemo, useState } from "react";
import type { Lesson } from "../types";

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
}

type StepId = "video" | "reinforcement" | "homework" | "fixes";

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete }) => {
  // -----------------------------
  // 1) Контентті "қауіпсіз" түрде алу
  // -----------------------------
  // ⬇️ Осыларды өз Lesson типіңе сай ауыстырсаң болады
  const videoUrl = (lesson as any).videoUrl || (lesson as any).video || (lesson as any).youtubeUrl || "";
  const fixesVideoUrl = (lesson as any).fixesVideoUrl || (lesson as any).mistakeVideoUrl || "";
  const homeworkPdfUrl = (lesson as any).homeworkPdfUrl || (lesson as any).pdfUrl || "";
  const fixesPdfUrl = (lesson as any).fixesPdfUrl || (lesson as any).mistakePdfUrl || "";

  // reinforcement сенде бар ✅
  type RQ = { question: string; options: string[]; correctAnswer: number };

// ✅ жаңа: көп сұрақ
const reinforcementItems = ((lesson as any).reinforcementItems || []) as RQ[];

// ✅ ескі: бір сұрақ (кері совместимость)
const reinforcementSingle = (lesson as any).reinforcement as RQ | undefined;

// ✅ финал: егер массив бар болса соны қолдан, жоқ болса бір сұрақтан массив жаса
const reinforcementList: RQ[] =
  Array.isArray(reinforcementItems) && reinforcementItems.length > 0
    ? reinforcementItems
    : reinforcementSingle
      ? [reinforcementSingle]
      : [];

  // homework: егер сенде тест/сұрақтар массиві болса
  const homeworkItems = ((lesson as any).homeworkItems || (lesson as any).homework || []) as any[];

  // -----------------------------
  // 2) Step / progress (гейт)
  // -----------------------------
  const [active, setActive] = useState<StepId>("video");
  const [progress, setProgress] = useState({
    watchedVideo: false,
    reinforcementDone: false,
    homeworkDone: false,
    fixesDone: false,
  });

  // reinforcement state
 const [rIdx, setRIdx] = useState(0);
const [reinforcementSelected, setReinforcementSelected] = useState<number | null>(null);
const [reinforcementResult, setReinforcementResult] = useState<"correct" | "wrong" | null>(null);


  // homework state (егер сұрақтар болса)
  const [hwIdx, setHwIdx] = useState(0);
  const [hwAnswers, setHwAnswers] = useState<number[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const locked = useMemo(() => {
    return {
      video: false,
      reinforcement: !progress.watchedVideo,
      homework: !progress.watchedVideo || !progress.reinforcementDone,
      fixes: !progress.watchedVideo || !progress.reinforcementDone || !progress.homeworkDone,
    };
  }, [progress]);

  const openStep = (id: StepId) => {
    if (locked[id]) return;
    setActive(id);
  };

  // -----------------------------
  // 3) Actions
  // -----------------------------
  const markVideoWatched = () => {
  setProgress((p) => ({ ...p, watchedVideo: true }));
  setRIdx(0);
  setReinforcementSelected(null);
  setReinforcementResult(null);
  setActive("reinforcement");
};

  const handleReinforcementCheck = () => {
  if (!Array.isArray(reinforcementList) || reinforcementList.length === 0) {
    // reinforcement жоқ болса — автоматты "өткен"
    setProgress((p) => ({ ...p, reinforcementDone: true }));
    setActive("homework");
    return;
  }

  const current = reinforcementList[rIdx];
  if (reinforcementSelected === null) return;

  if (reinforcementSelected === current.correctAnswer) {
    setReinforcementResult("correct");

    setTimeout(() => {
      const isLast = rIdx >= reinforcementList.length - 1;

      if (isLast) {
        setProgress((p) => ({ ...p, reinforcementDone: true }));
        setActive("homework");
      } else {
        // келесі бекіту сұрағына өтеміз
        setRIdx((i) => i + 1);
        setReinforcementSelected(null);
        setReinforcementResult(null);
      }
    }, 500);
  } else {
    setReinforcementResult("wrong");
    setTimeout(() => setReinforcementResult(null), 700);
    alert("Қате! Тағы да ойланып көр.");
  }
};

  const submitHomeworkAnswer = () => {
    if (!Array.isArray(homeworkItems) || homeworkItems.length === 0) {
      // Үй жұмысы сұрақтары жоқ болса — PDF/мәтін арқылы done деп қоямыз
      setProgress((p) => ({ ...p, homeworkDone: true }));
      setActive("fixes");
      return;
    }

    if (selectedOpt === null) return;

    const next = [...hwAnswers];
    next[hwIdx] = selectedOpt;
    setHwAnswers(next);

    const isLast = hwIdx >= homeworkItems.length - 1;
    if (isLast) {
      setProgress((p) => ({ ...p, homeworkDone: true }));
      setActive("fixes");
    } else {
      setHwIdx((i) => i + 1);
      setSelectedOpt(null);
    }
  };

  const finishFixes = () => {
    setProgress((p) => ({ ...p, fixesDone: true }));
    onComplete();
  };

  // -----------------------------
  // 4) UI
  // -----------------------------
  return (
    <div className="space-y-6">
      {/* Top stepper */}
      <div className="flex gap-2 flex-wrap">
        <StepBtn title="Видео" active={active === "video"} locked={locked.video} onClick={() => openStep("video")} />
        <StepBtn
          title="Бекіту"
          active={active === "reinforcement"}
          locked={locked.reinforcement}
          onClick={() => openStep("reinforcement")}
        />
        <StepBtn
          title="Үй жұмысы"
          active={active === "homework"}
          locked={locked.homework}
          onClick={() => openStep("homework")}
        />
        <StepBtn
          title="Қатемен жұмыс"
          active={active === "fixes"}
          locked={locked.fixes}
          onClick={() => openStep("fixes")}
        />
      </div>

      {/* VIDEO */}
      {active === "video" && (
        <Card title="Сабақ видеосы">
          {videoUrl ? (
            <>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe className="w-full h-full" src={videoUrl} allowFullScreen title="lesson-video" />
              </div>

              <button
                onClick={markVideoWatched}
                className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-2xl font-black"
              >
                Видеоны көрдім ✅
              </button>
            </>
          ) : (
            <Empty text="Бұл сабаққа видео қосылмаған." />
          )}
        </Card>
      )}

      {/* REINFORCEMENT */}
     {active === "reinforcement" && (
  <Card title="Бекіту тапсырмасы">
    {reinforcementList.length === 0 ? (
      <>
        <div className="p-4 rounded-2xl bg-amber-50 text-amber-800 font-bold">
          Бұл сабақта бекіту сұрақтары жоқ. Келесі бөлімге өте беруге болады.
        </div>
        <button
          onClick={() => {
            setProgress((p) => ({ ...p, reinforcementDone: true }));
            setActive("homework");
          }}
          className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-2xl font-black"
        >
          Келесі бөлімге өту →
        </button>
      </>
    ) : (
      <>
        <div className="text-sm text-slate-500 mb-3">
          Сұрақ {rIdx + 1} / {reinforcementList.length}
        </div>

        <p className="font-black text-slate-900 dark:text-white mb-4">
          {reinforcementList[rIdx]?.question}
        </p>

        <div className="space-y-2">
          {(reinforcementList[rIdx]?.options ?? []).map((opt, i) => (
            <button
              key={i}
              onClick={() => setReinforcementSelected(i)}
              className={`w-full text-left p-4 rounded-2xl border transition ${
                reinforcementSelected === i
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleReinforcementCheck}
          className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-2xl font-black"
        >
          {rIdx === reinforcementList.length - 1 ? "Бекітуді аяқтау ✅" : "Тексеру →"}
        </button>

        {reinforcementResult === "correct" && (
          <div className="mt-3 p-4 rounded-2xl bg-emerald-50 text-emerald-800 font-black">Дұрыс ✅</div>
        )}
        {reinforcementResult === "wrong" && (
          <div className="mt-3 p-4 rounded-2xl bg-rose-50 text-rose-800 font-black">Қате ❌</div>
        )}
      </>
    )}
  </Card>
)}

      {/* HOMEWORK */}
      {active === "homework" && (
        <Card title="Үй жұмысы">
          {/* 1) Егер homeworkItems (тест) болса */}
          {Array.isArray(homeworkItems) && homeworkItems.length > 0 ? (
            <>
              <div className="text-sm text-slate-500 mb-3">
                Сұрақ {hwIdx + 1} / {homeworkItems.length}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold">
                {homeworkItems[hwIdx]?.question || "Сұрақ мәтіні жоқ"}
              </div>

              <div className="mt-3 space-y-2">
                {(homeworkItems[hwIdx]?.options || []).map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOpt(i)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      selectedOpt === i
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                onClick={submitHomeworkAnswer}
                className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-2xl font-black"
              >
                {hwIdx === homeworkItems.length - 1 ? "Үй жұмысын аяқтау ✅" : "Келесі сұрақ →"}
              </button>
            </>
          ) : (
            <>
              {/* 2) Егер тест жоқ болса — PDF арқылы үй жұмысын көрсет */}
              {homeworkPdfUrl ? (
                <a
                  href={homeworkPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-slate-900 text-white py-3 rounded-2xl font-black"
                >
                  Үй жұмысы PDF ашу 📄
                </a>
              ) : (
                <Empty text="Үй жұмысы сұрақтары да, PDF те қосылмаған." />
              )}

              <button
                onClick={() => {
                  setProgress((p) => ({ ...p, homeworkDone: true }));
                  setActive("fixes");
                }}
                className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-2xl font-black"
              >
                Үй жұмысын қабылдадым ✅
              </button>
            </>
          )}
        </Card>
      )}

      {/* FIXES */}
      {active === "fixes" && (
        <Card title="Қатемен жұмыс">
          <div className="space-y-4">
            {fixesVideoUrl ? (
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe className="w-full h-full" src={fixesVideoUrl} allowFullScreen title="fixes-video" />
              </div>
            ) : (
              <Empty text="Қатемен жұмыс видеосы қосылмаған." />
            )}

            {fixesPdfUrl ? (
              <a
                href={fixesPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-slate-900 text-white py-3 rounded-2xl font-black"
              >
                Қатемен жұмыс PDF 📄
              </a>
            ) : null}

            <button onClick={finishFixes} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-black">
              Сабақты аяқтау ✅
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LessonContent;

function StepBtn({
  title,
  active,
  locked,
  onClick,
}: {
  title: string;
  active: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-black text-sm transition
      ${active ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200"}
      ${locked ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"}`}
      title={locked ? "Алдымен алдыңғы бөлімді аяқтаңыз" : ""}
    >
      {title} {locked ? "🔒" : ""}
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[30px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="text-lg font-black mb-4">{title}</div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">{text}</div>;
}
