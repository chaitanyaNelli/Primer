/**
 * THE PRIMER — DEEP PATIENCE AI TUTOR & SOCRATIC SCAFFOLDING
 * Empathy-driven feedback, frustration detection, and multi-tier scaffolding.
 */

import { sound } from '../audio/sound-synth.js';
import { speech } from '../speech/speech-engine.js';
import { contextMemory } from './context-memory.js';
import { mastery } from './mastery-graph.js';

export class PrimerTutor {
  constructor() {
    this.consecutiveMistakes = 0;
    this.rapidClickCount = 0;
    this.lastClickTime = Date.now();
    this.frustrationThreshold = 3;
    this.currentMood = 'curious'; // 'happy', 'curious', 'patient', 'celebrating', 'mindful'
    this.onStateChange = null;
    this.onMindfulPauseRequested = null;
  }

  setMood(mood, dialogueText = '') {
    this.currentMood = mood;
    if (this.onStateChange) {
      this.onStateChange({ mood, dialogueText });
    }
  }

  /**
   * Monitor user interaction cadence for signs of frustration or confusion
   */
  registerUserAction() {
    const now = Date.now();
    const timeDelta = now - this.lastClickTime;
    this.lastClickTime = now;

    // Detect frantic rapid clicking (< 300ms between attempts)
    if (timeDelta < 350) {
      this.rapidClickCount += 1;
    } else {
      this.rapidClickCount = Math.max(0, this.rapidClickCount - 1);
    }

    if (this.rapidClickCount >= 4) {
      this.triggerPatienceIntervention('rapid_clicking');
      this.rapidClickCount = 0;
    }
  }

  /**
   * Called when a child successfully solves a challenge
   */
  onSuccess(realm, skillKey, itemDescription) {
    this.consecutiveMistakes = 0;
    this.rapidClickCount = 0;
    this.setMood('celebrating');
    sound.play('success');

    mastery.recordAttempt(skillKey, true, realm, itemDescription);

    const name = contextMemory.profile.name;
    const praises = [
      `Splendid, ${name}! Your starlight grows brighter with every discovery!`,
      `Magnificent thinking, ${name}! You saw the pattern with crystal clarity.`,
      `Hooray, ${name}! That was a brilliant stroke of insight.`,
      `You did it, ${name}! The Primer shimmers with your wisdom!`
    ];
    const chosenPraise = praises[Math.floor(Math.random() * praises.length)];

    this.setMood('celebrating', chosenPraise);
    speech.speak(chosenPraise);
  }

  /**
   * Called when a child makes an error or asks for assistance
   */
  onMistake(realm, skillKey, hintObject, itemDescription) {
    this.consecutiveMistakes += 1;
    mastery.recordAttempt(skillKey, false, realm, itemDescription);
    sound.play('hint');

    if (this.consecutiveMistakes >= this.frustrationThreshold) {
      this.triggerPatienceIntervention('mistakes');
      return;
    }

    // Patient Growth Mindset Scaffolding
    this.setMood('patient');
    const name = contextMemory.profile.name;
    const gentleEncouragements = [
      `What an intriguing idea, ${name}! Let us take a slow, curious look together.`,
      `Every master was once an apprentice, ${name}. Let's look at this clue:`,
      `No rush at all, ${name}! Take a gentle breath and let's explore this step.`
    ];
    const prefix = gentleEncouragements[Math.floor(Math.random() * gentleEncouragements.length)];

    let hintText = '';
    if (hintObject && hintObject.hintMetaphor) {
      hintText = `${prefix} ${hintObject.hintMetaphor}`;
    } else if (hintObject && hintObject.hint) {
      hintText = `${prefix} ${hintObject.hint}`;
    } else {
      hintText = `${prefix} Try breaking it down into smaller parts!`;
    }

    this.setMood('patient', hintText);
    speech.speak(hintText);
  }

  /**
   * Trigger Mindful Pause when frustration or overwhelm is sensed
   */
  triggerPatienceIntervention(reason) {
    this.setMood('mindful');
    sound.play('breatheIn');

    const name = contextMemory.profile.name;
    const mindfulMsg = `Let's take a peaceful starlight breath together, ${name}. Breathe in the calm light... and release.`;
    this.setMood('mindful', mindfulMsg);
    speech.speak(mindfulMsg);

    if (this.onMindfulPauseRequested) {
      this.onMindfulPauseRequested(reason);
    }
  }

  /**
   * Generate Socratic Hint Ladder for the current problem
   */
  getSocraticHints(levelType, problemData) {
    return [
      {
        level: 1,
        title: '🌟 Level 1: The Cosmic Story Metaphor',
        content: problemData.hintMetaphor || 'Think of how each piece fits into the whole story.'
      },
      {
        level: 2,
        title: '🔍 Level 2: Visual Scaffolding',
        content: problemData.visualHint || 'Observe the color-coded parts on your parchment canvas.'
      },
      {
        level: 3,
        title: '✨ Level 3: Step-by-Step Discovery',
        content: problemData.stepHint || `Try counting or blending one step at a time.`
      }
    ];
  }
}

export const tutor = new PrimerTutor();
