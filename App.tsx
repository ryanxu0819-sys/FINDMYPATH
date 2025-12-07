import React, { useState } from 'react';
import { AppState, UserProfile, BusinessIdea } from './types';
import WizardForm from './components/WizardForm';
import IdeaCard from './components/IdeaCard';
import RoadmapView from './components/RoadmapView';
import { generateBusinessIdeas } from './services/geminiService';
import { Sparkles, Briefcase, Loader2, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppState>('LANDING');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleFormComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setView('ANALYZING');
    
    // Simulate steps for UX
    setLoadingMessage("Analyzing your personality profile...");
    
    try {
      setTimeout(() => setLoadingMessage("Identifying market gaps for your budget..."), 1500);
      setTimeout(() => setLoadingMessage("Formulating business models..."), 3500);
      
      const generatedIdeas = await generateBusinessIdeas(userProfile);
      setIdeas(generatedIdeas);
      setView('REPORT');
    } catch (error) {
      alert("Something went wrong generating ideas. Please try again.");
      setView('FORM');
    }
  };

  const handleIdeaSelect = (idea: BusinessIdea) => {
    setSelectedIdea(idea);
    setView('ROADMAP');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-900">VenturePath<span className="text-indigo-600">.ai</span></span>
          </div>
          {view !== 'LANDING' && (
            <button 
              onClick={() => setView('LANDING')}
              className="text-sm text-slate-500 hover:text-indigo-600"
            >
              Start Over
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {view === 'LANDING' && (
          <div className="text-center max-w-3xl mx-auto animate-fade-in pt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Gemini 2.0
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Don't know what to sell? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Let AI decide for you.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Stop guessing. We analyze your personality, budget, and skills to generate 
              a tailored business roadmap that actually works for <strong>you</strong>.
            </p>
            <button 
              onClick={() => setView('FORM')}
              className="group bg-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
            >
              Find My Business Idea
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { title: "Smart Matching", desc: "No generic advice. We match ideas to your specific personality type." },
                { title: "Budget Conscious", desc: "Whether you have $0 or $10k, we find a path that fits your wallet." },
                { title: "Actionable Plans", desc: "Get a step-by-step roadmap on exactly how to start earning." }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'FORM' && (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Tell us about yourself</h2>
                <p className="text-slate-500 mt-2">The more honest you are, the better the ideas.</p>
             </div>
            <WizardForm onComplete={handleFormComplete} />
          </div>
        )}

        {view === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-pulse" />
             </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Profile</h2>
            <p className="text-indigo-600 font-medium animate-pulse">{loadingMessage}</p>
          </div>
        )}

        {view === 'REPORT' && (
          <div className="animate-fade-in">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Here are your top matches</h2>
              <p className="text-slate-600">Based on your budget of <strong>{profile?.budget}</strong> and interest in <strong>{profile?.interests}</strong>.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ideas.map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  onSelect={handleIdeaSelect} 
                />
              ))}
            </div>
          </div>
        )}

        {view === 'ROADMAP' && selectedIdea && profile && (
          <RoadmapView 
            idea={selectedIdea} 
            profile={profile}
            onBack={() => setView('REPORT')} 
          />
        )}

      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
         <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} VenturePath AI. Advice generated by AI may vary.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;