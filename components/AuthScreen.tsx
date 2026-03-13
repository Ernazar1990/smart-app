
import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { supabase } from '../supabaseClient';

interface AuthScreenProps {
  onAuth: (userData: Partial<UserProgress>) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'pin' | 'forgot-password' | 'code-login' | 'selection'>('selection');
  const [step, setStep] = useState(1);
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [subCode, setSubCode] = useState('');
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

      // 2. Create profile in 'admin_users' table
      const finalData: Partial<UserProgress> = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        school: formData.school,
        points: 0,
        xp: 0,
        subscription: 'Free',
        pin: formData.pin, // Save PIN for quick login
        role: 'student',
        completedLessons: [],
        chosenElectives: formData.electives === 'creative' ? ['creative'] : formData.electives.split('-')
      };

      const { error: profileError } = await supabase.from('admin_users').upsert([finalData]);
      if (profileError) throw profileError;

      localStorage.setItem('smart_user_pin', formData.pin);
      localStorage.setItem('smart_user_name', formData.name);
      localStorage.setItem('smart_last_email', formData.email);
      
      onAuth(finalData);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Серверге қосылу мүмкін емес. Supabase жобасы тоқтатылған (Paused) болуы мүмкін. Dashboard-тан "Resume" батырмасын басыңыз.');
      } else {
        setError(err.message || 'Тіркелу кезінде қате кетті');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginByCode = async () => {
    if (!formData.email || !formData.pass || subCode.length !== 6) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Authenticate with email/pass
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.pass,
      });

      if (authError) throw authError;

      // 2. Fetch profile and verify code
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (profileError || !profile) {
        throw new Error('Профиль табылмады');
      }

      if (profile.subscriptionCode !== subCode.toUpperCase() && profile.activationCode !== subCode) {
        setError('Жазылым коды қате');
        return;
      }

      // Check expiry
      if (profile.subscriptionExpiresAt && new Date(profile.subscriptionExpiresAt) < new Date()) {
        setError('Жазылым мерзімі аяқталды');
        return;
      }

      onAuth(profile);
      localStorage.setItem('smart_last_email', formData.email);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Серверге қосылу мүмкін емес. Supabase жобасы тоқтатылған (Paused) болуы мүмкін. Dashboard-тан "Resume" батырмасын басыңыз.');
      } else {
        setError(err.message || 'Пошта, құпия сөз немесе код қате');
      }
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

      // Fetch profile from 'admin_users' table
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
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
          completedLessons: [],
          pin: '' 
        };
        onAuth(basicProfile);
      } else {
        // Save PIN locally for quick login next time
        if (profile.pin) {
          localStorage.setItem('smart_user_pin', profile.pin);
          localStorage.setItem('smart_user_name', profile.name);
        }
        onAuth(profile);
      }
      
      localStorage.setItem('smart_last_email', formData.email);
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Серверге қосылу мүмкін емес. Supabase жобасы тоқтатылған (Paused) болуы мүмкін. Dashboard-тан "Resume" батырмасын басыңыз.');
      } else {
        setError(err.message || 'Пошта немесе құпия сөз қате');
      }
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

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Email поштаны енгізіңіз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setResetEmailSent(true);
    } catch (err: any) {
      setError('Қате орын алды: ' + err.message);
    } finally {
      setLoading(false);
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
            {error && <p className="mt-4 text-red-500 text-sm font-bold">{error}</p>}
            {resetEmailSent && <p className="mt-4 text-emerald-600 text-sm font-bold">Сілтеме поштаңызға жіберілді!</p>}
          </div>
          <div className="space-y-6">
            <input type="email" placeholder="Email пошта" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <button 
              onClick={handleResetPassword} 
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit disabled:opacity-50"
            >
              {loading ? 'Жіберілуде...' : 'Сілтемені жіберу'}
            </button>
            <button onClick={() => { setMode('login'); setError(''); }} className="w-full text-gray-400 font-bold text-xs text-center uppercase">Кіруге оралу</button>
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

        {mode === 'selection' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-lg font-black text-gray-700 dark:text-slate-300 font-outfit uppercase tracking-widest">Кіру түрін таңдаңыз</h2>
            </div>
            
            <button 
              onClick={() => setMode('login')}
              className="w-full p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[32px] shadow-sm hover:border-emerald-500 transition-all group text-left flex items-center gap-5"
            >
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl group-hover:scale-110 transition-transform">
                <i className="fas fa-user"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 dark:text-white text-base font-outfit">Тегін көру</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Тегін сабақтармен танысу</p>
              </div>
              <i className="fas fa-chevron-right text-slate-200"></i>
            </button>

            <button 
              onClick={() => setMode('code-login')}
              className="w-full p-6 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-[32px] shadow-sm hover:border-indigo-500 transition-all group text-left flex items-center gap-5"
            >
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl group-hover:scale-110 transition-transform">
                <i className="fas fa-crown"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 dark:text-white text-base font-outfit">Premium кіру</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Код арқылы толық қолжетімділік</p>
              </div>
              <i className="fas fa-chevron-right text-slate-200"></i>
            </button>

            <div className="pt-4 text-center">
              <button onClick={() => setMode('register')} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">Тіркелмегенсіз бе? Тіркелу</button>
            </div>
          </div>
        ) : mode === 'login' ? (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setMode('selection')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <i className="fas fa-arrow-left"></i> Артқа
            </button>
            <input type="email" placeholder="Email пошта" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Құпия сөз" className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} />
            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit disabled:opacity-50">
              {loading ? 'Кіру...' : 'Кіру'}
            </button>
            <div className="flex flex-col gap-3 pt-2">
              <button onClick={() => setMode('forgot-password')} className="w-full text-slate-400 font-black text-[10px] text-center uppercase tracking-widest">Құпия сөзді ұмыттыңыз ба?</button>
              <button onClick={() => setMode('register')} className="w-full text-emerald-600 font-black text-xs text-center uppercase tracking-widest">Жаңа аккаунт ашу</button>
              <button 
                onClick={async () => {
                  setLoading(true);
                  setError('');
                  try {
                    await fetch('https://xdogbiyqcrrjlddmgiti.supabase.co', { mode: 'no-cors' });
                    setError('Байланыс сәтті! Сервер қолжетімді.');
                  } catch (e) {
                    setError('Серверге қосылу мүмкін емес. Supabase жобасы тоқтатылған (Paused) болуы мүмкін.');
                  }
                  setLoading(false);
                }} 
                className="w-full text-slate-300 font-bold text-[8px] text-center uppercase tracking-widest mt-4"
              >
                Байланысты тексеру
              </button>
              <button 
                onClick={() => {
                  const demoUser: Partial<UserProgress> = {
                    email: 'demo@smart.kz',
                    name: 'Demo User',
                    points: 100,
                    xp: 500,
                    subscription: 'Premium',
                    role: 'student',
                    completedLessons: [],
                    chosenElectives: ['chemistry', 'biology']
                  };
                  onAuth(demoUser);
                }}
                className="w-full text-slate-400 font-bold text-[8px] text-center uppercase tracking-widest mt-2 hover:text-emerald-500 transition-colors"
              >
                Демо режим (Офлайн кіру)
              </button>
            </div>
          </div>
        ) : mode === 'code-login' ? (
          <div className="space-y-4 animate-in zoom-in duration-300">
            <button onClick={() => setMode('selection')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <i className="fas fa-arrow-left"></i> Артқа
            </button>
            <div className="text-center mb-4">
              <h2 className="text-lg font-black text-indigo-600 font-outfit uppercase tracking-widest">Premium Кіру</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Деректеріңіз бен 6 таңбалы кодты енгізіңіз</p>
            </div>
            
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Email пошта" 
                className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
              <input 
                type="password" 
                placeholder="Құпия сөз" 
                className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none font-bold" 
                value={formData.pass} 
                onChange={e => setFormData({...formData, pass: e.target.value})} 
              />
              <div className="pt-2">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 ml-1">Жазылым коды</p>
                <input 
                  type="text" 
                  maxLength={6} 
                  placeholder="ABC123" 
                  className="w-full p-5 bg-indigo-50 dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-3xl text-center text-3xl font-black tracking-[0.2em] outline-none text-indigo-700 dark:text-indigo-400 focus:border-indigo-500 transition-all font-outfit uppercase" 
                  value={subCode} 
                  onChange={e => setSubCode(e.target.value.toUpperCase())} 
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button onClick={handleLoginByCode} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg font-outfit disabled:opacity-50">
              {loading ? 'Тексерілуде...' : 'Кодпен кіру'}
            </button>
            <button onClick={() => setMode('selection')} className="w-full text-gray-400 font-bold text-xs text-center uppercase">Кіруге оралу</button>
          </div>
        ) : (
          <div className="space-y-6">
            <button onClick={() => setMode('selection')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
              <i className="fas fa-arrow-left"></i> Артқа
            </button>
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
