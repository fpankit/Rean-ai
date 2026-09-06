import React from 'react';
import { CheckCircle2, Circle, AlertCircle, ListChecks, MapPin, Phone, User, Tag, AlertTriangle } from 'lucide-react';

export default function SlotChecklist({ slots = {}, currentStep = "GREETING", slotLabels = null }) {
  const DEFAULT_SLOTS = [
    { key: 'name', label: 'Caller Name', icon: User, value: slots.name },
    { key: 'contact', label: 'Contact Phone / ID', icon: Phone, value: slots.contact },
    { key: 'category', label: 'Primary Issue Category', icon: Tag, value: slots.category },
    { key: 'location', label: 'Location / Area', icon: MapPin, value: slots.location },
  ];

  const slotItems = slotLabels
    ? slotLabels.map((s, idx) => {
        const iconMap = [User, Phone, Tag, MapPin];
        return {
          key: s.key,
          label: s.label,
          icon: iconMap[idx] || Tag,
          value: slots[s.key],
        };
      })
    : DEFAULT_SLOTS;

  const totalFilled = slotItems.filter(item => Boolean(item.value)).length;
  const progressPercent = Math.round((totalFilled / slotItems.length) * 100);

  return (
    <div className="bg-[#0A0D14] rounded-3xl border border-slate-800/80 backdrop-blur-xl p-5 space-y-4 shadow-xl">
      {/* Header & Progress */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Information Collection Status</h3>
        </div>
        <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
          {progressPercent}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-2.5 pt-1">
        {slotItems.map((item) => {
          const Icon = item.icon;
          const isFilled = Boolean(item.value);

          return (
            <div
              key={item.key}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                isFilled
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  isFilled ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </div>
                  <div className={`text-xs font-medium mt-0.5 ${
                    isFilled ? 'text-slate-100 font-bold' : 'text-slate-500 italic'
                  }`}>
                    {item.value || 'Pending capture...'}
                  </div>
                </div>
              </div>

              {isFilled ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Status Footer */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Critical Details Confirmation:</span>
        {slots.confirmed ? (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        ) : currentStep === 'CONFIRMING' ? (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[11px] animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Awaiting Confirmation
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[11px]">
            Unconfirmed
          </span>
        )}
      </div>
    </div>
  );
}
