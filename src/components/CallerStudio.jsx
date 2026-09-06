import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Radio, Sparkles, 
  Send, AlertTriangle, UserCheck, Flame, ShieldAlert, Sliders,
  Wifi, TrendingUp, UserPlus, Stethoscope, Pencil, Bot
} from 'lucide-react';

import AudioOrb from './AudioOrb';
import SlotChecklist from './SlotChecklist';
import TranscriptView from './TranscriptView';


import { aiEngine, OPENING_GREETING, PRESET_PROMPTS } from '../voiceEngine/aiConversationLogic';
import { ttsEngine } from '../voiceEngine/textToSpeech';
import { elevenLabsSTTEngine } from '../voiceEngine/elevenLabsSTT';
import { speechRecognitionEngine } from '../voiceEngine/speechRecognition';
import { noiseFilterEngine } from '../voiceEngine/noiseFilter';
import { agoraService } from '../agora/agoraService';
import { createTicket } from '../firebase/ticketService';

const PRESET_ICONS = {
  wifi_support: Wifi,
  sales_outbound: TrendingUp,
  customer_onboarding: UserPlus,
  medical_triage: Stethoscope,
  custom: Pencil,
};

export default function CallerStudio({ onEscalateToSupervisor }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBargeIn, setIsBargeIn] = useState(false);
  
  const [noiseType, setNoiseType] = useState('none');
  const [isSuppressionActive, setIsSuppressionActive] = useState(true);
  const [volume, setVolume] = useState(15);
  const [noiseLevelLabel, setNoiseLevelLabel] = useState('Clean Signal');
  
  const [transcripts, setTranscripts] = useState([]);
  const [slots, setSlots] = useState(aiEngine.getSlotSummary());
  const [detectedLangs, setDetectedLangs] = useState(['English']);
  const [isCodeSwitched, setIsCodeSwitched] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(88);
  const [currentStep, setCurrentStep] = useState('GREETING');

  const [activeScenarioId, setActiveScenarioId] = useState('wifi_support');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [manualInput, setManualInput] = useState('');

  const activeScenario = PRESET_PROMPTS.find(p => p.id === activeScenarioId) || PRESET_PROMPTS[0];

  const noResponseTimerRef = React.useRef(null);
  const NO_RESPONSE_DELAY_MS = 15000; // 15s of silence before prompting

  const clearNoResponseTimer = () => {
    if (noResponseTimerRef.current) {
      clearTimeout(noResponseTimerRef.current);
      noResponseTimerRef.current = null;
    }
  };

  const armNoResponseTimer = () => {
    clearNoResponseTimer();
    noResponseTimerRef.current = setTimeout(() => {
      const res = aiEngine.processNoResponse(detectedLangs[detectedLangs.length - 1] || 'English');
      if (res) {
        setTranscripts([...aiEngine.transcriptHistory]);
        setSlots(res.slots || aiEngine.getSlotSummary());
        setConfidenceScore(res.avgConfidence || confidenceScore);
        setCurrentStep(res.currentStep || 'NO_RESPONSE');
        const lang = res.languages?.length ? res.languages[res.languages.length - 1] : 'English';
        ttsEngine.speak(res.agentReply, lang, () => setIsSpeaking(true), () => setIsSpeaking(false));
        if (res.endCall) {
          setTimeout(() => { endCall(); }, 4000);
        } else {
          armNoResponseTimer();
        }
      }
    }, NO_RESPONSE_DELAY_MS);
  };

  // Handle Speech Processing
  const handleUserUtterance = (text, rawConfidence = 85) => {
    if (!text) return;

    // User provided input — reset the no-response guardrail timer
    aiEngine.resetNoResponse();
    armNoResponseTimer();

    // Barge-in check: If AI was speaking, interrupt immediately!
    if (ttsEngine.isSpeaking) {
      ttsEngine.stop();
      setIsBargeIn(true);
      setTimeout(() => setIsBargeIn(false), 1500);
    }

    const result = aiEngine.processUserSpeech(text, rawConfidence, noiseLevelLabel);
    if (!result) return;

    // Update state
    setTranscripts([...aiEngine.transcriptHistory]);
    setSlots(result.slots || aiEngine.getSlotSummary());
    setDetectedLangs([...result.languages]);
    setIsCodeSwitched(result.isCodeSwitched);
    setConfidenceScore(result.avgConfidence);
    setCurrentStep(result.currentStep || 'COLLECTING');

    // Trigger AI Spoken Answer
    const currentLang = result.languages[result.languages.length - 1] || 'English';
    ttsEngine.speak(
      result.agentReply,
      currentLang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );

    // Escalation Trigger (Safety or Low Confidence)
    if (result.shouldEscalate) {
      const summary = aiEngine.generateHandoffSummary();
      createTicket({
        callerName: summary.callerName,
        phone: summary.extractedSlots.contact || "+91 98112 00412",
        languagesUsed: summary.languagesUsed,
        category: summary.extractedSlots.category || "Unclassified Issue",
        urgency: result.escalationReason.includes("SAFETY") ? "Critical" : "High",
        status: "Escalated",
        confidenceScore: summary.avgConfidence,
        noiseLevel: noiseLevelLabel,
        reasonForTransfer: result.escalationReason,
        summary: summary.summaryText,
        extractedSlots: summary.extractedSlots,
        safetyStatus: result.escalationReason.includes("SAFETY") ? "Safety Alert" : "Clean"
      });
      
      if (onEscalateToSupervisor) {
        onEscalateToSupervisor(summary);
      }
    }
  };

  const startWebSpeechFallback = () => {
    console.log("[STT Engine] Starting Web Speech API voice capture fallback...");
    elevenLabsSTTEngine.stop();

    speechRecognitionEngine.start(
      (res) => {
        if (res && res.text && res.text.trim()) {
          console.log("[CallerStudio] Mic Voice Captured -> Feeding into AI Model:", res.text);
          if (ttsEngine.isSpeaking) {
            ttsEngine.stop();
            setIsBargeIn(true);
            setTimeout(() => setIsBargeIn(false), 1500);
          }
          handleUserUtterance(res.text.trim(), res.confidence || 88);
        }
      },
      (interim) => {
        if (ttsEngine.isSpeaking && interim && interim.trim()) {
          ttsEngine.stop();
          setIsBargeIn(true);
          setTimeout(() => setIsBargeIn(false), 1500);
        }
      },
      (err) => {
        console.warn("[STT Engine] Web Speech API warning/error:", err);
      }
    );
    setIsListening(true);
  };

  // Start Voice Call
  const startCall = async () => {
    aiEngine.configureForScenario(activeScenarioId, customPrompt);
    aiEngine.resetSession();
    setTranscripts([]);
    setSlots(aiEngine.getSlotSummary());
    setDetectedLangs(['English']);
    setIsCodeSwitched(false);
    setConfidenceScore(88);

    await agoraService.joinChannel();
    await noiseFilterEngine.setupMicProcessing(({ volume, noiseLevel }) => {
      setVolume(volume);
      setNoiseLevelLabel(noiseLevel);
    });

    setIsCallActive(true);

    // Initial Rean AI Greeting (scenario-aware)
    const greeting = aiEngine.getGreeting();
    
    aiEngine.transcriptHistory.push({
      speaker: 'agent',
      text: greeting,
      language: 'English/Hindi',
      confidence: 100,
      timestamp: new Date().toLocaleTimeString()
    });
    setTranscripts([...aiEngine.transcriptHistory]);

    ttsEngine.speak(
      greeting,
      'English',
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );

    armNoResponseTimer();

    // Try ElevenLabs realtime speech-to-text first
    let sttStarted = false;
    try {
      sttStarted = await elevenLabsSTTEngine.start({
        onPartial: (interim) => {
          if (ttsEngine.isSpeaking && interim && interim.trim()) {
            ttsEngine.stop();
            setIsBargeIn(true);
            setTimeout(() => setIsBargeIn(false), 1500);
          }
        },
        onCommitted: (text) => {
          if (text && text.trim()) {
            console.log("[ElevenLabs STT] Mic Voice Captured -> Feeding into AI Model:", text);
            if (ttsEngine.isSpeaking) {
              ttsEngine.stop();
              setIsBargeIn(true);
              setTimeout(() => setIsBargeIn(false), 1500);
            }
            handleUserUtterance(text.trim(), 88);
          }
        },
        onError: (err) => {
          console.warn("[STT Engine] ElevenLabs STT error, switching to Web Speech API fallback:", err);
          elevenLabsSTTEngine.stop();
          startWebSpeechFallback();
        }
      });
    } catch (err) {
      console.warn("[STT Engine] ElevenLabs STT start failed:", err);
      elevenLabsSTTEngine.stop();
    }

    if (!sttStarted) {
      startWebSpeechFallback();
    } else {
      setIsListening(true);
    }
  };

  // End Call
  const endCall = () => {
    clearNoResponseTimer();
    ttsEngine.stop();
    elevenLabsSTTEngine.stop();
    speechRecognitionEngine.stop();
    noiseFilterEngine.stop();
    agoraService.leaveChannel();
    setIsCallActive(false);
    setIsSpeaking(false);
    setIsListening(false);
    aiEngine.resetNoResponse();
  };

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    agoraService.setMute(newMute);
    if (newMute) {
      elevenLabsSTTEngine.stop();
      speechRecognitionEngine.stop();
      setIsListening(false);
    } else if (isCallActive) {
      startWebSpeechFallback();
    }
  };

  const handleNoiseTypeChange = (type) => {
    setNoiseType(type);
    noiseFilterEngine.setSimulatedNoise(type);
  };

  const toggleSuppression = () => {
    const next = !isSuppressionActive;
    setIsSuppressionActive(next);
    noiseFilterEngine.toggleSuppression(next);
  };

  // Preset Scenario Runners for Quick Demo Evaluation
  const runPresetScenario = (scenarioType) => {
    if (!isCallActive) startCall();

    setTimeout(() => {
      if (scenarioType === 'hindi_codeswitch') {
        handleNoiseTypeChange('crowd');
        handleUserUtterance("Mera naam Rahul Sharma hai, mera Wi-Fi router kaam nahi kar raha hai Sector 14 Dwarka me, internet band hai.", 78);
      } else if (scenarioType === 'noisy_street') {
        handleNoiseTypeChange('street');
        handleUserUtterance("Hello, I am speaking from main market, noise is too much, router red light blinking near Gate 3.", 52);
      } else if (scenarioType === 'medical_safety') {
        handleUserUtterance("My neighbour is having severe chest pain and cannot breathe, tell me what medicine to give immediately!", 92);
      } else if (scenarioType === 'clean_confirm') {
        handleNoiseTypeChange('none');
        handleUserUtterance("Mera naam Ananya Roy hai, phone number 9123456789, Wi-Fi speed bahut dheemi ho gayi hai.", 95);
      } else if (scenarioType === 'sales_inquiry') {
        handleUserUtterance("I want to upgrade my call center to an AI voice assistant that handles over 2000 calls a day.", 90);
      } else if (scenarioType === 'onboarding_inquiry') {
        handleUserUtterance("My name is Priya, my email is priya@gmail.com, I signed up for the Business plan and want a setup guide.", 92);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">

      {/* Prompt / Scenario Selector */}
      <div className="bg-[#0A0D14] rounded-3xl border border-slate-800/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Choose AI Conversation Prompt</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Pick a ready-made use case or write your own
          </span>
        </div>

        {/* Preset Prompt Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {PRESET_PROMPTS.map((preset) => {
            const IconComp = PRESET_ICONS[preset.id] || Bot;
            const isSelected = activeScenarioId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setActiveScenarioId(preset.id);
                }}
                className={`relative p-3 rounded-2xl border text-left transition-all group ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className={`flex items-center gap-2 mb-1.5 ${preset.color}`}>
                  <IconComp className="w-4 h-4" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">{preset.shortLabel}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug min-h-[2rem]">
                  {preset.description}
                </p>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Prompt Textarea (only when Custom selected) */}
        {activeScenarioId === 'custom' && (
          <div className="mt-4 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400">
              Custom System Prompt — tell the AI what role it should play
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. You are a friendly hotel receptionist that handles bookings, check-ins, and local recommendations. Collect guest name, dates, and room preference..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        )}

        {/* Selected prompt hint */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-white font-bold">Active prompt: {activeScenario.label}.</strong>{' '}
            {activeScenarioId === 'custom' && customPrompt
              ? 'Using your custom prompt for this session.'
              : activeScenario.description}
          </p>
        </div>
      </div>

      {/* Main Studio 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Control & Audio Orb */}
        <div className="lg:col-span-4 space-y-6">
          <AudioOrb
            isSpeaking={isSpeaking}
            isListening={isListening}
            isCallActive={isCallActive}
            volume={volume}
            noiseLevel={noiseLevelLabel}
            confidenceScore={confidenceScore}
            detectedLanguages={detectedLangs}
            isCodeSwitched={isCodeSwitched}
            isBargeIn={isBargeIn}
          />

          {/* Call Controls Box */}
          <div className="bg-[#0A0D14] rounded-3xl border border-slate-800/80 backdrop-blur-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Call Controls</span>
              {isCallActive && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Call Active
                </span>
              )}
            </div>

            {/* Main Action Call Button */}
            {!isCallActive ? (
              <button
                onClick={startCall}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" />
                <span>Start Live Voice AI Call</span>
              </button>
            ) : (
              <button
                onClick={endCall}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call Session</span>
              </button>
            )}

            {/* Mute & Noise Gate Controls */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={toggleMute}
                disabled={!isCallActive}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
                <span>{isMuted ? 'Mic Muted' : 'Mute Mic'}</span>
              </button>

              <button
                onClick={toggleSuppression}
                disabled={!isCallActive}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isSuppressionActive
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{isSuppressionActive ? 'Noise Gate ON' : 'Noise Gate OFF'}</span>
              </button>
            </div>

            {/* Simulated Noise Injection Select */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-400">
                Simulate Background Noise Environment
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'none', label: 'Clean' },
                  { id: 'street', label: 'Street' },
                  { id: 'crowd', label: 'Crowd' },
                  { id: 'static', label: 'Static' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNoiseTypeChange(item.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition ${
                      noiseType === item.id
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Live Transcript Stream & Manual Voice Input */}
        <div className="lg:col-span-5 space-y-4">
          <TranscriptView transcripts={transcripts} />

          {/* Manual Input Box for Quick Voice Testing */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-3 flex items-center gap-2">
            <input
              type="text"
              placeholder={activeScenario.placeholder}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualInput.trim()) {
                  if (!isCallActive) startCall();
                  handleUserUtterance(manualInput.trim(), 88);
                  setManualInput('');
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                if (manualInput.trim()) {
                  if (!isCallActive) startCall();
                  handleUserUtterance(manualInput.trim(), 88);
                  setManualInput('');
                }
              }}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Slot Checklist & Call Summary */}
        <div className="lg:col-span-3 space-y-6">
          <SlotChecklist slots={slots} currentStep={currentStep} slotLabels={activeScenario.slots} />
        </div>
      </div>
    </div>
  );
}
