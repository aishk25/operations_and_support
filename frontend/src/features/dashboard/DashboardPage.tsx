import React from 'react';
import { 
  MessageSquare, 
  Receipt, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  Brain, 
  BookOpen, 
  TestTube2 
} from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface DashboardPageProps {
  agents: AgentConfig[];
  onSelectAgent: (agent: AgentConfig, step?: number) => void;
  onOpenTest: (agent: AgentConfig) => void;
  onCreateAgent: () => void;
  isDark: boolean;
}

export default function DashboardPage({ 
  agents, 
  onSelectAgent, 
  onOpenTest, 
  onCreateAgent,
  isDark
}: DashboardPageProps) {
  const getAgentIcon = (name: string) => {
    if (name.includes('Support')) {
      return (
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
        }`}>
          <MessageSquare className="w-5 h-5" />
        </div>
      );
    }
    if (name.includes('Payable')) {
      return (
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-300 text-zinc-800'
        }`}>
          <Receipt className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-700'
      }`}>
        <ShieldCheck className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-8">
      {/* Top Banner & Header */}
      <div className={`border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl transition-colors duration-200 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Agent Workspace
            </h1>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${
              isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
            }`}>
              Hindsight Engine
            </span>
          </div>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Prepare, configure and test your AI agents in Operations and Support HelpDesk.
          </p>
        </div>

        {/* Single Primary Action Button: Create Account */}
        <button
          onClick={onCreateAgent}
          className={`font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 w-full md:w-auto ${
            isDark 
              ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10' 
              : 'bg-black text-white hover:bg-zinc-800 shadow-black/10'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Account</span>
        </button>
      </div>

      {/* Main Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            <span>Your Agents</span>
            <span className={`text-xs font-normal font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              ({agents.length} configured workspace agents)
            </span>
          </h2>
          <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Click any agent card to manage setup
          </span>
        </div>

        {/* 3-Column Responsive Workspace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const checkedMemories = agent.memoryAreas.filter(m => m.checked);

            return (
              <div 
                key={agent.id}
                className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 shadow-xl hover:shadow-2xl group ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getAgentIcon(agent.name)}
                      <div>
                        <h3 className={`text-base font-bold transition-colors ${
                          isDark ? 'text-white group-hover:text-zinc-300' : 'text-zinc-900 group-hover:text-black'
                        }`}>
                          {agent.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-mono mt-1 inline-block ${
                          isDark ? 'bg-zinc-950 text-zinc-300 border-zinc-800' : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}>
                          {agent.statusCode === 'ready' ? '✓ Ready for Testing' :
                           agent.statusCode === 'setup' ? '⚙ In Setup' : '📝 Draft'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed min-h-[36px] ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {agent.description}
                  </p>

                  <div className={`border-t my-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}></div>

                  <div className="space-y-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono ${
                      isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      <Brain className="w-3.5 h-3.5" /> What It Remembers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {checkedMemories.map((m) => (
                        <span 
                          key={m.id}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border ${
                            isDark 
                              ? 'bg-zinc-950 text-zinc-300 border-zinc-800' 
                              : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                          }`}
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono ${
                      isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}>
                      <BookOpen className="w-3.5 h-3.5" /> Connected Sources:
                    </span>
                    <div className="space-y-1.5">
                      {agent.knowledgeSources.map((source) => (
                        <div 
                          key={source.id}
                          className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg border ${
                            isDark 
                              ? 'bg-zinc-950 border-zinc-800' 
                              : 'bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          <span className={`truncate max-w-[170px] ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{source.name}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded border font-mono ${
                            source.status === 'Connected' 
                              ? isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-200 text-black border-zinc-300'
                              : isDark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                          }`}>
                            {source.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`pt-4 border-t flex items-center gap-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <button
                    onClick={() => onSelectAgent(agent, 0)}
                    className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 ${
                      isDark 
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10' 
                        : 'bg-black text-white hover:bg-zinc-800 shadow-black/10'
                    }`}
                  >
                    <span>Open Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenTest(agent)}
                    className={`text-xs font-semibold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border ${
                      isDark 
                        ? 'bg-zinc-950 hover:bg-zinc-800 text-white border-zinc-700' 
                        : 'bg-zinc-100 hover:bg-zinc-200 text-black border-zinc-300'
                    }`}
                  >
                    <TestTube2 className="w-3.5 h-3.5" />
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
