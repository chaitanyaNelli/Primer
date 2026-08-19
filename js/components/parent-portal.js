/**
 * THE PRIMER — PARENT & EDUCATOR CHRONICLE PORTAL (ENHANCED)
 * Cognitive Mastery Radar, AI Brain Settings (Gemini Key), and Dynamic Bedtime Story Weaver.
 */

import { mastery } from '../ai/mastery-graph.js';
import { contextMemory } from '../ai/context-memory.js';
import { sound } from '../audio/sound-synth.js';
import { speech } from '../speech/speech-engine.js';
import { CURRICULUM } from '../data/curriculum.js';

export class ParentPortal {
  constructor(modalElement, onProfileUpdated) {
    this.modal = modalElement;
    this.onProfileUpdated = onProfileUpdated;
    this.hasServerGeminiKey = false;
    this.init();
  }

  async init() {
    try {
      const resp = await fetch('/api/config');
      if (resp.ok) {
        const data = await resp.json();
        this.hasServerGeminiKey = data.hasKey;
      }
    } catch (e) {
      // offline fallback
    }
    this.render();
  }

  open() {
    this.render();
    this.modal.classList.add('active');
    setTimeout(() => {
      this.drawRadarChart();
    }, 100);
    sound.play('pageFlip');
  }

  close() {
    this.modal.classList.remove('active');
    sound.play('pop');
  }

  render() {
    const profile = contextMemory.profile;
    const stats = mastery.state;
    const overallScore = mastery.getOverallMastery();

    this.modal.innerHTML = `
      <div class="glass-panel gold-border" style="max-width: 920px; width: 92%; max-height: 90vh; overflow-y: auto; padding: 32px; background: rgba(14, 18, 38, 0.96); border-radius: var(--radius-xl); box-shadow: 0 0 60px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--gold-border); padding-bottom: 16px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 2.2rem;">📜</span>
            <div>
              <h2 style="font-family: var(--font-title); font-size: 1.6rem; color: var(--gold-glow);">
                The Chronicle of Growth
              </h2>
              <p style="color: var(--text-cosmic-muted); font-size: 0.85rem;">
                Parent & Educator Insights • Adaptive Learning Analytics • AI Engine Settings
              </p>
            </div>
          </div>
          <button class="btn-secondary btn-icon" id="btn-close-portal" style="font-size: 1.2rem;">✕</button>
        </div>

        <!-- Metric Badges Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px;">
          <div class="glass-panel" style="padding: 16px; text-align: center; border-color: rgba(77, 238, 234, 0.3);">
            <div style="font-size: 0.8rem; color: var(--starlight-cyan); text-transform: uppercase; font-weight: 600;">Overall Mastery</div>
            <div style="font-size: 2.2rem; font-family: var(--font-kids); font-weight: 700; color: #ffffff;">${overallScore}%</div>
            <div style="font-size: 0.75rem; color: var(--text-cosmic-muted);">Zone of Proximal Dev</div>
          </div>

          <div class="glass-panel" style="padding: 16px; text-align: center; border-color: rgba(255, 194, 51, 0.3);">
            <div style="font-size: 0.8rem; color: var(--gold-glow); text-transform: uppercase; font-weight: 600;">Stars Collected</div>
            <div style="font-size: 2.2rem; font-family: var(--font-kids); font-weight: 700; color: var(--gold-pure);">⭐ ${stats.stars}</div>
            <div style="font-size: 0.75rem; color: var(--text-cosmic-muted);">Level ${stats.level} Apprentice</div>
          </div>

          <div class="glass-panel" style="padding: 16px; text-align: center; border-color: rgba(255, 93, 143, 0.3);">
            <div style="font-size: 0.8rem; color: var(--mystic-rose); text-transform: uppercase; font-weight: 600;">Patience & Focus</div>
            <div style="font-size: 2.2rem; font-family: var(--font-kids); font-weight: 700; color: #ffffff;">${stats.skills.resilience.score}%</div>
            <div style="font-size: 0.75rem; color: var(--text-cosmic-muted);">Emotional Regulation</div>
          </div>
        </div>

        <!-- Radar Chart & Dimension Progress -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
          <div class="glass-panel" style="padding: 20px; display: flex; flex-direction: column; align-items: center;">
            <h3 style="font-family: var(--font-title); font-size: 1.1rem; color: var(--text-cosmic-light); margin-bottom: 12px;">
              Cognitive Mastery Radar
            </h3>
            <canvas id="mastery-radar-canvas" width="340" height="300" style="max-width: 100%;"></canvas>
          </div>

          <div class="glass-panel" style="padding: 20px;">
            <h3 style="font-family: var(--font-title); font-size: 1.1rem; color: var(--text-cosmic-light); margin-bottom: 14px;">
              Curricular Skill Breakdown
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px; max-height: 250px; overflow-y: auto; padding-right: 6px;">
              ${Object.values(stats.skills).map(s => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-family: var(--font-kids); margin-bottom: 4px;">
                    <span>${s.label}</span>
                    <strong style="color: var(--gold-glow);">${s.score}%</strong>
                  </div>
                  <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${s.score}%; height: 100%; background: linear-gradient(90deg, #4deeea, #ffd166); border-radius: 4px;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- AI Brain Settings (Gemini API Key) -->
        <div class="glass-panel" style="padding: 24px; margin-bottom: 32px; border: 1px solid var(--starlight-cyan); background: rgba(14, 25, 48, 0.75);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.6rem;">🤖</span>
              <div>
                <h3 style="font-family: var(--font-title); font-size: 1.2rem; color: var(--starlight-cyan);">
                  Google Gemini AI Brain Integration
                </h3>
                <p style="color: var(--text-cosmic-muted); font-size: 0.8rem;">
                  Powers real-time infinite story weaving, conversational Socratic tutoring, and personalized bedtime tales.
                </p>
              </div>
            </div>
            <span style="font-size: 0.8rem; padding: 4px 12px; border-radius: var(--radius-full); background: ${this.hasServerGeminiKey ? 'rgba(46, 230, 168, 0.2)' : 'rgba(255, 194, 51, 0.2)'}; color: ${this.hasServerGeminiKey ? 'var(--aurora-teal)' : 'var(--gold-glow)'}; border: 1px solid currentColor;">
              ${this.hasServerGeminiKey ? '● Gemini Connected' : '○ Procedural AI Fallback'}
            </span>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 14px;">
            <input type="password" id="portal-gemini-key-input" placeholder="Paste your Google Gemini API Key here (AIzaSy...)" style="flex: 1; padding: 10px 14px; background: rgba(0,0,0,0.5); border: 1px solid var(--gold-border); border-radius: var(--radius-md); color: #fff; font-family: var(--font-kids); font-size: 0.95rem;" />
            <button class="btn-primer" id="btn-save-gemini-key">
              Save AI Key
            </button>
          </div>
        </div>

        <!-- Bedtime Story Weaver Module -->
        <div class="glass-panel" style="padding: 24px; margin-bottom: 32px; border: 1px solid var(--mystic-rose); background: rgba(30, 20, 48, 0.7);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.6rem;">🌙</span>
              <h3 style="font-family: var(--font-title); font-size: 1.2rem; color: #ffccd5;">
                Bedtime Fable Weaver
              </h3>
            </div>
            <button class="btn-primer" id="btn-generate-bedtime" style="background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);">
              ✨ Craft Tonight's Story
            </button>
          </div>
          <p style="color: var(--text-cosmic-muted); font-size: 0.9rem; margin-bottom: 16px;">
            The Primer weaves ${profile.name}'s daily triumphs into a personalized bedtime story celebrating their bravery and newly mastered concepts.
          </p>
          <div id="bedtime-story-container" style="display: none; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 18px; border: 1px dashed rgba(255,255,255,0.2);">
            <div id="bedtime-story-text" style="font-family: var(--font-story); font-size: 1.15rem; line-height: 1.8; color: #fdfaf4; margin-bottom: 14px;"></div>
            <div style="display: flex; gap: 10px;">
              <button class="btn-secondary" id="btn-read-bedtime-aloud">🔊 Listen Together</button>
            </div>
          </div>
        </div>

        <!-- Apprentice Profile Settings -->
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="font-family: var(--font-title); font-size: 1.2rem; color: var(--gold-glow); margin-bottom: 16px;">
            Apprentice Profile & Themes
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="font-size: 0.85rem; color: var(--text-cosmic-muted); display: block; margin-bottom: 6px;">Learner's Name</label>
              <input type="text" id="portal-child-name" value="${profile.name}" style="width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.4); border: 1px solid var(--gold-border); border-radius: var(--radius-md); color: #fff; font-family: var(--font-kids); font-size: 1rem;" />
            </div>

            <div>
              <label style="font-size: 0.85rem; color: var(--text-cosmic-muted); display: block; margin-bottom: 6px;">Age Level</label>
              <input type="number" id="portal-child-age" min="4" max="11" value="${profile.age}" style="width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.4); border: 1px solid var(--gold-border); border-radius: var(--radius-md); color: #fff; font-family: var(--font-kids); font-size: 1rem;" />
            </div>

            <div>
              <label style="font-size: 0.85rem; color: var(--text-cosmic-muted); display: block; margin-bottom: 6px;">Enchanted Theme World</label>
              <select id="portal-theme-select" style="width: 100%; padding: 10px 14px; background: #12172b; border: 1px solid var(--gold-border); border-radius: var(--radius-md); color: #fff; font-family: var(--font-kids); font-size: 1rem;">
                ${CURRICULUM.themes.map(t => `<option value="${t.id}" ${t.id === profile.currentTheme ? 'selected' : ''}>${t.icon} ${t.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <button class="btn-primer" id="btn-save-profile">
            💾 Save Apprentice Settings
          </button>
        </div>

      </div>
    `;

    // Bind event listeners
    this.modal.querySelector('#btn-close-portal').addEventListener('click', () => this.close());
    
    this.modal.querySelector('#btn-generate-bedtime').addEventListener('click', () => {
      this.generateBedtimeStory();
    });

    this.modal.querySelector('#btn-save-gemini-key').addEventListener('click', async () => {
      const key = this.modal.querySelector('#portal-gemini-key-input').value.trim();
      try {
        const resp = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ geminiApiKey: key })
        });
        if (resp.ok) {
          const res = await resp.json();
          this.hasServerGeminiKey = res.hasKey;
          sound.play('sparkle');
          alert('Gemini API configuration saved successfully!');
          this.render();
        }
      } catch (e) {
        alert('Could not reach backend to save key.');
      }
    });

    this.modal.querySelector('#btn-save-profile').addEventListener('click', () => {
      const name = this.modal.querySelector('#portal-child-name').value.trim() || 'Nell';
      const age = parseInt(this.modal.querySelector('#portal-child-age').value, 10) || 6;
      const theme = this.modal.querySelector('#portal-theme-select').value;

      contextMemory.updateProfile({ name, age, currentTheme: theme });
      sound.play('sparkle');
      if (this.onProfileUpdated) this.onProfileUpdated();
      alert(`Settings saved! The Primer is now tailored for ${name} in the ${theme} world.`);
    });
  }

  drawRadarChart() {
    const canvas = document.getElementById('mastery-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 105;

    ctx.clearRect(0, 0, width, height);

    const skills = mastery.getRadarData();
    const total = skills.length;
    const angleStep = (Math.PI * 2) / total;

    // Draw concentric polygon rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let r = 0.25; r <= 1.0; r += 0.25) {
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * r);
        const y = centerY + Math.sin(angle) * (radius * r);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw radial axes & labels
    ctx.font = '11px Outfit, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      const labelX = centerX + Math.cos(angle) * (radius + 24);
      const labelY = centerY + Math.sin(angle) * (radius + 24);
      ctx.fillText(skills[i].label.split(' ')[0], labelX, labelY);
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const valRadius = (skills[i].score / 100) * radius;
      const x = centerX + Math.cos(angle) * valRadius;
      const y = centerY + Math.sin(angle) * valRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(77, 238, 234, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#4deeea';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw points
    for (let i = 0; i < total; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const valRadius = (skills[i].score / 100) * radius;
      const x = centerX + Math.cos(angle) * valRadius;
      const y = centerY + Math.sin(angle) * valRadius;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd166';
      ctx.fill();
    }
  }

  async generateBedtimeStory() {
    const profile = contextMemory.profile;
    const stats = mastery.state;
    const storyContainer = document.getElementById('bedtime-story-container');
    const storyTextEl = document.getElementById('bedtime-story-text');
    if (!storyContainer || !storyTextEl) return;

    sound.play('harp');

    let chosenStory = `Once upon a starlit twilight, brave ${profile.name} sailed through the velvet sky aboard a ship made of moonlight. With wisdom in words and numbers, ${profile.name} balanced the celestial scales and decoded the ancient runes of the stars. The woodland creatures smiled, knowing the kingdom was bright and peaceful. Close your eyes, dear ${profile.name}, for tomorrow brings new wonders to behold. Sweet dreams.`;

    try {
      const response = await fetch('/api/tutor/bedtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          theme: profile.currentTheme || 'dragons',
          stars: stats.stars || 5
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.story) chosenStory = data.story;
      }
    } catch (e) {
      console.log('Backend API offline, using local bedtime story template.');
    }

    storyContainer.style.display = 'block';
    storyTextEl.textContent = chosenStory;

    const readBtn = document.getElementById('btn-read-bedtime-aloud');
    if (readBtn) {
      readBtn.onclick = () => {
        speech.speak(chosenStory, { rate: 0.8, pitch: 1.0 });
      };
    }
  }
}
