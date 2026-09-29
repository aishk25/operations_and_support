import React, { useState } from 'react';
import { TestTube2, Brain, Send } from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface TestAgentPageProps {
  agent: AgentConfig;
  agents: AgentConfig[];
  onSelectAgent: (agent: AgentConfig) => void;
  isDark: boolean;
}

export default function TestAgentPage({ agent, agents, onSelectAgent, isDark }: TestAgentPageProps) {
  if (!agent) return null;

  const [testInput, setTestInput] = useState<string>('');
  const [chatLog, setChatLog] = useState(agent.conversations || []);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const handleSendTestMessage = (textToSend = testInput) => {
    if (!textToSend.trim() || isTesting) return;

    setIsTesting(true);
    const newQuery = textToSend;
    setTestInput('');

    setTimeout(() => {
      const mockResp = generateMockAgentResponse(agent, newQuery);
      setChatLog(prev => [...prev, mockResp]);
      setIsTesting(false);
    }, 600);
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
            <TestTube2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Test Agent Workspace</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${
                isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
              }`}>
                {agent.name}
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Verify how <span className="font-bold">{agent.name}</span> uses memory & knowledge sources to answer prompts.
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

      {/* Preset Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className={`text-[11px] uppercase font-bold font-mono whitespace-nowrap ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Sample Test Queries:
        </span>
        {agent.testPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendTestMessage(prompt)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Split Screen Layout (Left: Conversation, Right: Memory Used) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Conversation */}
        <div className={`border rounded-2xl p-4 sm:p-6 flex flex-col h-[560px] shadow-xl ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className={`border-b pb-3 mb-3 flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <span className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Conversation
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Simulated Agent Interaction</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {chatLog.map((conv, idx) => (
              <div key={idx} className="space-y-3">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className={`p-3.5 rounded-2xl rounded-tr-none text-xs sm:text-sm max-w-[85%] leading-relaxed shadow-sm ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {conv.query}
                  </div>
                </div>

                {/* Agent Response */}
                <div className="flex justify-start">
                  <div className={`border p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[90%] space-y-2 leading-relaxed ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                  }`}>
                    <p>{conv.response}</p>

                    <div className={`text-[11px] font-mono pt-2 border-t flex items-center gap-1 ${
                      isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-600'
                    }`}>
                      <Brain className="w-3.5 h-3.5" />
                      <span>Memory Used: {conv.memoryUsed.length} item(s) retrieved</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTesting && (
              <div className={`flex items-center gap-2 text-xs p-3 rounded-xl border w-fit animate-pulse ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
              }`}>
                <Brain className="w-4 h-4 animate-spin" />
                <span>Recalling memory & querying knowledge sources...</span>
              </div>
            )}
          </div>

          {/* Test Input Bar */}
          <div className={`pt-3 border-t flex items-center gap-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTestMessage()}
              placeholder="Type test query..."
              className={`flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border focus:outline-none ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800 placeholder-zinc-500' : 'bg-zinc-50 text-zinc-900 border-zinc-300 placeholder-zinc-400'
              }`}
            />
            <button
              onClick={() => handleSendTestMessage()}
              disabled={isTesting || !testInput.trim()}
              className={`p-2.5 rounded-xl transition shadow-md ${
                isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Memory Used Inspector */}
        <div className={`border rounded-2xl p-4 sm:p-6 flex flex-col h-[560px] shadow-xl ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 mb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              <Brain className="w-4 h-4" /> Memory Used
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Hindsight Audit</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatLog.length > 0 && chatLog[chatLog.length - 1].memoryUsed.map((mem, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[11px]">{mem.category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                    isDark ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-zinc-200 text-black border-zinc-300'
                  }`}>
                    Score: {mem.confidence}
                  </span>
                </div>
                <p className="font-semibold text-xs">{mem.title}</p>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{mem.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateMockAgentResponse(agent: AgentConfig, query: string) {
  if (agent.id === 'customer-support') {
    return {
      query: query,
      response: `Based on customer history and past ticket logs, we recalled that similar issues were caused by configuration mismatches. In past tickets, resyncing server clocks and clearing outdated session tokens resolved the issue on the 1st attempt.`,
      memoryUsed: [
        { category: "Past ticket", title: "Ticket #4821 Resolution Log", detail: "Recalled previous SSO authentication failure fix.", confidence: "0.95" },
        { category: "Successful solution", title: "Token Re-authorization", detail: "Confirmed token refresh resolved customer friction.", confidence: "0.98" }
      ]
    };
  }

  if (agent.id === 'accounts-payable') {
    return {
      query: query,
      response: `Analysis of vendor records and invoice exception logs shows that billing variances under $1,500 for this vendor are pre-authorized under Master Agreement clause 4.2 and cleared under clearance code V-ACME-01.`,
      memoryUsed: [
        { category: "Vendor pattern", title: "Vendor Clearance Contract Clause 4.2", detail: "Pre-authorized shipping overages up to $1,500.", confidence: "0.97" },
        { category: "Resolution", title: "Clearance Code V-ACME-01", detail: "Applied automated AP exception clearance.", confidence: "0.99" }
      ]
    };
  }

  return {
    query: query,
    response: `Audit logs and remediation history confirm that Control CC6.1 testing verified 100% compliance during the August audit, following automated HRIS-to-Okta deprovisioning setup in Remediation Item #REM-104.`,
    memoryUsed: [
      { category: "Audit finding", title: "Q2 SOC2 Audit Finding #AUD-882", detail: "Identified IAM access offboarding latency.", confidence: "0.98" },
      { category: "Tested control", title: "Control CC6.1 Verification", detail: "Tested 25 sample events with zero exceptions.", confidence: "0.99" }
    ]
  };
}
