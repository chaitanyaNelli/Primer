/**
 * THE PRIMER — CONTEXT MEMORY & PERSONALIZATION ENGINE
 * Customizes every learning prompt, metaphor, and companion greeting to the child's interests.
 */

export class ContextMemory {
  constructor() {
    this.storageKey = 'the_primer_learner_context_v1';
    this.profile = this.loadProfile();
  }

  getDefaultProfile() {
    return {
      name: 'Nell',
      age: 6,
      avatar: '🦉',
      companionName: 'Aether',
      currentTheme: 'dragons',
      interests: ['Space Rockets', 'Magic Dragons', 'Ocean Whales', 'Forest Secrets'],
      favoriteColor: '#4deeea',
      learningStyle: 'visual_story',
      totalSessions: 1
    };
  }

  loadProfile() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load learner profile:', e);
    }
    return this.getDefaultProfile();
  }

  saveProfile() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
    } catch (e) {
      console.warn('Could not save learner profile:', e);
    }
  }

  updateProfile(updates) {
    this.profile = { ...this.profile, ...updates };
    this.saveProfile();
  }

  getThemedMetaphor(concept) {
    const theme = this.profile.currentTheme;
    const metaphors = {
      dragons: {
        addition: 'feeding extra golden stars to Pip the hungry dragon',
        subtraction: 'dragons taking flight to explore the cloud peaks',
        balance: 'balancing two treasure chests on dragon wings',
        phonics: 'breathing dragon fire on sound runes to forge words'
      },
      space: {
        addition: 'fueling rover rocket thrusters with plasma batteries',
        subtraction: 'launching satellites into orbit',
        balance: 'calibrating lunar gravity stabilizers',
        phonics: 'aligning radio beacon frequencies to decode alien messages'
      },
      ocean: {
        addition: 'pearl oysters gathering in the coral reef',
        subtraction: 'dolphins leaping over the ocean crest',
        balance: 'balancing the submarine ballast tanks',
        phonics: 'translating whale song melodies into words'
      },
      forest: {
        addition: 'squirrels storing acorns in the hollow tree',
        subtraction: 'butterflies fluttering across the meadow',
        balance: 'balancing pinecones on the forest scale',
        phonics: 'listening to the whispering wind through the ancient pines'
      }
    };

    return (metaphors[theme] && metaphors[theme][concept]) || `exploring the magical realm of ${concept}`;
  }

  getGreeting() {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    if (hour >= 17) timeGreeting = 'Good evening';

    return `${timeGreeting}, brave ${this.profile.name}! What wonders shall we discover in the Primer today?`;
  }
}

export const contextMemory = new ContextMemory();
