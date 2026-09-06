import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';
import { 
  ArrowUpRight, Volume2, Zap, Shield, Sparkles, Activity, 
  Cpu, Sliders, Globe, Radio, RefreshCw, CheckCircle2, Lock
} from 'lucide-react';

function SplineOrb({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let loaded = false;

    // htmlContentMode 'inline' runs scene HTML content directly for fast execution
    const app = new Application(canvas, { htmlContentMode: 'inline' });

    app.load('https://prod.spline.design/WUovGoyiKJdm7FvL/scene.splinecode')
      .then(() => {
        if (disposed) return;
        loaded = true;

        // --- Performance Tuning for Buttery Smooth 60FPS ---
        if (app._renderer) {
          // Cap pixel ratio to 1x to cut GPU shading workload by 75% on High-DPI/Retina screens
          app._renderer.setPixelRatio(1);
          
          // Disable watermark overlay calculations if present
          if (app._renderer.pipeline) {
            try { app._renderer.pipeline.setWatermark(null); } catch (e) {}
          }
        }
      })
      .catch((err) => {
        console.warn("[Spline 3D] Robot Bot Load error:", err);
      });

    // Pause WebGL rendering when off-screen to save GPU cycles
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!loaded) return;
        if (!entry.isIntersecting && !app.isStopped) app.stop();
        else if (entry.isIntersecting && app.isStopped) app.play();
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
      disposed = true;
      observer.disconnect();
      try {
        app.dispose();
      } catch (e) {}
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="canvas3d" 
      className={`${className} will-change-transform transform-gpu`}
      style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
    />
  );
}

export default function HeroSection({ onStartDemoCall, onOpenDocs }) {
  return (
    <div className="space-y-16 py-6 bg-black">
      {/* Main Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[480px]">
        {/* Left Column: Hero Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-slate-900 text-[11px] font-black text-cyan-400 tracking-wider uppercase">
            <span>PRODUCT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-['Plus_Jakarta_Sans',sans-serif]">
            Rean AI Conversational <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              AI Engine
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
            Give any AI model the ability to understand and respond naturally to human speech—even in challenging network conditions, code-switched languages, and noisy environments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartDemoCall}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-200 text-black font-black text-sm flex items-center gap-2 shadow-xl shadow-white/10 transition transform hover:scale-105"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Try Interactive Call</span>
            </button>

            <button
              onClick={() => {
                window.open('/voice-studio', '_blank', 'width=1440,height=900,resizable=yes,scrollbars=yes');
              }}
              className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-900 text-slate-200 font-bold text-sm border border-slate-800 transition"
            >
              <span>Explore Voice Studio ↗</span>
            </button>
          </div>
        </div>

        {/* Right Column: Spline 3D Scene */}
        <div className="lg:col-span-5 flex justify-center items-center relative py-8">
          <div className="relative w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            {/* Ambient Glow Behind 3D Scene */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-purple-900/25 to-indigo-900/25 blur-3xl pointer-events-none"></div>

            {/* Spline 3D Integration */}
            <SplineOrb className="w-full h-full" />

            {/* Floating Pill Tag (Matching Agora Screenshot: 'Your AI Agent') */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/90 border border-slate-800 backdrop-blur-md shadow-2xl text-xs font-bold text-slate-100 flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Your AI Agent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid Section ("Build real-time voice AI agents with any LLM") */}
      <div id="features" className="space-y-8 pt-10 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Build real-time voice AI agents with any LLM
          </h2>
          <p className="text-sm text-slate-400 font-['Plus_Jakarta_Sans',sans-serif]">
            Enterprise-grade infrastructure designed for multilingual interaction, code-switching, low latency, and human supervisor escalation.
          </p>
        </div>

        {/* 6 Feature Cards Grid (Matching User Screenshot Exactly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#08080A] border border-slate-900 hover:border-slate-700 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition shadow-inner">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">Any AI model, any voice</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Full flexibility to connect voice AI platform to any LLM, from leading providers to custom fine-tuned models, along with automatic speech recognition (ASR) and selection of text-to-speech (TTS) model.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#08080A] border border-slate-900 hover:border-slate-700 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition shadow-inner">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">Multilingual & Code-switching</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Automatic language detection across Hindi, English, Hinglish, Spanish, and French with dynamic code-switching recognition mid-sentence.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#08080A] border border-slate-900 hover:border-slate-700 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">Reduced response delay</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Ultra-low latency response times for more natural conversation flow between callers and AI, up to 3x faster than voice mode from major LLMs.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#08080A] border border-slate-900 hover:border-slate-700 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition shadow-inner">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">Intelligent interruption handling</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Advanced acoustic algorithm enables real-time interruption handling so voice AI agents immediately stop speaking when the caller interrupts (barge-in).
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-[#08080A] border border-slate-900 hover:border-slate-700 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-purple-400 group-hover:scale-110 transition shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">Background noise suppression</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Built-in noise suppression and Web Audio bandpass filters block background voices, traffic horns, and line noise interference.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-[#08080A] border border-slate-900 hover:border-slate-700 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F1424] border border-slate-800 flex items-center justify-center text-rose-400 group-hover:scale-110 transition shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">Human escalation with context</h3>
            <p className="text-xs text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Low-confidence detection automatically transfers complex cases to human supervisors with structured conversation briefs & Firebase Firestore sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
