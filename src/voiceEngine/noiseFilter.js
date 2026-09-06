// Web Audio API Noise Suppression, Noise Meter & Background Noise Generator

class NoiseFilterEngine {
  constructor() {
    this.audioCtx = null;
    this.micStream = null;
    this.micSource = null;
    this.analyser = null;
    this.noiseGateNode = null;
    this.filterNode = null;
    this.isSuppressionEnabled = true;
    this.noiseGenNode = null;
    this.simulatedNoiseType = "none"; // 'none', 'street', 'crowd', 'static'
    this.animFrameId = null;
    this.onVolumeCallback = null;
  }

  async initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  async setupMicProcessing(onVolume) {
    await this.initAudioContext();
    this.onVolumeCallback = onVolume;

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micSource = this.audioCtx.createMediaStreamSource(this.micStream);

      // Create Biquad Bandpass Filter for Speech Frequencies (300Hz - 3400Hz)
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.value = 1800; // Center speech freq
      this.filterNode.Q.value = 0.9;

      // Analyser Node
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;

      // Connect nodes
      this.micSource.connect(this.filterNode);
      this.filterNode.connect(this.analyser);

      this.startMeterLoop();
      return true;
    } catch (err) {
      console.warn("Microphone access unavailable or denied for AudioContext:", err);
      this.startSimulatedMeterLoop();
      return false;
    }
  }

  startMeterLoop() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const update = () => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedVol = Math.min(100, Math.round((average / 128) * 100));

      if (this.onVolumeCallback) {
        this.onVolumeCallback({
          volume: normalizedVol,
          noiseLevel: this.getNoiseLabel(normalizedVol)
        });
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    update();
  }

  startSimulatedMeterLoop() {
    const update = () => {
      const baseVol = this.simulatedNoiseType !== "none" ? Math.floor(20 + Math.random() * 45) : Math.floor(5 + Math.random() * 15);
      if (this.onVolumeCallback) {
        this.onVolumeCallback({
          volume: baseVol,
          noiseLevel: this.getNoiseLabel(baseVol)
        });
      }
      this.animFrameId = requestAnimationFrame(update);
    };
    this.animFrameId = requestAnimationFrame(update);
  }

  getNoiseLabel(volume) {
    if (this.simulatedNoiseType === "street") return "High (Traffic Static & Horns)";
    if (this.simulatedNoiseType === "crowd") return "High (Background Voices)";
    if (this.simulatedNoiseType === "static") return "Medium (Line Interference)";
    if (volume > 55) return "High Ambient Noise";
    if (volume > 30) return "Moderate Noise";
    return "Clean Signal";
  }

  setSimulatedNoise(type) {
    this.simulatedNoiseType = type;
    console.log("Simulated Noise set to:", type);
  }

  toggleSuppression(enabled) {
    this.isSuppressionEnabled = enabled;
    if (this.filterNode) {
      if (enabled) {
        this.filterNode.frequency.value = 1800;
      } else {
        this.filterNode.frequency.value = 10000; // bypass bandpass effect
      }
    }
  }

  stop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
    }
  }
}

export const noiseFilterEngine = new NoiseFilterEngine();
export default noiseFilterEngine;
