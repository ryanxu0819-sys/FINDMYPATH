import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BusinessIdea, UserProfile, Language } from '../types';
import { generateDetailedRoadmap } from '../services/geminiService';
import { ChevronLeft, Loader2, Printer, Save, Crown } from 'lucide-react';
import ChatConsultant from './ChatConsultant';
import { translations } from '../utils/translations';

interface RoadmapViewProps {
  idea: BusinessIdea;
  profile: UserProfile;
  isPro: boolean;
  language: Language;
  onBack: () => void;
  onUpgrade: () => void;
  onSave: () => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ idea, profile, isPro, language, onBack, onUpgrade, onSave }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const t = translations[language].roadmap;

  useEffect(() => {
    let isMounted = true;
    const fetchRoadmap = async () => {
      const result = await generateDetailedRoadmap(idea, profile, language);
      if (isMounted) {
        setMarkdown(result);
        setLoading(false);
      }
    };
    fetchRoadmap();
    return () => { isMounted = false; };
  }, [idea, profile, language]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-24 relative">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={onBack}
            className="flex items-center text-stone-500 hover:text-indigo-600 transition-colors"
        >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t.back}
        </button>

        <button 
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm font-medium"
        >
            <Save className="w-4 h-4" />
            {language === 'zh' ? '保存方案' : language === 'es' ? 'Guardar' : 'Save Plan'}
        </button>
      </div>

      {/* Main Roadmap */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
        <div className="bg-stone-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <div className="flex justify-between items-start relative z-10">
             <div>
                <h1 className="text-3xl font-bold mb-2 text-white">{idea.title}</h1>
                <p className="opacity-80 text-lg">{t.subtitle}</p>
             </div>
             <button onClick={() => window.print()} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors" title={t.print}>
                <Printer className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
              <p>Consulting with AI experts...</p>
            </div>
          ) : (
            <article className="prose prose-stone prose-lg prose-headings:text-indigo-900 prose-a:text-indigo-600 max-w-none">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          )}
        </div>
      </div>

      {/* GOLDEN PRO BUTTON */}
      <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setShowChat(true)}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg hover:scale-105 hover:shadow-amber-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
              <div className="absolute inset-0 rounded-full bg-white/20 group-hover:bg-transparent transition-colors"></div>
              <Crown className="w-6 h-6 animate-pulse" />
              <span className="text-lg tracking-wide shadow-black drop-shadow-md">
                 {language === 'zh' ? '尊贵会员专属咨询' : 'Supreme Pro Consultation'}
              </span>
          </button>
      </div>

      {/* Centered Chat Modal */}
      <ChatConsultant 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        isPro={isPro} 
        idea={idea} 
        profile={profile} 
        language={language}
        onUpgrade={onUpgrade} 
      />
    </div>
  );
};

export default RoadmapView;