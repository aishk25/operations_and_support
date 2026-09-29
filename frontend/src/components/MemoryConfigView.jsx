import React from 'react';
import { Brain, Check, Sliders, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MemoryConfigView({ agent, onUpdateAgent, agents, onSelectAgent }) {
  if (!agent) return null;

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

  const handleUpdateRules = (field, value) => {
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Memory Configuration</h1>
              <span className="bg-purple-950 text-purple-300 border border-purple-800/60 text-xs px-2.5 py-0.5 rounded-full font-mono">
                {agent.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select the memory categories and retention rules appropriate to <span className="text-blue-300 font-semibold">{agent.name}</span>.
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

      {/* Memory Categories Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Memory Categories for {agent.name}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
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
      </div>

      {/* Memory Rules & Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Memory Rules & Scoping Settings</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Memory Retention Period</label>
            <select
              value={agent.memoryRules.retentionPeriod}
              onChange={(e) => handleUpdateRules('retentionPeriod', e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 font-mono"
            >
              <option value="30 days">30 days</option>
              <option value="90 days">90 days</option>
              <option value="180 days">180 days</option>
              <option value="365 days">365 days</option>
            </select>
            <p className="text-[11px] text-slate-500">Specifies how long memory units remain active in Hindsight memory banks.</p>
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
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>0.70 (Broad)</span>
              <span className="text-purple-400 font-bold">{agent.memoryRules.confidenceThreshold}</span>
              <span>0.99 (Strict)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
