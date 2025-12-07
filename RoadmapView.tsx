import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BusinessIdea, UserProfile } from '../types';
import { generateDetailedRoadmap } from '../services/geminiService';
import { ChevronLeft, Loader2, Printer } from 'lucide-react';

interface RoadmapViewProps {
  idea: BusinessIdea;
  profile: UserProfile;
  onBack: () => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ idea, profile, onBack }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRoadmap = async () => {
      const result = await generateDetailedRoadmap(idea, profile);
      if (isMounted) {
        setMarkdown(result);
        setLoading(false);
      }
    };
    fetchRoadmap();
    return () => { isMounted = false; };
  }, [idea, profile]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Ideas
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
                <p className="opacity-90 text-indigo-100 text-lg">Your Zero to First Dollar Roadmap</p>
             </div>
             <button onClick={() => window.print()} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title="Print Plan">
                <Printer className="w-5 h-5" />
             </button>
          </div>
          <div className="mt-6 flex gap-4 text-sm font-medium">
             <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Platform: {idea.recommendedPlatform}
             </div>
             <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Target: {idea.potentialMonthlyRevenue}/mo
             </div>
          </div>
        </div>

        <div className="p-8 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
              <p>Consulting with AI experts to build your plan...</p>
            </div>
          ) : (
            <article className="prose prose-slate prose-headings:text-indigo-900 prose-a:text-indigo-600 max-w-none">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
