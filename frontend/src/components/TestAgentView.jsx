import React, { useState } from 'react';
import { TestTube2, Brain, Send, Bot, CheckCircle2, Sparkles } from 'lucide-react';

export default function TestAgentView({ agent, agents, onSelectAgent }) {
  if (!agent) return null;

  const [testInput, setTestInput] = useState('');
  const [chatLog, setChatLog] = useState(agent.conversations || []);
  const [isTesting, setIsTesting] = useState(false);

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <TestTube2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Test Agent Workspace</h1>
              <span className="bg-blue-950 text-blue-300 border border-blue-800/60 text-xs px-2.5 py-0.5 rounded-full font-mono">
                {agent.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verify how <span className="text-blue-300 font-semibold">{agent.name}</span> uses memory & knowledge sources to answer prompts.
            </p>
          </div>
        </div>

        {/* Agent Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Select Agent:</span>
          <select
            value={agent.id}
            onChange={(e) => {
              const found = agents.find(a => a.id === e.target.value);
              if (found) onSelectAgent(found);
            }}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id} className="bg-slate-900 text-slate-200">
                {ag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] uppercase font-bold text-slate-500 font-mono whitespace-nowrap">
          Sample Test Queries:
        </span>
        {agent.testPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendTestMessage(prompt)}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800 transition whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Split Screen Layout (Left: Conversation, Right: Memory Used) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Conversation */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col h-[560px] shadow-xl">
          <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Conversation
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Simulated Agent Interaction</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {chatLog.map((conv, idx) => (
              <div key={idx} className="space-y-3">
                {/* User Query */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-none text-xs sm:text-sm max-w-[85%] leading-relaxed shadow-sm">
                    {conv.query}
                  </div>
                </div>

                {/* Agent Response */}
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[90%] space-y-2 leading-relaxed shadow-inner">
                    <p>{conv.response}</p>

                    <div className="text-[11px] text-blue-300 font-mono pt-2 border-t border-slate-800 flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-purple-400" />
                      <span>Memory Used: {conv.memoryUsed.length} item(s) retrieved</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTesting && (
              <div className="flex items-center gap-2 text-xs text-blue-300 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit animate-pulse">
                <Brain className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Recalling memory & querying knowledge sources...</span>
              </div>
            )}
          </div>

          {/* Test Input Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTestMessage()}
              placeholder="Type test query..."
              className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendTestMessage()}
              disabled={isTesting || !testInput.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Memory Used Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col h-[560px] shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" /> Memory Used
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Hindsight Audit</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatLog.length > 0 && chatLog[chatLog.length - 1].memoryUsed.map((mem, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 font-mono text-[11px]">{mem.category}</span>
                  <span className="bg-purple-950 text-purple-200 border border-purple-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                    Score: {mem.confidence}
                  </span>
                </div>
                <p className="font-semibold text-white text-xs">{mem.title}</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">{mem.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateMockAgentResponse(agent, query) {
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
