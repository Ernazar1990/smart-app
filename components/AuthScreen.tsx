
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
    pin: '',
    activationCode: ''
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
      handleFinalize(); // ПИН-кодсыз бірден аяқтау
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    setError('');
    try {
      let isPremium = false;
      let mergedProfileData: any = null;
      const upperCode = formData.activationCode.trim().toUpperCase();

      if (upperCode) {
        if (upperCode.length !== 6) {
          setError('Белсендіру коды 6 таңбалы болуы керек');
          setLoading(false);
          return;
        }

        // Search by code
        const { data: codeProfile, error: codeError } = await supabase
          .from('admin_users')
          .select('*')
          .or(`subscriptionCode.eq.${upperCode},activationCode.eq.${upperCode}`)
          .maybeSingle();

        if (codeError) throw codeError;

        if (!codeProfile) {
          setError('Бұл белсендіру коды табылмады. Қайта тексеріңіз немесе админге хабарласыңыз.');
          setLoading(false);
          return;
        }

        isPremium = true;
        mergedProfileData = { ...codeProfile };
      }

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.pass,
      });

      if (authError) throw authError;

      // Query existing profile by email first
      const { data: emailProfile } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle();

      // Merge sources: emailProfile has highest priority, then mergedProfileData (from code), then defaults
      const baseProfile = emailProfile || mergedProfileData || {};

      // 2. Create/update profile in 'admin_users' table
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const finalData: Partial<UserProgress> = {
        ...baseProfile,
        email: formData.email.toLowerCase().trim(),
        name: formData.name || baseProfile.name || 'Пайдаланушы',
        phone: formData.phone || baseProfile.phone || '',
        region: formData.region || baseProfile.region || '',
        school: formData.school || baseProfile.school || '',
        points: baseProfile.points ?? 0,
        xp: baseProfile.xp ?? 0,
        subscription: (isPremium || baseProfile.subscription === 'Premium') ? 'Premium' : 'Free',
        pin: baseProfile.pin || '',
        activationCode: upperCode || baseProfile.activationCode || generatedCode,
        role: baseProfile.role || 'student',
        completedLessons: baseProfile.completedLessons || [],
        chosenElectives: formData.electives === 'creative' ? ['creative'] : formData.electives.split('-')
      };

      // If the code was found on a profile with a DIFFERENT email, let's delete that old profile record to prevent duplicates/orphans!
      if (mergedProfileData && mergedProfileData.email && mergedProfileData.email.toLowerCase().trim() !== formData.email.toLowerCase().trim()) {
         await supabase.from('admin_users').delete().eq('email', mergedProfileData.email);
      }

      const { error: profileError } = await supabase.from('admin_users').upsert([finalData]);
      if (profileError) throw profileError;

      localStorage.setItem('smart_user_name', finalData.name || '');
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
    if (!formData.email || !formData.pass) {
      setError('Пошта мен құпия сөзді енгізіңіз');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Try standard email/password login first. If it succeeds, they are already registered!
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.pass,
      });

      if (!authError) {
        // Login succeeded! Load profile
        const { data: profile, error: profileError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', formData.email.toLowerCase().trim())
          .maybeSingle();

        if (profile) {
          onAuth(profile);
          localStorage.setItem('smart_last_email', formData.email);
          return;
        }
      }

      // 2. If login failed, they are probably registering/activating for the first time.
      if (!subCode || subCode.length !== 6) {
        throw new Error('Егер сіз бірінші рет кіріп тұрсаңыз, 6 таңбалы белсендіру кодын енгізіңіз. Ал егер бұрын тіркелген болсаңыз, құпия сөзіңіз қате.');
      }

      // Fetch profile and verify code FIRST
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', formData.email.toLowerCase().trim())
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profile) {
        throw new Error('Бұл email-мен оқушы табылмады. Алдымен тіркеліңіз немесе админге хабарласыңыз.');
      }

      // Verify code
      const upperCode = subCode.toUpperCase();
      const isCodeValid = (profile.subscriptionCode === upperCode) || (profile.activationCode === upperCode) || (profile.activationCode === subCode);
      
      if (!isCodeValid) {
        throw new Error(`Жазылым коды қате. Сіздің кодыңыз: ${subCode}. Егер қате болса, админге хабарласыңыз.`);
      }

      // Check expiry
      if (profile.subscriptionExpiresAt && new Date(profile.subscriptionExpiresAt) < new Date()) {
        throw new Error('Жазылым мерзімі аяқталды. Жазылымды жаңарту үшін админге хабарласыңыз.');
      }

      // Try to sign up the user with the provided password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.pass,
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          throw new Error('Құпия сөз қате. Егер ұмытсаңыз, "Құпия сөзді ұмыттым" батырмасын басыңыз.');
        }
        if (signUpError.message.includes('DATABASE ERROR SAVING NEW USER')) {
          throw new Error('Деректер базасында қате (Trigger error). Админ панельдегі "System" бөліміндегі SQL-ді қайта көшіріп басыңыз.');
        }
        throw signUpError;
      }

      // Ensure user subscription status is marked as Premium
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ subscription: 'Premium' })
        .eq('email', formData.email.toLowerCase().trim());

      const updatedProfile = { ...profile, subscription: 'Premium' };
      onAuth(updatedProfile);
      localStorage.setItem('smart_last_email', formData.email);
    } catch (err: any) {
      console.error("Code login error:", err);
      if (err.message === 'Failed to fetch') {
        setError('Серверге қосылу мүмкін емес. Supabase жобасы тоқтатылған (Paused) болуы мүмкін.');
      } else {
        setError(err.message || 'Қате орын алды');
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
    <div className="min-h-screen flex flex-col justify-center px-6 bg-warm-paper dark:bg-warm-950 py-12">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-600 rounded-[32px] flex items-center justify-center text-white text-4xl mx-auto shadow-2xl shadow-primary-200 dark:shadow-none mb-6">
            <i className="fas fa-book-reader"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-warm-50 tracking-tight font-outfit">Smart App</h1>
          <p className="text-warm-400 dark:text-warm-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">ҰБТ-ға дайындық академиясы</p>
        </div>

        {mode === 'selection' ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="text-center mb-8">
              <h2 className="text-sm font-bold text-warm-400 dark:text-warm-500 font-outfit uppercase tracking-widest">Кіру түрін таңдаңыз</h2>
            </div>
            
            <button 
              onClick={() => setMode('login')}
              className="w-full p-8 bg-white dark:bg-warm-900 border border-warm-100 dark:border-warm-800 rounded-[40px] shadow-sm hover:border-primary-500 dark:hover:border-primary-400 transition-all group text-left flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-warm-50 dark:bg-warm-950 rounded-2xl flex items-center justify-center text-primary-600 text-3xl group-hover:scale-110 transition-transform shadow-inner">
                <i className="fas fa-user"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 dark:text-warm-50 text-lg font-outfit">Тегін көру</h3>
                <p className="text-[11px] text-warm-400 font-bold uppercase tracking-widest mt-1">Тегін сабақтармен танысу</p>
              </div>
              <i className="fas fa-chevron-right text-warm-200"></i>
            </button>

            <button 
              onClick={() => setMode('code-login')}
              className="w-full p-8 bg-white dark:bg-warm-900 border border-amber-100 dark:border-warm-800 rounded-[40px] shadow-sm hover:border-amber-500 transition-all group text-left flex items-center gap-6"
            >
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950 rounded-2xl flex items-center justify-center text-amber-500 text-3xl group-hover:scale-110 transition-transform shadow-inner">
                <i className="fas fa-crown"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 dark:text-warm-50 text-lg font-outfit">Premium кіру</h3>
                <p className="text-[11px] text-warm-400 font-bold uppercase tracking-widest mt-1">Код арқылы толық қолжетімділік</p>
              </div>
              <i className="fas fa-chevron-right text-warm-200"></i>
            </button>

            <div className="pt-6 text-center">
              <button onClick={() => setMode('register')} className="text-primary-600 dark:text-primary-400 font-extrabold text-xs uppercase tracking-widest hover:underline">Тіркелмегенсіз бе? Тіркелу</button>
            </div>
          </div>
        ) : mode === 'login' ? (
          <div className="space-y-5 animate-in slide-in-from-bottom-6 duration-500">
            <button onClick={() => setMode('selection')} className="text-[11px] font-bold text-warm-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <i className="fas fa-arrow-left"></i> Артқа
            </button>
            <input type="email" placeholder="Email пошта" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 dark:border-warm-800 rounded-3xl shadow-sm outline-none font-bold text-slate-800 dark:text-warm-50 focus:border-primary-500 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Құпия сөз" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 dark:border-warm-800 rounded-3xl shadow-sm outline-none font-bold text-slate-800 dark:text-warm-50 focus:border-primary-500 transition-all" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} />
            {error && <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-200 dark:shadow-none font-outfit text-sm uppercase tracking-widest disabled:opacity-50 transition-all">
              {loading ? 'Кіру...' : 'Кіру'}
            </button>
            <div className="flex flex-col gap-4 pt-4">
              <button onClick={() => setMode('forgot-password')} className="w-full text-warm-400 font-bold text-[11px] text-center uppercase tracking-widest">Құпия сөзді ұмыттыңыз ба?</button>
              <button onClick={() => setMode('register')} className="w-full text-primary-600 dark:text-primary-400 font-extrabold text-xs text-center uppercase tracking-widest">Жаңа аккаунт ашу</button>
            </div>
          </div>
        ) : mode === 'code-login' ? (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <button onClick={() => setMode('selection')} className="text-[11px] font-bold text-warm-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <i className="fas fa-arrow-left"></i> Артқа
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-amber-600 font-outfit uppercase tracking-wider">Premium Кіру</h2>
              <p className="text-[11px] font-bold text-warm-400 uppercase tracking-widest mt-2">Деректеріңіз бен 6 таңбалы кодты енгізіңіз</p>
            </div>
            
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Email пошта" 
                className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 dark:border-warm-800 rounded-3xl shadow-sm outline-none font-bold text-slate-800 dark:text-warm-50 focus:border-amber-500 transition-all" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
              <input 
                type="password" 
                placeholder="Құпия сөз" 
                className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 dark:border-warm-800 rounded-3xl shadow-sm outline-none font-bold text-slate-800 dark:text-warm-50 focus:border-amber-500 transition-all" 
                value={formData.pass} 
                onChange={e => setFormData({...formData, pass: e.target.value})} 
              />
              <div className="pt-4">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-3 ml-2">Жазылым коды (тек бірінші рет кіргенде қажет)</p>
                <input 
                  type="text" 
                  maxLength={6} 
                  placeholder="ABC123" 
                  className="w-full p-6 bg-amber-50 dark:bg-warm-900 border-2 border-amber-100 dark:border-warm-800 rounded-[32px] text-center text-4xl font-black tracking-[0.3em] outline-none text-amber-700 dark:text-amber-400 focus:border-amber-500 transition-all font-outfit uppercase" 
                  value={subCode} 
                  onChange={e => setSubCode(e.target.value.toUpperCase())} 
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <button onClick={handleLoginByCode} disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-[32px] font-black shadow-xl shadow-amber-100 dark:shadow-none font-outfit text-sm uppercase tracking-widest disabled:opacity-50 transition-all">
              {loading ? 'Тексерілуде...' : 'Кодпен кіру'}
            </button>
            <div className="flex flex-col gap-4">
              <button onClick={() => setMode('forgot-password')} className="w-full text-warm-400 font-bold text-[11px] text-center uppercase tracking-widest">Құпия сөзді ұмыттыңыз ба?</button>
              <button onClick={() => setMode('selection')} className="w-full text-warm-400 font-bold text-[11px] text-center uppercase tracking-widest">Кіруге оралу</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <button onClick={() => setMode('selection')} className="text-[11px] font-bold text-warm-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <i className="fas fa-arrow-left"></i> Артқа
            </button>
            <div className="flex justify-between mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 mx-1.5 rounded-full ${step >= i ? 'bg-primary-600' : 'bg-warm-100 dark:bg-warm-800'}`}></div>
              ))}
            </div>
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right duration-500">
                <input type="text" placeholder="Аты-жөніңіз" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="Email пошта" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="tel" placeholder="Телефон" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right duration-500">
                <input type="text" placeholder="Аймақ (мысалы: Алматы)" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} />
                <input type="text" placeholder="Мектеп" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5 animate-in slide-in-from-right duration-500">
                <input type="password" placeholder="Құпия сөз" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.pass} onChange={e => setFormData({...formData, pass: e.target.value})} />
                <input type="password" placeholder="Құпия сөзді растау" className="w-full p-5 bg-white dark:bg-warm-900 border border-warm-100 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50" value={formData.passConfirm} onChange={e => setFormData({...formData, passConfirm: e.target.value})} />
                <div className="pt-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 block ml-2">Белсендіру коды (бар болса, Premium алу үшін)</label>
                  <input 
                    type="text" 
                    maxLength={6} 
                    placeholder="6 таңбалы кодты енгізіңіз (міндетті емес)" 
                    className="w-full p-5 bg-amber-50/50 dark:bg-warm-900 border border-amber-200 dark:border-warm-800 rounded-3xl shadow-sm font-bold text-slate-800 dark:text-warm-50 focus:border-amber-500 transition-all uppercase" 
                    value={formData.activationCode} 
                    onChange={e => setFormData({...formData, activationCode: e.target.value.toUpperCase()})} 
                  />
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-widest">{error}</p>}
            <div className="flex gap-4">
              {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 bg-warm-100 dark:bg-warm-800 py-5 rounded-3xl font-black text-xs uppercase tracking-widest text-warm-500">Артқа</button>}
              <button onClick={handleRegisterNext} disabled={loading} className="flex-[2] bg-primary-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-200 font-outfit text-sm uppercase tracking-widest disabled:opacity-50 transition-all">
                {loading ? 'Жүктелуде...' : (step === 3 ? 'Аяқтау' : 'Келесі')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
