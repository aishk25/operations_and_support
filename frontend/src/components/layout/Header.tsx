import React from 'react';
import { Menu, Bot, ChevronRight } from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface HeaderProps {
  activeTab: string;
  selectedAgent: AgentConfig;
  setSelectedAgent: (agent: AgentConfig) => void;
  agents: AgentConfig[];
  onOpenMobileSidebar: () => void;
  onCreateAgent: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isDark: boolean;
}

export default function Header({ 
  activeTab, 
  selectedAgent, 
  setSelectedAgent, 
  agents,
  onOpenMobileSidebar,
  theme,
  onToggleTheme,
  isDark
}: HeaderProps) {
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
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-4 transition-colors duration-200 ${
      isDark 
        ? 'bg-zinc-900/90 border-zinc-800 text-white' 
        : 'bg-white/90 border-zinc-200 text-zinc-900 shadow-sm'
    }`}>
      {/* Left: Mobile Menu button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className={`lg:hidden p-2 rounded-xl border transition ${
            isDark 
              ? 'text-zinc-400 hover:text-white bg-zinc-800 border-zinc-700' 
              : 'text-zinc-600 hover:text-black bg-zinc-100 border-zinc-300'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className={`font-medium hidden sm:inline ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Operations & Support HelpDesk
          </span>
          <ChevronRight className={`w-4 h-4 hidden sm:inline ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
          <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            {getTabLabel()}
          </span>

          {selectedAgent && activeTab !== 'dashboard' && (
            <div className={`hidden md:flex items-center gap-2 ml-2 pl-2 border-l ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <span className={`font-medium text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Active:</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-lg font-semibold border ${
                isDark 
                  ? 'bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-zinc-100 text-zinc-900 border-zinc-300'
              }`}>
                {selectedAgent.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions: Full Moon / Half Moon Symbol-Only Theme Toggle & Quick Switcher */}
      <div className="flex items-center gap-3">
        {/* Symbol-Only Theme Toggle Button (Full Moon 🌕 for Dark Mode / Half Moon 🌓 for Light Mode) */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition flex items-center justify-center ${
            isDark 
              ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white' 
              : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-900'
          }`}
          title={isDark ? 'Switch to Light Mode (Half Moon)' : 'Switch to Dark Mode (Full Moon)'}
          aria-label="Toggle Light or Dark Mode"
        >
          {isDark ? (
            /* Full Moon Symbol 🌕 */
            <svg className="w-5 h-5 fill-white text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="9" fill="currentColor" />
            </svg>
          ) : (
            /* Half Moon Symbol 🌓 */
            <svg className="w-5 h-5 text-zinc-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
            </svg>
          )}
        </button>

        {/* Quick Agent Switcher */}
        {selectedAgent && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
            isDark 
              ? 'bg-zinc-950 border-zinc-800 text-white' 
              : 'bg-zinc-50 border-zinc-300 text-zinc-900'
          }`}>
            <Bot className={`w-3.5 h-3.5 ${isDark ? 'text-white' : 'text-black'}`} />
            <select
              value={selectedAgent.id}
              onChange={(e) => {
                const found = agents.find(a => a.id === e.target.value);
                if (found) setSelectedAgent(found);
              }}
              className="bg-transparent text-xs focus:outline-none font-medium cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-black'}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </header>
  );
}
