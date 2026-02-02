import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage } from "../types";

type Props = {
  onBack?: () => void;
};

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Сәлем! Мен EasyUBT AI тьюторымын. Химиядан кез келген сұрағың болса қоя бер. Реакция теңдеуін түсіндіру немесе есеп шығаруға көмектесемін.",
};

export default function AITutor({ onBack }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const fakeAIReply = async (text: string) => {
    // Бұл жерде сен кейін Gemini/OpenAI қосасың.
    // Қазір TypeScript қате болмасын деп "демо" жауап қайтарамыз.
    await new Promise((r) => setTimeout(r, 450));
    return `Түсіндім. Сен сұрадың: "${text}". Қай бөлім? (есеп / теория / реакция теңестіру)`;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const response = await fakeAIReply(text);

      // ❗ЕҢ МАҢЫЗДЫСЫ: role "assistant"
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-outfit">
            AI Тьютор
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Chemistry helper
          </p>
        </div>

        {onBack ? (
          <button
            onClick={onBack}
            className="text-xs font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors"
          >
            ← Артқа
          </button>
        ) : null}
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div ref={listRef} className="h-[55vh] overflow-y-auto p-8 space-y-4 no-scrollbar">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            // ❗ЕҢ МАҢЫЗДЫСЫ: "model" дегенді тексермейміз
            return (
              <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-[26px] px-5 py-4 text-sm font-bold leading-relaxed ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {loading ? (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-[26px] px-5 py-4 text-sm font-bold bg-gray-50 dark:bg-slate-900/50 text-slate-500 border border-gray-100 dark:border-slate-700">
                Жауап жазылып жатыр...
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 p-6">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              className="flex-1 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none font-bold"
              placeholder="Сұрағыңды жаз..."
            />
            <button
              disabled={!canSend}
              onClick={send}
              className="bg-emerald-600 text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg disabled:opacity-60"
            >
              Жіберу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
