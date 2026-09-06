import React from 'react';
import { Radio, ArrowUpRight, Sparkles, Home } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenAgoraModal, 
  agoraConnected, 
  firebaseConnected,
  isCallActive,
  onScrollToStudio
}) {
  const handleGoHome = () => {
    setActiveTab('caller');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-black">
      {/* Top Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-black text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>New Release: Real-Time Multilingual Code-Switching Engine with Instant Human Escalation</span>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-black/95 backdrop-blur-xl border-b border-slate-900 px-6 lg:px-12 py-4 flex items-center justify-between gap-6">
        {/* Left: Brand Logo (Clickable -> Home) */}
        <button
          onClick={handleGoHome}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          title="Go to Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white tracking-tight font-['Samsung_Sharp_Sans',sans-serif] group-hover:text-cyan-400 transition-colors">
              rean <span className="text-cyan-400 font-light">AI</span>
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full uppercase">
              Engine v2.4
            </span>
          </div>
        </button>

        {/* Center: All Nav Links Centered */}
        <nav className="hidden lg:flex items-center justify-center gap-8 text-base font-bold font-['Samsung_Sharp_Sans',sans-serif]">
          <button
            onClick={handleGoHome}
            className={`flex items-center gap-1.5 transition ${
              activeTab === 'caller'
                ? 'text-cyan-400 font-extrabold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              window.open('/voice-studio', '_blank', 'width=1440,height=900,resizable=yes,scrollbars=yes');
            }}
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Voice Studio ↗
          </button>

          <button
            onClick={() => setActiveTab('supervisor')}
            className={`transition ${
              activeTab === 'supervisor'
                ? 'text-cyan-400 font-extrabold border-b-2 border-cyan-400 pb-0.5'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Supervisor Desk
          </button>

          <a href="#products" className="text-slate-300 hover:text-cyan-400 transition">
            Our Products
          </a>

          <a href="#features" className="text-slate-300 hover:text-cyan-400 transition">
            Capabilities
          </a>

          <button
            onClick={onOpenAgoraModal}
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Agora Config
          </button>
        </nav>

        {/* Right: Primary Action CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.open('/voice-studio', '_blank', 'width=1440,height=900,resizable=yes,scrollbars=yes');
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-white hover:bg-slate-200 text-black text-sm font-black font-['Samsung_Sharp_Sans',sans-serif] shadow-lg shadow-white/10 transition transform hover:scale-105"
          >
            <span>Try Voice Agent</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </header>
    </div>
  );
}
