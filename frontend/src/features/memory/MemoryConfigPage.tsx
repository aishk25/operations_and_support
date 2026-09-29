import React from 'react';
import { Brain, Check, Sliders } from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface MemoryConfigPageProps {
  agent: AgentConfig;
  onUpdateAgent: (agent: AgentConfig) => void;
  agents: AgentConfig[];
  onSelectAgent: (agent: AgentConfig) => void;
  isDark: boolean;
}

export default function MemoryConfigPage({ agent, onUpdateAgent, agents, onSelectAgent, isDark }: MemoryConfigPageProps) {
  if (!agent) return null;

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

  const handleUpdateRules = (field: string, value: any) => {
    onUpdateAgent({
      ...agent,
      memoryRules: {
        ...agent.memoryRules,
        [field]: value
      }
    });
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
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Memory Configuration</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${
                isDark ? 'bg-zinc-950 text-white border-zinc-700' : 'bg-zinc-100 text-zinc-900 border-zinc-300'
              }`}>
                {agent.name}
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Select the memory categories and retention rules appropriate to <span className="font-bold">{agent.name}</span>.
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

      {/* Memory Categories Grid */}
      <div className={`border rounded-2xl p-6 space-y-4 shadow-xl ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className={`border-b pb-3 flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            <Brain className="w-4 h-4" />
            <span>Memory Categories for {agent.name}</span>
          </h2>
          <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {agent.memoryAreas.filter(m => m.checked).length} of {agent.memoryAreas.length} Enabled
          </span>
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
      </div>

      {/* Memory Rules & Settings */}
      <div className={`border rounded-2xl p-6 space-y-6 shadow-xl ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className={`border-b pb-3 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            <Sliders className="w-4 h-4" />
            <span>Memory Rules & Scoping Settings</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Memory Retention Period</label>
            <select
              value={agent.memoryRules.retentionPeriod}
              onChange={(e) => handleUpdateRules('retentionPeriod', e.target.value)}
              className={`w-full text-xs p-3 rounded-xl border focus:outline-none font-mono ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-zinc-300'
              }`}
            >
              <option value="30 days">30 days</option>
              <option value="90 days">90 days</option>
              <option value="180 days">180 days</option>
              <option value="365 days">365 days</option>
            </select>
            <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Specifies how long memory units remain active in Hindsight memory banks.
            </p>
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
      </div>
    </div>
  );
}
