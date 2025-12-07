import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, Loader2, Crown } from 'lucide-react';
import { translations } from '../utils/translations';
import { Language } from '../types';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess, language }) => {
  const [processing, setProcessing] = useState(false);
  const t = translations[language].payment;

  const handlePay = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 text-white text-center">
          <div className="bg-amber-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/50">
            <Crown className="w-8 h-8 text-amber-900" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{t.title}</h3>
          <div className="text-4xl font-extrabold text-white mt-2">{t.price}<span className="text-lg text-indigo-200 font-medium">{t.period}</span></div>
          <p className="text-indigo-200 text-sm mt-2">{t.cancel}</p>
        </div>

        <div className="p-8">
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-700">
               <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
               <span className="font-semibold">{t.benefit1}</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700">
               <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
               <span className="font-semibold">{t.benefit2}</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700">
               <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
               <span className="font-semibold">{t.benefit3}</span>
            </li>
          </ul>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
              <CreditCard className="w-4 h-4" /> Card Details (Simulated)
            </div>
            <div className="space-y-3">
               <input disabled className="w-full bg-white border border-slate-200 rounded p-2 text-sm cursor-not-allowed" value="•••• •••• •••• 4242" />
               <div className="flex gap-3">
                  <input disabled className="w-1/2 bg-white border border-slate-200 rounded p-2 text-sm cursor-not-allowed" value="12/25" />
                  <input disabled className="w-1/2 bg-white border border-slate-200 rounded p-2 text-sm cursor-not-allowed" value="•••" />
               </div>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              t.cta
            )}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> {t.secure}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;