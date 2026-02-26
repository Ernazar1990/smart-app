
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserProgress } from '../types';

const Dashboard: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  const chartData = (progress.recentScores || []).map((score, i) => ({
    name: `Тест ${i + 1}`,
    score: score
  }));

  const pieData = Object.entries(progress.categoryStrength || {}).map(([name, value]) => ({
    name, value
  }));

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Сәлем, Жас Химик! 👋</h2>
        <p className="text-gray-500 mt-2">Сенің бүгінгі жетістіктерің мен оқу барысың.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-check-double"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Жалпы шешілген</p>
            <p className="text-2xl font-bold text-gray-800">{progress.totalSolved || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <i className="fas fa-bullseye"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Дұрыс жауаптар</p>
            <p className="text-2xl font-bold text-gray-800">{Math.round(((progress.correctAnswers || 0) / (progress.totalSolved || 1)) * 100)}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Белсенділік</p>
            <p className="text-2xl font-bold text-gray-800">Жоғары</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80">
          <h3 className="font-semibold text-gray-800 mb-6">Соңғы нәтижелер динамикасы</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-4">Тақырыптар бойынша білім</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
