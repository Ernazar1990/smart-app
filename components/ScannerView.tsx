
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ScannerViewProps {
  onBack?: () => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      // Create a fresh instance of GoogleGenAI before the API call.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64.split(',')[1];
      
      const response = await ai.models.generateContent({
        // Using 'gemini-3-pro-preview' for specialized multimodal reasoning in STEM.
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { text: "Осы химиялық есепті немесе реакцияны анықтап, қазақ тілінде қадамдық талдау (түсіндірме) жасап беріңіз. Соңында дұрыс жауабын көрсетіңіз." },
            { 
              inlineData: { 
                mimeType: "image/jpeg", 
                data: base64Data 
              } 
            }
          ]
        }
      });
      // Access response text property directly.
      setAnalysis(response.text || "Мәтін танылмады.");
    } catch (e) {
      console.error(e);
      setAnalysis("Қате орын алды. Қайта көріңіз.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">AI Есеп Сканері 📸</h2>
        <p className="text-gray-500 text-sm">Есепті суретке түсір, AI оны бірден талдайды</p>
      </header>

      {!image ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[40px] border-4 border-dashed border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center gap-6" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 text-4xl shadow-inner">
            <i className="fas fa-qrcode"></i>
          </div>
          <div className="text-center">
            <p className="font-black text-gray-800 dark:text-slate-100">Суретті таңдаңыз немесе түсіріңіз</p>
            <p className="text-xs text-gray-400 mt-1">Тек химиялық есептер мен формулалар үшін</p>
          </div>
          <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleCapture} />
          <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">Камераны ашу</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <img src={image} alt="Scanner input" className="w-full rounded-2xl h-48 object-cover" />
            <button onClick={() => setImage(null)} className="w-full mt-4 text-xs font-bold text-red-500 py-2">Басқа сурет түсіру</button>
          </div>

          <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden min-h-[200px]">
            <i className="fas fa-brain absolute -right-6 -bottom-6 text-8xl text-white/10 rotate-12"></i>
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <i className="fas fa-magic text-amber-300"></i>
              AI Талдау нәтижесі
            </h4>
            
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/6"></div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis}</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-800 flex gap-4 items-start">
        <i className="fas fa-lightbulb text-amber-500 mt-1"></i>
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
          Кеңес: Жазу анық болуы керек. Есептің толық шарты суретке сыйғанын қадағалаңыз.
        </p>
      </div>
    </div>
  );
};

export default ScannerView;
