
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, BusinessIdea, ChatMessage, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const businessResponseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      oneLiner: { type: Type.STRING },
      reasoning: { type: Type.STRING, description: "Mental state aware reasoning" },
      difficultyScore: { type: Type.NUMBER, description: "1 to 10" },
      estimatedStartupCost: { type: Type.STRING },
      potentialMonthlyRevenue: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendedPlatform: { type: Type.STRING }
    },
    required: ["title", "oneLiner", "reasoning", "difficultyScore", "estimatedStartupCost", "potentialMonthlyRevenue", "tags", "recommendedPlatform"]
  }
};

export const generateBusinessIdeas = async (profile: UserProfile, language: Language): Promise<BusinessIdea[]> => {
  const modelId = "gemini-3-pro-preview";

  // Construct specific employment context
  let employmentContext = "";
  if (profile.employmentStatus === 'employed') {
      employmentContext = `User is EMPLOYED as "${profile.currentJob}". Earns ${profile.currentSalary}. Works ${profile.workHours} hrs/week. Time is LIMITED. Focus on side hustles or scalable things that don't require 24/7 presence initially.`;
  } else {
      employmentContext = `User is ${profile.employmentStatus}. Target Income: ${profile.targetIncome}. Time is FLEXIBLE but need income ASAP.`;
  }

  // Construct Ambition/Industry context
  let directionContext = "";
  if (profile.hasIndustryIdea) {
      directionContext = `CRITICAL: The user SPECIFICALLY wants to be in the "${profile.targetIndustry}" industry. GENERATE IDEAS ONLY IN THIS INDUSTRY. Do not suggest anything else.`;
  } else {
      if (profile.ambition === 'wealth') {
          directionContext = `User goal: BECOME A MILLIONAIRE (Build an Empire). Focus on High Growth, Scalable Startups, Equity value. Ignore small gig work.`;
      } else {
          directionContext = `User goal: SIDE HUSTLE (Extra Income). Focus on low risk, quick cash flow, easy to start businesses.`;
      }
  }

  const mentalContext = `
    User Demographics: ${profile.age} years old, ${profile.gender}.
    Mental State: ${profile.feelingLost ? 'Feeling LOST in life.' : 'Focused.'}
    Life Stagnation: ${profile.lifeStagnant ? 'Feels life is STAGNANT/Going nowhere.' : 'Making progress.'}
    Financial Stress: ${profile.stressLevel}/10.
  `;

  const prompt = `
    You are an expert career and life coach.
    Analyze the following user profile to generate 3 business ideas.
    
    ${mentalContext}
    ${employmentContext}
    ${directionContext}
    
    Profile:
    - Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Budget: ${profile.budget}
    - Time: ${profile.timeCommitment}
    - Interests: ${profile.interests}
    
    Task: Generate 3 highly personalized business ideas.
    
    CRITICAL RULES: 
    1. If the user specified an industry ("${profile.targetIndustry}"), YOU MUST OBEY IT.
    2. If the user feels LOST or STAGNANT, your "reasoning" MUST be encouraging and explain why this specific path will help them regain control.
    3. If stress is high, prioritize quick wins.
    
    Language Instruction: ${language === 'zh' ? "Output in SIMPLIFIED CHINESE" : language === 'es' ? "Output in SPANISH" : "Output in ENGLISH"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: businessResponseSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.map((item: any, index: number) => ({ ...item, id: `idea-${index}-${Date.now()}` }));
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate business ideas.");
  }
};

export const generateDetailedRoadmap = async (idea: BusinessIdea, profile: UserProfile, language: Language): Promise<string> => {
  const modelId = "gemini-3-pro-preview";

  const introPrompt = profile.feelingLost || profile.lifeStagnant
    ? "The user feels lost or stuck. Start the roadmap with a short, powerful, empathetic paragraph acknowledging their struggle and inspiring them that THIS is their way out."
    : "Start with a high-energy professional summary.";
    
  let empAdvice = "";
  if (profile.employmentStatus === 'employed') {
      empAdvice = "Since the user is currently employed, include specific tips on how to manage this alongside their 9-5 job (e.g. 'Lunch break tasks', 'Weekend sprints').";
  }

  const prompt = `
    Create a detailed "Zero to First Dollar" roadmap for: ${idea.title}.
    User: ${profile.age}yo ${profile.gender}, Exp: ${profile.experience}.
    
    ${introPrompt}
    ${empAdvice}

    Include:
    1. **Empowering Intro**
    2. **The "Starter Kit"** (Tools, Accounts, Setup)
    3. **Step-by-Step Execution** (Week 1-4)
    4. **First Sale Script/Strategy**
    5. **Scaling**
    
    Language: ${language === 'zh' ? "SIMPLIFIED CHINESE" : language === 'es' ? "SPANISH" : "ENGLISH"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Could not generate roadmap.";
  } catch (error) {
    return "Error generating roadmap.";
  }
};

export const sendConsultationMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  idea: BusinessIdea, 
  profile: UserProfile,
  language: Language
): Promise<string> => {
  const modelId = "gemini-3-pro-preview";
  
  const closingPhrase = language === 'zh' 
    ? "您是否还有其他疑问，如果还有请告诉我，如您已经准备好要开始搞钱，那么，让我们开始征服星辰和大海吧！"
    : language === 'es' 
    ? "¿Tiene alguna otra pregunta? Si es así, dímelo. Si ya estás listo para ganar dinero, ¡comencemos a conquistar las estrellas y el mar!"
    : "Do you have any other questions? If so, tell me. If you are ready to make money, then let us begin to conquer the stars and the sea!";

  const prompt = `
    You are a Wise and Passionate Business Master (AI Grandmaster).
    The user is asking about: "${idea.title}".
    
    User Context:
    - Feeling Lost: ${profile.feelingLost}
    - Stagnant: ${profile.lifeStagnant}
    - Employment: ${profile.employmentStatus}
    
    Tone: Highly encouraging, authoritative, visionary, but practical.
    
    Instructions:
    1. Answer the user's question specifically.
    2. ALWAYS end your response with this EXACT phrase:
    "${closingPhrase}"
    
    Conversation History:
    ${history.map(h => `${h.role === 'user' ? 'User' : 'Master'}: ${h.text}`).join('\n')}
    
    User: ${newMessage}
    Master:
  `;

  try {
    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt
    });

    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error", error);
    return "Connection error.";
  }
};
