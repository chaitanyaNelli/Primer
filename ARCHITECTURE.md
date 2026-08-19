# 🏛️ The Primer: System Architecture & Technical Design

> *"Inspired by Neal Stephenson's The Young Lady's Illustrated Primer in The Diamond Age."*

---

## 🌟 Executive Overview

**The Primer** is an adaptive, multimodal, and emotionally intelligent AI private tutor web application designed for young children (ages 4–11). It combines real-time generative intelligence (powered by Google Gemini 2.5 Flash), zero-dependency procedural audio synthesis, HTML5 Canvas touch-drawing, and an adaptive cognitive mastery engine.

---

## 🏗️ High-Level System Architecture

```mermaid
graph TD
    subgraph Client ["Client Browser (Touch, Voice & Visual)"]
        UI[Enchanted Codex UI]
        AVATAR[Aether Companion Avatar]
        SPEECH[Web Speech API TTS / STT]
        AUDIO[Web Audio Procedural Synthesizer]
        CANVAS[HTML5 Drawing & Manipulatives Canvas]
        ZPD[Client Mastery Graph & ZPD Engine]
    end

    subgraph Backend ["Python Fullstack Backend (server.py)"]
        REST[REST API Gateway]
        ADAPT[Adaptive Challenge Engine]
        SOCRATIC[Socratic Scaffolding Engine]
        STORIES[Dynamic Story Loom]
        AUTH[Config & Key Manager]
        DATA[(Progress Store primer_data.json)]
    end

    subgraph CloudAI ["Google Gemini AI Cloud"]
        GEMINI[Gemini 2.5 Flash API]
    end

    UI --> REST
    AVATAR --> REST
    REST --> ADAPT
    REST --> SOCRATIC
    REST --> STORIES
    REST --> DATA
    ADAPT --> GEMINI
    SOCRATIC --> GEMINI
    STORIES --> GEMINI
```

---

## 🧩 Core Subsystems & Components

### 1. 📖 The Scribe's Haven (Reading & Phonics Engine)
- **Phoneme Cauldron**: Parses words into phonemic components (CVC, Blends, Magic E, Multi-syllable), rendering draggable runes that trigger audio feedback upon contact.
- **Living Storybook**: Dynamic multi-page interactive reader with syllable breakdown and speech recognition read-aloud verification.
- **AI Story Loom**: Generates structured JSON multi-page storybooks tailored to the child's chosen theme, character name, and reading level.

### 2. ✍️ The Runecrafter's Workshop (Handwriting & Penmanship)
- **Stardust Canvas Engine**: Captures high-frequency pointer and touch events, rendering quadratic Bezier curve strokes with glow effects.
- **Stroke Accuracy Evaluator**: Compares drawn coordinates against predefined guide star checkpoints.
- **Co-Author Story Weaver**: AI dialogue oracle that collaboratively writes continuing chapters with the child.

### 3. 🔢 The Chrono-Alchemist's Spire (Mathematics & Spatial Logic)
- **Ten-Frames**: Visual subitizing grid for base-10 number sense.
- **Balance Scale of Truth**: Physics-calculated visual algebra with rotational beam physics.
- **Cosmic Fraction Slicer**: Real-time geometric slice calculation ($1/2, 1/3, 2/4, 3/4$).
- **Number Line Rover**: Discrete position hopping for addition and subtraction.

### 4. 🦉 The Soul of the Primer (AI Socratic Companion)
- **Patience & Frustration Detector**: Tracks dwell times and rapid incorrect clicks. Automatically triggers **Starlight Breathing** interludes when cognitive fatigue is detected.
- **Socratic Guidance Ladder**: Tiered hints (Level 1: Story Metaphor $\rightarrow$ Level 2: Visual Scaffolding $\rightarrow$ Level 3: Step-by-Step Resolution).
- **"Ask Aether Anything"**: Conversational voice & text Q&A with Gemini.

---

## 🔄 Adaptive Learning Flow & Zone of Proximal Development (ZPD)

```mermaid
sequenceDiagram
    autonumber
    actor Child as 🧒 Learner
    participant UI as 📱 Primer UI
    participant Tutor as 🦉 Aether Tutor
    participant Engine as ⚙️ Backend AI
    participant Gemini as 🤖 Gemini 2.5 Flash

    Child->>UI: Selects Realm (e.g. Reading)
    UI->>Engine: POST /api/adaptive/next-challenge (Mastery: 70%)
    Engine->>Gemini: Generate challenge calibrated to 70% Mastery
    Gemini-->>Engine: Returns { word: 'STAR', phonemes: ['ST','A','R'] }
    Engine-->>UI: Renders Phoneme Cauldron
    Child->>UI: Solves challenge or makes attempt
    alt Correct Solution
        UI->>Tutor: Triggers celebration & XP update
        Tutor-->>Child: "Splendid thinking! Your starlight grows brighter!"
    else Hesitation or Mistake
        UI->>Engine: POST /api/adaptive/socratic-hint
        Engine->>Gemini: Generate gentle metaphor clue (No direct answer)
        Gemini-->>Tutor: "Blend /st/ at the beginning like starlight!"
        Tutor-->>Child: Speaks gentle Socratic hint
    end
```

---

## 🔒 Security & Privacy Architecture
- **Secret Isolation**: All API keys and environment variables are strictly loaded on the backend via `.env` or `config.json` and never exposed to the client.
- **Offline Self-Sufficiency**: If offline or without an API key, the system automatically falls back to an internal procedural adaptive engine with 100% uptime.
