import React from 'react';
import { 
  Brain, 
  MessageSquare, 
  Database, 
  TrendingUp, 
  LayoutDashboard, 
  BookOpen, 
  User, 
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../services/api';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  selectedCustomer, 
  setSelectedCustomer,
  onResetDemo
}) {
  const tabs = [
    { id: 'chat', label: 'Support Chat', icon: MessageSquare, badge: 'Live AI' },
    { id: 'memory', label: 'Hindsight Memory Bank', icon: Database, badge: 'Recall' },
    { id: 'learning', label: 'Learning Curve Demo', icon: TrendingUp, badge: 'Before/After' },
    { id: 'dashboard', label: 'Support Dashboard', icon: LayoutDashboard, badge: 'Ops' },
    { id: 'knowledge', label: 'Knowledge Base (RAG)', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between border-b border-indigo-500/20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-indigo-200">Hindsight Persistent Memory Active</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono text-[11px]">Vectorize Memory Layer Engine</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onResetDemo}
            className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-100 transition bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 px-2 py-0.5 rounded"
            title="Reset or seed memory interactions for demo"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Memory</span>
          </button>
          <span className="hidden sm:inline bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            HackwithHyderabad 3.0
          </span>
        </div>
      </div>

      {/* Main Nav header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Hindsight <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Support Agent</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>Operations & Support AI with Hindsight Memory</span>
            </p>
          </div>
        </div>

        {/* Customer Selector dropdown */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 shadow-inner">
          <div className="flex items-center gap-2 px-2 text-xs text-slate-400 font-medium">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Customer:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {MOCK_CUSTOMERS.map((cust) => {
              const isSelected = selectedCustomer.id === cust.id;
              return (
                <button
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/40 font-semibold' 
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <img src={cust.avatar} alt={cust.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{cust.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-indigo-900/60 text-indigo-200' : 'text-slate-500 bg-slate-950'}`}>
                    {cust.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-indigo-500/30 text-indigo-200 font-semibold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
