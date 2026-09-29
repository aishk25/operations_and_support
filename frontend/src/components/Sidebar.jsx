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
  Receipt
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  selectedAgent, 
  setSelectedAgent, 
  agents,
  isOpen, 
  onClose,
  onCreateAgent
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents', label: 'Agents', icon: Bot, badge: agents.length },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'test', label: 'Test Agent', icon: TestTube2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getAgentIcon = (name) => {
    if (name.includes('Support')) return <MessageSquare className="w-4 h-4 text-sky-400" />;
    if (name.includes('Payable')) return <Receipt className="w-4 h-4 text-emerald-400" />;
    return <ShieldCheck className="w-4 h-4 text-purple-400" />;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">Hindsight Studio</h1>
              <p className="text-[11px] text-slate-400">Agent Preparation Workspace</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section: Main Menu */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
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
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: Active Workspace Agents Quick Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Workspace Agents
              </span>
              <button
                onClick={() => {
                  onCreateAgent();
                  if (onClose) onClose();
                }}
                className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 font-medium"
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
                        ? 'bg-slate-800 border border-slate-700 text-white font-semibold' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {getAgentIcon(agent.name)}
                    <span className="truncate flex-1">{agent.name}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      agent.statusCode === 'ready' ? 'bg-emerald-500' :
                      agent.statusCode === 'setup' ? 'bg-indigo-400' : 'bg-slate-500'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Hindsight Core</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">v2.4</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Memory-First Agent Builder</p>
        </div>
      </aside>
    </>
  );
}
