
import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { supabase } from '../supabaseClient';

interface AuthScreenProps {
  onAuth: (userData: Partial<UserProgress>) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'pin' | 'forgot-password'>('login');
  const [step, setStep] = useState(1);
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pass: '',
    passConfirm: '',
    class: '11',
    region: '',
    school: '',
    electives: 'bio-chem',
    pin: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const savedPin = localStorage.getItem('smart_user_pin');
    const savedEmail = localStorage.getItem('smart_last_email');
    if (savedEmail) setFormData(prev => ({ ...prev, email: savedEmail }));
    if (savedPin) setMode('pin');
  }, []);

  const handleRegisterNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Барлық өрістерді толтырыңыз');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.region || !formData.school) {
        setError('Аймақ пен мектепті енгізіңіз');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (formData.pass !== formData.passConfirm) {
        setError('Құпия сөздер сәйкес келмейді');
        return;
      }
      if (formData.pass.length < 6) {
        setError('Құпия сөз кемі 6 таңбадан тұруы керек');
        return;
      }
      setStep(4);
    }
  };

  const handleFinalize = async () => {
    if (formData.pin.length !== 4) {
      setError('4 таңбалы ПИН-кодты енгізіңіз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.pass,
      });

      if (authError) throw authError;

      // 2. Create profile in 'users' table
      const finalData: Partial<UserProgress> = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        school: formData.school,
        points: 0,
        xp: 0,
        subscription: 'Free',
        role: 'student',
        completedLessons: [],
        chosenElectives: formData.electives === 'creative' ? ['creative'] : formData.electives.split('-')
      };

      const { error: profileError } = await supabase.from('users').upsert([finalData]);
      if (profileError) throw profileError;

      localStorage.setItem('smart_user_pin', formData.pin);
      localStorage.setItem('smart_user_name', formData.name);
      localStorage.setItem('smart_last_email', formData.email);
      
      onAuth(finalData);
    } catch (err: any) {
      setError(err.message || 'Тіркелу кезінде қате кетті');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.pass) {
      setError('Пошта мен құпия сөзді енгізіңіз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.pass,
      });

      if (authError) throw authError;

      // Fetch profile from 'users' table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (profileError) {
        // If profile doesn't exist but auth succeeded, create a basic one
        const basicProfile: Partial<UserProgress> = { 
          email: formData.email, 
          name: 'Пайдаланушы', 
          role: 'student' as const, 
          subscription: 'Free', 
          points: 0, 
          completedLessons: [] 
        };
        onAuth(basicProfile);
      } else {
        onAuth(profile);
      }
      
      localStorage.setItem('smart_last_email', formData.email);
    } catch (err: any) {
      setError('Пошта немесе құпия сөз қате');
    } finally {
      setLoading(false);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + digit;
      setPinInput(newPin);
      if (newPin.length === 4) {
        const saved = localStorage.getItem('smart_user_pin');
        if (saved && newPin === saved) {
          const savedSession = localStorage.getItem('smart_user_session');
          if (savedSession) {
            try {
              const fullUserData = JSON.parse(savedSession);
              onAuth(fullUserData);
            } catch (e) {
              onAuth({ name: localStorage.getItem('smart_user_name') || 'Пайдаланушы' });
            }
          } else {
            onAuth({ name: localStorage.getItem('smart_user_name') || 'Пайдаланушы' });
          }
        } else {
          setError('ПИН-код қате');
          setTimeout(() => { setPinInput(''); setError(''); }, 600);
        }
      }
    }
  };

  if (mode === 'forgot-password') {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 bg-[#FDFDFD] dark:bg-slate-900 py-12 animate-in slide-in-from-bottom">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg mb-4">
              <i className="fas fa-key"></i>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Құпия сөзді ұмыттыңыз ба?</h1>
          </div>
          <div className="space-y-6">
            <input type="email" placeholder="Email пошта" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <button onClick={() => setResetEmailSent(true)} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit">Сілтемені жіберу</button>
            <button onClick={() => setMode('login')} className="w-full text-gray-400 font-bold text-xs text-center uppercase">Кіруге оралу</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-[#FDFDFD] dark:bg-slate-900 py-12">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-[22px] flex items-center justify-center text-white text-3xl mx-auto shadow-xl mb-4">
            <i className="fas fa-flask"></i>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-outfit">Smart App</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Premium Education Platform</p>
        </div>

        {mode === 'login' ? (
          <div className="space-y-4">
            <input type="email" placeholder="Email пошта" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Құпия сөз" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} />
            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit disabled:opacity-50">
              {loading ? 'Кіру...' : 'Кіру'}
            </button>
            <button onClick={() => setMode('register')} className="w-full text-emerald-600 font-black text-xs text-center uppercase tracking-widest">Жаңа аккаунт ашу</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full ${step >= i ? 'bg-emerald-600' : 'bg-gray-100'}`}></div>
              ))}
            </div>
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <input type="text" placeholder="Аты-жөніңіз" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="Email пошта" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="tel" placeholder="Телефон" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <input type="text" placeholder="Аймақ (мысалы: Алматы)" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
                <input type="text" placeholder="Мектеп" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <input type="password" placeholder="Құпия сөз" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} />
                <input type="password" placeholder="Құпия сөзді растау" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 rounded-2xl shadow-sm font-bold" value={formData.passConfirm} onChange={e => setFormData({...formData, passConfirm: e.target.value})} />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4 text-center animate-in zoom-in">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Кіру үшін ПИН-код орнатыңыз</p>
                <input type="text" maxLength={4} placeholder="0000" className="w-40 mx-auto p-5 bg-emerald-50 rounded-[30px] text-center text-4xl font-black tracking-[0.3em] outline-none text-emerald-700 focus:border-emerald-500 transition-all font-outfit" onChange={e => setFormData({...formData, pin: e.target.value})} />
              </div>
            )}
            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <div className="flex gap-3">
              {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500">Артқа</button>}
              <button onClick={step === 4 ? handleFinalize : handleRegisterNext} disabled={loading} className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit disabled:opacity-50">
                {loading ? 'Жүктелуде...' : (step === 4 ? 'Аяқтау' : 'Келесі')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
