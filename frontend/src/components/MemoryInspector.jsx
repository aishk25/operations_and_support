import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Brain, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Layers, 
  Zap, 
  RefreshCw,
  Filter,
  Tag
} from 'lucide-react';
import { api } from '../services/api';

export default function MemoryInspector({ customer }) {
  const [memories, setMemories] = useState([]);
  const [testQuery, setTestQuery] = useState('');
  const [recallResults, setRecallResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchMemories();
  }, [customer.id]);

  const fetchMemories = async () => {
    const data = await api.getMemories(customer.id);
    setMemories(data);
  };

  const handleTestRecall = async () => {
    if (!testQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.testRecall(customer.id, testQuery);
      setRecallResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredMemories = memories.filter(m => {
    if (filter === 'SUCCESS') return m.attempts.some(a => a.result === 'SUCCESSFUL');
    if (filter === 'FAILED') return m.attempts.some(a => a.result === 'FAILED');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center glow-purple">
            <Brain className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Hindsight Persistent Memory Bank</h2>
              <span className="bg-purple-900/60 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
                Customer: {customer.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Inspecting long-term remembered experiences, attempted solutions, environmental context, and outcome histories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-slate-400">Total Memory Units:</span>
          <span className="text-sm font-bold font-mono text-purple-300">{memories.length}</span>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Hindsight Recall Tester */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Live Memory Recall Tester</h3>
          </div>

          <p className="text-xs text-slate-400">
            Type any issue phrase to simulate how Hindsight vector recall fetches past troubleshooting memories for <span className="text-indigo-300 font-semibold">{customer.name}</span>.
          </p>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTestRecall()}
                placeholder="e.g. payment failed, 429 rate limit..."
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleTestRecall}
                disabled={isSearching || !testQuery.trim()}
                className="absolute right-1.5 top-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1 rounded-lg transition"
              >
                {isSearching ? 'Querying...' : 'Recall'}
              </button>
            </div>
          </div>

          {/* Recall Output */}
          {recallResults && (
            <div className="mt-4 space-y-3 bg-slate-950 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Hindsight Recall Results
                </span>
                <span className="text-slate-500 font-mono text-[10px]">Query: "{recallResults.query}"</span>
              </div>

              {recallResults.matches.length > 0 ? (
                recallResults.matches.map((m, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{m.topic}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800/40">
                        Score: {(m.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{m.summary}</p>
                    <div className="text-[10px] text-purple-300 font-mono">
                      Working Fix: {m.attempts.find(a => a.result === 'SUCCESSFUL')?.action || 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No matching memories found for this query.</p>
              )}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Stored Customer Memory Units */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Customer Memory Vault</span>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {['ALL', 'SUCCESS', 'FAILED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                    filter === f 
                      ? 'bg-purple-600 text-white font-semibold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Memory Cards */}
          <div className="space-y-4">
            {filteredMemories.map((mem) => (
              <div 
                key={mem.id}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 space-y-4 transition shadow-md"
              >
                {/* Memory Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                    <h4 className="text-sm font-bold text-white">{mem.topic}</h4>
                    <span className="bg-purple-950 text-purple-300 border border-purple-700/50 text-[10px] px-2 py-0.5 rounded font-mono">
                      {mem.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(mem.timestamp).toLocaleDateString()}
                    </span>
                    <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/40 text-[10px] px-2 py-0.5 rounded font-mono">
                      Recalled {mem.recall_count}x
                    </span>
                  </div>
                </div>

                {/* Summary & Environment */}
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-semibold text-slate-200">Memory Summary: </span>
                    {mem.summary}
                  </p>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] px-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span>Environment Context: {mem.environment}</span>
                  </div>
                </div>

                {/* Attempted Actions & Outcomes */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Recorded Solution Steps & Outcomes:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {mem.attempts.map((att, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 ${
                          att.result === 'SUCCESSFUL'
                            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                            : 'bg-red-950/30 border-red-800/50 text-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1 text-[11px]">
                            {att.result === 'SUCCESSFUL' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            {att.result}
                          </span>
                          <span className="text-[10px] font-mono opacity-80">Step #{idx + 1}</span>
                        </div>
                        
                        <p className="font-medium text-white text-xs">{att.action}</p>
                        {att.note && <p className="text-[10px] opacity-75 font-mono">{att.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
