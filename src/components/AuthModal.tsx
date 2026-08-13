import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, Chrome, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, loginWithEmail, registerWithEmail, loginWithGoogle, language } = useApp();
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      setIsAuthOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setIsAuthOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-900 dark:text-slate-100">
        
        {/* Close button */}
        <button 
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0A2342] to-[#0E2F56] border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-2 shadow-lg">
            <User className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-black text-[#0A2342] dark:text-white">
            {isRegister 
              ? (language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create Account') 
              : (language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Customer Login')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' ? 'ট্রেন্ডিফাই শেরপুরের বিশেষ সুবিধা উপভোগ করুন' : 'Unlock rewards, track orders & refer friends'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold mb-1">
                {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1">
              {language === 'bn' ? 'ইমেইল এড্রেস *' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2342] hover:bg-[#07182E] text-[#D4AF37] font-black py-3 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-lg border border-[#D4AF37]/30 transition-all"
          >
            <LogIn className="w-4 h-4 text-[#D4AF37]" />
            <span>{loading ? 'প্রসেসিং হচ্ছে...' : (isRegister ? 'রেজিস্ট্রেশন করুন' : 'লগইন করুন')}</span>
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">OR</span></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 border border-slate-300 dark:border-slate-700 transition-all"
        >
          <Chrome className="w-4 h-4 text-amber-500" />
          <span>Google দিয়ে সাইন ইন করুন</span>
        </button>

        {/* Toggle Login/Register */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-[#D4AF37] hover:underline"
          >
            {isRegister 
              ? (language === 'bn' ? 'আগে থেকেই অ্যাকাউন্ট আছে? সাইন ইন করুন' : 'Already have an account? Sign In') 
              : (language === 'bn' ? 'নতুন গ্রাহক? একাউন্ট তৈরি করুন' : "Don't have an account? Sign Up")}
          </button>
        </div>
      </div>
    </div>
  );
};
