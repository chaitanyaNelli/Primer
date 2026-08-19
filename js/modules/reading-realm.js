/**
 * THE PRIMER — READING & PHONICS REALM (AI ADAPTIVE)
 * The Scribe's Haven: Adaptive Real-Time Phonics Cauldron & Interactive Story Loom.
 */

import { CURRICULUM } from '../data/curriculum.js';
import { sound } from '../audio/sound-synth.js';
import { speech } from '../speech/speech-engine.js';
import { tutor } from '../ai/primer-tutor.js';
import { contextMemory } from '../ai/context-memory.js';
import { AdaptiveGenerator } from '../ai/adaptive-generator.js';

export class ReadingRealm {
  constructor(container, companionUI) {
    this.container = container;
    this.companionUI = companionUI;
    this.currentView = 'cauldron'; // 'cauldron' | 'storybook'
    this.currentLevelIndex = 0;
    this.currentWordIndex = 0;
    this.currentStoryIndex = 0;
    this.currentStoryPage = 0;
    this.placedPhonemes = [];
    this.activeStories = [...CURRICULUM.reading.stories];
    this.currentCustomWord = null;
  }

  mount() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="reading-realm-container">
        <!-- Sub navigation -->
        <div class="sub-nav" style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 10px;">
            <button class="sub-nav-btn ${this.currentView === 'cauldron' ? 'active' : ''}" id="btn-view-cauldron">
              ✨ Phoneme Cauldron Lab
            </button>
            <button class="sub-nav-btn ${this.currentView === 'storybook' ? 'active' : ''}" id="btn-view-storybook">
              📖 Living Story Library (${this.activeStories.length})
            </button>
          </div>

          ${this.currentView === 'storybook' ? `
            <button class="btn-primer" id="btn-summon-ai-story" style="font-size: 0.85rem; padding: 6px 14px;">
              ✨ Summon New AI Story
            </button>
          ` : `
            <div style="display: flex; gap: 8px;">
              <button class="btn-primer" id="btn-ai-adaptive-word" style="font-size: 0.82rem; padding: 5px 12px; background: linear-gradient(135deg, #4deeea 0%, #00b4d8 100%); color: #041c2c;">
                🤖 Generate for My Level
              </button>
              <div style="display: flex; gap: 4px;">
                ${CURRICULUM.reading.levels.map((lvl, idx) => `
                  <button class="sub-nav-btn ${idx === this.currentLevelIndex ? 'active' : ''}" data-lvl="${idx}" style="font-size: 0.78rem; padding: 4px 8px;">
                    Lvl ${idx + 1}
                  </button>
                `).join('')}
              </div>
            </div>
          `}
        </div>

        <div id="reading-content-stage">
          <!-- Dynamic Content Loaded Below -->
        </div>
      </div>
    `;

    this.container.querySelector('#btn-view-cauldron').addEventListener('click', () => {
      this.currentView = 'cauldron';
      this.render();
    });

    this.container.querySelector('#btn-view-storybook').addEventListener('click', () => {
      this.currentView = 'storybook';
      this.render();
    });

    const aiStoryBtn = this.container.querySelector('#btn-summon-ai-story');
    if (aiStoryBtn) {
      aiStoryBtn.addEventListener('click', () => {
        this.summonNewAIStory();
      });
    }

    const aiWordBtn = this.container.querySelector('#btn-ai-adaptive-word');
    if (aiWordBtn) {
      aiWordBtn.addEventListener('click', async () => {
        sound.play('sparkle');
        tutor.setMood('curious', `Calibrating a new phonics rune to your exact mastery level... ✨`);
        const challenge = await AdaptiveGenerator.getNextChallenge('reading', 'phonics');
        if (challenge) {
          this.currentCustomWord = challenge;
          this.renderCauldron();
        }
      });
    }

    this.container.querySelectorAll('[data-lvl]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCustomWord = null;
        this.currentLevelIndex = parseInt(btn.dataset.lvl, 10);
        this.currentWordIndex = 0;
        sound.play('pop');
        this.render();
      });
    });

    if (this.currentView === 'cauldron') {
      this.renderCauldron();
    } else {
      this.renderStorybook();
    }
  }

  renderCauldron() {
    const stage = this.container.querySelector('#reading-content-stage');
    const level = CURRICULUM.reading.levels[this.currentLevelIndex];
    const target = this.currentCustomWord || level.words[this.currentWordIndex];
    this.placedPhonemes = new Array(target.phonemes.length).fill(null);

    // Shuffle letter gems with 3 distractors
    const distractors = ['B', 'T', 'M', 'R', 'S', 'P', 'L', 'D', 'N'].filter(l => !target.phonemes.includes(l));
    const allLetters = [...target.phonemes, ...distractors.slice(0, 3)];
    const shuffledLetters = allLetters.sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div class="cauldron-area">
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
          <div style="font-family: var(--font-kids); font-size: 0.95rem; color: var(--text-parchment-muted);">
            ${target.levelLabel || level.title} • ${this.currentCustomWord ? '✨ AI Real-Time Adaptive' : `Word ${this.currentWordIndex + 1} of ${level.words.length}`}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary btn-icon" id="btn-prev-word" style="width: 34px; height: 34px;">◀</button>
            <button class="btn-secondary btn-icon" id="btn-next-word" style="width: 34px; height: 34px;">▶</button>
          </div>
        </div>

        <div class="target-word-card">
          <div class="target-image-display" id="cauldron-emoji-target">
            ${target.emoji}
          </div>
          <div>
            <div style="font-family: var(--font-title); font-size: 1.15rem; color: var(--gold-glow);">
              Target Word: ${target.word}
            </div>
            <div class="target-word-hint">
              "${target.hint}"
            </div>
          </div>
        </div>

        <div class="cauldron-stage">
          <div style="font-family: var(--font-kids); font-size: 0.95rem; color: var(--text-parchment-muted); margin-bottom: 8px;">
            Tap or drag the runes into the glowing slots:
          </div>

          <div class="cauldron-slots" id="cauldron-slots-container">
            ${target.phonemes.map((p, idx) => `
              <div class="phoneme-drop-slot" data-slot="${idx}" id="slot-${idx}">
                <span class="phoneme-slot-char">?</span>
              </div>
            `).join('')}
          </div>

          <div class="letter-gem-bank" id="letter-gems-bank">
            ${shuffledLetters.map(letter => `
              <div class="letter-gem" draggable="true" data-letter="${letter}">
                <span>${letter}</span>
                <span class="phoneme-sublabel">/${letter.toLowerCase()}/</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 14px; margin-top: 10px;">
          <button class="btn-primer" id="btn-cauldron-blend">
            🔮 Blend Sounds & Summon Word!
          </button>
          <button class="btn-secondary" id="btn-cauldron-reset">
            🔄 Reset
          </button>
        </div>
      </div>
    `;

    // Socratic hints for companion
    this.companionUI.updateSocraticHints([
      { title: '🌱 Clue 1: Initial Sound', content: `The first sound is /${target.phonemes[0].toLowerCase()}/.` },
      { title: '🔍 Clue 2: Middle Phoneme', content: `Middle sound: ${target.phonemes[1]}.` },
      { title: '✨ Clue 3: Complete Word', content: `Spell ${target.phonemes.join(' - ')} to complete "${target.word}"!` }
    ]);

    tutor.setMood('curious', `Can you forge the word "${target.word}"? Listen: / ${target.phonemes.join(' / / ')} /`);

    stage.querySelector('#btn-prev-word').addEventListener('click', () => {
      this.currentCustomWord = null;
      this.currentWordIndex = (this.currentWordIndex - 1 + level.words.length) % level.words.length;
      this.renderCauldron();
    });
    stage.querySelector('#btn-next-word').addEventListener('click', () => {
      this.currentCustomWord = null;
      this.currentWordIndex = (this.currentWordIndex + 1) % level.words.length;
      this.renderCauldron();
    });

    const gems = stage.querySelectorAll('.letter-gem');
    const slots = stage.querySelectorAll('.phoneme-drop-slot');

    gems.forEach(gem => {
      gem.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', gem.dataset.letter);
        sound.play('pop');
      });

      gem.addEventListener('click', () => {
        sound.play('pop');
        speech.speak(gem.dataset.letter);
        const emptySlotIdx = this.placedPhonemes.findIndex(p => p === null);
        if (emptySlotIdx !== -1) {
          this.placeLetterInSlot(gem.dataset.letter, emptySlotIdx);
        }
      });
    });

    slots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      });
      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const letter = e.dataTransfer.getData('text/plain');
        const slotIdx = parseInt(slot.dataset.slot, 10);
        this.placeLetterInSlot(letter, slotIdx);
      });
    });

    stage.querySelector('#btn-cauldron-blend').addEventListener('click', () => {
      this.checkCauldronSubmission();
    });

    stage.querySelector('#btn-cauldron-reset').addEventListener('click', () => {
      this.renderCauldron();
    });
  }

  placeLetterInSlot(letter, slotIdx) {
    this.placedPhonemes[slotIdx] = letter;
    const slotEl = this.container.querySelector(`#slot-${slotIdx}`);
    if (slotEl) {
      slotEl.classList.add('filled');
      slotEl.innerHTML = `<span class="phoneme-slot-char" style="color: #0369a1;">${letter}</span>`;
      sound.play('sparkle');
    }
  }

  async checkCauldronSubmission() {
    tutor.registerUserAction();
    const level = CURRICULUM.reading.levels[this.currentLevelIndex];
    const target = this.currentCustomWord || level.words[this.currentWordIndex];

    const currentWordAttempt = this.placedPhonemes.join('');
    const targetWord = target.phonemes.join('');

    if (currentWordAttempt === targetWord) {
      tutor.onSuccess('reading', 'phonics', `Forged ${target.word}`);
      sound.play('success');

      const emojiTarget = this.container.querySelector('#cauldron-emoji-target');
      if (emojiTarget) {
        emojiTarget.style.transform = 'scale(1.3) rotate(10deg)';
        setTimeout(() => { emojiTarget.style.transform = 'scale(1)'; }, 800);
      }

      setTimeout(async () => {
        // Automatically request next adaptive word
        const nextChallenge = await AdaptiveGenerator.getNextChallenge('reading', 'phonics');
        if (nextChallenge) {
          this.currentCustomWord = nextChallenge;
        } else {
          this.currentWordIndex = (this.currentWordIndex + 1) % level.words.length;
        }
        this.renderCauldron();
      }, 2000);
    } else {
      // Dynamic Socratic Hint for the mistake
      const dynamicHint = await AdaptiveGenerator.getDynamicSocraticHint(target.word, currentWordAttempt);
      tutor.onMistake('reading', 'phonics', {
        hint: dynamicHint || `Listen closely to the word: ${target.phonemes.join(' - ')}.`,
        hintMetaphor: target.metaphor || `The sound /${target.phonemes[0]}/ comes first!`
      }, `Attempted ${currentWordAttempt}`);
    }
  }

  renderStorybook() {
    const stage = this.container.querySelector('#reading-content-stage');
    const story = this.activeStories[this.currentStoryIndex];
    const totalPages = story.pages.length;
    const page = story.pages[this.currentStoryPage];

    stage.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-family: var(--font-kids); font-weight: 700; color: var(--text-parchment-muted);">Choose Tale:</span>
          <select id="story-selector-dropdown" style="padding: 6px 14px; border-radius: var(--radius-md); border: 1px solid var(--gold-border); background: #ffffff; font-family: var(--font-kids); font-size: 0.95rem; color: #2b1f13;">
            ${this.activeStories.map((s, idx) => `
              <option value="${idx}" ${idx === this.currentStoryIndex ? 'selected' : ''}>
                ${s.illustration} ${s.title}
              </option>
            `).join('')}
          </select>
        </div>

        <div style="font-family: var(--font-kids); font-size: 0.9rem; color: var(--text-parchment-muted);">
          Page ${this.currentStoryPage + 1} of ${totalPages}
        </div>
      </div>

      <div class="storybook-layout">
        <div class="story-illustration-frame">
          <div class="story-art-emoji">${story.illustration}</div>
          <div class="story-caption">${story.caption}</div>
        </div>

        <div>
          <div class="story-text-card">
            ${page.words.map(w => `
              <span class="story-interactive-word" data-word="${w.replace(/[^a-zA-Z]/g, '')}">
                ${w}
              </span>
            `).join(' ')}
          </div>

          <div class="word-inspector" id="word-inspector-box">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-parchment-muted);">Tapped Word Breakdown:</span>
              <div id="inspector-word-title" style="font-family: var(--font-kids); font-size: 1.3rem; font-weight: 700; color: #0369a1;">
                Tap any word to hear pronunciation!
              </div>
            </div>
            <button class="btn-primer btn-icon" id="btn-speak-word" style="display: none; width: 36px; height: 36px;">🔊</button>
          </div>

          ${page.question ? `
            <div style="margin-top: 14px; background: rgba(255, 255, 255, 0.7); border-radius: var(--radius-md); padding: 14px; border: 1px dashed var(--gold-border);">
              <div style="font-family: var(--font-kids); font-weight: 700; font-size: 0.95rem; color: #854d0e; margin-bottom: 8px;">
                💡 Comprehension Quest: ${page.question}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${page.options.map((opt, optIdx) => `
                  <button class="sub-nav-btn btn-story-option" data-idx="${optIdx}" style="background: #ffffff;">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary" id="btn-prev-page" ${this.currentStoryPage === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
                ◀ Previous Page
              </button>
              <button class="btn-secondary" id="btn-next-page" ${this.currentStoryPage === totalPages - 1 ? 'disabled style="opacity: 0.5;"' : ''}>
                Next Page ▶
              </button>
            </div>

            <button class="btn-primer" id="btn-read-story-aloud">
              🔊 Read Page Aloud
            </button>
          </div>
        </div>
      </div>
    `;

    tutor.setMood('curious', `Reading "${story.title}". Tap any word to sound it out!`);

    stage.querySelector('#story-selector-dropdown').addEventListener('change', (e) => {
      this.currentStoryIndex = parseInt(e.target.value, 10);
      this.currentStoryPage = 0;
      sound.play('pageFlip');
      this.renderStorybook();
    });

    stage.querySelectorAll('.story-interactive-word').forEach(wordEl => {
      wordEl.addEventListener('click', () => {
        const rawWord = wordEl.dataset.word;
        wordEl.classList.add('reading-active');
        setTimeout(() => wordEl.classList.remove('reading-active'), 800);

        sound.play('sparkle');
        speech.speak(rawWord);

        const titleEl = document.getElementById('inspector-word-title');
        const speakBtn = document.getElementById('btn-speak-word');
        if (titleEl) {
          titleEl.textContent = `"${rawWord}" (/ ${rawWord.split('').join(' · ')} /)`;
        }
        if (speakBtn) {
          speakBtn.style.display = 'inline-flex';
          speakBtn.onclick = () => speech.speak(rawWord);
        }
      });
    });

    const prevBtn = stage.querySelector('#btn-prev-page');
    const nextBtn = stage.querySelector('#btn-next-page');

    if (prevBtn && this.currentStoryPage > 0) {
      prevBtn.addEventListener('click', () => {
        this.currentStoryPage -= 1;
        sound.play('pageFlip');
        this.renderStorybook();
      });
    }

    if (nextBtn && this.currentStoryPage < totalPages - 1) {
      nextBtn.addEventListener('click', () => {
        this.currentStoryPage += 1;
        sound.play('pageFlip');
        this.renderStorybook();
      });
    }

    stage.querySelector('#btn-read-story-aloud').addEventListener('click', () => {
      speech.speak(page.text, { rate: 0.85 });
    });

    stage.querySelectorAll('.btn-story-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx === page.correctIndex) {
          btn.style.background = '#dcfce7';
          btn.style.borderColor = '#22c55e';
          tutor.onSuccess('reading', 'readingFluency', `Answered question for ${story.title}`);
        } else {
          btn.style.background = '#fee2e2';
          tutor.onMistake('reading', 'readingFluency', { hint: 'Look back at the story text above to find the clue!' }, 'Wrong comprehension option');
        }
      });
    });
  }

  async summonNewAIStory() {
    const profile = contextMemory.profile;
    sound.play('harp');

    const promptConcept = prompt(`What magical quest shall The Primer weave for ${profile.name}? (e.g. finding a hidden time machine, discovering a flying island):`, 'exploring the cosmic star gateway');
    if (!promptConcept) return;

    tutor.setMood('curious', `Weaving a brand new illustrated story for ${profile.name}... ✨`);

    try {
      const resp = await fetch('/api/story/summon-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          theme: profile.currentTheme || 'space',
          concept: promptConcept
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.story) {
          data.story.pages.forEach(p => {
            if (!p.words && p.text) {
              p.words = p.text.split(' ');
            }
          });
          this.activeStories.unshift(data.story);
          this.currentStoryIndex = 0;
          this.currentStoryPage = 0;
          sound.play('success');
          this.renderStorybook();
          speech.speak(`Behold! The Primer has summoned "${data.story.title}"!`);
          return;
        }
      }
    } catch (e) {
      console.warn('Error summoning AI story:', e);
    }
  }
}
