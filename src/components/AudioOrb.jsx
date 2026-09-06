import React from 'react';
import { Mic, Volume2, ShieldCheck, Activity, Zap, VolumeX, Sparkles } from 'lucide-react';

export default function AudioOrb({ 
  isSpeaking, 
  isListening, 
  isCallActive, 
  volume = 0, 
  noiseLevel = "Clean Signal",
  confidenceScore = 88,
  detectedLanguages = ["English"],
  isCodeSwitched = false,
  isBargeIn = false
}) {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#0A0D14] rounded-3xl border border-slate-800/80 backdrop-blur-xl space-y-6 overflow-hidden shadow-2xl">
      {/* Background Ambient Glow */}
      <div className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-25 ${
        isSpeaking 
          ? 'bg-cyan-500 scale-125' 
          : isListening 
          ? 'bg-indigo-500 scale-110' 
          : 'bg-purple-900 scale-90'
      }`}></div>

      {/* Language & Code-Switch Header Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 z-10">
        {detectedLanguages.map((lang, idx) => (
          <span 
            key={idx} 
            className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5 shadow-sm"
          >
            <span>{lang === 'Hindi' ? '🇮🇳 Hindi' : lang === 'French' ? '🇫🇷 French' : lang === 'Spanish' ? '🇪🇸 Spanish' : '🇺🇸 English'}</span>
          </span>
        ))}

        {isCodeSwitched && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1 shadow-sm animate-pulse">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Code-Switched Stream</span>
          </span>
        )}
      </div>

      {/* Main Concentric Orbital Rings & AI Voice Orb */}
      <div className="relative z-10 flex items-center justify-center py-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Concentric Outer Orbital Ring 3 */}
          <div className={`absolute inset-0 rounded-full border border-purple-900/40 bg-purple-950/10 transition-all duration-700 ${
            isSpeaking ? 'scale-110 border-cyan-500/30' : 'scale-100'
          }`}></div>

          {/* Concentric Middle Orbital Ring 2 */}
          <div className={`absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border border-indigo-800/40 bg-indigo-950/20 transition-all duration-500 ${
            isListening ? 'scale-105 border-indigo-500/40' : 'scale-100'
          }`}></div>

          {/* Concentric Inner Ring 1 */}
          <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-purple-600/40 bg-gradient-to-tr from-purple-900/30 to-indigo-900/30"></div>

          {/* Central Sphere */}
          <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative cursor-pointer ${
            !isCallActive
              ? 'bg-slate-900 border-2 border-slate-800 shadow-inner'
              : isSpeaking
              ? 'bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 shadow-cyan-400/50 scale-105 ring-4 ring-cyan-400/30'
              : isListening
              ? 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 shadow-indigo-500/60 scale-100 ring-4 ring-indigo-500/30'
              : 'bg-slate-900 border-2 border-slate-800'
          }`}>
            <div className="flex flex-col items-center justify-center space-y-1 text-white">
              {isSpeaking ? (
                <>
                  <Volume2 className="w-9 h-9 animate-bounce text-cyan-200" />
                  <span className="text-[9px] font-extrabold tracking-wider uppercase opacity-90">AI Agent Speaking</span>
                </>
              ) : isListening ? (
                <>
                  <Mic className="w-9 h-9 text-white animate-pulse" />
                  <span className="text-[9px] font-extrabold tracking-wider uppercase opacity-90">Listening...</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-8 h-8 text-slate-500" />
                  <span className="text-[9px] font-semibold text-slate-400">Standby</span>
                </>
              )}
            </div>
          </div>

          {/* Floating Pill Tag (Matching Retell Voice Model: 'Your AI Agent (Retell Nico)') */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3.5 py-1 rounded-full bg-black border border-slate-800 backdrop-blur-md shadow-xl text-[11px] font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`}></span>
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Your AI Agent (Retell Nico)</span>
          </div>

          {/* Barge-In Notification Ring */}
          {isBargeIn && (
            <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping"></div>
          )}
        </div>
      </div>

      {/* Frequency Wave Visualizer Bars */}
      <div className="flex items-center gap-1.5 h-8 z-10 pt-2">
        {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70].map((h, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isCallActive && (isSpeaking || isListening)
                ? 'bg-gradient-to-t from-cyan-400 to-indigo-500'
                : 'bg-slate-800'
            }`}
            style={{
              height: isCallActive && (isSpeaking || isListening)
                ? `${Math.max(6, (h * (volume || 40)) / 100)}px`
                : '6px'
            }}
          ></div>
        ))}
      </div>

      {/* Audio Signal Metrics Footer */}
      <div className="w-full grid grid-cols-2 gap-3 z-10 pt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-black border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Voice Confidence</div>
            <div className={`text-sm font-bold mt-0.5 font-mono ${
              confidenceScore > 75 ? 'text-emerald-400' : confidenceScore > 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {confidenceScore}%
            </div>
          </div>
          <ShieldCheck className={`w-5 h-5 ${
            confidenceScore > 75 ? 'text-emerald-400' : 'text-amber-400'
          }`} />
        </div>

        <div className="p-3 rounded-2xl bg-black border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Noise Environment</div>
            <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate max-w-[120px]">
              {noiseLevel}
            </div>
          </div>
          <Activity className="w-5 h-5 text-cyan-400" />
        </div>
      </div>
    </div>
  );
}
