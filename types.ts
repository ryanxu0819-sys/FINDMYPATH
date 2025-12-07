export interface UserProfile {
  name: string;
  personality: string; // e.g., "Introvert", "Creative", "Analytical"
  skills: string; // e.g., "Programming, Writing, Cooking"
  experience: string; // e.g., "5 years in sales", "Student", "Ex-Engineer"
  budget: string; // e.g., "500", "5000", "0"
  timeCommitment: string; // e.g., "Weekends", "Full-time"
  interests: string;
  riskTolerance: 'Low' | 'Medium' | 'High';
}

export interface BusinessIdea {
  id: string;
  title: string;
  oneLiner: string;
  reasoning: string;
  difficultyScore: number; // 1-10
  estimatedStartupCost: string;
  potentialMonthlyRevenue: string;
  tags: string[];
  recommendedPlatform: string;
}

export interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  actionItems: string[];
}

export type AppState = 'LANDING' | 'FORM' | 'ANALYZING' | 'REPORT' | 'ROADMAP';