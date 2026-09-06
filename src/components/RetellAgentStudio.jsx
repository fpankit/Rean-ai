import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Bot, Mic, Play, Pause, Save, Check, ChevronDown, 
  Settings, Sliders, Shield, Database, Wrench, Code2, History,
  Share2, Volume2, Key, Server, Cpu, FileText, Lock, Globe, AlertCircle
} from 'lucide-react';
import { getStoredRetellConfig, saveRetellConfig } from '../voiceEngine/retellConfig';
import { retellService } from '../voiceEngine/retellService';
import { aiEngine } from '../voiceEngine/aiConversationLogic';

export default function RetellAgentStudio({ onSystemPromptChange }) {
  const [retellConfig, setRetellConfig] = useState(getStoredRetellConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const [agentName, setAgentName] = useState('Rean');
  const [model, setModel] = useState('GPT 4.1');
  const [voiceId, setVoiceId] = useState(retellConfig.voiceId || 'retell-Nico');
  const [language, setLanguage] = useState('Multilingual (2)');
  const [systemPrompt, setSystemPrompt] = useState(retellConfig.systemPrompt);
  const [welcomeMessage, setWelcomeMessage] = useState('AI speaks first');

  const [activeTab, setActiveTab] = useState('Test Audio'); // 'Test Audio' | 'Test LLM' | 'JSON'
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testAudioStatus, setTestAudioStatus] = useState('Standby');
  const [testLog, setTestLog] = useState([]);

  // Accordion Expand States
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    aiEngine.setSystemPrompt(systemPrompt);
  }, [systemPrompt]);

  const handleSaveConfig = () => {
    const updated = {
      ...retellConfig,
      voiceId,
      model,
      language,
      systemPrompt
    };
    setRetellConfig(updated);
    saveRetellConfig(updated);
    retellService.updateConfig(updated);
    aiEngine.setSystemPrompt(systemPrompt);
    
    if (onSystemPromptChange) onSystemPromptChange(systemPrompt);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRunTest = async () => {
    if (isTestRunning) {
      setIsTestRunning(false);
      setTestAudioStatus('Standby');
      retellService.stopCall();
      return;
    }

    setIsTestRunning(true);
    setTestAudioStatus('Connecting to Retell AI Voice Engine...');
    setTestLog(prev => [...prev, { time: new Date().toLocaleTimeString(), text: 'Initializing Retell Web Call (Port 3002)...' }]);

    const callResult = await retellService.createWebCall();
    
    setTimeout(() => {
      setTestAudioStatus('Retell AI Engine Active (Listening)');
      setTestLog(prev => [
        ...prev, 
        { time: new Date().toLocaleTimeString(), text: `Connected: Call ID ${callResult.call_id || 'retell-session'}` },
        { time: new Date().toLocaleTimeString(), text: `Agent Rean (${voiceId}) loaded with custom system prompt.` }
      ]);
    }, 1200);
  };

  const accordionItems = [
    { id: 'functions', label: 'Functions', icon: Wrench, desc: 'Configure custom tool calls & function schemas' },
    { id: 'kb', label: 'Knowledge Base', icon: Database, desc: 'Connect documents, FAQs & vector search index' },
    { id: 'speech', label: 'Speech Settings', icon: Volume2, desc: 'Adjust stability, speech speed, and voice style' },
    { id: 'stt', label: 'Realtime Transcription Settings', icon: FileText, desc: 'STT provider & noise reduction settings' },
    { id: 'call', label: 'Call Settings', icon: Sliders, desc: 'Max duration, silence timeout, and transfer rules' },
    { id: 'extraction', label: 'Post Call Extraction', icon: Code2, desc: 'Define JSON extraction fields after call ends' },
    { id: 'security', label: 'Security & Fallback Settings', icon: Shield, desc: 'PFI encryption, guardrails & fallback responses' },
    { id: 'webhooks', label: 'Webhook Settings', icon: Server, desc: 'Set endpoint for live call events & transcript sync' },
    { id: 'mcps', label: 'MCPs', icon: Cpu, desc: 'Model Context Protocol integrations & tools' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Inter',sans-serif] flex flex-col">
      {/* Retell Top Navigation Toolbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
        {/* Left: Agent Title & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900 tracking-tight">{agentName}</span>
            <span className="px-2 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
              Environment
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 font-mono border-l border-slate-200 pl-4">
            <span>Agent Details</span>
            <span>Cost <strong className="text-slate-700">$0.134/min</strong></span>
            <span>Latency <strong className="text-slate-700">1090-1580ms</strong></span>
            <span>Tokens <strong className="text-slate-700">4.2k - 8.3k</strong></span>
            <button className="px-1.5 py-0.5 text-[10px] bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 text-slate-700 font-bold">
              ID
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveConfig}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved' : 'Save Config'}</span>
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200">
            Publish
          </button>
        </div>
      </header>

      {/* Model & Voice Configuration Selector Bar */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-3 py-1 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="GPT 4.1">GPT 4.1</option>
              <option value="GPT 4o">GPT 4o</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          {/* Voice Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-3 py-1 shadow-sm">
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-400 font-semibold">Voice:</span>
            <select 
              value={voiceId} 
              onChange={(e) => setVoiceId(e.target.value)}
              className="bg-transparent font-semibold text-indigo-700 focus:outline-none cursor-pointer"
            >
              <option value="retell-Nico">retell-Nico (Default Rean)</option>
              <option value="retell-Maya">retell-Maya</option>
              <option value="retell-James">retell-James</option>
              <option value="retell-Sophie">retell-Sophie</option>
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-3 py-1 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Multilingual (2)">Multilingual (2)</option>
              <option value="English Only">English Only</option>
              <option value="Hindi-English Code-Switch">Hindi-English Code-Switch</option>
            </select>
          </div>

          <button className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-3 py-1 text-slate-700 font-medium hover:bg-slate-50 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Agent Handbook</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <span>Retell API Port: <strong className="text-slate-800">3002</strong></span>
        </div>
      </div>

      {/* Main Retell AI 3-Panel Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: System Prompt Editor */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 p-6 flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-105px)]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>System Prompt & Role Instructions</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the AI's role, identity, objectives, and guardrails. The AI will strictly adhere to this prompt during voice calls.
              </p>
            </div>
            <button 
              onClick={handleSaveConfig}
              className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-xs font-semibold hover:bg-indigo-100 transition"
            >
              Apply Prompt
            </button>
          </div>

          {/* System Prompt Large Text Area */}
          <div className="flex-1 flex flex-col space-y-2">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Write role, identity, primary objectives, trusted users, and guardrails..."
              className="w-full flex-1 min-h-[380px] p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner resize-y"
            />
          </div>

          {/* Welcome Message Settings */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Welcome Message & Audio Timing</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Speaker Order</label>
                <select 
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 font-medium text-slate-800"
                >
                  <option value="AI speaks first">AI speaks first</option>
                  <option value="User speaks first">User speaks first</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Pause Before Speaking</label>
                <input 
                  type="text" 
                  readOnly 
                  value="0s (Instant Response)" 
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 font-mono text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Accordion Settings */}
        <div className="lg:col-span-4 bg-slate-50/50 border-r border-slate-200 p-5 overflow-y-auto max-h-[calc(100vh-105px)] space-y-2.5">
          <div className="border-b border-slate-200 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Agent Settings & Capabilities</h3>
            <p className="text-[11px] text-slate-500">Configure LLM tools, speech settings, and fallback rules</p>
          </div>

          {accordionItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedSection === item.id;
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : item.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs text-slate-600">
                    <p className="italic text-slate-500">Configured for active Retell AI Voice Engine ({retellConfig.agentId}).</p>
                    {item.id === 'speech' && (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-semibold text-slate-700">Retell Voice ID</label>
                        <input 
                          type="text" 
                          value={voiceId} 
                          onChange={(e) => setVoiceId(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-indigo-700" 
                        />
                      </div>
                    )}
                    {item.id === 'security' && (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-semibold text-slate-700">Retell API Key</label>
                        <input 
                          type="password" 
                          value={retellConfig.apiKey} 
                          readOnly
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-slate-500" 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Audio Test & Execution Sandbox */}
        <div className="lg:col-span-3 bg-white p-6 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-105px)] border-l border-slate-200">
          <div>
            {/* Top Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 mb-6 text-xs font-semibold">
              {['Test Audio', 'Test LLM', '{}'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Test View Content */}
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all ${
                isTestRunning 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600 animate-pulse shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <Mic className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {isTestRunning ? 'Live Voice Test Active' : 'Audio Sandbox Standby'}
                </h4>
                <p className="text-xs text-slate-500">
                  {testAudioStatus}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRunTest}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md ${
                  isTestRunning
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isTestRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isTestRunning ? 'Stop Test Session' : '▷ Run Test'}</span>
              </button>
            </div>
          </div>

          {/* Test Logs */}
          <div className="bg-slate-900 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 text-[10px] uppercase font-bold">
              <span>Retell Log Output</span>
              <span>Port 3002</span>
            </div>
            {testLog.length === 0 ? (
              <p className="text-slate-500 italic">Click 'Run Test' to initiate audio conversation test...</p>
            ) : (
              testLog.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="text-indigo-400">[{log.time}]</span> {log.text}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
