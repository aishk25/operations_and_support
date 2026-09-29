import React from 'react';
import { Menu, Plus, Bot, ChevronRight } from 'lucide-react';

export default function Header({ 
  activeTab, 
  selectedAgent, 
  setSelectedAgent, 
  agents,
  onOpenMobileSidebar,
  onCreateAgent
}) {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'agents': return 'Agent Setup Workspace';
      case 'knowledge': return 'Knowledge Sources';
      case 'memory': return 'Memory Configuration';
      case 'test': return 'Test Agent';
      case 'settings': return 'Workspace Settings';
      default: return 'Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl border border-slate-700"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-400 font-medium hidden sm:inline">Workspace</span>
          <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:inline" />
          <span className="text-white font-bold tracking-tight">{getTabLabel()}</span>

          {selectedAgent && activeTab !== 'dashboard' && (
            <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-slate-800">
              <span className="text-slate-500 font-medium text-xs">Active:</span>
              <span className="bg-slate-800 text-blue-300 border border-slate-700 text-xs px-2.5 py-0.5 rounded-lg font-semibold">
                {selectedAgent.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions: Quick Agent Switcher & Create Agent button */}
      <div className="flex items-center gap-3">
        {/* Quick Agent Switcher dropdown */}
        {selectedAgent && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedAgent.id}
              onChange={(e) => {
                const found = agents.find(a => a.id === e.target.value);
                if (found) setSelectedAgent(found);
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none font-medium cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id} className="bg-slate-900 text-slate-200">
                  {ag.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          onClick={onCreateAgent}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Agent</span>
        </button>
      </div>
    </header>
  );
}
