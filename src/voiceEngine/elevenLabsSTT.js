// ElevenLabs Realtime Speech-to-Text Engine (Scribe v2)
// Streams microphone audio as 16kHz mono PCM over a WebSocket and emits
// partial + committed transcripts. Server-side VAD commits when the caller
// stops speaking, so each committed transcript is a finished utterance.

const ELEVENLABS_API_KEY = "sk_66805b4b0482a9d34df5415806be3cabfa976ea12bf4efbc";
const TOKEN_URL = "https://api.elevenlabs.io/v1/single-use-token/realtime_scribe";
const STT_WS_URL = "wss://api.elevenlabs.io/v1/speech-to-text/realtime";
const TARGET_SAMPLE_RATE = 16000;
const FLUSH_INTERVAL_MS = 120;

class ElevenLabsSTTEngine {
  constructor() {
    this.ws = null;
    this.audioCtx = null;
    this.micStream = null;
    this.processor = null;
    this.shouldListen = false;
    this.isListening = false;

    this.pcmBuffer = [];
    this.flushTimer = null;
    this.lastCommittedText = null;
    this.reconnectTimer = null;
    this.wasSentenceSent = false;

    this.onPartial = null;
    this.onCommitted = null;
    this.onStatus = null;
    this.onError = null;
  }

  async start({ onPartial, onCommitted, onStatus, onError } = {}) {
    this.onPartial = onPartial;
    this.onCommitted = onCommitted;
    this.onStatus = onStatus;
    this.onError = onError;
    this.shouldListen = true;

    try {
      await this.setupMic();
      await this.openSocket();
      this.isListening = true;
      if (this.onStatus) this.onStatus("listening");
    } catch (err) {
      this.isListening = false;
      if (this.onError) this.onError(err.message || String(err));
      if (this.onStatus) this.onStatus("error");
      console.warn("ElevenLabs STT failed to start:", err);
    }
    return this.isListening;
  }

  async fetchSessionToken() {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS_API_KEY }
    });
    if (!response.ok) {
      throw new Error(`ElevenLabs single-use token request failed (${response.status})`);
    }
    const data = await response.json();
    return data.token;
  }

  async openSocket() {
    const token = await this.fetchSessionToken();
    const params = new URLSearchParams({
      token,
      model_id: "scribe_v2_realtime",
      commit_strategy: "vad",
      filter_background_audio: "true",
      no_verbatim: "true"
    });

    const ws = new WebSocket(`${STT_WS_URL}?${params.toString()}`);
    this.ws = ws;
    this.sessionFirstChunkSent = false;

    ws.onopen = () => {
      if (this.onStatus) this.onStatus("connected");
      this.startFlushTimer();
    };

    ws.onmessage = (event) => this.handleMessage(event);

    ws.onclose = () => {
      this.ws = null;
      if (this.onStatus) this.onStatus("disconnected");
      if (this.shouldListen && this.isListening) this.scheduleReconnect();
    };

    ws.onerror = () => {
      if (this.onStatus) this.onStatus("error");
    };
  }

  handleMessage(event) {
    let msg = null;
    try {
      msg = JSON.parse(event.data);
    } catch (err) {
      return;
    }
    if (!msg || typeof msg.message_type !== "string") return;

    switch (msg.message_type) {
      case "partial_transcript": {
        if (this.onPartial) this.onPartial(msg.text || "");
        break;
      }
      case "committed_transcript":
      case "committed_transcript_with_timestamps": {
        const text = (msg.text || "").trim();
        if (text && this.onCommitted && !this.wasSentenceSent) {
          this.wasSentenceSent = true;
          this.lastCommittedText = text;
          this.onCommitted(text, 88);
          setTimeout(() => { this.wasSentenceSent = false; }, 250);
        }
        break;
      }
      default: {
        if (msg.message_type.includes("error")) {
          if (this.onError) this.onError(msg.error || msg.message_type);
          if (["auth_error", "invalid_request", "unaccepted_terms"].includes(msg.message_type)) {
            this.shouldListen = false;
          } else if (["session_time_limit_exceeded", "rate_limited", "queue_overflow"].includes(msg.message_type)) {
            this.scheduleReconnect();
          }
        }
        break;
      }
    }
  }

  async setupMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("getUserMedia is not supported in this browser");
    }

    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error("Web Audio API is not supported in this browser");

    this.audioCtx = new AudioContext();
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    const inputSampleRate = this.audioCtx.sampleRate || 48000;
    const source = this.audioCtx.createMediaStreamSource(this.micStream);
    this.processor = this.audioCtx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const pcm16 = this.resampleToPcm16(input, inputSampleRate);
      for (let i = 0; i < pcm16.length; i++) {
        this.pcmBuffer.push(pcm16[i]);
      }
    };

    const silentLineOut = this.audioCtx.createGain();
    silentLineOut.gain.value = 0;

    source.connect(this.processor);
    this.processor.connect(silentLineOut);
    silentLineOut.connect(this.audioCtx.destination);
  }

  resampleToPcm16(input, inputSampleRate) {
    const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
    const outputLength = Math.floor(input.length / ratio);
    const output = new Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const srcIndex = i * ratio;
      const i0 = Math.floor(srcIndex);
      const i1 = Math.min(i0 + 1, input.length - 1);
      const fraction = srcIndex - i0;
      const sample = input[i0] + (input[i1] - input[i0]) * fraction;
      output[i] = Math.max(-1, Math.min(1, sample)) * 32768;
    }
    return output;
  }

  startFlushTimer() {
    this.stopFlushTimer();
    this.flushTimer = setInterval(() => this.flushPcmChunk(), FLUSH_INTERVAL_MS);
  }

  stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  flushPcmChunk() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || this.pcmBuffer.length === 0) return;

    const audioBase64 = this.encodePcm16ToBase64(this.pcmBuffer);
    this.pcmBuffer.length = 0;

    const message = {
      message_type: "input_audio_chunk",
      audio_base_64: audioBase64,
      commit: false,
      sample_rate: TARGET_SAMPLE_RATE
    };

    // previous_text may only be sent with the first audio chunk of a session.
    // It carries the last committed utterance so a reconnected session stays coherent.
    if (!this.sessionFirstChunkSent && this.lastCommittedText) {
      message.previous_text = this.lastCommittedText;
    }
    this.sessionFirstChunkSent = true;

    this.ws.send(JSON.stringify(message));
  }

  encodePcm16ToBase64(samples) {
    const bytes = new Uint8Array(samples.length * 2);
    for (let i = 0; i < samples.length; i++) {
      const value = Math.max(-32768, Math.min(32767, Math.round(samples[i])));
      bytes[i * 2] = value & 0xff;
      bytes[i * 2 + 1] = (value >> 8) & 0xff;
    }

    let binary = "";
    const block = 0x8000;
    for (let i = 0; i < bytes.length; i += block) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + block));
    }
    return btoa(binary);
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (!this.shouldListen || !this.isListening) return;
      try {
        await this.openSocket();
      } catch (err) {
        if (this.onError) this.onError(err.message || String(err));
        this.scheduleReconnect();
      }
    }, 1500);
  }

  stop() {
    this.shouldListen = false;
    this.isListening = false;
    this.stopFlushTimer();
    this.pcmBuffer.length = 0;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (err) {
        console.warn("Error closing STT socket:", err);
      }
      this.ws = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    if (this.processor) {
      this.processor.onaudioprocess = null;
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }

    if (this.onStatus) this.onStatus("stopped");
  }
}

export const elevenLabsSTTEngine = new ElevenLabsSTTEngine();
export default elevenLabsSTTEngine;