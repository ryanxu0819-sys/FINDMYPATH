import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Briefcase } from 'lucide-react';
import { authService } from '../services/authService';
import { translations } from '../utils/translations';
import { Language } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, language }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Simple labels mapping since auth modal is simple
  const labels = language === 'en' ? {
     welcomeBack: 'Welcome Back',
     create: 'Create Account',
     loginSubtitle: 'Login to access your roadmaps',
     signupSubtitle: 'Save your progress and get started',
     email: 'Email Address',
     password: 'Password',
     loginBtn: 'Log In',
     signupBtn: 'Create Free Account',
     noAccount: "Don't have an account?",
     hasAccount: "Already have an account?",
     linkLogin: "Log in",
     linkSignup: "Sign up"
  } : language === 'zh' ? {
     welcomeBack: '欢迎回来',
     create: '创建账户',
     loginSubtitle: '登录以查看您的路线图',
     signupSubtitle: '保存进度并开始使用',
     email: '邮箱地址',
     password: '密码',
     loginBtn: '登录',
     signupBtn: '免费注册',
     noAccount: "没有账户？",
     hasAccount: "已有账户？",
     linkLogin: "登录",
     linkSignup: "注册"
  } : {
     welcomeBack: 'Bienvenido',
     create: 'Crear Cuenta',
     loginSubtitle: 'Inicia sesión para ver tus mapas',
     signupSubtitle: 'Guarda tu progreso',
     email: 'Correo Electrónico',
     password: 'Contraseña',
     loginBtn: 'Iniciar Sesión',
     signupBtn: 'Crear Cuenta',
     noAccount: "¿No tienes cuenta?",
     hasAccount: "¿Ya tienes cuenta?",
     linkLogin: "Entrar",
     linkSignup: "Registrarse"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // In a real app, validation and API calls happen here.
    authService.login(email);
    onSuccess();
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

        <div className="p-8 pb-0 text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isLogin ? labels.welcomeBack : labels.create}
          </h2>
          <p className="text-slate-500 mt-2">
            {isLogin ? labels.loginSubtitle : labels.signupSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{labels.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{labels.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? labels.loginBtn : labels.signupBtn} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? labels.noAccount : labels.hasAccount}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-semibold hover:underline ml-1"
            >
              {isLogin ? labels.linkSignup : labels.linkLogin}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;