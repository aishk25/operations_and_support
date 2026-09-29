import React, { useState } from 'react';
import { Settings, Key, Database, Shield, Download, CheckCircle2 } from 'lucide-react';

export default function SettingsView({ agent, agents }) {
  const [apiKey, setApiKey] = useState('hin_live_98a72b3c4d5e6f7a');
  const [baseUrl, setBaseUrl] = useState('https://api.hindsight.vectorize.io');
  const [bankId, setBankId] = useState('enterprise_workspace_bank_01');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportConfig = () => {
    const configJson = JSON.stringify(agents, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hindsight-agents-config.json';
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Workspace Settings</h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure Hindsight memory connection, tenant security scoping, and export configurations.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportConfig}
          className="bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Export Agents JSON Config</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Hindsight API & Memory Bank Credentials</span>
          </h2>
          {saved && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-300">Hindsight API Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-300">Default Hindsight Memory Bank ID</label>
            <input
              type="text"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="font-semibold text-slate-300">Hindsight API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-md shadow-blue-600/20"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
