import React, { useState } from 'react';
import { 
  Radio, Bot, UserCheck, Home, Shield, Zap, Sparkles, Activity, 
  Cpu, Sliders, Globe, RefreshCw, CheckCircle2, Lock, ArrowRight,
  ArrowUpRight, PhoneCall, Mic, Volume2, Layers, Wifi, Smartphone,
  Server, Clock, SlidersHorizontal, Check, X
} from 'lucide-react';

export default function ProductsSection({ onStartDemoCall, onOpenAgoraModal }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'agora-conversational-ai',
      title: 'Conversational AI using Agora',
      shortTitle: 'Agora Voice AI Engine',
      category: 'REAL-TIME TELEPHONY & STREAMING',
      badge: 'Powered by Agora RTC',
      badgeColor: 'from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30',
      accentGradient: 'from-cyan-500 via-sky-400 to-indigo-500',
      icon: Radio,
      tagline: 'Sub-200ms bi-directional streaming voice agent over global RTC channels.',
      description: 'Enterprise voice AI infrastructure built directly on Agora Real-Time Engagement (RTC) network. Deliver human-like conversational experiences with instant speech barge-in, background noise suppression, sub-second multilingual code-switching, and live fallback to human supervisor desks.',
      features: [
        {
          title: 'Ultra-Low Latency Voice Streaming',
          desc: 'Sub-200ms round-trip voice processing over Agora global edge servers for smooth, natural back-and-forth dialogue.'
        },
        {
          title: 'Multilingual & Code-Switching Speech',
          desc: 'Dynamic speech recognition instantly handles mid-sentence switches between English, Hindi, Hinglish, Spanish, and French.'
        },
        {
          title: 'Real-Time Interruption & Noise Cancelation',
          desc: 'Integrated Web Audio bandpass filters eliminate background street noise while full barge-in allows callers to interrupt anytime.'
        },
        {
          title: 'Human Supervisor Escalation Workspace',
          desc: 'Automatic low-confidence detection escalates calls seamlessly to human desk operators with live conversation state sync.'
        }
      ],
      metrics: [
        { label: 'Latency', value: '< 200ms' },
        { label: 'Languages', value: '15+ Languages' },
        { label: 'RTC Uptime', value: '99.99%' },
        { label: 'Noise Cutoff', value: '24 dB' }
      ],
      ctaText: 'Test Agora Voice Call',
      ctaAction: 'agora'
    },
    {
      id: 'jarvis-ai-assistant',
      title: 'Jarvis — AI Real-Time Assistant',
      shortTitle: 'Jarvis Autonomous Assistant',
      category: '24/7 AUTONOMOUS EXECUTIVE DELEGATE',
      badge: 'When You Are Away',
      badgeColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
      accentGradient: 'from-purple-500 via-indigo-400 to-cyan-400',
      icon: UserCheck,
      tagline: 'Your personal AI proxy that answers calls, screens visitors, and acts on your behalf 24/7.',
      description: 'Jarvis is an intelligent real-time executive voice assistant designed to operate when you are offline, in meetings, or sleeping. It answers incoming calls with customized voice persona, collects complex caller requirements, schedules calendar slots, screens spam, and sends instant push/SMS briefings to your device.',
      features: [
        {
          title: 'Autonomous Call Screening & Intake',
          desc: 'Jarvis introduces itself, evaluates the intent of callers, answers complex business or personal queries, and collects required slot checklists.'
        },
        {
          title: 'Calendar & Appointment Automation',
          desc: 'Integrates with your calendar to verify availability, negotiate times with callers, and send instant booking confirmations.'
        },
        {
          title: 'Real-Time SMS & Push Briefings',
          desc: 'Generates structured bulleted summaries, sentiment analysis, and audio replays delivered straight to your phone right after calls.'
        },
        {
          title: 'VIP Priority & Emergency Intercept',
          desc: 'Recognizes urgent situations or emergency numbers to instantly ring your phone or trigger real-time escalation overrides.'
        }
      ],
      metrics: [
        { label: 'Availability', value: '24/7 Always On' },
        { label: 'Screening', value: '100% Autonomous' },
        { label: 'Briefing Time', value: '< 5 Seconds' },
        { label: 'Slot Accuracy', value: '99.4%' }
      ],
      ctaText: 'Explore Jarvis Delegate',
      ctaAction: 'jarvis'
    },
    {
      id: 'home-voice-automation',
      title: 'Home Voice Automation',
      shortTitle: 'Smart Home Voice Engine',
      category: 'EDGE & CLOUD AMBIENT IOT CONTROL',
      badge: 'Smart Room Intelligence',
      badgeColor: 'from-amber-500/20 to-emerald-500/20 text-amber-400 border-amber-500/30',
      accentGradient: 'from-amber-400 via-emerald-400 to-cyan-400',
      icon: Home,
      tagline: 'Context-aware voice control system for smart home environments and IoT ecosystems.',
      description: 'Transform your physical environment with zero-latency voice automation. Controls HVAC climate, spatial lighting, security cameras, smart locks, and appliances through local wake-word detection, spatial room awareness, and predictive automated routines.',
      features: [
        {
          title: 'Local Edge Voice Trigger & Offline Hotwords',
          desc: 'Runs ultra-fast wake-word engines locally for immediate execution even during internet outages or cloud network drops.'
        },
        {
          title: 'Spatial Multi-Room Voice Sync',
          desc: 'Understands room location based on microphone array feeds so saying "turn off lights" targets only the room you are currently in.'
        },
        {
          title: 'Security & Sensor Voice Alarms',
          desc: 'Monitors door locks, motion detectors, and camera feeds to speak verbal security announcements and alert home occupants.'
        },
        {
          title: 'Custom IoT Workflow Routines',
          desc: 'Chain complex home events together—such as "Good Night Mode"—to lock doors, dim lights, adjust thermostat, and arm security.'
        }
      ],
      metrics: [
        { label: 'Local Trigger', value: '< 50ms Edge' },
        { label: 'Protocol', value: 'Zigbee/Matter/WiFi' },
        { label: 'Privacy', value: 'Offline On-Device' },
        { label: 'Sync Range', value: 'Multi-Room' }
      ],
      ctaText: 'View Home Voice Specs',
      ctaAction: 'home'
    }
  ];

  return (
    <section id="products" className="py-12 bg-black border-t border-slate-900 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-black text-cyan-400 tracking-wider uppercase shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>OUR PRODUCT ECOSYSTEM</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Enterprise Voice AI <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Suite & Products
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
          Explore our powerful core voice solutions—from ultra-low latency RTC conversational streaming to autonomous AI executive delegation and smart home automation.
        </p>
      </div>

      {/* 3 Main Product Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 sm:px-4 max-w-7xl mx-auto">
        {products.map((prod) => {
          const IconComponent = prod.icon;
          return (
            <div 
              key={prod.id}
              className="relative rounded-3xl bg-[#07090E] border border-slate-800/80 hover:border-slate-600 transition-all duration-300 p-7 flex flex-col justify-between group shadow-2xl hover:shadow-cyan-950/20"
            >
              {/* Top Card Gradient Glow Accent */}
              <div className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${prod.accentGradient} opacity-60 group-hover:opacity-100 transition-opacity`}></div>

              <div className="space-y-6">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-lg">
                    <IconComponent className="w-6 h-6 text-slate-100" />
                  </div>

                  <span className={`px-3 py-1 text-[11px] font-extrabold tracking-wide rounded-full border bg-gradient-to-r ${prod.badgeColor} uppercase font-['Plus_Jakarta_Sans',sans-serif]`}>
                    {prod.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                    {prod.category}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif] group-hover:text-cyan-300 transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-cyan-400/90 font-medium font-['Plus_Jakarta_Sans',sans-serif]">
                    {prod.tagline}
                  </p>
                </div>

                {/* Main Body Description */}
                <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
                  {prod.description}
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-2.5 pt-2 border-t border-slate-900">
                  <span className="text-[11px] font-bold text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] block">
                    Key Capabilities:
                  </span>
                  {prod.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200 font-semibold">{feat.title}: </strong>
                        <span className="text-slate-400">{feat.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-900/80">
                  {prod.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="bg-[#0B0F19] p-2.5 rounded-xl border border-slate-800/60">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{m.label}</div>
                      <div className="text-sm font-extrabold text-cyan-300 font-['Plus_Jakarta_Sans',sans-serif]">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-900 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (prod.ctaAction === 'home') {
                      window.open('https://smh-three-pi.vercel.app/', '_blank', 'noopener,noreferrer');
                    } else {
                      onStartDemoCall();
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white hover:bg-slate-200 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-[1.02]"
                >
                  <span>{prod.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
                  title="View Details & Tech Specs"
                >
                  <span>Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Technical Product Modal / Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#090C15] border border-slate-800 p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full border bg-gradient-to-r ${selectedProduct.badgeColor}`}>
                    {selectedProduct.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-bold uppercase">{selectedProduct.category}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  {selectedProduct.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body & Specs */}
            <div className="space-y-6">
              <p className="text-sm text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
                {selectedProduct.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedProduct.metrics.map((m, idx) => (
                  <div key={idx} className="bg-[#0D1220] p-3 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{m.label}</div>
                    <div className="text-base font-black text-cyan-400 font-['Plus_Jakarta_Sans',sans-serif] mt-1">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Detailed Features List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Full Feature Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#0B0E18] border border-slate-800/80 space-y-1">
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span>{feat.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pl-3">
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Note / Demo Launch */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Radio className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-200">Ready to test this engine live?</div>
                    <div className="text-slate-400 text-[11px]">Use our interactive voice studio right on this page to test calls.</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    onStartDemoCall();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold shrink-0 transition"
                >
                  Launch Interactive Demo
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
