import React, { useState } from 'react';
import { X, Plus, Bot, Brain } from 'lucide-react';

export default function CreateAgentModal({ isOpen, onClose, onCreateAgent }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Customer Support');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const newAgent = {
      id: `agent-${Date.now()}`,
      name: name,
      iconName: "Bot",
      status: "In Setup bg-indigo-950 text-indigo-300 border-indigo-800/60",
      statusCode: "setup",
      description: description,
      setupProgress: 20,
      setupSteps: { memory: true, knowledge: false, rules: false, reviewed: false, tested: false },
      memoryAreas: [
        { id: "mem-1", label: "Domain history", description: "Past interaction logs and customer history", checked: true },
        { id: "mem-2", label: "Known exceptions", description: "Recorded edge cases and resolutions", checked: true }
      ],
      knowledgeSources: [
        { id: "src-1", name: `${name} Knowledge Base`, system: "Internal Docs RAG", status: "Connected", statusColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50", category: "Documentation", lastSynced: "Just now", details: "Initial knowledge index created." }
      ],
      memoryRules: { retentionPeriod: "90 days", confidenceThreshold: 0.85, customerScoping: true, autoRetainOutcomes: true },
      testPrompts: [`How does ${name} process user requests?`],
      conversations: [
        {
          query: `How does ${name} process user requests?`,
          response: `I am configured as ${name}. I use Hindsight memory to recall past interactions and knowledge sources to provide context-aware answers.`,
          memoryUsed: [{ category: "Domain history", title: "Initial Agent Setup Log", detail: "Configured new workspace agent.", confidence: "0.95" }]
        }
      ]
    };

    onCreateAgent(newAgent);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Create New Workspace Agent</h2>
            <p className="text-xs text-slate-400">Define agent name and purpose to initialize setup.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Agent Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sales Intelligence Agent"
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Domain Function</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option>Customer Support</option>
              <option>Accounts Payable</option>
              <option>Compliance & Audit</option>
              <option>Operations & Supply Chain</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Short Purpose / Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent should remember and accomplish..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white px-4 py-2 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Initialize Agent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
