// Web Speech API Continuous Listener with Interruption Handling & Silence Debouncing

class SpeechRecognitionEngine {
  constructor() {
    this.isListening = false;
    this.onResultCallback = null;
    this.onInterruptionCallback = null;
    this.onErrorCallback = null;
    this.shouldKeepListening = false;
    this.recognition = null;
    this.silenceTimer = null;
    this.lastInterimText = "";
    this.lastProcessedText = "";
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = "en-IN"; // Supports English & Hindi / Indian accent speech smoothly
        this.setupListeners();
      } catch (e) {
        console.warn("[Web Speech API] Initialization error:", e);
        this.recognition = null;
      }
    } else {
      console.warn("[Web Speech API] SpeechRecognition not supported in this browser environment.");
      this.recognition = null;
    }
  }

  setupListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("[Web Speech API] Speech recognition active and listening to mic...");
    };

    this.recognition.onresult = (event) => {
      let finalChunk = "";
      let interimTranscript = "";
      let highestConfidence = 85;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        const confidence = Math.round((event.results[i][0].confidence || 0.85) * 100);
        if (confidence > highestConfidence) highestConfidence = confidence;

        if (event.results[i].isFinal) {
          finalChunk += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const trimmedFinal = finalChunk.trim();
      const trimmedInterim = interimTranscript.trim();

      if (trimmedInterim) {
        this.lastInterimText = trimmedInterim;
        if (this.onInterruptionCallback) {
          this.onInterruptionCallback(trimmedInterim);
        }

        // Silence Timer: If user stops talking for 700ms, auto-commit interim transcript to AI model
        clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          if (this.lastInterimText && this.lastInterimText !== this.lastProcessedText) {
            const textToProcess = this.lastInterimText;
            this.lastProcessedText = textToProcess;
            this.lastInterimText = "";
            console.log("[Web Speech API] Silence threshold reached. Feeding speech to AI model:", textToProcess);
            if (this.onResultCallback) {
              this.onResultCallback({
                text: textToProcess,
                isFinal: true,
                confidence: highestConfidence > 0 ? highestConfidence : 85
              });
            }
          }
        }, 700);
      }

      if (trimmedFinal && trimmedFinal !== this.lastProcessedText) {
        clearTimeout(this.silenceTimer);
        this.lastProcessedText = trimmedFinal;
        this.lastInterimText = "";
        console.log("[Web Speech API] Final speech recognized. Feeding to AI model:", trimmedFinal);
        if (this.onResultCallback) {
          this.onResultCallback({
            text: trimmedFinal,
            isFinal: true,
            confidence: highestConfidence > 0 ? highestConfidence : 85
          });
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("[Web Speech API] Recognition error:", event.error);
      if (event.error === 'no-speech') {
        return;
      }
      if (this.onErrorCallback) this.onErrorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      clearTimeout(this.silenceTimer);
      
      // Auto-flush any remaining interim speech when recognition ends
      if (this.lastInterimText && this.lastInterimText !== this.lastProcessedText) {
        const textToProcess = this.lastInterimText;
        this.lastProcessedText = textToProcess;
        this.lastInterimText = "";
        if (this.onResultCallback) {
          this.onResultCallback({
            text: textToProcess,
            isFinal: true,
            confidence: 85
          });
        }
      }

      if (this.shouldKeepListening) {
        setTimeout(() => {
          if (this.shouldKeepListening && !this.isListening && this.recognition) {
            try {
              this.recognition.start();
            } catch (e) {
              console.warn("[Web Speech API] Auto-restart skipped:", e.message);
            }
          }
        }, 300);
      }
    };
  }

  start(onResult, onInterruption, onError) {
    this.onResultCallback = onResult;
    this.onInterruptionCallback = onInterruption;
    this.onErrorCallback = onError;
    this.shouldKeepListening = true;
    this.lastInterimText = "";
    this.lastProcessedText = "";

    if (!this.recognition) {
      this.initRecognition();
    }

    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.warn("[Web Speech API] Failed to start:", err);
      }
    }
  }

  stop() {
    this.shouldKeepListening = false;
    clearTimeout(this.silenceTimer);
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("[Web Speech API] Error stopping:", e);
      }
    }
    this.isListening = false;
  }
}

export const speechRecognitionEngine = new SpeechRecognitionEngine();
export default speechRecognitionEngine;
