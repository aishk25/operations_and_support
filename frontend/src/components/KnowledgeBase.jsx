import React, { useState, useEffect } from 'react';
import { BookOpen, Search, FileText, CheckCircle2, Shield, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const data = await api.getKnowledgeDocs();
    setDocs(data);
    if (data.length > 0) setSelectedDoc(data[0]);
  };

  const filteredDocs = docs.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.summary.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center glow-sky">
            <BookOpen className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Company Knowledge Base (RAG Layer)</h2>
            <p className="text-xs text-slate-400 mt-1">
              RAG provides company documentation & policies. Hindsight provides personal customer experience memory.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documentation..."
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main Content split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Docs List */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full p-4 rounded-xl border text-left transition space-y-1.5 ${
                  isSelected 
                    ? 'bg-slate-900 border-sky-500 shadow-md glow-sky' 
                    : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800/50 px-2 py-0.5 rounded font-mono">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{doc.id}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{doc.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Doc Reader */}
        {selectedDoc && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-sky-400 font-semibold">{selectedDoc.category} Document</span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedDoc.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedDoc.summary}</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
              <p className="font-semibold text-white">Full Article Content:</p>
              <p>{selectedDoc.content}</p>
              <p className="text-slate-400 text-xs pt-3 border-t border-slate-800">
                Note: When answering support queries, the Support Agent combines information from this Knowledge Base with Hindsight customer experience memory.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
