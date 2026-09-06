import React, { useState } from 'react';
import { 
  Radio, Sparkles, Sliders, Shield, Bot, Layout, 
  ExternalLink, PhoneCall, Key, CheckCircle, Flame, Home
} from 'lucide-react';
import CallerStudio from './CallerStudio';
import RetellAgentStudio from './RetellAgentStudio';
import AgoraModal from './AgoraModal';
import { getStoredAgoraConfig } from '../agora/agoraConfig';
import { getStoredRetellConfig } from '../voiceEngine/retellConfig';

export default function VoiceStudioPage() {
  const [activeView, setActiveView] = useState('interactive'); // 'interactive' | 'prompt_studio' | 'dual'
  const [isAgoraModalOpen, setIsAgoraModalOpen] = useState(false);
  const [agoraConfig, setAgoraConfig] = useState(getStoredAgoraConfig());
  const [retellConfig, setRetellConfig] = useState(getStoredRetellConfig());

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 font-['Outfit',sans-serif] flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Banner & Header Navigation */}
      <div className="w-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <Sparkles className="w-3.5 h-3.5 shrink-0 animate-spin" />
        <span>Dedicated Voice Studio Workspace • Retell AI Voice Engine & Agora RTC Enabled</span>
      </div>

      <header className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            title="Go to Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight font-['Samsung_Sharp_Sans',sans-serif] flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
                rean <span className="text-cyan-400 font-light">AI</span>
                <span className="text-xs font-normal text-slate-400">| Voice Studio</span>
              </h1>
            </div>
          </button>
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('interactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'interactive'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Interactive Voice Call Studio (Dark UI)</span>
          </button>

          <button
            onClick={() => setActiveView('prompt_studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'prompt_studio'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Retell AI System Prompt & Agent Config</span>
          </button>

          <button
            onClick={() => setActiveView('dual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'dual'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Dual Studio View</span>
          </button>
        </div>

        {/* Right Credentials Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:text-white transition"
            title="Return to Home page"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setIsAgoraModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agora Config</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 bg-black p-4 lg:p-6">
        {activeView === 'interactive' && (
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                  Interactive Multilingual Voice Studio
                </h2>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Test live voice calling, background noise suppression, speech code-switching, and safety guardrails
                </p>
              </div>
            </div>
            <CallerStudio />
          </div>
        )}

        {activeView === 'prompt_studio' && (
          <div className="w-full max-w-7xl mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <RetellAgentStudio />
          </div>
        )}

        {activeView === 'dual' && (
          <div className="w-full space-y-6">
            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" /> Retell AI System Prompt & Role Purpose Editor
                </span>
                <span className="text-slate-500 font-mono">PORT 3002 • Voice: retell-Nico</span>
              </div>
              <RetellAgentStudio />
            </div>

            <div className="max-w-7xl mx-auto space-y-4 pt-4 border-t border-slate-900">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-cyan-400" />
                <span>Live Interactive Voice Call Testing Sandbox</span>
              </h3>
              <CallerStudio />
            </div>
          </div>
        )}
      </main>

      {/* Agora Credentials Modal */}
      <AgoraModal
        isOpen={isAgoraModalOpen}
        onClose={() => setIsAgoraModalOpen(false)}
        onSave={(newConfig) => setAgoraConfig(newConfig)}
      />
    </div>
  );
}
