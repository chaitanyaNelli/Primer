/**
 * THE PRIMER — MATHEMATICS REALM (AI ADAPTIVE)
 * The Chrono-Alchemist's Spire: Adaptive Real-Time Ten-Frames, Balance Scales, Fraction Slicers, and Number Line Hops.
 */

import { CURRICULUM } from '../data/curriculum.js';
import { sound } from '../audio/sound-synth.js';
import { speech } from '../speech/speech-engine.js';
import { tutor } from '../ai/primer-tutor.js';
import { contextMemory } from '../ai/context-memory.js';
import { AdaptiveGenerator } from '../ai/adaptive-generator.js';

export class MathRealm {
  constructor(container, companionUI) {
    this.container = container;
    this.companionUI = companionUI;
    this.currentView = 'tenframe'; // 'tenframe' | 'balance' | 'fractions' | 'numberline'
    this.tfIndex = 0;
    this.balanceIndex = 0;
    this.fractionIndex = 0;
    this.nlIndex = 0;
    this.tenFrameOrbs = [];
    this.currentCustomChallenge = null;
  }

  mount() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="math-realm-container">
        <!-- Sub navigation -->
        <div class="sub-nav" style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 8px;">
            <button class="sub-nav-btn ${this.currentView === 'tenframe' ? 'active' : ''}" id="btn-view-tenframe">
              🪐 Ten-Frames
            </button>
            <button class="sub-nav-btn ${this.currentView === 'balance' ? 'active' : ''}" id="btn-view-balance">
              ⚖️ Balance Scale
            </button>
            <button class="sub-nav-btn ${this.currentView === 'fractions' ? 'active' : ''}" id="btn-view-fractions">
              🍕 Fraction Slicer
            </button>
            <button class="sub-nav-btn ${this.currentView === 'numberline' ? 'active' : ''}" id="btn-view-numberline">
              🚀 Number Line Hop
            </button>
          </div>

          <button class="btn-primer" id="btn-ai-adaptive-math" style="font-size: 0.82rem; padding: 5px 12px; background: linear-gradient(135deg, #ffd166 0%, #ff9e00 100%); color: #2a1800;">
            🤖 Generate for My Level
          </button>
        </div>

        <div id="math-content-stage">
          <!-- Dynamic Content Loaded Below -->
        </div>
      </div>
    `;

    this.container.querySelector('#btn-view-tenframe').addEventListener('click', () => {
      this.currentView = 'tenframe';
      this.currentCustomChallenge = null;
      this.render();
    });

    this.container.querySelector('#btn-view-balance').addEventListener('click', () => {
      this.currentView = 'balance';
      this.currentCustomChallenge = null;
      this.render();
    });

    this.container.querySelector('#btn-view-fractions').addEventListener('click', () => {
      this.currentView = 'fractions';
      this.currentCustomChallenge = null;
      this.render();
    });

    this.container.querySelector('#btn-view-numberline').addEventListener('click', () => {
      this.currentView = 'numberline';
      this.currentCustomChallenge = null;
      this.render();
    });

    this.container.querySelector('#btn-ai-adaptive-math').addEventListener('click', async () => {
      sound.play('sparkle');
      tutor.setMood('curious', `Calibrating a math challenge to your exact mastery graph... 🔢`);
      const challenge = await AdaptiveGenerator.getNextChallenge('math', 'numberSense');
      if (challenge) {
        this.currentCustomChallenge = challenge;
        if (challenge.type === 'tenframe') this.currentView = 'tenframe';
        else if (challenge.type === 'balance') this.currentView = 'balance';
        else if (challenge.type === 'fraction') this.currentView = 'fractions';
        else if (challenge.type === 'numberline') this.currentView = 'numberline';
        this.render();
      }
    });

    switch (this.currentView) {
      case 'tenframe': this.renderTenFrame(); break;
      case 'balance': this.renderBalanceScale(); break;
      case 'fractions': this.renderFractionSlicer(); break;
      case 'numberline': this.renderNumberLine(); break;
    }
  }

  // 1. TEN-FRAME MANIPULATIVE
  renderTenFrame() {
    const stage = this.container.querySelector('#math-content-stage');
    const challenge = this.currentCustomChallenge || CURRICULUM.math.tenFrameChallenges[this.tfIndex];
    
    this.tenFrameOrbs = new Array(10).fill(false);
    for (let i = 0; i < challenge.initialCount; i++) {
      this.tenFrameOrbs[i] = true;
    }

    stage.innerHTML = `
      <div class="ten-frame-wrapper">
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
          <div style="font-family: var(--font-kids); font-size: 0.9rem; color: var(--text-parchment-muted);">
            ${this.currentCustomChallenge ? '✨ AI Real-Time Adaptive Challenge' : `Challenge ${this.tfIndex + 1} of ${CURRICULUM.math.tenFrameChallenges.length}`}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-icon" id="btn-prev-tf" style="width: 32px; height: 32px;">◀</button>
            <button class="btn-secondary btn-icon" id="btn-next-tf" style="width: 32px; height: 32px;">▶</button>
          </div>
        </div>

        <div class="math-challenge-banner" style="width: 100%;">
          <div>
            <div style="font-size: 0.85rem; color: var(--amber-warmth); text-transform: uppercase; font-weight: 700;">
              ${challenge.title}
            </div>
            <div class="math-question-text">
              ${challenge.instruction}
            </div>
          </div>
          <button class="btn-primer btn-icon" id="btn-speak-math-question" title="Listen to question">🔊</button>
        </div>

        <div class="ten-frame-grid" id="ten-frame-grid">
          ${this.tenFrameOrbs.map((active, idx) => `
            <div class="ten-frame-cell" data-index="${idx}">
              ${active ? `<div class="crystal-orb">⭐</div>` : ''}
            </div>
          `).join('')}
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          <button class="btn-primer" id="btn-check-ten-frame">
            ✨ Submit Ten-Frame!
          </button>
          <button class="btn-secondary" id="btn-reset-ten-frame">
            🔄 Reset
          </button>
        </div>
      </div>
    `;

    // Socratic hints
    this.companionUI.updateSocraticHints([
      { title: '🪐 Clue 1: Five on Top', content: 'Notice the top row has 5 slots. If 5 are filled, you are halfway to 10!' },
      { title: '🔍 Clue 2: Missing Slots', content: `Count the empty spaces to reach ${challenge.targetSum}.` },
      { title: '✨ Clue 3: Solution Clue', content: `${challenge.initialCount} + ${challenge.correctAnswer} = ${challenge.targetSum}!` }
    ]);

    tutor.setMood('curious', `Target is ${challenge.targetSum} orbs. Tap the cells to place or remove crystals!`);

    stage.querySelector('#btn-prev-tf').addEventListener('click', () => {
      this.currentCustomChallenge = null;
      this.tfIndex = (this.tfIndex - 1 + CURRICULUM.math.tenFrameChallenges.length) % CURRICULUM.math.tenFrameChallenges.length;
      this.renderTenFrame();
    });
    stage.querySelector('#btn-next-tf').addEventListener('click', () => {
      this.currentCustomChallenge = null;
      this.tfIndex = (this.tfIndex + 1) % CURRICULUM.math.tenFrameChallenges.length;
      this.renderTenFrame();
    });

    stage.querySelector('#btn-speak-math-question').addEventListener('click', () => {
      speech.speak(challenge.instruction);
    });

    const cells = stage.querySelectorAll('.ten-frame-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const idx = parseInt(cell.dataset.index, 10);
        this.tenFrameOrbs[idx] = !this.tenFrameOrbs[idx];
        sound.play('pop');
        cell.innerHTML = this.tenFrameOrbs[idx] ? `<div class="crystal-orb blue">💎</div>` : '';
      });
    });

    stage.querySelector('#btn-check-ten-frame').addEventListener('click', async () => {
      tutor.registerUserAction();
      const currentFilledCount = this.tenFrameOrbs.filter(Boolean).length;
      if (currentFilledCount === challenge.targetSum) {
        tutor.onSuccess('math', 'numberSense', `Completed 10-Frame challenge ${challenge.title}`);
        sound.play('success');
        setTimeout(async () => {
          const next = await AdaptiveGenerator.getNextChallenge('math', 'numberSense');
          if (next) {
            this.currentCustomChallenge = next;
          } else {
            this.tfIndex = (this.tfIndex + 1) % CURRICULUM.math.tenFrameChallenges.length;
          }
          this.renderTenFrame();
        }, 1800);
      } else {
        const dynamicHint = await AdaptiveGenerator.getDynamicSocraticHint(challenge.instruction, `Placed ${currentFilledCount}`);
        tutor.onMistake('math', 'numberSense', {
          hint: dynamicHint || `Currently you have ${currentFilledCount} orbs. We need ${challenge.targetSum}!`,
          hintMetaphor: challenge.hintMetaphor
        }, `Counted ${currentFilledCount}`);
      }
    });

    stage.querySelector('#btn-reset-ten-frame').addEventListener('click', () => {
      this.renderTenFrame();
    });
  }

  // 2. BALANCE SCALE OF TRUTH
  renderBalanceScale() {
    const stage = this.container.querySelector('#math-content-stage');
    const challenge = this.currentCustomChallenge || CURRICULUM.math.balanceScaleChallenges[this.balanceIndex];
    const totalLeft = challenge.leftWeights.reduce((a, b) => a + b, 0);

    stage.innerHTML = `
      <div class="math-realm-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-family: var(--font-kids); font-size: 0.9rem; color: var(--text-parchment-muted);">
            ${this.currentCustomChallenge ? '✨ AI Real-Time Adaptive Scale' : `Scale Challenge ${this.balanceIndex + 1} of ${CURRICULUM.math.balanceScaleChallenges.length}`}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-icon" id="btn-prev-balance" style="width: 32px; height: 32px;">◀</button>
            <button class="btn-secondary btn-icon" id="btn-next-balance" style="width: 32px; height: 32px;">▶</button>
          </div>
        </div>

        <div class="math-challenge-banner">
          <div>
            <div style="font-size: 0.85rem; color: var(--amber-warmth); text-transform: uppercase; font-weight: 700;">
              ${challenge.title}
            </div>
            <div class="math-question-text">
              ${challenge.instruction}
            </div>
          </div>
        </div>

        <div class="balance-scale-stage">
          <div class="scale-beam" id="scale-beam-bar">
            <div class="scale-pan left" id="scale-pan-left">
              ${challenge.leftWeights.join(' + ')} (= ${totalLeft})
            </div>
            <div class="scale-pan right" id="scale-pan-right">
              ${challenge.rightWeights.join(' + ')} + ?
            </div>
          </div>
          <div class="scale-fulcrum"></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 20px;">
          <div style="font-family: var(--font-kids); font-size: 1rem; color: var(--text-parchment-muted);">
            Choose a weight gem to balance the right pan:
          </div>
          <div style="display: flex; gap: 14px;">
            ${challenge.options.map(opt => `
              <button class="btn-primer btn-balance-opt" data-val="${opt}" style="min-width: 60px; font-size: 1.25rem;">
                ${opt} 💎
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const beam = stage.querySelector('#scale-beam-bar');
    beam.style.transform = 'rotate(-8deg)';

    this.companionUI.updateSocraticHints([
      { title: '⚖️ Clue 1: Total Left Weight', content: `Left pan total is ${totalLeft}.` },
      { title: '🔍 Clue 2: Right Pan Needed', content: `Find the number that makes the right side equal ${totalLeft}.` },
      { title: '✨ Clue 3: Exact Gem', content: `Missing weight is ${challenge.correctAnswer || challenge.targetMissingWeight}!` }
    ]);

    tutor.setMood('curious', `Left side has ${totalLeft}. Find the weight gem that balances it!`);

    stage.querySelector('#btn-prev-balance').addEventListener('click', () => {
      this.currentCustomChallenge = null;
      this.balanceIndex = (this.balanceIndex - 1 + CURRICULUM.math.balanceScaleChallenges.length) % CURRICULUM.math.balanceScaleChallenges.length;
      this.renderBalanceScale();
    });
    stage.querySelector('#btn-next-balance').addEventListener('click', () => {
      this.currentCustomChallenge = null;
      this.balanceIndex = (this.balanceIndex + 1) % CURRICULUM.math.balanceScaleChallenges.length;
      this.renderBalanceScale();
    });

    stage.querySelectorAll('.btn-balance-opt').forEach(btn => {
      btn.addEventListener('click', async () => {
        tutor.registerUserAction();
        const val = parseInt(btn.dataset.val, 10);
        const rightPan = stage.querySelector('#scale-pan-right');
        const currentRightBase = challenge.rightWeights.reduce((a, b) => a + b, 0);
        rightPan.textContent = `${challenge.rightWeights.join(' + ')} + ${val}`;

        const totalRight = currentRightBase + val;

        if (totalRight === totalLeft) {
          beam.style.transform = 'rotate(0deg)';
          tutor.onSuccess('math', 'algebraicBalance', `Balanced scale ${totalLeft} = ${totalRight}`);
          sound.play('success');
          setTimeout(() => {
            this.balanceIndex = (this.balanceIndex + 1) % CURRICULUM.math.balanceScaleChallenges.length;
            this.renderBalanceScale();
          }, 1800);
        } else if (totalRight < totalLeft) {
          beam.style.transform = 'rotate(-8deg)';
          tutor.onMistake('math', 'algebraicBalance', { hint: 'Still too light on the right! Try a heavier gem.' }, `Attempted ${val}`);
        } else {
          beam.style.transform = 'rotate(8deg)';
          tutor.onMistake('math', 'algebraicBalance', { hint: 'Too heavy on the right! Try a lighter gem.' }, `Attempted ${val}`);
        }
      });
    });
  }

  // 3. FRACTION SLICER
  renderFractionSlicer() {
    const stage = this.container.querySelector('#math-content-stage');
    const challenge = this.currentCustomChallenge || CURRICULUM.math.fractionChallenges[this.fractionIndex];

    stage.innerHTML = `
      <div class="fraction-slicer-area">
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
          <div style="font-family: var(--font-kids); font-size: 0.9rem; color: var(--text-parchment-muted);">
            ${this.currentCustomChallenge ? '✨ AI Real-Time Adaptive Slicer' : `Fraction Challenge ${this.fractionIndex + 1} of ${CURRICULUM.math.fractionChallenges.length}`}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-icon" id="btn-prev-frac" style="width: 32px; height: 32px;">◀</button>
            <button class="btn-secondary btn-icon" id="btn-next-frac" style="width: 32px; height: 32px;">▶</button>
          </div>
        </div>

        <div class="math-challenge-banner" style="width: 100%;">
          <div>
            <div style="font-size: 0.85rem; color: var(--amber-warmth); text-transform: uppercase; font-weight: 700;">
              ${challenge.title}
            </div>
            <div class="math-question-text">
              ${challenge.instruction}
            </div>
          </div>
        </div>

        <div class="fraction-wheel-container">
          <svg viewBox="0 0 100 100" width="100%" height="100%" id="fraction-svg-pie">
            ${this.renderFractionSVG(challenge.totalSlices, challenge.selectedSlices)}
          </svg>
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
          ${challenge.options.map((opt, idx) => `
            <button class="btn-primer btn-frac-choice" data-idx="${idx}">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.companionUI.updateSocraticHints([
      { title: '🍕 Clue 1: Parts of Whole', content: `The circle is divided into ${challenge.totalSlices} equal slices in total.` },
      { title: '🔍 Clue 2: Highlighted Slices', content: `${challenge.selectedSlices} slices are highlighted in golden cheese.` },
      { title: '✨ Clue 3: Fraction Format', content: `${challenge.selectedSlices} out of ${challenge.totalSlices} is written as ${challenge.fractionName}!` }
    ]);

    tutor.setMood('curious', `Look at the golden highlighted pieces. Which fraction represents this?`);

    stage.querySelector('#btn-prev-frac').addEventListener('click', () => {
      this.currentCustomChallenge = null;
      this.fractionIndex = (this.fractionIndex - 1 + CURRICULUM.math.fractionChallenges.length) % CURRICULUM.math.fractionChallenges.length;
      this.renderFractionSlicer();
    });
    stage.querySelector('#btn-next-frac').addEventListener('click', () => {
      this.currentCustomChallenge = null;
      this.fractionIndex = (this.fractionIndex + 1) % CURRICULUM.math.fractionChallenges.length;
      this.renderFractionSlicer();
    });

    stage.querySelectorAll('.btn-frac-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        tutor.registerUserAction();
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx === challenge.correctIndex) {
          tutor.onSuccess('math', 'fractions', `Solved fraction ${challenge.fractionName}`);
          sound.play('success');
          setTimeout(() => {
            this.fractionIndex = (this.fractionIndex + 1) % CURRICULUM.math.fractionChallenges.length;
            this.renderFractionSlicer();
          }, 1800);
        } else {
          tutor.onMistake('math', 'fractions', {
            hint: `Count the colored slices on top (${challenge.selectedSlices}) and total on bottom (${challenge.totalSlices})!`,
            hintMetaphor: 'A fraction shows how many parts out of the total!'
          }, 'Wrong fraction choice');
        }
      });
    });
  }

  renderFractionSVG(total, selected) {
    let paths = '';
    const cx = 50, cy = 50, r = 44;
    const angleStep = (2 * Math.PI) / total;

    for (let i = 0; i < total; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const isShaded = i < selected;
      const fill = isShaded ? '#ffd166' : '#f4ebd9';

      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="#ffffff" stroke-width="2"/>`;
    }
    return paths;
  }

  // 4. NUMBER LINE HOP
  renderNumberLine() {
    const stage = this.container.querySelector('#math-content-stage');
    const challenge = CURRICULUM.math.numberLineChallenges[this.nlIndex];
    let currentRoverPos = challenge.startPos;

    stage.innerHTML = `
      <div class="number-line-stage">
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
          <div style="font-family: var(--font-kids); font-size: 0.9rem; color: var(--text-parchment-muted);">
            Number Journey ${this.nlIndex + 1} of ${CURRICULUM.math.numberLineChallenges.length}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-icon" id="btn-prev-nl" style="width: 32px; height: 32px;">◀</button>
            <button class="btn-secondary btn-icon" id="btn-next-nl" style="width: 32px; height: 32px;">▶</button>
          </div>
        </div>

        <div class="math-challenge-banner" style="width: 100%;">
          <div>
            <div style="font-size: 0.85rem; color: var(--amber-warmth); text-transform: uppercase; font-weight: 700;">
              ${challenge.title}
            </div>
            <div class="math-question-text">
              ${challenge.instruction}
            </div>
          </div>
        </div>

        <div class="number-line-track">
          <div class="number-line-axis"></div>
          ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `
            <div class="number-line-tick ${n === currentRoverPos ? 'highlight' : ''}" data-val="${n}">
              ${n}
            </div>
          `).join('')}
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;">
          <button class="btn-primer" id="btn-hop-forward">
            🚀 Hop +1 Forward
          </button>
          <button class="btn-secondary" id="btn-hop-backward">
            ⬅️ Hop -1 Backward
          </button>
          <button class="btn-primer" id="btn-verify-hop">
            ✨ Land Rover & Check!
          </button>
          <button class="btn-secondary" id="btn-reset-hop">
            🔄 Reset Pad
          </button>
        </div>
      </div>
    `;

    this.companionUI.updateSocraticHints([
      { title: '🚀 Clue 1: Starting Number', content: `Rover starts at number ${challenge.startPos}.` },
      { title: '🔍 Clue 2: Hop Direction', content: `${challenge.operation === '+' ? 'Jump forward' : 'Hop backward'} by ${challenge.hopDistance} spaces.` },
      { title: '✨ Clue 3: Target Calculation', content: `${challenge.startPos} ${challenge.operation} ${challenge.hopDistance} = ${challenge.targetPos}!` }
    ]);

    tutor.setMood('curious', `Hop the rover ${challenge.operation} ${challenge.hopDistance} steps from ${challenge.startPos}!`);

    stage.querySelector('#btn-prev-nl').addEventListener('click', () => {
      this.nlIndex = (this.nlIndex - 1 + CURRICULUM.math.numberLineChallenges.length) % CURRICULUM.math.numberLineChallenges.length;
      this.renderNumberLine();
    });
    stage.querySelector('#btn-next-nl').addEventListener('click', () => {
      this.nlIndex = (this.nlIndex + 1) % CURRICULUM.math.numberLineChallenges.length;
      this.renderNumberLine();
    });

    const updateTicks = () => {
      stage.querySelectorAll('.number-line-tick').forEach(tick => {
        const val = parseInt(tick.dataset.val, 10);
        if (val === currentRoverPos) tick.classList.add('highlight');
        else tick.classList.remove('highlight');
      });
    };

    stage.querySelector('#btn-hop-forward').addEventListener('click', () => {
      if (currentRoverPos < 10) {
        currentRoverPos += 1;
        sound.play('pop');
        updateTicks();
      }
    });

    stage.querySelector('#btn-hop-backward').addEventListener('click', () => {
      if (currentRoverPos > 0) {
        currentRoverPos -= 1;
        sound.play('pop');
        updateTicks();
      }
    });

    stage.querySelector('#btn-verify-hop').addEventListener('click', () => {
      tutor.registerUserAction();
      if (currentRoverPos === challenge.targetPos) {
        tutor.onSuccess('math', 'numberSense', `Completed Number Line Hop to ${challenge.targetPos}`);
        sound.play('success');
        setTimeout(() => {
          this.nlIndex = (this.nlIndex + 1) % CURRICULUM.math.numberLineChallenges.length;
          this.renderNumberLine();
        }, 1800);
      } else {
        tutor.onMistake('math', 'numberSense', {
          hint: `You are at number ${currentRoverPos}. The target landing pad is ${challenge.targetPos}!`,
          hintMetaphor: 'Count each hop carefully step by step!'
        }, `Landed at ${currentRoverPos}`);
      }
    });

    stage.querySelector('#btn-reset-hop').addEventListener('click', () => {
      currentRoverPos = challenge.startPos;
      updateTicks();
      sound.play('pop');
    });
  }
}
