import { GoogleGenAI } from "@google/genai";

export const getChemistryExplanation = async (userPrompt: string, history: {role: string, content: string}[]) => {
  // process.env.API_KEY Vite арқылы define баптауымен келеді
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.warn("API_KEY is not defined. Please add it to Vercel Environment Variables.");
    return "Қате: AI қызметінің кілті табылмады. Баптауларды тексеріңіз.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          parts: [{
            text: `Сіз Химия пәнінен ҰБТ-ға дайындайтын кәсіби ұстазсыз. Оқушының сұрақтарына түсінікті, нақты және тек қазақ тілінде жауап беріңіз. Реакция теңдеулерін және формулаларды қолданыңыз. \nСұрақ: ${userPrompt}`
          }]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    return response.text || "Жауап алу мүмкін болмады.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Сервермен байланыс үзілді. Кішкенеден соң қайталап көріңіз.";
  }
};