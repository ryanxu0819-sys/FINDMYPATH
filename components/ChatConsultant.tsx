import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Crown, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, BusinessIdea, UserProfile, Language } from '../types';
import { sendConsultationMessage } from '../services/geminiService';
import { translations } from '../utils/translations';

interface ChatConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  idea: BusinessIdea;
  profile: UserProfile;
  language: Language;
  onUpgrade: () => void;
}

const ChatConsultant: React.FC<ChatConsultantProps> = ({ isOpen, onClose, isPro, idea, profile, language, onUpgrade }) => {
  const t = translations[language].chat;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0 && isOpen) {
       const greeting = language === 'zh' 
        ? `我是您的专属商业大师。关于【${idea.title}】，您想知道什么？` 
        : language === 'es' 
        ? `Soy su Maestro de Negocios. ¿Qué desea saber sobre ${idea.title}?` 
        : `I am your dedicated Business Master. What do you wish to know about ${idea.title}?`;
       setMessages([{ role: 'model', text: greeting }]);
    }
  }, [language, idea.title, messages.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await sendConsultationMessage(messages, userMsg, idea, profile, language);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col h-[600px] relative">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg border-2 border-amber-100">
                        <Crown className="w-6 h-6 text-amber-900" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-amber-100">{t.title}</h3>
                        <p className="text-xs text-indigo-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {t.online}
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="relative z-10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Chat Body */}
            {!isPro ? (
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50">
                    <div className="bg-amber-100 p-6 rounded-full mb-6 animate-pulse">
                        <Crown className="w-12 h-12 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-3">{t.unlockTitle}</h3>
                    <p className="text-stone-600 mb-8 max-w-sm">
                        {t.unlockDesc}
                    </p>
                    <button 
                        onClick={onUpgrade}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-8 rounded-xl shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform"
                    >
                        {t.upgrade}
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50">
                        {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center mr-2 mt-2 flex-shrink-0">
                                    <Bot className="w-4 h-4 text-amber-400" />
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none'
                            }`}>
                            {msg.text}
                            </div>
                        </div>
                        ))}
                        {loading && (
                        <div className="flex justify-start">
                             <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center mr-2 flex-shrink-0">
                                <Bot className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                            </div>
                        </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-stone-200">
                        <div className="relative flex items-center">
                             <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t.placeholder}
                                className="w-full bg-stone-100 border border-stone-200 text-stone-800 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="absolute right-2 bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};

export default ChatConsultant;