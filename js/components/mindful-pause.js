/**
 * THE PRIMER — MINDFUL PAUSE & EMOTIONAL REGULATION
 * Calming breathing orb mini-game that helps children reset attention and emotional state.
 */

import { sound } from '../audio/sound-synth.js';
import { tutor } from '../ai/primer-tutor.js';

export class MindfulPause {
  constructor(modalElement) {
    this.modal = modalElement;
    this.interval = null;
    this.step = 0;
    this.isActive = false;
    this.init();
  }

  init() {
    this.render();

    tutor.onMindfulPauseRequested = () => {
      this.open();
    };
  }

  render() {
    this.modal.innerHTML = `
      <div class="mindful-card">
        <h2 style="font-family: var(--font-title); font-size: 1.5rem; color: var(--gold-glow); margin-bottom: 8px;">
          ✨ Starlight Pause ✨
        </h2>
        <p style="color: var(--text-cosmic-muted); font-size: 0.95rem; font-family: var(--font-kids);">
          Let's rest our minds and breathe with the celestial orb.
        </p>

        <div class="breathing-orb-container">
          <div class="breathing-orb" id="breathing-orb-element"></div>
        </div>

        <div class="breathing-prompt-text" id="breathing-prompt-text">
          Breathe In Slowly...
        </div>

        <div style="margin-top: 24px; display: flex; gap: 14px;">
          <button class="btn-primer" id="btn-finish-mindful">
            I Feel Calm & Ready! 🌟
          </button>
        </div>
      </div>
    `;

    const finishBtn = this.modal.querySelector('#btn-finish-mindful');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.close();
      });
    }
  }

  open() {
    this.isActive = true;
    this.modal.classList.add('active');
    this.startBreathingCycle();
  }

  close() {
    this.isActive = false;
    this.modal.classList.remove('active');
    if (this.interval) clearInterval(this.interval);
    tutor.consecutiveMistakes = 0;
    tutor.setMood('curious', "You did wonderfully. Let's resume our quest with a fresh, clear mind!");
    sound.play('sparkle');
  }

  startBreathingCycle() {
    const orb = document.getElementById('breathing-orb-element');
    const prompt = document.getElementById('breathing-prompt-text');
    if (!orb || !prompt) return;

    let phase = 0; // 0 = Inhale (4s), 1 = Hold (3s), 2 = Exhale (4s)

    const cycle = () => {
      if (!this.isActive) return;

      if (phase === 0) {
        prompt.textContent = '🌟 Breathe In Starlight...';
        orb.classList.add('expand');
        sound.play('breatheIn');
        phase = 1;
        setTimeout(cycle, 4000);
      } else if (phase === 1) {
        prompt.textContent = '✨ Hold Gently...';
        phase = 2;
        setTimeout(cycle, 2500);
      } else {
        prompt.textContent = '🌊 Breathe Out & Release...';
        orb.classList.remove('expand');
        sound.play('breatheOut');
        phase = 0;
        setTimeout(cycle, 4000);
      }
    };

    cycle();
  }
}
