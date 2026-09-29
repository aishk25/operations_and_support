import React from 'react';
import { BookOpen } from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface KnowledgePageProps {
  agent: AgentConfig;
  onUpdateAgent: (agent: AgentConfig) => void;
  agents: AgentConfig[];
  onSelectAgent: (agent: AgentConfig) => void;
  isDark: boolean;
}

export default function KnowledgePage({ agent, onUpdateAgent, agents, onSelectAgent, isDark }: KnowledgePageProps) {
  if (!agent) return null;

  const handleToggleSourceStatus = (sourceId: string) => {
    const updatedSources = agent.knowledgeSources.map(src => {
      if (src.id === sourceId) {
        const nextStatus = src.status === 'Connected' ? 'Not connected' : 'Connected';
        const nextColor = nextStatus === 'Connected' 
          ? isDark ? 'text-white bg-zinc-800 border-zinc-700' : 'text-black bg-zinc-200 border-zinc-300' 
          : 'text-zinc-500 bg-zinc-800 border-zinc-700';
        return { ...src, status: nextStatus as any, statusColor: nextColor };
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
      <div className={`border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl transition-colors duration-200 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
          }`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Knowledge Sources</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${
                isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
              }`}>
                {agent.name}
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Connect external databases, document archives, ERP, CRM, and support systems required by <span className="font-bold">{agent.name}</span>.
            </p>
          </div>
        </div>

        {/* Agent Switcher */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
        }`}>
          <span className={`font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Select Agent:</span>
          <select
            value={agent.id}
            onChange={(e) => {
              const found = agents.find(a => a.id === e.target.value);
              if (found) onSelectAgent(found);
            }}
            className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-black'}>
                {ag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sources List */}
      <div className={`border rounded-2xl p-6 space-y-4 shadow-xl ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className={`border-b pb-3 flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            <BookOpen className="w-4 h-4" />
            <span>Connected Information Sources ({agent.knowledgeSources.filter(s => s.status === 'Connected').length} Connected)</span>
          </h2>
          <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Only showing relevant sources for {agent.name}</span>
        </div>

        <div className="space-y-3">
          {agent.knowledgeSources.map((source) => (
            <div 
              key={source.id}
              className={`border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{source.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                    isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-zinc-200 text-zinc-700 border-zinc-300'
                  }`}>
                    {source.category}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{source.details}</p>
                <span className="text-[11px] text-zinc-500 font-mono block">System: {source.system} • Last Synced: {source.lastSynced}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded border font-mono font-medium ${
                  source.status === 'Connected' 
                    ? isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-200 text-black border-zinc-300'
                    : isDark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}>
                  {source.status}
                </span>
                <button
                  onClick={() => handleToggleSourceStatus(source.id)}
                  className={`text-xs border px-3.5 py-1.5 rounded-lg transition ${
                    isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                  }`}
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
