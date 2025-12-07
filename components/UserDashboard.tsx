
import React, { useState } from 'react';
import { User, Language, SavedIdea } from '../types';
import { authService } from '../services/authService';
import { translations } from '../utils/translations';
import { CreditCard, Shield, User as UserIcon, LogOut, Bookmark, AlertTriangle, ArrowRight } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  language: Language;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onOpenSaved: (idea: SavedIdea) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, language, onUpdateUser, onLogout, onOpenSaved }) => {
  const t = translations[language].account;
  const [activeTab, setActiveTab] = useState<'subscription' | 'profile' | 'security' | 'saved'>('subscription');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = () => {
    const updatedUser = { ...user, name, email };
    authService.updateUser(updatedUser);
    onUpdateUser(updatedUser);
    alert("Profile updated successfully");
  };

  const handleToggleSubscription = () => {
    if (user.isPro) {
      if (confirm("Are you sure you want to cancel?")) {
         const updatedUser = { ...user, isPro: false, subscriptionStatus: 'canceled' as const };
         authService.updateUser(updatedUser);
         onUpdateUser(updatedUser);
      }
    } else {
       alert("Please go to the main page to upgrade.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-8">{t.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
           <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'subscription' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
          >
            <CreditCard className="w-5 h-5" /> {t.subscription}
          </button>
           <button
            onClick={() => setActiveTab('saved')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
          >
            <Bookmark className="w-5 h-5" /> {language === 'zh' ? '我的方案' : 'Saved Plans'}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
          >
            <UserIcon className="w-5 h-5" /> {t.profile}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'security' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'}`}
          >
            <Shield className="w-5 h-5" /> {t.security}
          </button>
          
          <div className="pt-4 border-t border-stone-200 mt-4">
             <button
              onClick={onLogout}
              className="w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> {translations[language].nav.logout}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 min-h-[400px]">
            
            {activeTab === 'saved' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-stone-800 border-b border-stone-100 pb-4">
                        {language === 'zh' ? '已保存的方案' : 'Saved Business Plans'}
                    </h2>
                    
                    {!user.savedIdeas || user.savedIdeas.length === 0 ? (
                        <div className="text-center py-12 text-stone-400">
                            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>{language === 'zh' ? '暂无保存的方案' : 'No saved plans yet'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {user.savedIdeas.map((saved) => (
                                <div key={saved.id} className="p-4 border border-stone-200 rounded-xl hover:border-indigo-300 transition-colors flex justify-between items-center group">
                                    <div>
                                        <h3 className="font-bold text-stone-800">{saved.idea.title}</h3>
                                        <p className="text-sm text-stone-500">{new Date(saved.date).toLocaleDateString()} • {saved.idea.recommendedPlatform}</p>
                                    </div>
                                    <button 
                                        onClick={() => onOpenSaved(saved)}
                                        className="text-indigo-600 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        View <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold text-stone-800 border-b border-stone-100 pb-4">{t.subscription}</h2>
                 
                 <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="text-sm text-stone-500 mb-1">{t.currentPlan}</div>
                          <div className="text-2xl font-bold text-stone-900">
                             {user.isPro ? "VenturePath Pro" : "Free Starter"}
                          </div>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.isPro ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                          {user.isPro ? t.active : t.inactive}
                       </div>
                    </div>
                    
                    {user.isPro && (
                       <div className="text-sm text-stone-600 mb-6">
                          <p>{t.renews}: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
                          <p className="text-stone-400 text-xs mt-1">($2.99/mo)</p>
                       </div>
                    )}

                    {user.isPro ? (
                       <button 
                         onClick={handleToggleSubscription}
                         className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
                       >
                         <AlertTriangle className="w-4 h-4" /> {t.cancelSub}
                       </button>
                    ) : (
                       <button disabled className="text-stone-400 text-sm italic cursor-not-allowed">
                          {t.inactive}
                       </button>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-stone-800 border-b border-stone-100 pb-4">{t.profile}</h2>
                <div className="grid grid-cols-1 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">{t.name}</label>
                      <input 
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">{t.email}</label>
                      <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <button onClick={handleUpdateProfile} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 self-start w-fit">{t.save}</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-stone-800 border-b border-stone-100 pb-4">{t.security}</h2>
                 <div className="grid grid-cols-1 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">{t.newPass}</label>
                      <input 
                         type="password" 
                         placeholder="••••••••"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">{t.confirmPass}</label>
                      <input 
                         type="password" 
                         placeholder="••••••••"
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <button onClick={() => { setPassword(''); setNewPassword(''); alert('Password updated'); }} className="bg-white border border-stone-300 text-stone-700 px-6 py-2 rounded-lg font-medium hover:bg-stone-50 self-start w-fit">{t.changePass}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
