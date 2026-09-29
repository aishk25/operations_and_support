import React from 'react';
import { 
  MessageSquare, 
  Receipt, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  Brain, 
  BookOpen, 
  TestTube2, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

export default function DashboardView({ 
  agents, 
  onSelectAgent, 
  onOpenTest, 
  onCreateAgent 
}) {
  const getAgentIcon = (name) => {
    if (name.includes('Support')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/60 flex items-center justify-center text-sky-400">
          <MessageSquare className="w-5 h-5" />
        </div>
      );
    }
    if (name.includes('Payable')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
          <Receipt className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
        <ShieldCheck className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Agent Workspace</h1>
            <span className="bg-blue-950 text-blue-300 border border-blue-800/60 text-xs px-2.5 py-0.5 rounded-full font-mono">
              Hindsight Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Prepare, configure and test your AI agents.
          </p>
        </div>

        <button
          onClick={onCreateAgent}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Agent</span>
        </button>
      </div>

      {/* Main Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Your Agents</span>
            <span className="text-xs font-normal text-slate-400 font-mono">({agents.length} configured workspace agents)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Click any agent card to manage setup</span>
        </div>

        {/* 3-Column Responsive Workspace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const connectedSources = agent.knowledgeSources.filter(s => s.status === 'Connected');
            const attentionSources = agent.knowledgeSources.filter(s => s.status === 'Needs attention');
            const checkedMemories = agent.memoryAreas.filter(m => m.checked);

            return (
              <div 
                key={agent.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 shadow-xl hover:shadow-2xl group"
              >
                {/* Header info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getAgentIcon(agent.name)}
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                          {agent.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-mono mt-1 inline-block ${agent.status}`}>
                          {agent.statusCode === 'ready' ? '✓ Ready for Testing' :
                           agent.statusCode === 'setup' ? '⚙ In Setup' : '📝 Draft'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                    {agent.description}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-slate-800/80 my-2"></div>

                  {/* Section: What the agent remembers */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Brain className="w-3.5 h-3.5 text-purple-400" /> What It Remembers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {checkedMemories.map((m) => (
                        <span 
                          key={m.id}
                          className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Section: Connected Knowledge Sources */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" /> Connected Sources:
                    </span>
                    <div className="space-y-1.5">
                      {agent.knowledgeSources.map((source) => (
                        <div 
                          key={source.id}
                          className="flex items-center justify-between text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80"
                        >
                          <span className="text-slate-300 truncate max-w-[170px]">{source.name}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded border font-mono ${source.statusColor}`}>
                            {source.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectAgent(agent, 0)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                  >
                    <span>Open Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenTest(agent)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <TestTube2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Test Agent</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
