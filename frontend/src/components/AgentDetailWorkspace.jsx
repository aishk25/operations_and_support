import React, { useState } from 'react';
import { 
  Brain, 
  BookOpen, 
  Sliders, 
  CheckCircle2, 
  TestTube2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  RefreshCw,
  X
} from 'lucide-react';

export default function AgentDetailWorkspace({ 
  agent, 
  onUpdateAgent, 
  initialStep = 0,
  onNavigateToTest 
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [testInput, setTestInput] = useState('');
  const [chatLog, setChatLog] = useState(agent.conversations || []);
  const [isTesting, setIsTesting] = useState(false);

  const steps = [
    { id: 0, title: "1. What should it remember?", shortTitle: "Memory", icon: Brain },
    { id: 1, title: "2. Knowledge sources", shortTitle: "Knowledge", icon: BookOpen },
    { id: 2, title: "3. Memory rules", shortTitle: "Rules", icon: Sliders },
    { id: 3, title: "4. Review", shortTitle: "Review", icon: CheckCircle2 },
    { id: 4, title: "5. Test agent", shortTitle: "Test", icon: TestTube2 },
  ];

  // Step 1: Memory Areas Checkbox Toggle
  const handleToggleMemoryArea = (areaId) => {
    const updatedAreas = agent.memoryAreas.map(area => {
      if (area.id === areaId) {
        return { ...area, checked: !area.checked };
      }
      return area;
    });

    onUpdateAgent({
      ...agent,
      memoryAreas: updatedAreas
    });
  };

  // Step 2: Toggle Knowledge Source Status
  const handleToggleSourceStatus = (sourceId) => {
    const updatedSources = agent.knowledgeSources.map(src => {
      if (src.id === sourceId) {
        const nextStatus = src.status === 'Connected' ? 'Not connected' : 'Connected';
        const nextColor = nextStatus === 'Connected' 
          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' 
          : 'text-slate-400 bg-slate-800 border-slate-700';
        return { ...src, status: nextStatus, statusColor: nextColor };
      }
      return src;
    });

    onUpdateAgent({
      ...agent,
      knowledgeSources: updatedSources
    });
  };

  // Step 3: Update Rules
  const handleUpdateRules = (field, value) => {
    onUpdateAgent({
      ...agent,
      memoryRules: {
        ...agent.memoryRules,
        [field]: value
      }
    });
  };

  // Step 5: Test Execution
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{agent.name}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded border font-mono ${agent.status}`}>
                {agent.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              {agent.description}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Setup Progress:</span>
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${agent.setupProgress}%` }}
              ></div>
            </div>
            <span className="text-blue-400 font-bold font-mono">{agent.setupProgress}%</span>
          </div>
        </div>

        {/* Stepper Progress Bar (5 Steps) */}
        <div className="border-t border-slate-800/80 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                    isActive 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20 font-semibold' 
                      : isCompleted
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : step.id + 1}
                  </div>
                  <span className="truncate">{step.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP CONTENT PANELS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* STEP 1: What should it remember? */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>1. Select What This Agent Should Remember</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure persistent memory categories for <span className="text-blue-300 font-semibold">{agent.name}</span>. Only memory types relevant to this domain are available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agent.memoryAreas.map((area) => (
                <div 
                  key={area.id}
                  onClick={() => handleToggleMemoryArea(area.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    area.checked 
                      ? 'bg-purple-950/30 border-purple-500/50 shadow-md' 
                      : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition ${
                    area.checked ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {area.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white">{area.label}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <span>Next: Knowledge Sources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Knowledge sources */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <span>2. Connect Information Sources Needed by the Agent</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Connect external systems, document repositories, or databases required by <span className="text-blue-300 font-semibold">{agent.name}</span>.
              </p>
            </div>

            <div className="space-y-3">
              {agent.knowledgeSources.map((source) => (
                <div 
                  key={source.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{source.name}</h3>
                      <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                        {source.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{source.details}</p>
                    <span className="text-[11px] text-slate-500 font-mono block">System: {source.system} • Last Synced: {source.lastSynced}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded border font-mono font-medium ${source.statusColor}`}>
                      {source.status}
                    </span>
                    <button
                      onClick={() => handleToggleSourceStatus(source.id)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition"
                    >
                      {source.status === 'Connected' ? 'Disconnect' : 'Connect Source'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(0)}
                className="text-xs text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <span>Next: Memory Rules</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Memory rules */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>3. Memory Retention & Scoping Rules</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Define how long memory items persist and how confidence scoring & scoping apply.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Memory Retention Window</label>
                <select
                  value={agent.memoryRules.retentionPeriod}
                  onChange={(e) => handleUpdateRules('retentionPeriod', e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="30 days">30 days (Short-Term)</option>
                  <option value="90 days">90 days (Standard Support Window)</option>
                  <option value="180 days">180 days (AP Fiscal Window)</option>
                  <option value="365 days">365 days (Full Compliance Audit Window)</option>
                </select>
                <p className="text-[11px] text-slate-500">Older memory units past this threshold will be archived.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Hindsight Recall Confidence Threshold</label>
                <input
                  type="range"
                  min="0.70"
                  max="0.99"
                  step="0.01"
                  value={agent.memoryRules.confidenceThreshold}
                  onChange={(e) => handleUpdateRules('confidenceThreshold', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>0.70 (Broad Recall)</span>
                  <span className="text-blue-400 font-bold">{agent.memoryRules.confidenceThreshold}</span>
                  <span>0.99 (Strict Recall)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <span>Next: Review Configuration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>4. Review Agent Configuration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Review memory areas, knowledge sources, and rules before putting this agent into test mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Memory Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" /> Selected Memory Categories ({agent.memoryAreas.filter(m => m.checked).length})
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {agent.memoryAreas.filter(m => m.checked).map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-slate-200">
                      <span className="text-emerald-400 font-bold">✓</span> {m.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Knowledge Summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" /> Connected Information Sources
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {agent.knowledgeSources.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-xs">
                      <span>{s.name}</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded border font-mono ${s.statusColor}`}>
                        {s.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-slate-400 hover:text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <TestTube2 className="w-4 h-4" />
                <span>Proceed to Test Agent</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Test agent (Clean AI Testing Split Interface) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TestTube2 className="w-5 h-5 text-blue-400" />
                  <span>Test Interface — {agent.name}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Ask test questions to verify how the agent recalls memory and retrieves knowledge sources.
                </p>
              </div>

              {/* Preset prompt buttons */}
              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Sample Test Queries:</span>
                {agent.testPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendTestMessage(prompt)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-800 transition truncate max-w-[180px]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen Layout (Left: Conversation, Right: Memory Used) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Conversation */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col h-[520px]">
                <div className="flex-1 overflow-y-auto space-y-4 p-2">
                  {chatLog.map((conv, idx) => (
                    <div key={idx} className="space-y-3">
                      {/* User Query */}
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-xs sm:text-sm max-w-[85%] leading-relaxed">
                          {conv.query}
                        </div>
                      </div>

                      {/* Agent Response */}
                      <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[90%] space-y-2 leading-relaxed">
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
                    <div className="flex items-center gap-2 text-xs text-blue-300 bg-slate-900 p-3 rounded-xl border border-slate-800 w-fit animate-pulse">
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
                    className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSendTestMessage()}
                    disabled={isTesting || !testInput.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Memory Used Inspector */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col h-[520px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-purple-400" /> Memory Used
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Hindsight Recall Audit</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatLog.length > 0 && chatLog[chatLog.length - 1].memoryUsed.map((mem, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-purple-500/30 space-y-2 text-xs">
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
        )}

      </div>
    </div>
  );
}

// Generate realistic domain response based on test query
function generateMockAgentResponse(agent, query) {
  const qLower = query.toLowerCase();

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
