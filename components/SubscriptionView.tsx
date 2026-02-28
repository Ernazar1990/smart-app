
import React from 'react';

const SubscriptionView: React.FC = () => {
  const bundles = [
    { 
      id: 'single', 
      name: '1 пән', 
      price: '10 000 ₸', 
      oldPrice: '15 000 ₸',
      desc: 'Таңдаған бір пәніңізге толық қолжетімділік.',
      color: 'border-gray-200'
    },
    { 
      id: 'double', 
      name: '2 пән', 
      price: '15 000 ₸', 
      oldPrice: '25 000 ₸',
      desc: 'Екі таңдау пәніңізге толық қолжетімділік.',
      color: 'border-blue-500 bg-blue-50/30'
    },
    { 
      id: 'full', 
      name: '5 пән (Толық пакет)', 
      price: '40 000 ₸', 
      oldPrice: '60 000 ₸',
      desc: 'Барлық 3 негізгі пән + 2 таңдау пәні. Ең тиімді таңдау!',
      color: 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100/50',
      badge: 'Ең тиімді'
    },
  ];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900">Дайындықты бастау 🚀</h2>
        <p className="text-gray-500 text-sm">Өзіңізге ыңғайлы пакетті таңдап, грантқа жол ашыңыз.</p>
      </div>
      
      <div className="space-y-4">
        {bundles.map((bundle) => (
          <div key={bundle.id} className={`p-6 rounded-3xl border-2 transition-all relative ${bundle.color}`}>
            {bundle.badge && (
              <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {bundle.badge}
              </span>
            )}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-xl font-black text-gray-800">{bundle.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{bundle.desc}</p>
              </div>
              <div className="text-right">
                {bundle.oldPrice && <p className="text-xs text-red-400 line-through font-bold">{bundle.oldPrice}</p>}
                <p className="text-2xl font-black text-gray-900">{bundle.price}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Айына</p>
              </div>
            </div>
            <button className="w-full mt-4 bg-gray-900 text-white py-3.5 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all">
              Сатып алу
            </button>
          </div>
        ))}
      </div>

      <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i className="fas fa-gift"></i>
            </div>
            <h4 className="text-xl font-black font-outfit uppercase tracking-tight">Арнайы акция! 🎁</h4>
          </div>
          <p className="text-sm font-medium text-emerald-50 leading-relaxed">
            <b>5 пәнге</b> бірден жазылсаңыз, <b>33% жеңілдік</b> аласыз! Барлық негізгі пәндер + 2 таңдау пәні толық ашылады.
          </p>
          <div className="pt-2">
            <span className="text-3xl font-black">40 000 ₸</span>
            <span className="ml-2 text-sm line-through opacity-60">60 000 ₸</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h4 className="font-black text-gray-800 dark:text-white flex items-center justify-center gap-2">
            <i className="fas fa-qrcode text-emerald-600"></i>
            Kaspi QR арқылы төлеу
          </h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Тез әрі қауіпсіз</p>
        </div>
        
        <div className="aspect-square max-w-[200px] mx-auto bg-gray-50 dark:bg-slate-800 rounded-3xl border-4 border-emerald-500/20 p-4 flex items-center justify-center relative group">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kaspi.kz/pay/SMART_UBT" 
            alt="Kaspi QR"
            className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="bg-white p-2 rounded-lg shadow-md border border-gray-100">
               <img src="https://kaspi.kz/img/logo.svg" alt="Kaspi" className="w-8" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-center space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kaspi аударым</p>
            <p className="font-black text-lg text-slate-800 dark:text-white">8 777 190 27 96</p>
            <p className="text-[10px] text-slate-400">Ерназар Н.</p>
          </div>
          <a 
            href="https://wa.me/77771902796"
            target="_blank"
            rel="noreferrer"
            className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center space-y-1 border border-emerald-100 dark:border-emerald-800/50 hover:scale-[1.02] transition-transform"
          >
            <i className="fab fa-whatsapp text-2xl text-emerald-600 mb-1"></i>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Менеджерге чекті жіберу</p>
            <p className="font-black text-sm text-emerald-700 dark:text-emerald-300">WhatsApp-қа жазу</p>
          </a>
        </div>
        <p className="text-[10px] text-gray-400 text-center italic leading-relaxed">Төлем жасалған соң, чекті WhatsApp арқылы жіберіңіз. Куратор 5 минут ішінде барлық сабақтарға қолжетімділік ашады.</p>
      </div>
    </div>
  );
};

export default SubscriptionView;
