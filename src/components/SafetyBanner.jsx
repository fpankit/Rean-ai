import React from 'react';
import { ShieldCheck, AlertOctagon, HeartPulse, PhoneCall } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <span>Safety Restriction & AI Boundary Guardrails Active</span>
            <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              Non-Clinical
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            This AI assistant does not diagnose medical conditions, provide authoritative legal/financial advice, or replace official emergency 911/112/108 dispatchers.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold text-slate-400">Emergency Hotlines:</span>
        <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px] font-bold">
          112 / 108 / 911
        </span>
      </div>
    </div>
  );
}
