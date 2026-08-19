# 🌟 The Primer: Adaptive AI Private Tutor for Young Children

> *"The Diamond Age's Young Lady's Illustrated Primer brought to life."*

**The Primer** is an adaptive, deeply patient, and multimodal consumer-scale AI private tutor web application designed for young children (ages 4–11). It teaches **Reading & Phonics, Handwriting & Creative Writing, and Intuitive Mathematics** through dynamic storyweaving, interactive manipulatives, voice synthesis, emotional scaffolding, and real-time Google Gemini AI intelligence.

---

## ✨ Features & Sovereign Realms

### 📖 1. The Scribe's Haven (Reading & Phonics)
- **Phoneme Cauldron Lab**: Drag-and-drop letter gems onto sound slots. Real-time audio synthesis sounds out phonemes and summons animated illustrations.
- **Living Storybook Library**: Interactive multi-page stories with tap-to-inspect phonetic breakdowns and syllable clapping cards.
- **✨ AI Story Loom**: Generates bespoke multi-page illustrated storybooks on demand for any quest concept using Google Gemini.
- **Voice Read-Aloud**: Voice recognition checks and rewards speech reading practice.

### ✍️ 2. The Runecrafter's Workshop (Writing & Penmanship)
- **Stardust Rune Tracer**: HTML5 Canvas with glowing particle ink, guide paths, and stroke accuracy evaluation for letters, numbers, and celestial runes.
- **Co-Author Story Weaver**: AI story oracle that collaborates with the child to write continuing story chapters.
- **🔨 Anagram Word Forge**: Tactile anagram spelling mini-game.

### 🔢 3. The Chrono-Alchemist's Spire (Mathematics & Spatial Logic)
- **Multi-Level Ten-Frames**: Subitizing, place-value, and making-10 manipulatives with draggable starlight orbs.
- **The Balance Scale of Truth**: Physics-calculated visual algebra and weight balancing.
- **Cosmic Fraction Slicer**: Interactive geometric fraction cutter ($1/2, 1/3, 2/4, 3/4$).
- **Number Line Hop Track**: Space rover hopping along number lines for addition and subtraction.

### 🦉 4. The Soul of the Primer (Deep Patience AI Companion)
- **Aether the Starlight Sprite**: Expressive animated avatar with live emotional mood states (Curious, Joyful, Patient, Celebrating, Mindful).
- **Frustration Detector & Mindful Pause**: Detects rapid misclicks or struggle, automatically triggering calming **Starlight Breathing** interludes.
- **Socratic Hint Ladder**: Multi-tiered clues (Metaphor $\rightarrow$ Visual Scaffolding $\rightarrow$ Step-by-Step Discovery).
- **"Ask Aether Anything"**: Conversational voice/text chat powered by Google Gemini.

### 📜 5. Parent & Educator Chronicle
- **Cognitive Mastery Radar**: 8-axis canvas visualization tracking Phonemic Blending, Reading Fluency, Handwriting, Storytelling, Number Sense, Balance Logic, Fractions, and Emotional Resilience.
- **Bedtime Fable Weaver**: Synthesizes the child's daily achievements into a soothing nighttime story.

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.8+ (No external pip dependencies required!)
- Any modern web browser (Chrome, Edge, Safari, Firefox)

### 2. Configuration (Optional Google Gemini Key)
Copy the example environment file and insert your free key from [Google AI Studio](https://aistudio.google.com/app/apikey):
```bash
cp .env.example .env
# Edit .env and set: GEMINI_API_KEY=your_key_here
```
*(Note: If no API key is provided, the application runs on a built-in multi-tier adaptive procedural AI engine).*

### 3. Run the Server
```bash
python server.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser!

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, Particle Starfields), Modular ES6 JavaScript, HTML5 Canvas, Web Audio API, Web Speech API.
- **Backend**: Lightweight Python Fullstack Server (`server.py`), REST API endpoints for Gemini 2.5 Flash, story weaving, adaptive challenge generation, and progress persistence.
