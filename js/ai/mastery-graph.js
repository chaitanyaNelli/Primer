/**
 * THE PRIMER — COGNITIVE MASTERY GRAPH & ZPD ENGINE
 * Tracks student understanding across multiple granular dimensions.
 */

export class MasteryGraph {
  constructor() {
    this.storageKey = 'the_primer_mastery_v1';
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      xp: 120,
      level: 1,
      stars: 5,
      skills: {
        phonics: { score: 75, attempts: 6, successes: 5, label: 'Phonemic Blending' },
        readingFluency: { score: 70, attempts: 4, successes: 3, label: 'Story Fluency' },
        handwriting: { score: 65, attempts: 5, successes: 4, label: 'Rune Penmanship' },
        creativeWriting: { score: 80, attempts: 3, successes: 3, label: 'Creative Storytelling' },
        numberSense: { score: 85, attempts: 8, successes: 7, label: 'Ten-Frames & Counting' },
        algebraicBalance: { score: 60, attempts: 4, successes: 3, label: 'Balance Scale Logic' },
        fractions: { score: 55, attempts: 3, successes: 2, label: 'Visual Fractions' },
        resilience: { score: 90, attempts: 10, successes: 9, label: 'Emotional Resilience & Focus' }
      },
      history: [
        { timestamp: Date.now() - 3600000 * 2, realm: 'reading', item: 'SUN (CVC word)', result: 'success' },
        { timestamp: Date.now() - 3600000 * 1, realm: 'math', item: '10-Frame (6 + 4)', result: 'success' }
      ]
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  recordAttempt(skillKey, isSuccess, realm, itemDescription = '') {
    if (!this.state.skills[skillKey]) {
      this.state.skills[skillKey] = { score: 50, attempts: 0, successes: 0, label: skillKey };
    }

    const skill = this.state.skills[skillKey];
    skill.attempts += 1;
    if (isSuccess) {
      skill.successes += 1;
      skill.score = Math.min(100, Math.round(skill.score + (100 - skill.score) * 0.15));
      this.state.xp += 25;
      this.state.stars += 1;
    } else {
      skill.score = Math.max(20, Math.round(skill.score - 8));
      this.state.xp += 5; // Growth mindset XP for trying!
    }

    // Check level progression
    this.state.level = Math.floor(this.state.xp / 100) + 1;

    // Log history
    this.state.history.unshift({
      timestamp: Date.now(),
      realm,
      item: itemDescription,
      result: isSuccess ? 'success' : 'scaffold'
    });
    if (this.state.history.length > 50) this.state.history.pop();

    this.saveState();
    return skill;
  }

  getOverallMastery() {
    const skills = Object.values(this.state.skills);
    const sum = skills.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / skills.length);
  }

  getRadarData() {
    return Object.entries(this.state.skills).map(([key, data]) => ({
      key,
      label: data.label,
      score: data.score
    }));
  }
}

export const mastery = new MasteryGraph();
