
import React, { useState } from 'react';
import { SubscriptionConfig, UserProgress, Subject } from '../types';
import { SUBJECTS } from '../constants';
import { supabase } from '../supabaseClient';
import { CheckCircle2, QrCode, MessageCircle, Key, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface SubscriptionViewProps {
  config: SubscriptionConfig;
  user: UserProgress;
  onUpdateUser: (user: UserProgress) => void;
  onBack: () => void;
  onRefresh?: () => void;
}

type SubStep = 'plans' | 'subjects' | 'payment' | 'code';

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ config, user, onUpdateUser, onBack, onRefresh }) => {
  const [step, setStep] = useState<SubStep>('plans');
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [duration, setDuration] = useState<'month' | 'year'>('month');
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tempSubjects, setTempSubjects] = useState<string[]>(user.chosenElectives || []);

  const handleSelectBundle = (bundle: any) => {
    setSelectedBundle(bundle);
    setTempSubjects([]);
    setStep('subjects');
  };

  const handleConfirmSubjects = () => {
    setStep('payment');
  };

   const handlePaymentDone = () => {
    const durText = duration === 'month' ? '1 айға' : '1 жылға';
    const message = encodeURIComponent(`Сәлеметсіз бе! Мен "${selectedBundle.name}" пакетін ${durText} сатып алдым. Чекті жіберіп отырмын. Менің белсендіру кодым: ${user.activationCode || '—'}. Оплатаны растап, Premium-ға ауыстырып жіберіңізші.`);
    window.open(`https://wa.me/${config.whatsappNumber}?text=${message}`, '_blank');
    setStep('code');
  };

  const handleActivate = async () => {
    if (activationCode.length !== 6) {
      setError('Код 6 таңбадан тұруы керек');
      return;
    }
    
    try {
      // Fetch current status from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (profileError || !profile) throw new Error('Профиль табылмады. Қайта кіріп көріңіз.');

      const upperInput = activationCode.toUpperCase();
      const isCodeValid = (profile.subscriptionCode === upperInput) || (profile.activationCode === upperInput) || (profile.activationCode === activationCode);

      if (isCodeValid) {
        // Update to Premium status in Supabase
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            subscription: 'Premium',
            // If it was a subscriptionCode, we might want to clear it or mark as used
            // but for now just setting Premium is enough
          })
          .eq('email', user.email);

        if (updateError) throw updateError;

        onUpdateUser({ ...profile, subscription: 'Premium' });
        setIsSuccess(true);
      } else {
        setError('Қате код. Қайта тексеріңіз немесе админге хабарласыңыз.');
      }
    } catch (err: any) {
      setError('Тексеру кезінде қате кетті: ' + err.message);
    }
  };

  const toggleSubject = (id: string) => {
    if (tempSubjects.includes(id)) {
      setTempSubjects(tempSubjects.filter(s => s !== id));
    } else {
      // Limit based on bundle
      const limit = selectedBundle?.id === 'single' ? 1 : selectedBundle?.id === 'double' ? 2 : 5;
      if (tempSubjects.length < limit) {
        setTempSubjects([...tempSubjects, id]);
      } else {
        setError(`Бұл пакетте тек ${limit} пән таңдауға болады`);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in duration-500 text-center px-4">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
          <ShieldCheck size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Құттықтаймыз! 🎉</h2>
          <p className="text-gray-500 font-bold">Сіздің аккаунтыңыз Premium статусқа сәтті ауыстырылды.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[32px] border border-indigo-100 dark:border-indigo-800/50 max-w-md">
          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-bold">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Ескерту: Сіздің аккаунтыңыз сәтті белсендірілді! Енді платформаға тек email поштаңыз бен құпия сөзіңіз арқылы кіре аласыз. 6 таңбалы белсендіру коды енді қайтып сұралмайды.
          </p>
        </div>
        <button 
          onClick={onBack}
          className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all"
        >
          Дайындықты бастау
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-gray-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-wider">Premium Жазылым</h2>
          <div className="flex items-center justify-center gap-1 mt-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all ${
                (step === 'plans' && i === 1) || 
                (step === 'subjects' && i === 2) || 
                (step === 'payment' && i === 3) || 
                (step === 'code' && i === 4) ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-slate-700'
              }`}></div>
            ))}
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      {step === 'plans' && (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Пакетті таңдаңыз 🚀</h3>
            <p className="text-gray-500 text-sm">Өзіңізге ыңғайлы пакетті таңдап, грантқа жол ашыңыз.</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl">
              <button onClick={() => setDuration('month')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${duration === 'month' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}>Айына</button>
              <button onClick={() => setDuration('year')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${duration === 'year' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400'}`}>Жылына <span className="ml-1.5 text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md">-20%</span></button>
            </div>
          </div>

          <div className="space-y-4">
            {config.bundles && config.bundles.length > 0 ? (
              config.bundles.map((bundle) => (
                <button 
                  key={bundle.id} 
                  onClick={() => handleSelectBundle(bundle)}
                  className={`w-full p-6 rounded-[35px] border-2 text-left transition-all relative group hover:scale-[1.02] active:scale-95 ${bundle.color} ${selectedBundle?.id === bundle.id ? 'ring-4 ring-indigo-500/20' : ''}`}
                >
                  {bundle.badge && (
                    <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {bundle.badge}
                    </span>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-gray-800 dark:text-white">{bundle.name}</h4>
                      <p className="text-xs text-gray-500">{bundle.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {duration === 'month' ? bundle.priceMonth : bundle.priceYear}
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">{duration === 'month' ? 'Айына' : 'Жылына'}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50 dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <i className="fas fa-box-open text-2xl"></i>
                </div>
                <h4 className="font-black text-gray-900 dark:text-white mb-2">Пакеттер табылмады</h4>
                <p className="text-xs text-gray-500 font-bold mb-4">Жазылым пакеттері әлі бапталмаған. Админмен хабарласыңыз.</p>
                {onRefresh && (
                  <button 
                    onClick={onRefresh}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                    Жаңарту
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'subjects' && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Пәндерді таңдаңыз 📚</h3>
            <p className="text-gray-500 text-sm">Таңдаған пакетіңіз бойынша пәндерді растаңыз.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-gray-800 dark:text-white uppercase text-xs tracking-widest">Таңдалған пәндер</h4>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">
                {tempSubjects.length} / {selectedBundle?.id === 'single' ? 1 : selectedBundle?.id === 'double' ? 2 : 5}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SUBJECTS.filter(s => s.isElective).map(subject => (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    tempSubjects.includes(subject.id) 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                    : 'border-transparent bg-gray-50 dark:bg-slate-900/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${subject.color}`}>
                    <i className={`fas ${subject.icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-gray-800 dark:text-white">{subject.name}</p>
                  </div>
                  {tempSubjects.includes(subject.id) && <CheckCircle2 className="text-indigo-600" size={20} />}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center animate-bounce">{error}</p>}

          <div className="flex gap-4">
            <button onClick={() => setStep('plans')} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-2xl font-black text-sm uppercase tracking-widest">Артқа</button>
            <button 
              onClick={handleConfirmSubjects} 
              disabled={tempSubjects.length === 0}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
            >
              Растау және төлеу
            </button>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Төлем жасау 💳</h3>
            <p className="text-gray-500 text-sm">Kaspi QR арқылы төлем жасап, чекті жіберіңіз.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[45px] border border-gray-100 dark:border-slate-700 shadow-xl space-y-8">
            <div className="aspect-square max-w-[240px] mx-auto bg-white rounded-3xl border-8 border-emerald-500/10 p-4 shadow-inner relative group">
              {config.qrCodeUrl ? (
                <img src={config.qrCodeUrl} alt="Kaspi QR" className="w-full h-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <i className="fas fa-qrcode text-4xl mb-2"></i>
                  <p className="text-[8px] font-black uppercase tracking-widest">QR код жүктелмеген</p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white p-2 rounded-lg shadow-md border border-gray-100">
                  <img src="https://kaspi.kz/img/logo.svg" alt="Kaspi" className="w-8" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <QrCode size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">1-қадам: QR-ды сканерлеңіз</p>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-200">Kaspi қосымшасы арқылы QR-ды сканерлеп, төлем жасаңыз.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">2-қадам: Чекті жіберіңіз</p>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">Төлемнен кейін чекті менеджерге WhatsApp арқылы жіберіңіз.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Key size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">3-қадам: Кодты жіберіңіз</p>
                  <p className="text-xs font-bold text-indigo-800 dark:text-indigo-200">Менеджерге мына 6 таңбалы кодты жіберіңіз: <span className="text-indigo-600 font-black ml-1">{user.activationCode || '—'}</span></p>
                </div>
              </div>
            </div>

            <button 
              onClick={handlePaymentDone}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              Чекті жіберу және код алу
            </button>
          </div>
        </div>
      )}

      {step === 'code' && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Белсендіру 🔑</h3>
            <p className="text-gray-500 text-sm">Менеджер берген 6 таңбалы кодты енгізіңіз.</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[45px] border border-gray-100 dark:border-slate-700 shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Белсендіру коды</label>
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000"
                value={activationCode}
                onChange={e => setActivationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full py-6 text-center text-4xl font-black tracking-[0.5em] bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none transition-all"
              />
              {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            </div>

            <button 
              onClick={handleActivate}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none"
            >
              Белсендіру
            </button>

            <p className="text-[10px] text-gray-400 text-center italic leading-relaxed">
              Кодты енгізген соң, сіздің аккаунтыңыз бірден <b>Premium</b> статусқа ауысады. 
              Бұл кодты сақтап қойыңыз, ол сізге Premium мүмкіндіктерге кіру үшін қажет болады.
            </p>
          </div>

          <button onClick={() => setStep('payment')} className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest">Артқа оралу</button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionView;
