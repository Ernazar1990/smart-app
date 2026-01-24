
import React, { useState } from 'react';

interface PeriodicTableProps {
  onBack?: () => void;
}

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', weight: 1.008, group: 'non-metal', x: 1, y: 1 },
  { symbol: 'He', name: 'Helium', weight: 4.002, group: 'noble-gas', x: 18, y: 1 },
  { symbol: 'Li', name: 'Lithium', weight: 6.941, group: 'alkali', x: 1, y: 2 },
  { symbol: 'Be', name: 'Beryllium', weight: 9.012, group: 'alkaline', x: 2, y: 2 },
  { symbol: 'B', name: 'Boron', weight: 10.81, group: 'metalloid', x: 13, y: 2 },
  { symbol: 'C', name: 'Carbon', weight: 12.01, group: 'non-metal', x: 14, y: 2 },
  { symbol: 'N', name: 'Nitrogen', weight: 14.01, group: 'non-metal', x: 15, y: 2 },
  { symbol: 'O', name: 'Oxygen', weight: 16.00, group: 'non-metal', x: 16, y: 2 },
  { symbol: 'F', name: 'Fluorine', weight: 19.00, group: 'halogen', x: 17, y: 2 },
  { symbol: 'Ne', name: 'Neon', weight: 20.18, group: 'noble-gas', x: 18, y: 2 },
  { symbol: 'Na', name: 'Sodium', weight: 22.99, group: 'alkali', x: 1, y: 3 },
  { symbol: 'Mg', name: 'Magnesium', weight: 24.31, group: 'alkaline', x: 2, y: 3 },
  { symbol: 'Al', name: 'Aluminum', weight: 26.98, group: 'post-transition', x: 13, y: 3 },
  { symbol: 'Si', name: 'Silicon', weight: 28.09, group: 'metalloid', x: 14, y: 3 },
  { symbol: 'P', name: 'Phosphorus', weight: 30.97, group: 'non-metal', x: 15, y: 3 },
  { symbol: 'S', name: 'Sulfur', weight: 32.06, group: 'non-metal', x: 16, y: 3 },
  { symbol: 'Cl', name: 'Chlorine', weight: 35.45, group: 'halogen', x: 17, y: 3 },
  { symbol: 'Ar', name: 'Argon', weight: 39.95, group: 'noble-gas', x: 18, y: 3 },
];

const GROUP_INFO = [
  { id: 'non-metal', label: 'Бейметалдар' },
  { id: 'noble-gas', label: 'Инертті газдар' },
  { id: 'alkali', label: 'Сілтілік металдар' },
  { id: 'alkaline', label: 'Сілтілік-жер металдар' },
  { id: 'metalloid', label: 'Металлоидтар' },
  { id: 'halogen', label: 'Галогендер' },
  { id: 'post-transition', label: 'Металдар' },
];

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'non-metal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'noble-gas': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'alkali': return 'bg-red-100 text-red-800 border-red-200';
      case 'alkaline': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'metalloid': return 'bg-green-100 text-green-800 border-green-200';
      case 'halogen': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'post-transition': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const matchesSearch = (el: any) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return el.symbol.toLowerCase().includes(lowerSearch) || el.name.toLowerCase().includes(lowerSearch);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <i className="fas fa-arrow-left"></i> AI Хабқа оралу
        </button>
      )}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Периодтық кесте 🧬</h2>
          <p className="text-gray-500 text-sm">Элементтердің қасиеттерін жылдам қарап шығу.</p>
        </div>
        
        {selected && (
          <div className={`p-4 rounded-2xl border-2 shadow-lg flex items-center gap-6 animate-in slide-in-from-right duration-300 ${getGroupColor(selected.group)}`}>
            <div className="text-4xl font-black">{selected.symbol}</div>
            <div>
              <p className="text-lg font-bold">{selected.name}</p>
              <p className="text-xs opacity-70">Масса: {selected.weight}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 ml-4">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500"></i>
        <input 
          type="text" 
          placeholder="Элемент атауы немесе таңбасы (мысалы: Au, Алтын)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[25px] shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times-circle"></i>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-[40px] border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto no-scrollbar">
        <div className="grid grid-cols-18 gap-2 min-w-[800px]">
          {Array.from({ length: 7 }).map((_, row) => (
            <div key={row} className="contents">
              {Array.from({ length: 18 }).map((_, col) => {
                const element = ELEMENTS.find(e => e.x === col + 1 && e.y === row + 1);
                const isMatch = element && matchesSearch(element);
                
                return element ? (
                  <button
                    key={`${row}-${col}`}
                    onClick={() => setSelected(element)}
                    className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all ${
                      isMatch 
                        ? `hover:scale-110 hover:z-20 hover:shadow-xl opacity-100 ${getGroupColor(element.group)}` 
                        : 'opacity-20 grayscale scale-95 pointer-events-none'
                    }`}
                  >
                    <span className="text-[10px] font-bold opacity-60 leading-none mb-1">{element.weight}</span>
                    <span className="text-lg font-black leading-none dark:text-slate-100">{element.symbol}</span>
                  </button>
                ) : (
                  <div key={`${row}-${col}`} className="w-full aspect-square"></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Group Legend */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Элементтер топтарының шартты белгілері</h4>
        <div className="flex flex-wrap gap-3">
          {GROUP_INFO.map((group) => (
            <div key={group.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-md border ${getGroupColor(group.id).split(' ')[0]} ${getGroupColor(group.id).split(' ')[2]}`}></div>
              <span className="text-xs font-bold text-gray-600 dark:text-slate-400">{group.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .grid-cols-18 {
          display: grid;
          grid-template-columns: repeat(18, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default PeriodicTable;
