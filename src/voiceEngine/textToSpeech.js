// Retell AI Text-to-Speech Engine — Voice Model: retell-Nico
// Configured with Retell AI Voice Credentials:
// RETELL_API_KEY=key_dee313fbc7db5f84550b2159b517
// RETELL_VOICE_ID=retell-Nico
// RETELL_AGENT_ID=agent_50a7617c0890beace66d05a491
// RETELL_LLM_ID=llm_4f8512b94aa923a6fada445424c6
// PORT=3002

import { getStoredRetellConfig } from './retellConfig';

class RetellTextToSpeechEngine {
  constructor() {
    this.config = getStoredRetellConfig();
    this.apiKey = this.config.apiKey || "key_dee313fbc7db5f84550b2159b517";
    this.voiceId = this.config.voiceId || "retell-Nico";
    this.agentId = this.config.agentId || "agent_50a7617c0890beace66d05a491";
    this.llmId = this.config.llmId || "llm_4f8512b94aa923a6fada445424c6";
    this.port = this.config.port || 3002;

    this.isSpeaking = false;
    this.currentAudio = null;
    this.synth = window.speechSynthesis || null;
    this.onStartCallback = null;
    this.onEndCallback = null;

    console.log(`[Retell Voice Model] Active Voice Model: '${this.voiceId}' (Rean Retell Engine on Port ${this.port})`);
  }

  async speak(text, language = "English", onStart = null, onEnd = null) {
    this.stop(); // Stop ongoing audio stream for barge-in

    this.onStartCallback = onStart;
    this.onEndCallback = onEnd;

    // Refresh credentials
    const currentCfg = getStoredRetellConfig();
    this.apiKey = currentCfg.apiKey || this.apiKey;
    this.voiceId = currentCfg.voiceId || "retell-Nico";
    this.agentId = currentCfg.agentId || this.agentId;
    this.port = currentCfg.port || 3002;

    // 1. Send speech generation request to Retell Voice Engine on port 3002
    let success = await this.speakRetellNico(text, this.voiceId);

    // 2. Fallback using Retell Nico voice profile (male, pitch 0.82, rate 0.92)
    if (!success) {
      console.log(`[Retell Voice Engine] Playing speech with Retell Nico voice profile (${language})...`);
      this.speakNicoSpeechProfile(text, language);
    }
  }

  async speakRetellNico(text, voiceId) {
    try {
      console.log(`[Retell AI Voice Engine] Requesting speech audio for Retell Voice '${voiceId}': "${text.slice(0, 50)}..."`);

      const response = await fetch(`http://localhost:${this.port}/api/retell/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          voiceId: voiceId,
          apiKey: this.apiKey,
          agentId: this.agentId,
          llmId: this.llmId
        })
      });

      if (!response.ok) return false;

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("audio")) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.playbackRate = 1.25;
        this.currentAudio = audio;

        audio.onplay = () => {
          this.isSpeaking = true;
          if (this.onStartCallback) this.onStartCallback();
        };

        audio.onended = () => {
          this.isSpeaking = false;
          this.currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          if (this.onEndCallback) this.onEndCallback();
        };

        audio.onerror = () => {
          this.isSpeaking = false;
          this.currentAudio = null;
          if (this.onEndCallback) this.onEndCallback();
        };

        await audio.play();
        return true;
      }
      return false;
    } catch (err) {
      console.warn("[Retell Voice API Connection]:", err.message);
      return false;
    }
  }

  speakNicoSpeechProfile(text, language = "English") {
    if (!this.synth) {
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = this.synth.getVoices();
    const isHindi = language.includes("Hindi") || /[\u0900-\u097F]/.test(text);

    let selectedVoice = null;
    if (isHindi) {
      // Prioritize Hindi / Indian voices for Hindi & Hinglish text
      selectedVoice = voices.find(v => v.lang.startsWith("hi") || v.lang.includes("hi-IN") || v.name.includes("Hindi") || v.name.includes("हिन्दी"))
        || voices.find(v => v.lang.includes("IN") || v.name.includes("India"));
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        v.name.includes("Nico") || 
        v.name.includes("Ryan") || 
        v.name.includes("Guy") || 
        v.name.includes("UK English Male") || 
        (v.name.includes("Natural") && v.name.includes("Male"))
      ) || voices.find(v => v.lang.startsWith("en") && (v.name.includes("Male") || v.name.includes("David") || v.name.includes("George")));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      if (isHindi) utterance.lang = "hi-IN";
      else if (language.includes("French")) utterance.lang = "fr-FR";
      else if (language.includes("Spanish")) utterance.lang = "es-ES";
      else utterance.lang = "en-US";
    }

    // Voice playback speed and pitch optimization
    utterance.rate = isHindi ? 1.05 : 1.25;
    utterance.pitch = 0.90;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStartCallback) this.onStartCallback();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        console.warn("Error pausing audio:", e);
      }
      this.currentAudio = null;
    }

    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }

    this.isSpeaking = false;
  }
}

export const ttsEngine = new RetellTextToSpeechEngine();
export default ttsEngine;
