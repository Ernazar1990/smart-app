import { GoogleGenAI, Type } from "@google/genai";

export const generateWeeklyTest = async (subjectName: string, topics: string[]) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    throw new Error("API key is missing");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Generate a comprehensive ҰБТ (UNT) style test for the subject: "${subjectName}".
    The test must over the following topics: ${topics.join(', ')}.
    
    Requirements:
    1. Total 40 questions.
    2. Questions 1-30: Single choice (exactly 4 options, 1 correct answer).
    3. Questions 31-40: Multiple choice (exactly 5-8 options, 1 to 3 correct answers).
    4. Language: Kazakh.
    5. Difficulty: UNT level.
    6. Ensure questions are diverse and cover all provided topics.
    
    Return the questions in a strictly valid JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer for single choice" },
                  isMulti: { type: Type.BOOLEAN },
                  correctAnswers: { 
                    type: Type.ARRAY, 
                    items: { type: Type.INTEGER },
                    description: "Indices of correct answers for multiple choice"
                  },
                  explanation: { type: Type.STRING }
                },
                required: ["text", "options"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{"questions": []}');
    return parsed.questions;
  } catch (error: any) {
    console.error("Gemini test generation error:", error);
    throw error;
  }
};

export const getProjectBotResponse = async (userPrompt: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    return "Қате: Байланыс орнату мүмкін емес. Жүйе әкімшісіне хабарласыңыз.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [{
            text: `Сіз "Smart App" (ҰБТ-ға дайындық платформасы) бойынша виртуалды көмекшісіз. 
            Платформа туралы ақпарат:
            - Мақсаты: Оқушыларды ҰБТ-ға (Химия, Биология және т.б.) дайындау.
            - Құрылымы: Әр пән бойынша тараулар (модульдер) бар. Мысалы, Химияда 22 тарау бар.
            - Сабақтар: Әр тарауда Теория, Есептер шығару және Тест талдауы бар.
            - Құралдар: Периодтық кесте, Ерігіштік кестесі, Формулалар хабы, Терминдер (Глоссарий), Реакция теңестіру құралы бар.
            - Жазылым (Subscription): Тегін нұсқада әр пәннен алғашқы 5 сабақ ашық. Толық курсты алу үшін "Премиум" жазылымы қажет.
            - Премиум артықшылықтары: Барлық сабақтарға шексіз қолжетімділік, куратор көмегі, толық тесттер.
            
            Оқушының сұрақтарына тек осы платформа аясында, қазақ тілінде, сыпайы жауап беріңіз. Егер сұрақ платформаға қатысты болмаса, оны платформамен байланыстыруға тырысыңыз.
            
            Сұрақ: ${userPrompt}`
          }]
        }
      ],
      config: {
        temperature: 0.5,
      }
    });
    
    return response.text || "Жауап алу мүмкін болмады.";
  } catch (error: any) {
    return "Сервермен байланыс үзілді. Қайта көріңіз.";
  }
};
