import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AgentDetailWorkspace from './components/AgentDetailWorkspace';
import MemoryConfigView from './components/MemoryConfigView';
import KnowledgeSourcesView from './components/KnowledgeSourcesView';
import TestAgentView from './components/TestAgentView';
import SettingsView from './components/SettingsView';
import CreateAgentModal from './components/CreateAgentModal';
import { INITIAL_AGENTS } from './data/agentsData';

export default function App() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState(INITIAL_AGENTS[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agentDetailStep, setAgentDetailStep] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Update agent data state
  const handleUpdateAgent = (updatedAgent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    setSelectedAgent(updatedAgent);
  };

  const handleCreateNewAgent = (newAgent) => {
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgent(newAgent);
    setActiveTab('agents');
    setAgentDetailStep(0);
  };

  const handleOpenAgentDetail = (agent, step = 0) => {
    setSelectedAgent(agent);
    setAgentDetailStep(step);
    setActiveTab('agents');
  };

  const handleOpenTest = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('test');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar */}
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
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          {/* Header */}
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
          />

          {/* Body View Container */}
          <main className="flex-1 pb-12 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                agents={agents}
                onSelectAgent={handleOpenAgentDetail}
                onOpenTest={handleOpenTest}
                onCreateAgent={() => setIsCreateModalOpen(true)}
              />
            )}

            {activeTab === 'agents' && (
              <AgentDetailWorkspace
                key={selectedAgent?.id}
                agent={selectedAgent}
                onUpdateAgent={handleUpdateAgent}
                initialStep={agentDetailStep}
                onNavigateToTest={() => setActiveTab('test')}
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeSourcesView
                key={selectedAgent?.id}
                agent={selectedAgent}
                onUpdateAgent={handleUpdateAgent}
                agents={agents}
                onSelectAgent={setSelectedAgent}
              />
            )}

            {activeTab === 'memory' && (
              <MemoryConfigView
                key={selectedAgent?.id}
                agent={selectedAgent}
                onUpdateAgent={handleUpdateAgent}
                agents={agents}
                onSelectAgent={setSelectedAgent}
              />
            )}

            {activeTab === 'test' && (
              <TestAgentView
                key={selectedAgent?.id}
                agent={selectedAgent}
                agents={agents}
                onSelectAgent={setSelectedAgent}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                agent={selectedAgent}
                agents={agents}
              />
            )}
          </main>
        </div>
      </div>

      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={handleCreateNewAgent}
      />
    </div>
  );
}
