import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, DollarSign, Clock, Brain, Heart, ShieldAlert, Briefcase } from 'lucide-react';

interface WizardFormProps {
  onComplete: (profile: UserProfile) => void;
}

const WizardForm: React.FC<WizardFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    personality: '',
    skills: '',
    experience: '',
    budget: '',
    timeCommitment: '',
    interests: '',
    riskTolerance: 'Medium',
  });

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.budget.length > 0 && formData.timeCommitment.length > 0;
      // Added check for experience length to ensure AI has context
      case 2: return formData.skills.length > 0 && formData.interests.length > 0 && formData.experience.length > 0;
      case 3: return formData.personality.length > 0;
      default: return true;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-indigo-600 h-2 w-full">
        <div 
          className="bg-indigo-300 h-full transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              Let's talk resources
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">How much capital can you invest right now?</label>
                <input
                  type="text"
                  placeholder="e.g. $0, $500, $5000"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">How much time can you commit?</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.timeCommitment}
                  onChange={(e) => handleChange('timeCommitment', e.target.value)}
                >
                  <option value="">Select an option...</option>
                  <option value="Just weekends">Just weekends (5-10 hrs/week)</option>
                  <option value="Evenings after work">Evenings (10-20 hrs/week)</option>
                  <option value="Half-time">Half-time (20+ hrs/week)</option>
                  <option value="Full-time">Full-time (40+ hrs/week)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              Your Resume & Assets
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Professional Background / Resume <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="e.g. 5 years in retail management, degree in history, currently working as an admin assistant..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills (Hard & Soft)</label>
                <input
                  type="text"
                  placeholder="e.g. Graphic design, sales, empathy, Excel"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Interests</label>
                <input
                  type="text"
                  placeholder="e.g. Fitness, Gaming, Sustainable living, Fashion"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.interests}
                  onChange={(e) => handleChange('interests', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Heart className="w-6 h-6 text-indigo-600" />
              The Personal Touch
            </h2>
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">How would friends describe your personality?</label>
                <input
                  type="text"
                  placeholder="e.g. Introverted thinker, Extroverted salesperson, Detailed planner"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.personality}
                  onChange={(e) => handleChange('personality', e.target.value)}
                />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-500"/>
                    Risk Tolerance
                 </label>
                 <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'High'].map((risk) => (
                        <button
                            key={risk}
                            onClick={() => handleChange('riskTolerance', risk as any)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                formData.riskTolerance === risk 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            {risk}
                        </button>
                    ))}
                 </div>
                 <p className="text-xs text-slate-500 mt-2">
                    {formData.riskTolerance === 'Low' && "I prefer safe bets with steady, smaller returns."}
                    {formData.riskTolerance === 'Medium' && "I'm willing to take calculated risks for growth."}
                    {formData.riskTolerance === 'High' && "I want to go big, even if it means failing."}
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? 'opacity-0' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          Back
        </button>
        
        {step < 3 ? (
             <button
             onClick={nextStep}
             disabled={!isStepValid()}
             className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             Next <ArrowRight className="w-4 h-4" />
           </button>
        ) : (
            <button
            onClick={() => onComplete(formData)}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            Generate My Plan
          </button>
        )}
       
      </div>
    </div>
  );
};

export default WizardForm;
