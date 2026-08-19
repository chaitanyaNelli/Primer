/**
 * THE PRIMER — WRITING & HANDWRITING REALM (ENHANCED)
 * The Runecrafter's Workshop: Stardust Handwriting Canvas, Anagram Forge & Multi-Chapter Co-Authoring.
 */

import { CURRICULUM } from '../data/curriculum.js';
import { sound } from '../audio/sound-synth.js';
import { speech } from '../speech/speech-engine.js';
import { tutor } from '../ai/primer-tutor.js';
import { contextMemory } from '../ai/context-memory.js';

export class WritingRealm {
  constructor(container, companionUI) {
    this.container = container;
    this.companionUI = companionUI;
    this.currentView = 'tracing'; // 'tracing' | 'storycraft' | 'anagram'
    this.currentRuneIndex = 0;
    this.currentColor = '#ffd700';
    this.isDrawing = false;
    this.drawnPoints = [];
    this.canvas = null;
    this.ctx = null;
    this.storyChapters = [];
  }

  mount() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="writing-realm-container">
        <!-- Sub navigation -->
        <div class="sub-nav">
          <button class="sub-nav-btn ${this.currentView === 'tracing' ? 'active' : ''}" id="btn-view-tracing">
            ✍️ Stardust Rune Tracer
          </button>
          <button class="sub-nav-btn ${this.currentView === 'storycraft' ? 'active' : ''}" id="btn-view-storycraft">
            🏰 Co-Author Story Weaver
          </button>
          <button class="sub-nav-btn ${this.currentView === 'anagram' ? 'active' : ''}" id="btn-view-anagram">
            🔨 Anagram Word Forge
          </button>
        </div>

        <div id="writing-content-stage">
          <!-- Dynamic Content Loaded Below -->
        </div>
      </div>
    `;

    this.container.querySelector('#btn-view-tracing').addEventListener('click', () => {
      this.currentView = 'tracing';
      this.render();
    });

    this.container.querySelector('#btn-view-storycraft').addEventListener('click', () => {
      this.currentView = 'storycraft';
      this.render();
    });

    this.container.querySelector('#btn-view-anagram').addEventListener('click', () => {
      this.currentView = 'anagram';
      this.render();
    });

    if (this.currentView === 'tracing') {
      this.renderTracingCanvas();
    } else if (this.currentView === 'storycraft') {
      this.renderStoryCrafter();
    } else {
      this.renderAnagramForge();
    }
  }

  renderTracingCanvas() {
    const stage = this.container.querySelector('#writing-content-stage');
    const rune = CURRICULUM.writing.runes[this.currentRuneIndex];

    stage.innerHTML = `
      <div class="tracing-canvas-wrapper">
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 12px;">
          <div>
            <span style="font-family: var(--font-title); font-size: 1.2rem; color: var(--text-parchment-ink);">
              Trace Rune: <strong style="color: var(--amber-warmth);">${rune.char}</strong>
            </span>
            <div style="font-family: var(--font-kids); font-size: 0.9rem; color: var(--text-parchment-muted);">
              "${rune.hint}"
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-icon" id="btn-prev-rune" style="width: 34px; height: 34px;">◀</button>
            <button class="btn-secondary btn-icon" id="btn-next-rune" style="width: 34px; height: 34px;">▶</button>
          </div>
        </div>

        <canvas id="tracing-canvas" width="360" height="300"></canvas>

        <div class="canvas-toolbar">
          <div class="ink-color-picker">
            <div class="ink-dot active" style="background: #ffd700;" data-color="#ffd700" title="Starlight Gold"></div>
            <div class="ink-dot" style="background: #4deeea;" data-color="#4deeea" title="Aurora Cyan"></div>
            <div class="ink-dot" style="background: #ff5d8f;" data-color="#ff5d8f" title="Mystic Rose"></div>
            <div class="ink-dot" style="background: #2ee6a8;" data-color="#2ee6a8" title="Emerald Light"></div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn-secondary" id="btn-clear-canvas">🧹 Clear Ink</button>
            <button class="btn-primer" id="btn-evaluate-tracing">✨ Check Rune!</button>
          </div>
        </div>
      </div>
    `;

    // Socratic hints
    this.companionUI.updateSocraticHints([
      { title: '🌟 Clue 1: Start at the Star', content: 'Begin your stroke at the glowing golden star and follow the path.' },
      { title: '✍️ Clue 2: Smooth Strokes', content: 'Draw smoothly without lifting your pen or finger.' },
      { title: '✨ Clue 3: Complete Shape', content: rune.hint }
    ]);

    tutor.setMood('curious', `Draw the rune '${rune.char}'. Connect the starlight guides!`);

    this.initCanvas(rune);

    stage.querySelector('#btn-prev-rune').addEventListener('click', () => {
      this.currentRuneIndex = (this.currentRuneIndex - 1 + CURRICULUM.writing.runes.length) % CURRICULUM.writing.runes.length;
      this.renderTracingCanvas();
    });

    stage.querySelector('#btn-next-rune').addEventListener('click', () => {
      this.currentRuneIndex = (this.currentRuneIndex + 1) % CURRICULUM.writing.runes.length;
      this.renderTracingCanvas();
    });

    stage.querySelector('#btn-clear-canvas').addEventListener('click', () => {
      this.clearCanvas(rune);
    });

    stage.querySelector('#btn-evaluate-tracing').addEventListener('click', () => {
      this.evaluateTracing(rune);
    });

    stage.querySelectorAll('.ink-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        stage.querySelectorAll('.ink-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        this.currentColor = dot.dataset.color;
        sound.play('pop');
      });
    });
  }

  initCanvas(rune) {
    this.canvas = this.container.querySelector('#tracing-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.drawnPoints = [];

    this.drawBackgroundGuide(rune);

    const start = (e) => {
      this.isDrawing = true;
      const pt = this.getCanvasPoint(e);
      this.drawnPoints.push(pt);
      sound.play('sparkle');
    };

    const move = (e) => {
      if (!this.isDrawing) return;
      const pt = this.getCanvasPoint(e);
      this.drawnPoints.push(pt);
      this.renderStrokes(rune);
    };

    const stop = () => {
      this.isDrawing = false;
    };

    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);

    this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e.touches[0]); }, { passive: false });
    this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e.touches[0]); }, { passive: false });
    this.canvas.addEventListener('touchend', stop);
  }

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
    };
  }

  drawBackgroundGuide(rune) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Handwriting guidelines
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([]);
    this.ctx.beginPath();
    this.ctx.moveTo(20, 50); this.ctx.lineTo(340, 50);
    this.ctx.moveTo(20, 250); this.ctx.lineTo(340, 250);
    this.ctx.stroke();

    this.ctx.strokeStyle = 'rgba(212, 168, 67, 0.35)';
    this.ctx.setLineDash([6, 6]);
    this.ctx.beginPath();
    this.ctx.moveTo(20, 150); this.ctx.lineTo(340, 150);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Guide Path
    this.ctx.strokeStyle = 'rgba(180, 140, 80, 0.22)';
    this.ctx.lineWidth = 26;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    rune.guidePoints.forEach((pt, idx) => {
      if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
      else this.ctx.lineTo(pt.x, pt.y);
    });
    this.ctx.stroke();

    // Checkpoint stars
    rune.guidePoints.forEach((pt, idx) => {
      this.ctx.fillStyle = idx === 0 ? '#ffd700' : 'rgba(180, 140, 80, 0.6)';
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, idx === 0 ? 8 : 5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  renderStrokes(rune) {
    this.drawBackgroundGuide(rune);

    if (this.drawnPoints.length < 2) return;

    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = 14;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowColor = this.currentColor;
    this.ctx.shadowBlur = 10;

    this.ctx.beginPath();
    this.ctx.moveTo(this.drawnPoints[0].x, this.drawnPoints[0].y);
    for (let i = 1; i < this.drawnPoints.length; i++) {
      this.ctx.lineTo(this.drawnPoints[i].x, this.drawnPoints[i].y);
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  clearCanvas(rune) {
    this.drawnPoints = [];
    this.drawBackgroundGuide(rune);
    sound.play('pop');
  }

  evaluateTracing(rune) {
    tutor.registerUserAction();
    if (this.drawnPoints.length < 12) {
      tutor.onMistake('writing', 'handwriting', { hint: 'Draw the full rune along the glowing path!' }, 'Short stroke');
      return;
    }

    let hits = 0;
    rune.guidePoints.forEach(guidePt => {
      const hit = this.drawnPoints.some(pt => {
        const dist = Math.hypot(pt.x - guidePt.x, pt.y - guidePt.y);
        return dist < 40;
      });
      if (hit) hits++;
    });

    const accuracy = hits / rune.guidePoints.length;
    if (accuracy >= 0.6) {
      tutor.onSuccess('writing', 'handwriting', `Traced rune '${rune.char}'`);
      sound.play('success');
    } else {
      tutor.onMistake('writing', 'handwriting', {
        hint: `Follow each starlight point from start to finish!`,
        hintMetaphor: rune.hint
      }, `Incomplete trace for '${rune.char}'`);
    }
  }

  renderStoryCrafter() {
    const stage = this.container.querySelector('#writing-content-stage');
    const prompt = CURRICULUM.writing.storyPrompts[0];
    const profile = contextMemory.profile;

    stage.innerHTML = `
      <div class="story-crafter-grid">
        <div class="ai-prompt-box">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.4rem;">🔮</span>
              <strong style="font-family: var(--font-title); color: #831843;">The AI Story Oracle</strong>
            </div>
            <span style="font-size: 0.75rem; color: #be185d; font-weight: 600;">Powered by Gemini</span>
          </div>

          <p style="font-family: var(--font-story); font-size: 1.15rem; line-height: 1.7; color: #2c1a1d; margin-bottom: 14px;">
            "${prompt.starter}"
          </p>
          <div style="font-family: var(--font-kids); font-weight: 700; color: #9d174d; margin-bottom: 8px;">
            ${prompt.question}
          </div>

          <div class="story-idea-pills">
            ${prompt.suggestedWords.map(w => `<span class="idea-pill" data-word="${w}">+ ${w}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <textarea class="story-input-textarea" id="coauthor-story-input" placeholder="Type or speak what happens next in your adventure, ${profile.name}..."></textarea>

          <div style="display: flex; gap: 10px;">
            <button class="btn-primer" id="btn-submit-story-turn">
              ✨ Weave Into Story!
            </button>
            <button class="btn-secondary" id="btn-story-mic">
              🎙️ Speak Idea
            </button>
          </div>

          <div id="story-weave-result" style="display: none; background: #ffffff; border-radius: var(--radius-md); padding: 14px; border: 2px solid var(--mystic-rose); font-family: var(--font-story); font-size: 1.1rem; line-height: 1.7;"></div>
        </div>
      </div>
    `;

    // Socratic hints
    this.companionUI.updateSocraticHints([
      { title: '📖 Clue 1: Imagination', content: 'What magical creature or surprise would you love to see in the story?' },
      { title: '✍️ Clue 2: Descriptive Words', content: 'Use glowing, sparkling, or mysterious words to describe it!' }
    ]);

    tutor.setMood('curious', `What happens next in your story, ${profile.name}? Pick an idea or write your own!`);

    const input = stage.querySelector('#coauthor-story-input');
    stage.querySelectorAll('.idea-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        input.value += (input.value ? ' ' : '') + pill.dataset.word;
        sound.play('pop');
      });
    });

    stage.querySelector('#btn-submit-story-turn').addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) {
        tutor.onMistake('writing', 'creativeWriting', { hint: 'Write or speak an idea for the story!' }, 'Empty story submission');
        return;
      }

      tutor.onSuccess('writing', 'creativeWriting', `Co-authored story with: ${text}`);
      const res = stage.querySelector('#story-weave-result');
      res.style.display = 'block';
      res.innerHTML = `<em>Weaving your imagination into the living tapestry... ✨</em>`;

      let chapterText = `As ${profile.name} approached the ${text}, a golden aura illuminated the sky, revealing a hidden passage to the ancient observatory! 🌌`;

      try {
        const response = await fetch('/api/story/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profile.name,
            theme: profile.currentTheme || 'dragons',
            input: text
          })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.chapter) chapterText = data.chapter;
        }
      } catch (err) {
        console.log('Backend API offline, using local story generation.');
      }

      res.innerHTML = `<strong>✨ Chapter Continues:</strong> ${chapterText}`;
      speech.speak(chapterText);
    });

    stage.querySelector('#btn-story-mic').addEventListener('click', () => {
      speech.listen((transcript) => {
        input.value += (input.value ? ' ' : '') + transcript;
        sound.play('sparkle');
      });
    });
  }

  // 3. ANAGRAM WORD FORGE MINI-GAME
  renderAnagramForge() {
    const stage = this.container.querySelector('#writing-content-stage');
    const anagramPuzzles = [
      { target: 'STAR', letters: ['T', 'S', 'R', 'A'], hint: 'A sparkling celestial diamond in the night sky' },
      { target: 'MOON', letters: ['O', 'M', 'N', 'O'], hint: 'Glows like silver over the sleeping world' },
      { target: 'BOOK', letters: ['O', 'B', 'K', 'O'], hint: 'Filled with wondrous tales and magical secrets' }
    ];
    const puzzle = anagramPuzzles[0];
    let placedLetters = [];

    stage.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 10px 0;">
        <div style="text-align: center;">
          <h3 style="font-family: var(--font-title); font-size: 1.3rem; color: var(--text-parchment-ink);">
            🔨 Anagram Rune Forge
          </h3>
          <p style="font-family: var(--font-kids); color: var(--text-parchment-muted);">
            Unscramble the scrambled runes to forge the word: "${puzzle.hint}"
          </p>
        </div>

        <div class="cauldron-slots" id="forge-slots" style="min-height: 80px;">
          ${puzzle.target.split('').map((_, idx) => `
            <div class="phoneme-drop-slot" id="forge-slot-${idx}">
              <span class="phoneme-slot-char">_</span>
            </div>
          `).join('')}
        </div>

        <div class="letter-gem-bank" id="forge-gem-bank">
          ${puzzle.letters.map((char, idx) => `
            <div class="letter-gem forge-gem" data-char="${char}" data-idx="${idx}">
              <span>${char}</span>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn-primer" id="btn-forge-submit">✨ Forge Word!</button>
          <button class="btn-secondary" id="btn-forge-reset">🔄 Reset</button>
        </div>
      </div>
    `;

    // Socratic hints
    this.companionUI.updateSocraticHints([
      { title: '🔨 Clue 1: First Letter', content: `The word begins with letter '${puzzle.target[0]}'.` },
      { title: '🔍 Clue 2: Rhyme Clue', content: `It rhymes with "FAR" and "CAR"!` }
    ]);

    tutor.setMood('curious', `Unscramble the letters to forge "${puzzle.target}".`);

    stage.querySelectorAll('.forge-gem').forEach(gem => {
      gem.addEventListener('click', () => {
        if (placedLetters.length < puzzle.target.length) {
          const char = gem.dataset.char;
          placedLetters.push(char);
          gem.style.opacity = '0.3';
          gem.style.pointerEvents = 'none';

          const slotEl = stage.querySelector(`#forge-slot-${placedLetters.length - 1}`);
          if (slotEl) {
            slotEl.classList.add('filled');
            slotEl.innerHTML = `<span class="phoneme-slot-char" style="color: #0369a1;">${char}</span>`;
          }
          sound.play('pop');
        }
      });
    });

    stage.querySelector('#btn-forge-submit').addEventListener('click', () => {
      const attempt = placedLetters.join('');
      if (attempt === puzzle.target) {
        tutor.onSuccess('writing', 'handwriting', `Forged anagram: ${puzzle.target}`);
        sound.play('success');
      } else {
        tutor.onMistake('writing', 'handwriting', { hint: `Try putting '${puzzle.target[0]}' first!` }, `Attempted ${attempt}`);
      }
    });

    stage.querySelector('#btn-forge-reset').addEventListener('click', () => {
      this.renderAnagramForge();
    });
  }
}
