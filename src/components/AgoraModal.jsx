import React, { useState, useEffect } from 'react';
import { X, Key, Radio, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { getStoredAgoraConfig, saveAgoraConfig } from '../agora/agoraConfig';

export default function AgoraModal({ isOpen, onClose, onSave }) {
  const [config, setConfig] = useState(getStoredAgoraConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredAgoraConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAgoraConfig(config);
    setSavedSuccess(true);
    if (onSave) onSave(config);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#131B2E] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Agora Conversational AI Settings</h3>
              <p className="text-xs text-slate-400">Configure Agora App ID and RTC Channel credentials</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Agora App ID</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 4a8b...129c"
              value={config.appId}
              onChange={(e) => setConfig({ ...config, appId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono placeholder:text-slate-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">Leave empty to use built-in browser speech & WebAudio simulation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">RTC Channel Name</label>
              <input
                type="text"
                value={config.channelName}
                onChange={(e) => setConfig({ ...config, channelName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agora Agent ID (Optional)</label>
              <input
                type="text"
                placeholder="agent-xyz-101"
                value={config.agentId || ''}
                onChange={(e) => setConfig({ ...config, agentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Temporary RTC Token (If Required)</label>
            <textarea
              rows={2}
              placeholder="Paste Agora RTC Token if primary authentication is enabled..."
              value={config.token}
              onChange={(e) => setConfig({ ...config, token: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono placeholder:text-slate-600 resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
            <Radio className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              When Agora credentials are provided, Echosphere automatically connects to Agora RTC channels for low-latency voice streaming with Agora Conversational AI agents.
            </span>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Agora settings saved successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
