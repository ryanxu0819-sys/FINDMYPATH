import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, BusinessIdea } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const businessResponseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      oneLiner: { type: Type.STRING },
      reasoning: { type: Type.STRING, description: "Why this fits the user specifically" },
      difficultyScore: { type: Type.NUMBER, description: "1 to 10" },
      estimatedStartupCost: { type: Type.STRING },
      potentialMonthlyRevenue: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendedPlatform: { type: Type.STRING, description: "Best platform to start (e.g. Shopify, Upwork, TikTok)" }
    },
    required: ["title", "oneLiner", "reasoning", "difficultyScore", "estimatedStartupCost", "potentialMonthlyRevenue", "tags", "recommendedPlatform"]
  }
};

export const generateBusinessIdeas = async (profile: UserProfile): Promise<BusinessIdea[]> => {
  const modelId = "gemini-3-pro-preview"; // Using Pro for complex reasoning

  const prompt = `
    You are an expert career coach and startup consultant. 
    Analyze the following user profile and generate 3 highly personalized, viable business or side-hustle ideas.
    
    User Profile:
    - Personality: ${profile.personality}
    - Professional Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Budget/Capital: ${profile.budget}
    - Time Commitment: ${profile.timeCommitment}
    - Interests: ${profile.interests}
    - Risk Tolerance: ${profile.riskTolerance}

    Constraints:
    - Ideas must be realistic given the budget.
    - Strong emphasis on leveraging their 'Professional Experience' and 'Skills'.
    - Suggest the specific platform to start on (e.g., specific marketplaces, social platforms, or tech stacks).
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
      // Add unique IDs
      return data.map((item: any, index: number) => ({ ...item, id: `idea-${index}-${Date.now()}` }));
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate business ideas. Please try again.");
  }
};

export const generateDetailedRoadmap = async (idea: BusinessIdea, profile: UserProfile): Promise<string> => {
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    Create a step-by-step "Zero to First Dollar" roadmap for the following business idea.
    
    Business: ${idea.title}
    Platform: ${idea.recommendedPlatform}
    User Constraints: Budget ${profile.budget}, Time ${profile.timeCommitment}, Experience: ${profile.experience}.

    Format the output as a clean Markdown document.
    Include:
    1. **Preparation (Day 1-3)**: What exactly to buy/setup.
    2. **Platform Mastery**: How to use ${idea.recommendedPlatform} specifically.
    3. **Leveraging Experience**: How to use their background in ${profile.experience} to gain an unfair advantage.
    4. **First Product/Service Offer**: Defining the MVP.
    5. **Getting the First Client/Sale**: specific marketing tactic.
    6. **Scaling**: What to do after the first sale.
    
    Keep it actionable, encouraging, and specific. Use headers, bullet points, and bold text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Could not generate roadmap.";
  } catch (error) {
    console.error("Gemini API Roadmap Error:", error);
    return "Sorry, we encountered an error generating your roadmap.";
  }
};