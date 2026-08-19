/**
 * THE PRIMER — SPEECH SYNTHESIS & RECOGNITION ENGINE
 * Natural, soothing voice synthesis and real-time speech recognition for reading practice.
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.selectedVoice = null;
    this.recognition = null;
    this.isListening = false;
    this.onSpeakingStateChange = null;

    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    const load = () => {
      this.voices = this.synth.getVoices();
      // Look for pleasant, clear English voices
      this.selectedVoice = this.voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Ava') || v.name.includes('Female')) && v.lang.startsWith('en')
      ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    };

    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  /**
   * Speak text with expressive, gentle pacing suited for a child tutor
   */
  speak(text, { rate = 0.9, pitch = 1.15, onStart = null, onEnd = null } = {}) {
    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, 2000);
      return;
    }

    // Cancel ongoing speech to avoid overlap
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  /**
   * Listen to the child reading aloud
   */
  listen(onResult, onError) {
    if (!this.recognition) {
      console.log('Speech recognition not supported in this browser. Simulating voice check.');
      if (onError) onError('Speech recognition not available on this browser.');
      return;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        this.isListening = false;
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        const confidence = event.results[0][0].confidence;
        if (onResult) onResult(transcript, confidence);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speech = new SpeechEngine();
