import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Brain, 
  TrendingUp, 
  Filter,
  Sparkles,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { api } from '../services/api';

export default function SupportDashboard({ onSelectCustomer }) {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const tks = await api.getTickets();
    const custs = await api.getCustomers();
    setTickets(tks);
    setCustomers(custs);
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === 'Escalated') return t.status === 'Escalated';
    if (filter === 'Open') return t.status === 'Open';
    if (filter === 'Resolved') return t.status === 'Resolved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hindsight Memory Recall Rate</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>94.2%</span>
            <span className="text-xs text-emerald-400 font-normal font-sans flex items-center">
              +12.4% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Recalled past history across 124 sessions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>First Contact Resolution (FCR)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>88.5%</span>
            <span className="text-xs text-emerald-400 font-normal font-sans flex items-center">
              +18.1% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Automated memory-driven resolutions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Human Escalation Rate</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>4.1%</span>
            <span className="text-xs text-emerald-400 font-normal font-sans flex items-center">
              -8.2% <ArrowUpRight className="w-3 h-3 rotate-90" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Only 4 tickets required human agent</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Customer CSAT Score</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>4.9 / 5.0</span>
            <span className="text-xs text-emerald-400 font-normal font-sans">
              Top Tier
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Zero repeated explanations</p>
        </div>
      </div>

      {/* Main Operations Ticket Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950 border border-indigo-500/40 rounded-xl">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Operations Ticket & Escalation Queue</h3>
              <p className="text-xs text-slate-400">Manage support tickets and review Hindsight memory recall logs.</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'Escalated', 'Open', 'Resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === f 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <div 
              key={t.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition shadow-sm"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-300">{t.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                    t.status === 'Escalated' ? 'bg-red-950 text-red-300 border border-red-800/50' :
                    t.status === 'Open' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  }`}>
                    {t.status}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    Priority: {t.priority}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-semibold text-white">{t.subject}</h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {t.customer_name} ({t.customer_id})
                  </span>
                  <span>•</span>
                  <span className="text-purple-300 flex items-center gap-1 font-mono text-[11px]">
                    <Brain className="w-3 h-3 text-purple-400" /> {t.memory_recalled}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const cust = customers.find(c => c.id === t.customer_id) || customers[0];
                    onSelectCustomer(cust);
                  }}
                  className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/50 text-xs px-3 py-1.5 rounded-lg transition font-medium"
                >
                  View Customer Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
