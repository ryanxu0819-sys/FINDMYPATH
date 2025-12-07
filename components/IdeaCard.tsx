import React from 'react';
import { BusinessIdea, Language } from '../types';
import { TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { translations } from '../utils/translations';

interface IdeaCardProps {
  idea: BusinessIdea;
  language: Language;
  onSelect: (idea: BusinessIdea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, language, onSelect }) => {
  const t = translations[language].report;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative group animate-fade-in">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{idea.title}</h3>
            <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded mt-1">
              {idea.recommendedPlatform}
            </span>
          </div>
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
            ${idea.difficultyScore <= 3 ? 'bg-green-100 text-green-700' : idea.difficultyScore <= 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
          `}>
            {idea.difficultyScore}
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-4 italic">
          "{idea.oneLiner}"
        </p>
      </div>

      {/* Content Body */}
      <div className="p-6 pt-0 flex-grow relative">
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-sm text-slate-700">
             <TrendingUp className="w-4 h-4 text-emerald-500" />
             <span>{t.potential}: <span className="font-medium">{idea.potentialMonthlyRevenue}</span></span>
           </div>
           <div className="flex items-center gap-2 text-sm text-slate-700">
             <Wallet className="w-4 h-4 text-blue-500" />
             <span>{t.startupCost}: <span className="font-medium">{idea.estimatedStartupCost}</span></span>
           </div>
           <div className="bg-slate-50 p-3 rounded text-sm text-slate-600">
              <span className="font-semibold text-slate-700 block mb-1">{t.whyYou}</span>
              {idea.reasoning}
           </div>
           <div className="flex flex-wrap gap-2">
              {idea.tags.map(tag => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <button
          onClick={() => onSelect(idea)}
          className="w-full py-2.5 px-4 rounded-lg font-semibold border-2 border-indigo-600 text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-2 transition-colors"
        >
          {t.viewPlan}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;