export interface UserProfile {
  // Demographics & Mental State
  gender: string;
  age: string;
  feelingLost: boolean; // 迷茫
  lifeStagnant: boolean; // 毫无起色
  
  // Business Params
  name: string;
  personality: string;
  skills: string;
  experience: string;
  budget: string;
  timeCommitment: string;
  interests: string;
  riskTolerance: 'Low' | 'Medium' | 'High';
  familyStatus: string;
  monthlyDebt: string;
  stressLevel: number;

  // New Fields: Direction & Employment
  hasIndustryIdea: boolean;
  targetIndustry?: string;
  ambition?: 'wealth' | 'side_hustle'; // Empire vs Side Income
  
  employmentStatus: 'employed' | 'unemployed' | 'freelance';
  currentJob?: string;
  currentSalary?: string;
  workHours?: string; // How many hours they work currently
  targetIncome?: string; // If unemployed/freelance
}

export interface SavedIdea {
  id: string;
  date: string;
  idea: BusinessIdea;
}

export interface User {
  email: string;
  name: string;
  isPro: boolean;
  lastGenerationDate: string; // ISO Date string
  dailyUsageCount: number;
  subscriptionStatus?: 'active' | 'canceled' | 'none';
  subscriptionEndDate?: string;
  savedIdeas: SavedIdea[];
}

export interface BusinessIdea {
  id: string;
  title: string;
  oneLiner: string;
  reasoning: string;
  difficultyScore: number;
  estimatedStartupCost: string;
  potentialMonthlyRevenue: string;
  tags: string[];
  recommendedPlatform: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type Language = 'en' | 'zh' | 'es';

export type AppState = 'LANDING' | 'FORM' | 'ANALYZING' | 'REPORT' | 'ROADMAP' | 'ACCOUNT';