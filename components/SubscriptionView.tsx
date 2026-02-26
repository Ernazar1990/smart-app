
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

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h4 className="font-black text-gray-800 flex items-center gap-2">
          <i className="fas fa-qrcode text-emerald-600"></i>
          Төлем жасау жолдары
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-2">
            <i className="fas fa-mobile-screen text-2xl text-blue-600"></i>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Kaspi аударым</p>
            <p className="font-black text-sm">8 777 190 27 96</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-2">
            <i className="fas fa-shield-check text-2xl text-emerald-600"></i>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Менеджер</p>
            <p className="font-black text-sm">WhatsApp-қа жазу</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center italic">Төлем жасалған соң, чекті кураторға жіберіңіз. 5 минутта қолжетімділік ашылады.</p>
      </div>
    </div>
  );
};

export default SubscriptionView;
