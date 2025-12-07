
import { User, BusinessIdea, SavedIdea } from '../types';

const USER_KEY = 'venturepath_user';

export const authService = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  },

  login: (email: string): User => {
    let user = authService.getCurrentUser();
    if (!user || user.email !== email) {
      user = {
        email,
        name: email.split('@')[0],
        isPro: false,
        lastGenerationDate: new Date().toISOString().split('T')[0],
        dailyUsageCount: 0,
        savedIdeas: []
      };
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  updateUser: (user: User): User => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  upgradeToPro: (): User | null => {
    const user = authService.getCurrentUser();
    if (user) {
      user.isPro = true;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  checkDailyLimit: (): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    if (user.isPro) return true;

    const today = new Date().toISOString().split('T')[0];
    
    if (user.lastGenerationDate !== today) {
      user.lastGenerationDate = today;
      user.dailyUsageCount = 0;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    }

    return user.dailyUsageCount < 1;
  },

  incrementUsage: () => {
    const user = authService.getCurrentUser();
    if (user) {
      user.dailyUsageCount += 1;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  saveBusinessIdea: (idea: BusinessIdea) => {
    const user = authService.getCurrentUser();
    if (user) {
      if (!user.savedIdeas) user.savedIdeas = [];
      // Check for duplicates
      if (!user.savedIdeas.find(saved => saved.idea.title === idea.title)) {
        user.savedIdeas.unshift({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            idea: idea
        });
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    }
  },

  deleteSavedIdea: (id: string) => {
    const user = authService.getCurrentUser();
    if (user && user.savedIdeas) {
        user.savedIdeas = user.savedIdeas.filter(i => i.id !== id);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
};
