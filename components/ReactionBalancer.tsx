
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ReactionBalancerProps {
  onBack?: () => void;
}

const ReactionBalancer: React.FC<ReactionBalancerProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBalance = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      // Create new instance of GoogleGenAI right before API call.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Сіз химия профессорысыз. Мына химиялық реакцияны теңестіріп, әр заттың алдындағы коэффициенттерді анықтап беріңіз. Сонымен қатар, бұл реакцияның түрін (қосылу, айырылу т.б.) және қысқаша түсініктеме жазыңыз. Реакция: ${input}`;
      
      const response = await ai.models.generateContent({
        // Upgraded to 'gemini-3-pro-preview' for specialized chemistry STEM task.
        model: 'gemini-3-pro-preview',
        contents: prompt
      });
      setResult(response.text || "Теңдеуді өңдеу мүмкін болмады.");
    } catch (e) {
      console.error(e);
      setResult("Қате орын алды. Теңдеуді дұрыс жазғаныңызға көз жеткізіңіз.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-24">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
          <i className="fas fa-equals"></i>
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Реакция Теңестіруші ✨</h2>
        <p className="text-gray-500 text-xs">AI көмегімен кез келген теңдеуді бір секундта теңестір</p>
      </header>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Реакцияны енгізіңіз</label>
          <input 
            type="text" 
            placeholder="Мысалы: NaOH + HCl = NaCl + H2O" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-5 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-[25px] font-black text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        <button 
          onClick={handleBalance}
          disabled={loading || !input.trim()}
          className={`w-full py-5 rounded-[25px] font-black shadow-lg transition-all flex items-center justify-center gap-3 ${
            loading || !input.trim() ? 'bg-gray-100 text-gray-400' : 'bg-emerald-600 text-white hover:scale-[1.02] active:scale-95'
          }`}
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <><i className="fas fa-magic"></i> ТЕҢЕСТІРУ</>
          )}
        </button>

        {result && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[30px] border border-emerald-100 dark:border-emerald-800/50 animate-in zoom-in">
             <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-check-circle text-emerald-500"></i>
                <h4 className="font-black text-emerald-900 dark:text-emerald-200 uppercase text-xs tracking-widest">Нәтиже</h4>
             </div>
             <p className="text-gray-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
               {result}
             </p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[35px] border border-amber-100 dark:border-amber-800 flex gap-4">
         <i className="fas fa-info-circle text-amber-500 mt-1"></i>
         <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
           <b>Кеңес:</b> Формулаларды жазғанда бас әріптерді (H, O, Na) қолдануды ұмытпаңыз. Индекстерді жай сандармен жаза беріңіз.
         </p>
      </div>
    </div>
  );
};

export default ReactionBalancer;
