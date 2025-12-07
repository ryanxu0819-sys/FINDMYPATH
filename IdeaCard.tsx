import React from 'react';
import { BusinessIdea } from '../types';
import { TrendingUp, Wallet, Activity, ArrowRight, Tag } from 'lucide-react';

interface IdeaCardProps {
  idea: BusinessIdea;
  onSelect: (idea: BusinessIdea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{idea.title}</h3>
          <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded mt-1">
            Platform: {idea.recommendedPlatform}
          </span>
        </div>
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
          ${idea.difficultyScore <= 3 ? 'bg-green-100 text-green-700' : 
            idea.difficultyScore <= 7 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'}
        `} title="Difficulty Score (1-10)">
          {idea.difficultyScore}
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4 flex-grow italic">
        "{idea.oneLiner}"
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-700">
           <TrendingUp className="w-4 h-4 text-emerald-500" />
           <span>Potential: <span className="font-medium">{idea.potentialMonthlyRevenue}</span>/mo</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
           <Wallet className="w-4 h-4 text-blue-500" />
           <span>Startup Cost: <span className="font-medium">{idea.estimatedStartupCost}</span></span>
        </div>
        <div className="bg-slate-50 p-3 rounded text-sm text-slate-600">
            <span className="font-semibold text-slate-700 block mb-1">Why you?</span>
            {idea.reasoning}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {idea.tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            <Tag className="w-3 h-3" /> {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => onSelect(idea)}
        className="mt-auto w-full py-2.5 px-4 bg-white border-2 border-indigo-600 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2 group"
      >
        View Action Plan
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default IdeaCard;
