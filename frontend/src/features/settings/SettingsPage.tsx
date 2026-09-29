import React, { useState } from 'react';
import { Settings, Key, Download, CheckCircle2 } from 'lucide-react';
import { AgentConfig } from '../../constants/agents';

interface SettingsPageProps {
  agent: AgentConfig;
  agents: AgentConfig[];
  isDark: boolean;
}

export default function SettingsPage({ agent, agents, isDark }: SettingsPageProps) {
  const [apiKey, setApiKey] = useState<string>('hin_live_98a72b3c4d5e6f7a');
  const [baseUrl, setBaseUrl] = useState<string>('https://api.hindsight.vectorize.io');
  const [bankId, setBankId] = useState<string>('enterprise_workspace_bank_01');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
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
      <div className={`border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl transition-colors duration-200 ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-300 text-black'
          }`}>
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Workspace Settings</h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Configure Hindsight memory connection, tenant security scoping, and export configurations.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportConfig}
          className={`border text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            isDark ? 'bg-zinc-950 hover:bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border-zinc-300'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Export Agents JSON Config</span>
        </button>
      </div>

      <form onSubmit={handleSave} className={`border rounded-2xl p-6 space-y-6 shadow-xl ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className={`border-b pb-3 flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            <Key className="w-4 h-4" />
            <span>Hindsight API & Memory Bank Credentials</span>
          </h2>
          {saved && (
            <span className={`text-xs font-mono flex items-center gap-1 font-semibold ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Hindsight API Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none font-mono ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-zinc-300'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Default Hindsight Memory Bank ID</label>
            <input
              type="text"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none font-mono ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-zinc-300'
              }`}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Hindsight API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none font-mono ${
                isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-zinc-50 text-zinc-900 border-zinc-300'
              }`}
            />
          </div>
        </div>

        <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <button
            type="submit"
            className={`font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-md ${
              isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
