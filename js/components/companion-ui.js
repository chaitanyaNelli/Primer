/**
 * THE PRIMER — COMPANION AVATAR & CONVERSATIONAL TUTOR UI (ENHANCED)
 * Renders the living companion avatar (Aether), speech bubbles, and "Ask Aether Anything" conversational chat.
 */

import { speech } from '../speech/speech-engine.js';
import { tutor } from '../ai/primer-tutor.js';
import { sound } from '../audio/sound-synth.js';
import { contextMemory } from '../ai/context-memory.js';

export class CompanionUI {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentMood = 'curious';
    this.isSpeaking = false;
    this.speechTimeout = null;
    this.init();
  }

  init() {
    this.render();

    tutor.onStateChange = ({ mood, dialogueText }) => {
      this.updateMood(mood);
      if (dialogueText) {
        this.say(dialogueText);
      }
    };

    speech.onSpeakingStateChange = (speaking) => {
      this.isSpeaking = speaking;
      const wave = document.getElementById('voice-wave-bars');
      if (wave) {
        if (speaking) wave.classList.add('speaking');
        else wave.classList.remove('speaking');
      }
    };
  }

  render() {
    const profile = contextMemory.profile;

    this.container.innerHTML = `
      <div class="companion-card gold-border">
        <div class="avatar-viewport">
          <div class="avatar-aura ${this.currentMood}" id="companion-aura"></div>
          <div id="companion-svg-container" class="avatar-character-svg" title="Click to hear me speak!">
            ${this.getAvatarSVG(this.currentMood)}
          </div>
        </div>

        <div class="companion-status-tag">
          <span class="status-dot"></span>
          <span id="companion-mood-label">Companion: Curious</span>
        </div>

        <div class="companion-speech-bubble" id="companion-bubble">
          <span id="companion-text">Welcome, ${profile.name}! I am Aether, your patient guide through the living pages of the Primer.</span>
        </div>

        <div class="voice-wave-indicator" id="voice-wave-bars">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>

        <!-- Ask Aether Anything Chat Box -->
        <div style="width: 100%; margin-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px;">
          <div style="display: flex; gap: 6px;">
            <input type="text" id="companion-ask-input" placeholder="Ask Aether any question..." style="flex: 1; padding: 8px 12px; border-radius: var(--radius-full); background: rgba(0,0,0,0.35); border: 1px solid var(--gold-border); color: #fff; font-family: var(--font-kids); font-size: 0.9rem; outline: none;" />
            <button class="btn-secondary btn-icon" id="btn-companion-voice-ask" style="width: 34px; height: 34px; font-size: 0.9rem;" title="Speak question">🎙️</button>
            <button class="btn-primer btn-icon" id="btn-companion-submit-ask" style="width: 34px; height: 34px; font-size: 0.9rem;" title="Send question">✨</button>
          </div>
        </div>
      </div>

      <div class="socratic-hints-card gold-border">
        <div class="hint-header-row">
          <span class="hint-title">💡 Socratic Guidance</span>
          <button class="btn-primer btn-icon" id="btn-request-hint" style="width: 30px; height: 30px; font-size: 0.8rem;" title="Ask for next clue">✨</button>
        </div>
        <div class="hint-steps-ladder" id="socratic-hint-list">
          <div class="hint-step-item unlocked" id="hint-step-1">
            <strong>🌱 Clue 1:</strong> Explore the living codex freely — every discovery brings new wisdom!
          </div>
        </div>
      </div>
    `;

    // Click companion to repeat message
    const svgEl = document.getElementById('companion-svg-container');
    if (svgEl) {
      svgEl.addEventListener('click', () => {
        const text = document.getElementById('companion-text').textContent;
        speech.speak(text);
      });
    }

    const hintBtn = document.getElementById('btn-request-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        tutor.registerUserAction();
        this.unlockNextHint();
      });
    }

    // "Ask Aether Anything" event handlers
    const askInput = this.container.querySelector('#companion-ask-input');
    const submitBtn = this.container.querySelector('#btn-companion-submit-ask');
    const voiceBtn = this.container.querySelector('#btn-companion-voice-ask');

    const handleAsk = async () => {
      const q = askInput.value.trim();
      if (!q) return;
      askInput.value = '';
      sound.play('pop');
      this.say("Thinking about your question... ✨");

      try {
        const resp = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contextMemory.profile.name,
            query: q
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.reply) {
            this.say(data.reply);
            speech.speak(data.reply);
            return;
          }
        }
      } catch (e) {
        console.warn('Tutor chat API offline:', e);
      }

      const defaultReply = `That is a magnificent question, ${contextMemory.profile.name}! Everything in the universe is connected by invisible threads of wonder.`;
      this.say(defaultReply);
      speech.speak(defaultReply);
    };

    submitBtn.addEventListener('click', handleAsk);
    askInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAsk();
    });

    voiceBtn.addEventListener('click', () => {
      speech.listen((transcript) => {
        askInput.value = transcript;
        handleAsk();
      });
    });
  }

  getAvatarSVG(mood) {
    let eyeShape = `<circle cx="42" cy="46" r="7" fill="#12172b"/><circle cx="44" cy="44" r="2.5" fill="#ffffff"/><circle cx="68" cy="46" r="7" fill="#12172b"/><circle cx="70" cy="44" r="2.5" fill="#ffffff"/>`;
    let mouth = `<path d="M 50 62 Q 55 67 60 62" stroke="#d48b28" stroke-width="3" fill="none" stroke-linecap="round"/>`;

    if (mood === 'celebrating') {
      eyeShape = `<path d="M 36 48 Q 42 40 48 48" stroke="#12172b" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M 62 48 Q 68 40 74 48" stroke="#12172b" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M 48 60 Q 55 72 62 60 Z" fill="#ff5d8f"/>`;
    } else if (mood === 'patient' || mood === 'mindful') {
      eyeShape = `<path d="M 37 46 Q 42 50 47 46" stroke="#12172b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M 63 46 Q 68 50 73 46" stroke="#12172b" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M 50 62 Q 55 65 60 62" stroke="#d48b28" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    }

    return `
      <svg viewBox="0 0 110 110" width="100%" height="100%">
        <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255, 215, 0, 0.4)" stroke-width="1.5" stroke-dasharray="4 6"/>
        <ellipse cx="55" cy="58" rx="34" ry="38" fill="url(#avatar-grad)"/>
        <ellipse cx="55" cy="65" rx="20" ry="24" fill="#fdfaf4" opacity="0.92"/>
        <path d="M 32 30 L 22 14 L 38 24 Z" fill="#ffd166"/>
        <path d="M 78 30 L 88 14 L 72 24 Z" fill="#ffd166"/>
        ${eyeShape}
        ${mouth}
        <defs>
          <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4deeea"/>
            <stop offset="60%" stop-color="#3a86ff"/>
            <stop offset="100%" stop-color="#9d4edd"/>
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  updateMood(mood) {
    this.currentMood = mood;
    const aura = document.getElementById('companion-aura');
    const svgContainer = document.getElementById('companion-svg-container');
    const label = document.getElementById('companion-mood-label');

    if (aura) aura.className = `avatar-aura ${mood}`;
    if (svgContainer) svgContainer.innerHTML = this.getAvatarSVG(mood);
    if (label) {
      const moodTitles = {
        curious: 'Companion: Curious',
        happy: 'Companion: Joyful',
        patient: 'Companion: Gentle & Patient',
        celebrating: 'Companion: Celebrating!',
        mindful: 'Companion: Mindful Breath'
      };
      label.textContent = moodTitles[mood] || 'Companion: Attentive';
    }
  }

  say(text) {
    const bubble = document.getElementById('companion-text');
    if (!bubble) return;

    bubble.textContent = '';
    let i = 0;
    if (this.speechTimeout) clearInterval(this.speechTimeout);

    this.speechTimeout = setInterval(() => {
      if (i < text.length) {
        bubble.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.speechTimeout);
      }
    }, 18);
  }

  updateSocraticHints(hints = []) {
    const container = document.getElementById('socratic-hint-list');
    if (!container) return;

    this.currentHints = hints;
    this.unlockedHintIndex = 0;

    container.innerHTML = hints.map((h, idx) => `
      <div class="hint-step-item ${idx === 0 ? 'unlocked' : ''}" id="hint-step-${idx + 1}" data-index="${idx}">
        <strong>${h.title}:</strong>
        <span>${idx === 0 ? h.content : '🔒 Tap to unlock clue'}</span>
      </div>
    `).join('');

    container.querySelectorAll('.hint-step-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        this.unlockHint(idx);
      });
    });
  }

  unlockHint(idx) {
    if (!this.currentHints || !this.currentHints[idx]) return;
    const item = document.getElementById(`hint-step-${idx + 1}`);
    if (item) {
      item.classList.add('unlocked');
      item.innerHTML = `<strong>${this.currentHints[idx].title}:</strong> <span>${this.currentHints[idx].content}</span>`;
      tutor.setMood('patient', this.currentHints[idx].content);
      speech.speak(this.currentHints[idx].content);
    }
  }

  unlockNextHint() {
    if (!this.currentHints) return;
    const nextIdx = (this.unlockedHintIndex || 0) + 1;
    if (nextIdx < this.currentHints.length) {
      this.unlockedHintIndex = nextIdx;
      this.unlockHint(nextIdx);
    }
  }
}
