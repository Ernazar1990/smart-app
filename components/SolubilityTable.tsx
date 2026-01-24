
import React from 'react';

interface SolubilityTableProps {
  onBack?: () => void;
}

const SolubilityTable: React.FC<SolubilityTableProps> = ({ onBack }) => {
  const anions = ['OH-', 'Cl-', 'Br-', 'I-', 'S2-', 'SO3 2-', 'SO4 2-', 'PO4 3-', 'CO3 2-', 'NO3-', 'CH3COO-'];
  const cations = ['H+', 'Li+', 'Na+', 'K+', 'NH4+', 'Mg2+', 'Ca2+', 'Ba2+', 'Al3+', 'Zn2+', 'Fe2+', 'Fe3+', 'Pb2+', 'Cu2+', 'Ag+'];

  // Simplified solubility logic (M: Soluble, H: Insoluble, P: Slightly Soluble)
  const getSol = (cat: string, ani: string) => {
    if (cat === 'K+' || cat === 'Na+' || cat === 'NH4+' || ani === 'NO3-' || ani === 'CH3COO-') return 'E'; // Ериді
    if (ani === 'Cl-' || ani === 'Br-' || ani === 'I-') {
        if (cat === 'Ag+' || cat === 'Pb2+') return 'Н'; // Ерімейді
        return 'Е';
    }
    if (ani === 'SO4 2-') {
        if (cat === 'Ba2+' || cat === 'Pb2+') return 'Н';
        if (cat === 'Ca2+' || cat === 'Ag+') return 'А'; // Аз ериді
        return 'Е';
    }
    if (ani === 'OH-') {
        if (['Li+','Na+','K+','Ba2+','Ca2+'].includes(cat)) return 'Е';
        return 'Н';
    }
    return 'Н';
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="px-2">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Ерігіштік кестесі 💧</h2>
        <p className="text-gray-500 text-xs">Қышқылдардың, негіздердің және тұздардың суда ерігіштігі.</p>
      </header>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto no-scrollbar">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-gray-50 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100">Иондар</th>
              {anions.map(ani => (
                <th key={ani} className="p-2 border border-gray-50 dark:border-slate-700 font-black text-indigo-600">{ani}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cations.map(cat => (
              <tr key={cat}>
                <td className="p-2 border border-gray-50 dark:border-slate-700 font-black text-emerald-600 bg-gray-50 dark:bg-slate-900">{cat}</td>
                {anions.map(ani => {
                  const sol = getSol(cat, ani);
                  const color = sol === 'Е' ? 'text-emerald-500' : sol === 'Н' ? 'text-red-500' : 'text-amber-500';
                  return (
                    <td key={ani} className={`p-2 border border-gray-50 dark:border-slate-700 text-center font-black ${color}`}>
                      {sol}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 px-4 text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-1 text-emerald-500"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Ериді</div>
        <div className="flex items-center gap-1 text-red-500"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Ерімейді</div>
        <div className="flex items-center gap-1 text-amber-500"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Аз ериді</div>
      </div>
    </div>
  );
};

export default SolubilityTable;
