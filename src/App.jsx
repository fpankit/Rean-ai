import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import AgoraModal from './components/AgoraModal';
import CallerStudio from './components/CallerStudio';
import SupervisorDesk from './components/SupervisorDesk';
import VoiceStudioPage from './components/VoiceStudioPage';
import { getStoredAgoraConfig } from './agora/agoraConfig';

export default function App() {
  const [isVoiceStudioWindow, setIsVoiceStudioWindow] = useState(
    window.location.pathname.includes('voice-studio') || window.location.search.includes('voice-studio')
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsVoiceStudioWindow(
        window.location.pathname.includes('voice-studio') || window.location.search.includes('voice-studio')
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeTab, setActiveTab] = useState('caller'); // 'caller' | 'supervisor'
  const [isAgoraModalOpen, setIsAgoraModalOpen] = useState(false);
  const [agoraConfig, setAgoraConfig] = useState(getStoredAgoraConfig());
  const [activeHandoff, setActiveHandoff] = useState(null);

  const studioRef = useRef(null);

  const scrollToStudio = () => {
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEscalateToSupervisor = (handoffData) => {
    setActiveHandoff(handoffData);
  };

  if (isVoiceStudioWindow) {
    return <VoiceStudioPage />;
  }

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500 selection:text-black">
      {/* Top Fixed Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAgoraModal={() => setIsAgoraModalOpen(true)}
        agoraConnected={Boolean(agoraConfig.appId)}
        firebaseConnected={true}
        isCallActive={false}
        onScrollToStudio={scrollToStudio}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-12 bg-black">
        {/* Landing Page Hero Showcase */}
        {activeTab === 'caller' && (
          <HeroSection
            onStartDemoCall={() => {
              setActiveTab('caller');
              scrollToStudio();
            }}
            onOpenDocs={() => setIsAgoraModalOpen(true)}
          />
        )}

        {/* Our Products Showcase Section (Placed right before Interactive Voice Studio) */}
        {activeTab === 'caller' && (
          <ProductsSection
            onStartDemoCall={() => {
              setActiveTab('caller');
              scrollToStudio();
            }}
            onOpenAgoraModal={() => setIsAgoraModalOpen(true)}
          />
        )}

        {/* Studio / Supervisor Workspace */}
        <div ref={studioRef} id="studio" className="pt-4 bg-black">
          {activeTab === 'caller' ? (
            <div className="space-y-4">
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
              <CallerStudio onEscalateToSupervisor={handleEscalateToSupervisor} />
            </div>
          ) : (
            <div id="supervisor" className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                    Human Supervisor & Escalation Console
                  </h2>
                  <p className="text-xs text-slate-400 font-['Inter']">
                    Inspect active context handoff summaries, manage low-confidence transfers, and sync with Firebase Firestore
                  </p>
                </div>
              </div>
              <SupervisorDesk activeHandoff={activeHandoff} />
            </div>
          )}
        </div>
      </main>

      {/* Agora Credentials Modal */}
      <AgoraModal
        isOpen={isAgoraModalOpen}
        onClose={() => setIsAgoraModalOpen(false)}
        onSave={(newConfig) => setAgoraConfig(newConfig)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-black py-8 px-6 text-center text-xs text-slate-400 space-y-2">
        <p className="font-extrabold text-slate-200 text-sm font-['Outfit']">
          Rean AI Conversational AI Engine • Integrated with Agora RTC & Firebase Firestore
        </p>
        <p className="text-xs text-slate-500 font-['Inter']">
          Non-Clinical Support Line • Emergency Safety Guardrails Active (112 / 108 / 911 Direct Escalation)
        </p>
      </footer>
    </div>
  );
}
