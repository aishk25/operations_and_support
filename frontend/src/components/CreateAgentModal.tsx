import React, { useState } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import { AgentConfig } from '../constants/agents';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAgent: (agent: AgentConfig) => void;
  isDark: boolean;
}

export default function CreateAgentModal({ isOpen, onClose, onCreateAgent, isDark }: CreateAgentModalProps) {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [domain, setDomain] = useState<string>('Customer Support');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const newAgent: AgentConfig = {
      id: `agent-${Date.now()}`,
      name: name,
      iconName: "Bot",
      status: isDark ? "In Setup bg-zinc-800 text-zinc-200 border-zinc-700" : "In Setup bg-zinc-200 text-zinc-800 border-zinc-300",
      statusCode: "setup",
      description: description,
      setupProgress: 20,
      setupSteps: { memory: true, knowledge: false, rules: false, reviewed: false, tested: false },
      memoryAreas: [
        { id: "mem-1", label: "Domain history", description: "Past interaction logs and customer history", checked: true },
        { id: "mem-2", label: "Known exceptions", description: "Recorded edge cases and resolutions", checked: true }
      ],
      knowledgeSources: [
        { id: "src-1", name: `${name} Knowledge Base`, system: "Internal Docs RAG", status: "Connected", statusColor: isDark ? "text-white bg-zinc-800 border-zinc-700" : "text-black bg-zinc-200 border-zinc-300", category: "Documentation", lastSynced: "Just now", details: "Initial knowledge index created." }
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold">Create Account & New Agent</h2>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Define agent name and purpose to initialize setup.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold">Agent / Account Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sales Intelligence Agent"
              className={`w-full p-3 rounded-xl border focus:outline-none ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800 placeholder-zinc-500' : 'bg-zinc-50 text-zinc-900 border-zinc-300 placeholder-zinc-400'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold">Domain Function</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-zinc-300'
              }`}
            >
              <option>Customer Support</option>
              <option>Accounts Payable</option>
              <option>Compliance & Audit</option>
              <option>Operations & Supply Chain</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold">Short Purpose / Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent should remember and accomplish..."
              className={`w-full p-3 rounded-xl border focus:outline-none ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800 placeholder-zinc-500' : 'bg-zinc-50 text-zinc-900 border-zinc-300 placeholder-zinc-400'
              }`}
            />
          </div>

          <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl transition ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`font-semibold px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 ${
                isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
