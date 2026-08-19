/**
 * THE PRIMER — CLIENT ADAPTIVE AI CHALLENGE GENERATOR
 * Dynamically queries the backend/Gemini AI for custom challenges tailored to the child's live knowledge state.
 */

import { contextMemory } from './context-memory.js';
import { mastery } from './mastery-graph.js';
import { tutor } from './primer-tutor.js';

export class AdaptiveGenerator {
  /**
   * Request an adaptive challenge from the AI engine based on child's current knowledge & mastery
   */
  static async getNextChallenge(realm, skillKey) {
    const profile = contextMemory.profile;
    const skillData = mastery.state.skills[skillKey] || { score: 50 };
    const overallMastery = mastery.getOverallMastery();

    try {
      const response = await fetch('/api/adaptive/next-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          realm,
          skillKey,
          name: profile.name,
          age: profile.age,
          theme: profile.currentTheme || 'dragons',
          masteryScore: skillData.score || overallMastery
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.challenge) {
          return data.challenge;
        }
      }
    } catch (e) {
      console.warn('Adaptive generator API unreachable, falling back to local heuristic:', e);
    }

    return null;
  }

  /**
   * Request a bespoke Socratic Hint for the specific mistake made by the child
   */
  static async getDynamicSocraticHint(challengeContext, mistakeAttempt) {
    const profile = contextMemory.profile;
    try {
      const response = await fetch('/api/adaptive/socratic-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          theme: profile.currentTheme || 'dragons',
          context: challengeContext,
          attempt: mistakeAttempt
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.hint) {
          return data.hint;
        }
      }
    } catch (e) {
      console.warn('Socratic hint API offline:', e);
    }

    return null;
  }
}
