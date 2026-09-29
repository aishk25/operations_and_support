import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Plus, RefreshCw, FileText, Database, Shield, Ticket, Users, FileSpreadsheet, CreditCard, Building } from 'lucide-react';

export default function KnowledgeSourcesView({ agent, onUpdateAgent, agents, onSelectAgent }) {
  if (!agent) return null;

  const handleToggleSourceStatus = (sourceId) => {
    const updatedSources = agent.knowledgeSources.map(src => {
      if (src.id === sourceId) {
        const nextStatus = src.status === 'Connected' ? 'Not connected' : 'Connected';
        const nextColor = nextStatus === 'Connected' 
          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
          : 'text-slate-400 bg-slate-800 border-slate-700';
        return { ...src, status: nextStatus, statusColor: nextColor };
      }
      return src;
    });

    onUpdateAgent({
      ...agent,
      knowledgeSources: updatedSources
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Knowledge Sources</h1>
              <span className="bg-sky-950 text-sky-300 border border-sky-800/60 text-xs px-2.5 py-0.5 rounded-full font-mono">
                {agent.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connect external databases, document archives, ERP, CRM, and support systems required by <span className="text-blue-300 font-semibold">{agent.name}</span>.
            </p>
          </div>
        </div>

        {/* Agent Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Select Agent:</span>
          <select
            value={agent.id}
            onChange={(e) => {
              const found = agents.find(a => a.id === e.target.value);
              if (found) onSelectAgent(found);
            }}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id} className="bg-slate-900 text-slate-200">
                {ag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sources List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Connected Information Sources ({agent.knowledgeSources.filter(s => s.status === 'Connected').length} Connected)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Only showing relevant sources for {agent.name}</span>
        </div>

        <div className="space-y-3">
          {agent.knowledgeSources.map((source) => (
            <div 
              key={source.id}
              className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-700"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{source.name}</h3>
                  <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                    {source.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{source.details}</p>
                <span className="text-[11px] text-slate-500 font-mono block">System: {source.system} • Last Synced: {source.lastSynced}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded border font-mono font-medium ${source.statusColor}`}>
                  {source.status}
                </span>
                <button
                  onClick={() => handleToggleSourceStatus(source.id)}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3.5 py-1.5 rounded-lg transition"
                >
                  {source.status === 'Connected' ? 'Disconnect' : 'Connect Source'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
