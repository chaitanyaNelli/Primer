/**
 * THE PRIMER — MAIN APPLICATION CONTROLLER
 * Integrates Starfield Canvas, Realm Coordinator, AI Companion, and Modals.
 */

import { sound } from './audio/sound-synth.js';
import { speech } from './speech/speech-engine.js';
import { contextMemory } from './ai/context-memory.js';
import { mastery } from './ai/mastery-graph.js';
import { tutor } from './ai/primer-tutor.js';

import { CompanionUI } from './components/companion-ui.js';
import { MindfulPause } from './components/mindful-pause.js';
import { ParentPortal } from './components/parent-portal.js';

import { ReadingRealm } from './modules/reading-realm.js';
import { WritingRealm } from './modules/writing-realm.js';
import { MathRealm } from './modules/math-realm.js';

class PrimerApp {
  constructor() {
    this.currentRealm = 'reading'; // 'reading' | 'writing' | 'math'
    this.companionUI = null;
    this.mindfulPause = null;
    this.parentPortal = null;
    this.readingRealm = null;
    this.writingRealm = null;
    this.mathRealm = null;
  }

  init() {
    this.initStarfield();
    this.initUI();
    this.initRealms();
    this.bindEvents();
    this.updateProfileDisplay();

    // Initial warm welcome
    setTimeout(() => {
      const greeting = contextMemory.getGreeting();
      tutor.setMood('happy', greeting);
      sound.play('harp');
    }, 600);
  }

  initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const stars = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speed: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#090b16');
      grad.addColorStop(0.5, '#0e1226');
      grad.addColorStop(1, '#080a14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        star.alpha += star.alphaSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.2) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        ctx.fillStyle = `rgba(255, 230, 160, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  initUI() {
    const companionContainer = document.getElementById('companion-container');
    const mindfulModal = document.getElementById('mindful-pause-modal');
    const parentModal = document.getElementById('parent-portal-modal');

    this.companionUI = new CompanionUI(companionContainer);
    this.mindfulPause = new MindfulPause(mindfulModal);
    this.parentPortal = new ParentPortal(parentModal, () => {
      this.updateProfileDisplay();
    });
  }

  initRealms() {
    const realmContainer = document.getElementById('realm-content-container');
    this.readingRealm = new ReadingRealm(realmContainer, this.companionUI);
    this.writingRealm = new WritingRealm(realmContainer, this.companionUI);
    this.mathRealm = new MathRealm(realmContainer, this.companionUI);

    this.switchRealm('reading');
  }

  switchRealm(realmKey) {
    this.currentRealm = realmKey;
    sound.play('pageFlip');

    // Update active tab button
    document.querySelectorAll('.realm-tab').forEach(tab => {
      if (tab.dataset.realm === realmKey) tab.classList.add('active');
      else tab.classList.remove('active');
    });

    // Update header labels
    const realmTitles = {
      reading: { title: "The Scribe's Haven", sub: 'Phonemic Alchemy & Living Stories', icon: '📖' },
      writing: { title: "The Runecrafter's Workshop", sub: 'Stardust Penmanship & Story Weaving', icon: '✍️' },
      math: { title: "The Chrono-Alchemist's Spire", sub: 'Visual Manipulatives & Spatial Logic', icon: '🔢' }
    };

    const info = realmTitles[realmKey];
    document.getElementById('book-realm-title').textContent = info.title;
    document.getElementById('book-realm-sublevel').textContent = info.sub;
    document.getElementById('book-realm-icon').textContent = info.icon;

    // Mount corresponding module
    if (realmKey === 'reading') this.readingRealm.mount();
    else if (realmKey === 'writing') this.writingRealm.mount();
    else if (realmKey === 'math') this.mathRealm.mount();

    this.updateProgressIndicator();
  }

  updateProfileDisplay() {
    const profile = contextMemory.profile;
    const stats = mastery.state;

    document.getElementById('header-learner-name').textContent = profile.name;
    document.getElementById('header-learner-level').textContent = `Lvl ${stats.level} • ⭐ ${stats.stars}`;
    document.getElementById('header-learner-avatar').textContent = profile.avatar || '🦉';

    this.updateProgressIndicator();
  }

  updateProgressIndicator() {
    const score = mastery.getOverallMastery();
    const fill = document.getElementById('book-progress-fill');
    const label = document.getElementById('book-progress-label');
    if (fill) fill.style.width = `${score}%`;
    if (label) label.textContent = `${score}% Mastery`;
  }

  bindEvents() {
    // Realm switcher buttons
    document.querySelectorAll('.realm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchRealm(tab.dataset.realm);
      });
    });

    // Parent Portal button & profile chip
    document.getElementById('btn-open-parent-portal').addEventListener('click', () => {
      this.parentPortal.open();
    });

    document.getElementById('learner-profile-btn').addEventListener('click', () => {
      this.parentPortal.open();
    });

    // Mindful Pause trigger button
    document.getElementById('btn-manual-mindful-pause').addEventListener('click', () => {
      this.mindfulPause.open();
    });

    // Audio mute toggle
    const soundToggle = document.getElementById('btn-toggle-sound');
    soundToggle.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      soundToggle.textContent = isMuted ? '🔇' : '🔊';
      soundToggle.title = isMuted ? 'Unmute Sound' : 'Mute Sound';
    });

    // Global first click unlocks audio context
    window.addEventListener('click', () => sound.unlock(), { once: true });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PrimerApp();
  app.init();
  window.__PRIMER_APP__ = app;
});
