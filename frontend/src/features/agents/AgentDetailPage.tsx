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
  Send
} from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface AgentDetailPageProps {
  agent: AgentConfig;
  onUpdateAgent: (agent: AgentConfig) => void;
  initialStep?: number;
  onNavigateToTest: () => void;
  isDark: boolean;
}

export default function AgentDetailPage({ 
  agent, 
  onUpdateAgent, 
  initialStep = 0,
  onNavigateToTest,
  isDark
}: AgentDetailPageProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [testInput, setTestInput] = useState<string>('');
  const [chatLog, setChatLog] = useState(agent.conversations || []);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const steps = [
    { id: 0, title: "1. What should it remember?", shortTitle: "Memory", icon: Brain },
    { id: 1, title: "2. Knowledge sources", shortTitle: "Knowledge", icon: BookOpen },
    { id: 2, title: "3. Memory rules", shortTitle: "Rules", icon: Sliders },
    { id: 3, title: "4. Review", shortTitle: "Review", icon: CheckCircle2 },
    { id: 4, title: "5. Test agent", shortTitle: "Test", icon: TestTube2 },
  ];

  const handleToggleMemoryArea = (areaId: string) => {
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

  const handleToggleSourceStatus = (sourceId: string) => {
    const updatedSources = agent.knowledgeSources.map(src => {
      if (src.id === sourceId) {
        const nextStatus = src.status === 'Connected' ? 'Not connected' : 'Connected';
        const nextColor = nextStatus === 'Connected' 
          ? isDark ? 'text-white bg-zinc-800 border-zinc-700' : 'text-black bg-zinc-200 border-zinc-300' 
          : 'text-zinc-500 bg-zinc-800 border-zinc-700';
        return { ...src, status: nextStatus as any, statusColor: nextColor };
      }
      return src;
    });

    onUpdateAgent({
      ...agent,
      knowledgeSources: updatedSources
    });
  };

  const handleUpdateRules = (field: string, value: any) => {
    onUpdateAgent({
      ...agent,
      memoryRules: {
        ...agent.memoryRules,
        [field]: value
      }
    });
  };

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
      <div className={`border rounded-2xl p-6 space-y-4 shadow-xl ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{agent.name}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded border font-mono ${
                isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
              }`}>
                {agent.status}
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-1 max-w-3xl ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {agent.description}
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-300'
          }`}>
            <span className={`font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Setup Progress:</span>
            <div className={`w-24 h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'}`}
                style={{ width: `${agent.setupProgress}%` }}
              ></div>
            </div>
            <span className={`font-bold font-mono ${isDark ? 'text-white' : 'text-black'}`}>{agent.setupProgress}%</span>
          </div>
        </div>

        <div className={`border-t pt-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                    isActive 
                      ? isDark 
                        ? 'bg-white text-black border-white font-bold shadow-md' 
                        : 'bg-black text-white border-black font-bold shadow-md'
                      : isCompleted
                      ? isDark
                        ? 'bg-zinc-950 text-zinc-300 border-zinc-800'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                      : isDark
                        ? 'bg-zinc-950/60 text-zinc-500 border-zinc-800/80'
                        : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive 
                      ? isDark ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-white' 
                      : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-700'
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

      <div className={`border rounded-2xl p-6 shadow-xl space-y-6 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className={`border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <Brain className="w-5 h-5" />
                <span>1. Select What This Agent Should Remember</span>
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Configure persistent memory categories for <span className="font-bold">{agent.name}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agent.memoryAreas.map((area) => (
                <div 
                  key={area.id}
                  onClick={() => handleToggleMemoryArea(area.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    area.checked 
                      ? isDark
                        ? 'bg-zinc-800/80 border-white text-white'
                        : 'bg-zinc-100 border-black text-black'
                      : isDark
                        ? 'bg-zinc-950 border-zinc-800 opacity-60 hover:opacity-100'
                        : 'bg-zinc-50 border-zinc-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition ${
                    area.checked 
                      ? isDark ? 'bg-white border-white text-black' : 'bg-black border-black text-white' 
                      : 'border-zinc-500'
                  }`}>
                    {area.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{area.label}</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{area.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button
                onClick={() => setCurrentStep(1)}
                className={`text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md ${
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <span>Next: Knowledge Sources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className={`border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <BookOpen className="w-5 h-5" />
                <span>2. Connect Information Sources Needed by the Agent</span>
              </h2>
            </div>

            <div className="space-y-3">
              {agent.knowledgeSources.map((source) => (
                <div 
                  key={source.id}
                  className={`border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{source.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                        isDark ? 'bg-zinc-900 text-zinc-400 border-zinc-800' : 'bg-zinc-200 text-zinc-700 border-zinc-300'
                      }`}>
                        {source.category}
                      </span>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{source.details}</p>
                    <span className="text-[11px] text-zinc-500 font-mono block">System: {source.system} • Last Synced: {source.lastSynced}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded border font-mono font-medium ${
                      source.status === 'Connected' 
                        ? isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-200 text-black border-zinc-300'
                        : isDark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                    }`}>
                      {source.status}
                    </span>
                    <button
                      onClick={() => handleToggleSourceStatus(source.id)}
                      className={`text-xs border px-3 py-1.5 rounded-lg transition ${
                        isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                      }`}
                    >
                      {source.status === 'Connected' ? 'Disconnect' : 'Connect Source'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button
                onClick={() => setCurrentStep(0)}
                className={`text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(2)}
                className={`text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md ${
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <span>Next: Memory Rules</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className={`border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <Sliders className="w-5 h-5" />
                <span>3. Memory Retention & Scoping Rules</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Memory Retention Window</label>
                <select
                  value={agent.memoryRules.retentionPeriod}
                  onChange={(e) => handleUpdateRules('retentionPeriod', e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-zinc-300'
                  }`}
                >
                  <option value="30 days">30 days (Short-Term)</option>
                  <option value="90 days">90 days (Standard Support Window)</option>
                  <option value="180 days">180 days (AP Fiscal Window)</option>
                  <option value="365 days">365 days (Full Compliance Audit Window)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Recall Confidence Threshold</label>
                <input
                  type="range"
                  min="0.70"
                  max="0.99"
                  step="0.01"
                  value={agent.memoryRules.confidenceThreshold}
                  onChange={(e) => handleUpdateRules('confidenceThreshold', parseFloat(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className={`flex justify-between text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  <span>0.70 (Broad)</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{agent.memoryRules.confidenceThreshold}</span>
                  <span>0.99 (Strict)</span>
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button
                onClick={() => setCurrentStep(1)}
                className={`text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className={`text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md ${
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <span>Next: Review Configuration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className={`border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                <CheckCircle2 className="w-5 h-5" />
                <span>4. Review Agent Configuration</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  <Brain className="w-4 h-4" /> Selected Memory Categories ({agent.memoryAreas.filter(m => m.checked).length})
                </h3>
                <ul className="space-y-1.5 text-xs">
                  {agent.memoryAreas.filter(m => m.checked).map((m) => (
                    <li key={m.id} className={`flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                      <span className="font-bold">✓</span> {m.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  <BookOpen className="w-4 h-4" /> Connected Information Sources
                </h3>
                <ul className="space-y-1.5 text-xs">
                  {agent.knowledgeSources.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-xs">
                      <span>{s.name}</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded border font-mono ${
                        s.status === 'Connected'
                          ? isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-200 text-black border-zinc-300'
                          : isDark ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}>
                        {s.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <button
                onClick={() => setCurrentStep(2)}
                className={`text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className={`text-xs font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg ${
                  isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                <TestTube2 className="w-4 h-4" />
                <span>Proceed to Test Agent</span>
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div>
                <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  <TestTube2 className="w-5 h-5" />
                  <span>Test Interface — {agent.name}</span>
                </h2>
              </div>

              <div className="hidden md:flex items-center gap-1.5">
                <span className={`text-[10px] uppercase font-bold font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Sample Test Queries:</span>
                {agent.testPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendTestMessage(prompt)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition truncate max-w-[180px] ${
                      isDark ? 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`border rounded-xl p-4 flex flex-col h-[520px] ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className="flex-1 overflow-y-auto space-y-4 p-2">
                  {chatLog.map((conv, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-end">
                        <div className={`p-3 rounded-2xl rounded-tr-none text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                          isDark ? 'bg-white text-black' : 'bg-black text-white'
                        }`}>
                          {conv.query}
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className={`border p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[90%] space-y-2 leading-relaxed ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'
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
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
                    }`}>
                      <Brain className="w-4 h-4 animate-spin" />
                      <span>Recalling memory & querying knowledge sources...</span>
                    </div>
                  )}
                </div>

                <div className={`pt-3 border-t flex items-center gap-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTestMessage()}
                    placeholder="Type test query..."
                    className={`flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-zinc-900 text-white border-zinc-800 placeholder-zinc-500' : 'bg-white text-zinc-900 border-zinc-300 placeholder-zinc-400'
                    }`}
                  />
                  <button
                    onClick={() => handleSendTestMessage()}
                    disabled={isTesting || !testInput.trim()}
                    className={`p-2.5 rounded-xl transition ${
                      isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={`border rounded-xl p-4 flex flex-col h-[520px] ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <div className={`flex items-center justify-between border-b pb-3 mb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <h3 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}>
                    <Brain className="w-4 h-4" /> Memory Used
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatLog.length > 0 && chatLog[chatLog.length - 1].memoryUsed.map((mem, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border space-y-2 text-xs ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-[11px]">{mem.category}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                          isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-zinc-100 text-black border-zinc-300'
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
        )}
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
