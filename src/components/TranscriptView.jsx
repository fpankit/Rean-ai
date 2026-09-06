import React, { useRef, useEffect } from 'react';
import { User, Bot, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TranscriptView({ transcripts = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <div className="flex flex-col h-[480px] bg-[#0A0D14] rounded-3xl border border-slate-800/80 backdrop-blur-xl p-5 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Live Conversation Stream</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          {transcripts.length} Messages
        </span>
      </div>

      {/* Transcript List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {transcripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-2">
            <Bot className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="text-xs font-medium">No live speech detected yet.</p>
            <p className="text-[11px] text-slate-600 max-w-xs">
              Click "Start Live Call" or trigger a demo scenario to begin multilingual voice testing.
            </p>
          </div>
        ) : (
          transcripts.map((item, idx) => (
            <div
              key={idx}
              className={`flex gap-3 animate-fadeIn ${
                item.speaker === 'agent' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Speaker Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                item.speaker === 'agent'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                  : 'bg-sky-600 text-white shadow-sky-600/30'
              }`}>
                {item.speaker === 'agent' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[82%] space-y-1.5 ${
                item.speaker === 'agent' ? 'items-start' : 'items-end'
              }`}>
                {/* Speaker Header Info */}
                <div className={`flex items-center gap-2 text-[11px] font-medium text-slate-400 ${
                  item.speaker === 'agent' ? 'justify-start' : 'justify-end'
                }`}>
                  <span className="font-semibold text-slate-200">
                    {item.speaker === 'agent' ? 'Rean AI (Wi-Fi Support)' : 'Caller'}
                  </span>

                  {item.language && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                      {item.language}
                    </span>
                  )}

                  {item.confidence && item.speaker === 'caller' && (
                    <span className={`text-[10px] font-mono font-semibold ${
                      item.confidence > 75 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {item.confidence}% confidence
                    </span>
                  )}

                  <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                </div>

                {/* Message Box */}
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                  item.isSafetyAlert
                    ? 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
                    : item.speaker === 'agent'
                    ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                    : 'bg-indigo-600/90 text-white rounded-tr-none shadow-indigo-600/20'
                }`}>
                  {item.isSafetyAlert && (
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1 text-[11px]">
                      <ShieldAlert className="w-4 h-4" />
                      <span>SAFETY RESTRICTION TRIGGERED</span>
                    </div>
                  )}
                  <p>{item.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
