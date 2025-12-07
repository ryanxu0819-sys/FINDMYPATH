import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { ArrowRight, DollarSign, Brain, Heart, Home, Activity, Smile, Briefcase, Target } from 'lucide-react';
import { translations } from '../utils/translations';

interface WizardFormProps {
  onComplete: (profile: UserProfile) => void;
  language: Language;
}

const WizardForm: React.FC<WizardFormProps> = ({ onComplete, language }) => {
  const [step, setStep] = useState(0); // Start at 0 for Demographics
  const [formData, setFormData] = useState<UserProfile>({
    gender: 'Male',
    age: '',
    feelingLost: false,
    lifeStagnant: false,
    name: '',
    personality: '',
    skills: '',
    experience: '',
    budget: '',
    timeCommitment: '',
    interests: '',
    riskTolerance: 'Medium',
    familyStatus: 'Single',
    monthlyDebt: '',
    stressLevel: 5,
    // New Defaults
    hasIndustryIdea: false,
    targetIndustry: '',
    ambition: 'side_hustle',
    employmentStatus: 'employed',
    currentJob: '',
    currentSalary: '',
    workHours: '',
    targetIncome: ''
  });

  const t = translations[language].form;

  // Manual translations mapping for step 0 (Mental)
  const mentalLabels = language === 'zh' ? {
      title: "关于你自己",
      age: "年龄",
      gender: "性别",
      lost: "你是否经常感到迷茫，不知道未来方向？",
      stagnant: "你是否觉得生活毫无起色，停滞不前？",
      yes: "是",
      no: "否"
  } : language === 'es' ? {
      title: "Sobre Ti",
      age: "Edad",
      gender: "Género",
      lost: "¿Te sientes perdido a menudo?",
      stagnant: "¿Sientes que tu vida está estancada?",
      yes: "Sí",
      no: "No"
  } : {
      title: "About You",
      age: "Age",
      gender: "Gender",
      lost: "Do you often feel lost about your future?",
      stagnant: "Do you feel your life is stagnant?",
      yes: "Yes",
      no: "No"
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const isStepValid = () => {
    switch (step) {
      case 0: return formData.age.length > 0;
      case 1: return formData.budget.length > 0 && formData.timeCommitment.length > 0;
      case 2: // Experience & Employment
        if (formData.experience.length === 0) return false;
        if (formData.employmentStatus === 'employed') {
            return (formData.currentJob?.length || 0) > 0 && (formData.currentSalary?.length || 0) > 0 && (formData.workHours?.length || 0) > 0;
        } else {
            return (formData.targetIncome?.length || 0) > 0;
        }
      case 3: // Direction & Interest
        if (formData.hasIndustryIdea) {
            return (formData.targetIndustry?.length || 0) > 0;
        }
        return true;
      case 4: return formData.monthlyDebt.length >= 0;
      default: return true;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
      <div className="bg-indigo-600 h-2 w-full">
        <div 
          className="bg-amber-400 h-full transition-all duration-500 ease-out" 
          style={{ width: `${((step + 1) / 5) * 100}%` }}
        />
      </div>

      <div className="p-8">
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <Smile className="w-6 h-6 text-indigo-600" />
              {mentalLabels.title}
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">{mentalLabels.age}</label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">{mentalLabels.gender}</label>
                    <select
                      className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-700 font-medium">{mentalLabels.lost}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleChange('feelingLost', true)}
                            className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${formData.feelingLost ? 'bg-indigo-600 text-white' : 'bg-white text-stone-500 border'}`}
                        >
                            {mentalLabels.yes}
                        </button>
                        <button 
                            onClick={() => handleChange('feelingLost', false)}
                            className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${!formData.feelingLost ? 'bg-indigo-600 text-white' : 'bg-white text-stone-500 border'}`}
                        >
                            {mentalLabels.no}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-700 font-medium">{mentalLabels.stagnant}</span>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => handleChange('lifeStagnant', true)}
                            className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${formData.lifeStagnant ? 'bg-indigo-600 text-white' : 'bg-white text-stone-500 border'}`}
                        >
                            {mentalLabels.yes}
                        </button>
                        <button 
                            onClick={() => handleChange('lifeStagnant', false)}
                            className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${!formData.lifeStagnant ? 'bg-indigo-600 text-white' : 'bg-white text-stone-500 border'}`}
                        >
                            {mentalLabels.no}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              {t.step1}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.budgetLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. $0, $500, $5000"
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.timeLabel}</label>
                <select
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.timeCommitment}
                  onChange={(e) => handleChange('timeCommitment', e.target.value)}
                >
                  <option value="">Select an option...</option>
                  <option value="Just weekends">Weekends</option>
                  <option value="Evenings after work">Evenings</option>
                  <option value="Half-time">Part-time</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              {t.step2}
            </h2>
            
            {/* Employment Status Section */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t.empStatusLabel}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button 
                            onClick={() => handleChange('employmentStatus', 'employed')}
                            className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${formData.employmentStatus === 'employed' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
                        >
                            {t.empOption1}
                        </button>
                        <button 
                             onClick={() => handleChange('employmentStatus', 'unemployed')}
                             className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${formData.employmentStatus === 'unemployed' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
                        >
                            {t.empOption2}
                        </button>
                        <button 
                             onClick={() => handleChange('employmentStatus', 'freelance')}
                             className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${formData.employmentStatus === 'freelance' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
                        >
                            {t.empOption3}
                        </button>
                    </div>
                </div>

                {formData.employmentStatus === 'employed' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-stone-700 mb-1">{t.jobTitleLabel}</label>
                             <input
                                type="text"
                                className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.currentJob}
                                onChange={(e) => handleChange('currentJob', e.target.value)}
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-stone-700 mb-1">{t.salaryLabel}</label>
                             <input
                                type="text"
                                className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.currentSalary}
                                onChange={(e) => handleChange('currentSalary', e.target.value)}
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-stone-700 mb-1">{t.workHoursLabel}</label>
                             <input
                                type="text"
                                className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.workHours}
                                onChange={(e) => handleChange('workHours', e.target.value)}
                             />
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <label className="block text-sm font-medium text-stone-700 mb-1">{t.targetIncomeLabel}</label>
                        <input
                            type="text"
                            placeholder="e.g. $3000/mo"
                            className="w-full p-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.targetIncome}
                            onChange={(e) => handleChange('targetIncome', e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.expLabel}</label>
                <textarea
                  placeholder="e.g. 5 years in retail..."
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.skillsLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. Sales, Writing, Driving"
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.skills}
                  onChange={(e) => handleChange('skills', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              {t.step3}
            </h2>

            {/* Industry Intent Section */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t.industryQuestion}</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                checked={formData.hasIndustryIdea} 
                                onChange={() => handleChange('hasIndustryIdea', true)}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-stone-700">{t.industryYes}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                checked={!formData.hasIndustryIdea} 
                                onChange={() => handleChange('hasIndustryIdea', false)}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-stone-700">{t.industryNo}</span>
                        </label>
                    </div>
                 </div>

                 {formData.hasIndustryIdea ? (
                      <div className="animate-fade-in">
                         <label className="block text-sm font-medium text-stone-700 mb-1">{t.targetIndustryLabel}</label>
                         <input
                            type="text"
                            placeholder="e.g. Coffee Shop, AI, Pet Care"
                            className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            value={formData.targetIndustry}
                            onChange={(e) => handleChange('targetIndustry', e.target.value)}
                         />
                      </div>
                 ) : (
                      <div className="animate-fade-in">
                         <label className="block text-sm font-medium text-stone-700 mb-1">{t.ambitionQuestion}</label>
                         <select
                            className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            value={formData.ambition}
                            onChange={(e) => handleChange('ambition', e.target.value)}
                         >
                            <option value="wealth">{t.ambitionWealth}</option>
                            <option value="side_hustle">{t.ambitionSide}</option>
                         </select>
                      </div>
                 )}
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.interestsLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. Pets, Gaming"
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.interests}
                  onChange={(e) => handleChange('interests', e.target.value)}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.personalityLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. Introvert, Creative"
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.personality}
                  onChange={(e) => handleChange('personality', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <Home className="w-6 h-6 text-indigo-600" />
              {t.step4}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.familyLabel}</label>
                <select
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.familyStatus}
                  onChange={(e) => handleChange('familyStatus', e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Married, No Kids">Married, No Kids</option>
                  <option value="Married with Kids">Married with Kids</option>
                  <option value="Single Parent">Single Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.debtLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. $1500/mo"
                  className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.monthlyDebt}
                  onChange={(e) => handleChange('monthlyDebt', e.target.value)}
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Activity className="w-4 h-4"/> {t.stressLabel}</span>
                    <span className="font-bold text-indigo-600">{formData.stressLevel}</span>
                 </label>
                 <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={formData.stressLevel} 
                    onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                 />
                 <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-stone-50 p-6 flex justify-between items-center border-t border-stone-100">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 0 ? 'opacity-0' : 'text-stone-600 hover:bg-stone-200'}`}
        >
          {t.back}
        </button>
        
        {step < 4 ? (
             <button
             onClick={nextStep}
             disabled={!isStepValid()}
             className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             {t.next} <ArrowRight className="w-4 h-4" />
           </button>
        ) : (
            <button
            onClick={() => onComplete(formData)}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {t.generate}
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardForm;