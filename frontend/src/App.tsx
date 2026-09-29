import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './features/dashboard/DashboardPage';
import AgentDetailPage from './features/agents/AgentDetailPage';
import MemoryConfigPage from './features/memory/MemoryConfigPage';
import KnowledgePage from './features/knowledge/KnowledgePage';
import TestAgentPage from './features/conversations/TestAgentPage';
import SettingsPage from './features/settings/SettingsPage';
import CreateAgentModal from './components/CreateAgentModal';
import { INITIAL_AGENTS, AgentConfig } from './constants/agents';

export default function App() {
  const [agents, setAgents] = useState<AgentConfig[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig>(INITIAL_AGENTS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [agentDetailStep, setAgentDetailStep] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  
  // Light / Dark mode state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateAgent = (updatedAgent: AgentConfig) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    setSelectedAgent(updatedAgent);
  };

  const handleCreateNewAgent = (newAgent: AgentConfig) => {
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgent(newAgent);
    setActiveTab('agents');
    setAgentDetailStep(0);
  };

  const handleOpenAgentDetail = (agent: AgentConfig, step = 0) => {
    setSelectedAgent(agent);
    setAgentDetailStep(step);
    setActiveTab('agents');
  };

  const handleOpenTest = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setActiveTab('test');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-zinc-950 text-white selection:bg-white selection:text-black' 
        : 'bg-zinc-100 text-zinc-900 selection:bg-black selection:text-white'
    }`}>
      <div className="flex flex-1 min-h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedAgent={selectedAgent}
          setSelectedAgent={(ag) => {
            setSelectedAgent(ag);
            setAgentDetailStep(0);
          }}
          agents={agents}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onCreateAgent={() => setIsCreateModalOpen(true)}
          isDark={isDark}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeTab={activeTab}
            selectedAgent={selectedAgent}
            setSelectedAgent={(ag) => {
              setSelectedAgent(ag);
              setAgentDetailStep(0);
            }}
            agents={agents}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onCreateAgent={() => setIsCreateModalOpen(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
            isDark={isDark}
          />

          <main className="flex-1 pb-12 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardPage
                agents={agents}
                onSelectAgent={handleOpenAgentDetail}
                onOpenTest={handleOpenTest}
                onCreateAgent={() => setIsCreateModalOpen(true)}
                isDark={isDark}
              />
            )}

            {activeTab === 'agents' && (
              <AgentDetailPage
                key={selectedAgent?.id}
                agent={selectedAgent}
                onUpdateAgent={handleUpdateAgent}
                initialStep={agentDetailStep}
                onNavigateToTest={() => setActiveTab('test')}
                isDark={isDark}
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgePage
                key={selectedAgent?.id}
                agent={selectedAgent}
                onUpdateAgent={handleUpdateAgent}
                agents={agents}
                onSelectAgent={setSelectedAgent}
                isDark={isDark}
              />
            )}

            {activeTab === 'memory' && (
              <MemoryConfigPage
                key={selectedAgent?.id}
                agent={selectedAgent}
                onUpdateAgent={handleUpdateAgent}
                agents={agents}
                onSelectAgent={setSelectedAgent}
                isDark={isDark}
              />
            )}

            {activeTab === 'test' && (
              <TestAgentPage
                key={selectedAgent?.id}
                agent={selectedAgent}
                agents={agents}
                onSelectAgent={setSelectedAgent}
                isDark={isDark}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                agent={selectedAgent}
                agents={agents}
                isDark={isDark}
              />
            )}
          </main>
        </div>
      </div>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={handleCreateNewAgent}
        isDark={isDark}
      />
    </div>
  );
}
