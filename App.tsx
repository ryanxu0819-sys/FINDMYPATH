import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, BusinessIdea, User, Language, SavedIdea } from './types';
import WizardForm from './components/WizardForm';
import IdeaCard from './components/IdeaCard';
import RoadmapView from './components/RoadmapView';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import { generateBusinessIdeas } from './services/geminiService';
import { authService } from './services/authService';
import { translations } from './utils/translations';
import { Sparkles, PlayCircle, Crown, User as UserIcon, Globe, Rocket, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [view, setView] = useState<AppState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Modals State
  const [showPayment, setShowPayment] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Translations
  const t = translations[language];

  // Load user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleStart = () => {
    // Direct access to form, no login required initially (Guest Mode)
    setView('FORM');
  };

  const handleAuthSuccess = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setShowAuth(false);
    
    // If on Landing, go to Form. Otherwise stay on current view (Report/Roadmap) to continue action.
    if (view === 'LANDING') {
      setView('FORM');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('LANDING');
  };

  const generateIdeas = async (userProfile: UserProfile) => {
    // Only enforce limit if user is logged in. 
    // Guests get a "free pass" for the first generation in this session context, 
    // but won't be able to regenerate without logging in.
    if (user) {
      const canGenerate = authService.checkDailyLimit();
      if (!canGenerate) {
        alert("Daily limit reached. Upgrade to Pro for unlimited access.");
        setShowPayment(true);
        return;
      }
    }

    setProfile(userProfile);
    setView('ANALYZING');
    setLoadingMessage(t.analyzing.step1);
    
    try {
      setTimeout(() => setLoadingMessage(t.analyzing.step2), 2000);
      setTimeout(() => setLoadingMessage(t.analyzing.step3), 4500);
      
      const generatedIdeas = await generateBusinessIdeas(userProfile, language);
      
      // Only track usage if logged in
      if (user) {
        authService.incrementUsage();
        setUser(authService.getCurrentUser());
      }

      setIdeas(generatedIdeas);
      setView('REPORT');
    } catch (error) {
      alert("Something went wrong generating ideas. Please try again.");
      setView('FORM');
    }
  };

  const handleFormComplete = (userProfile: UserProfile) => {
      generateIdeas(userProfile);
  };

  const handleRegenerate = () => {
      // Require Login for Regenerate
      if (!user) {
          setShowAuth(true);
          return;
      }
      if (profile) {
          generateIdeas(profile);
      }
  };

  const handleSavePlan = () => {
     // Require Login for Saving
     if (!user) {
         setShowAuth(true);
         return;
     }
     
     if (selectedIdea) {
         authService.saveBusinessIdea(selectedIdea);
         const msg = language === 'zh' ? '方案已保存到您的账户' : language === 'es' ? 'Plan guardado' : 'Plan saved to your account';
         alert(msg);
         setView('REPORT');
     }
  };

  const handleSubscribeSuccess = () => {
    const updatedUser = authService.upgradeToPro();
    setUser(updatedUser);
    setShowPayment(false);
    alert("Welcome to VenturePath Pro!");
  };

  const handleOpenSavedPlan = (saved: SavedIdea) => {
      const mockProfile: UserProfile = profile || { 
          name: '', personality: '', skills: '', experience: '', budget: '', 
          timeCommitment: '', interests: '', riskTolerance: 'Medium', 
          familyStatus: 'Single', monthlyDebt: '', stressLevel: 5,
          gender: '', age: '', feelingLost: false, lifeStagnant: false,
          hasIndustryIdea: false,
          employmentStatus: 'employed'
      };
      
      setProfile(mockProfile);
      setSelectedIdea(saved.idea);
      setView('ROADMAP');
  };

  const changeLanguage = (lang: Language) => {
      setLanguage(lang);
      setIsLangMenuOpen(false);
  };

  const triggerUpgrade = () => {
      if (!user) {
          setShowAuth(true);
          return;
      }
      setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-stone-800 font-sans">
      {/* Modals */}
      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={handleSubscribeSuccess}
          language={language}
        />
      )}
      
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
          language={language}
        />
      )}

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900 hidden sm:block">VenturePath<span className="text-indigo-600">.ai</span></span>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Language Selector (Click Toggle) */}
            <div className="relative mr-2">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`p-2 hover:text-indigo-600 transition-colors flex items-center gap-1 rounded-lg ${isLangMenuOpen ? 'bg-stone-100 text-indigo-600' : 'text-stone-500'}`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase">{language}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[120px] z-50 animate-fade-in">
                  <div className="bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden">
                    <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 text-stone-700 hover:text-indigo-600">English</button>
                    <button onClick={() => changeLanguage('zh')} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 text-stone-700 hover:text-indigo-600">中文</button>
                    <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 text-stone-700 hover:text-indigo-600">Español</button>
                  </div>
                </div>
              )}
            </div>

            {user?.isPro ? (
              <span className="text-xs sm:text-sm font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full whitespace-nowrap border border-amber-100 shadow-sm">
                <Crown className="w-3 h-3 fill-current" /> {t.nav.proMember}
              </span>
            ) : (
             <button onClick={triggerUpgrade} className="text-xs sm:text-sm font-medium text-stone-500 hover:text-amber-600 flex items-center gap-1 transition-colors whitespace-nowrap">
                <Crown className="w-4 h-4" /> {t.nav.upgrade}
             </button>
            )}

            {user ? (
               <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                 <button 
                   onClick={() => setView('ACCOUNT')} 
                   className="flex items-center gap-2 hover:bg-stone-100 p-1.5 rounded-lg transition-colors group"
                   title={t.nav.account}
                 >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm transition-all
                        ${user.isPro 
                            ? 'bg-amber-100 text-amber-700 border-2 border-amber-400' 
                            : 'bg-stone-200 text-stone-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }
                    `}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                 </button>
               </div>
            ) : (
               <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                 <UserIcon className="w-4 h-4" /> {t.nav.login}
               </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {view === 'LANDING' && (
          <div className="text-center max-w-3xl mx-auto animate-fade-in pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6 border border-indigo-100 shadow-sm">
              <Sparkles className="w-4 h-4" />
              {t.landing.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
              {t.landing.titlePre} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {t.landing.titleHighlight}
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 mb-10 leading-relaxed">
              {t.landing.subtitle}
            </p>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
               <button 
                 onClick={handleStart}
                 className="group bg-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
               >
                 {t.landing.cta}
                 <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </button>
               {!user && (
                 <p className="text-xs text-stone-400">{t.landing.disclaimer}</p>
               )}
            </div>
          </div>
        )}

        {view === 'ACCOUNT' && user && (
          <UserDashboard 
            user={user} 
            language={language}
            onUpdateUser={setUser} 
            onLogout={handleLogout}
            onOpenSaved={handleOpenSavedPlan}
          />
        )}

        {view === 'FORM' && (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-stone-900">{t.form.title}</h2>
                <p className="text-stone-500 mt-2">{t.form.subtitle}</p>
                {!user?.isPro && (
                  <div className="mt-2 text-xs text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded">
                     {t.form.dailyLimit} {user?.dailyUsageCount}/1
                  </div>
                )}
             </div>
            <WizardForm onComplete={handleFormComplete} language={language} />
          </div>
        )}

        {view === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-pulse" />
             </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">{t.analyzing.title}</h2>
            <p className="text-indigo-600 font-medium animate-pulse">{loadingMessage}</p>
          </div>
        )}

        {view === 'REPORT' && (
          <div className="animate-fade-in">
            <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-stone-900 mb-2">{t.report.title}</h2>
                <p className="text-stone-600">
                    {t.report.subtitle}
                </p>
              </div>
              <button 
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm"
              >
                 <RefreshCw className="w-4 h-4" /> 
                 {language === 'zh' ? '重新生成' : 'Regenerate'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ideas.map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  language={language}
                  onSelect={(i) => {
                    setSelectedIdea(i);
                    setView('ROADMAP');
                    window.scrollTo(0,0);
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {view === 'ROADMAP' && selectedIdea && profile && (
          <RoadmapView 
            idea={selectedIdea} 
            profile={profile}
            isPro={!!user?.isPro}
            language={language}
            onBack={() => setView('REPORT')}
            onUpgrade={triggerUpgrade}
            onSave={handleSavePlan}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 mt-12">
         <div className="max-w-6xl mx-auto px-4 text-center text-stone-400 text-sm">
            <p>&copy; {new Date().getFullYear()} VenturePath AI. <span className="underline cursor-pointer">Terms</span> • <span className="underline cursor-pointer">Privacy</span></p>
         </div>
      </footer>
    </div>
  );
};

export default App;