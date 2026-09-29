import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  BookOpen, 
  Brain, 
  TestTube2, 
  Settings, 
  X,
  PlusCircle,
  ShieldCheck,
  MessageSquare,
  Receipt,
  LifeBuoy
} from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAgent: AgentConfig;
  setSelectedAgent: (agent: AgentConfig) => void;
  agents: AgentConfig[];
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: () => void;
  isDark: boolean;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  selectedAgent, 
  setSelectedAgent, 
  agents,
  isOpen, 
  onClose,
  onCreateAgent,
  isDark
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot, badge: agents.length },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'test', label: 'Test Agent', icon: TestTube2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getAgentIcon = (name: string) => {
    if (name.includes('Support')) return <MessageSquare className={`w-4 h-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} />;
    if (name.includes('Payable')) return <Receipt className={`w-4 h-4 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`} />;
    return <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />;
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 border-r flex flex-col justify-between transition-colors duration-200 lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}
      `}>
        {/* Brand Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-md ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            }`}>
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-sm font-bold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Operations & Support
              </h1>
              <p className={`text-[11px] font-mono tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                HelpDesk Workspace
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`lg:hidden p-1 rounded-lg ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            <span className={`px-3 text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive 
                      ? isDark 
                        ? 'bg-white text-black font-bold shadow-md' 
                        : 'bg-black text-white font-bold shadow-md'
                      : isDark
                        ? 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                        : 'text-zinc-700 hover:text-black hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive 
                        ? isDark ? 'bg-zinc-200 text-black font-bold' : 'bg-zinc-800 text-white font-bold'
                        : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Workspace Agents list */}
          <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <div className="flex items-center justify-between px-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Workspace Agents
              </span>
              <button
                onClick={() => {
                  onCreateAgent();
                  if (onClose) onClose();
                }}
                className={`text-xs flex items-center gap-1 font-medium ${isDark ? 'text-white hover:text-zinc-300' : 'text-black hover:text-zinc-700'}`}
                title="Create Account / Agent"
              >
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {agents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setActiveTab('agents');
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition ${
                      isSelected 
                        ? isDark 
                          ? 'bg-zinc-800 border border-zinc-700 text-white font-semibold' 
                          : 'bg-zinc-200 border border-zinc-300 text-black font-semibold'
                        : isDark
                          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {getAgentIcon(agent.name)}
                    <span className="truncate flex-1">{agent.name}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      agent.statusCode === 'ready' 
                        ? isDark ? 'bg-white' : 'bg-black' 
                        : isDark ? 'bg-zinc-500' : 'bg-zinc-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className={`p-3 border-t text-[11px] ${isDark ? 'border-zinc-800 bg-zinc-950/60 text-zinc-400' : 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}>
          <div className="flex items-center justify-between">
            <span className={`font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Hindsight Core</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
              isDark ? 'bg-zinc-800 text-zinc-200 border-zinc-700' : 'bg-zinc-200 text-zinc-800 border-zinc-300'
            }`}>v2.4</span>
          </div>
          <p className="text-[10px] mt-1 opacity-80">HelpDesk Memory Platform</p>
        </div>
      </aside>
    </>
  );
}
