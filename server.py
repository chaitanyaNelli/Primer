#!/usr/bin/env python3
"""
THE PRIMER — REAL-TIME ADAPTIVE AI ENGINE WITH GEMINI INTEGRATION
Generates bespoke learning challenges across Reading, Writing, and Math
dynamically calibrated to the child's real-time knowledge, age, mastery graph, and interests.
"""

import http.server
import socketserver
import json
import os
import sys
import urllib.parse
import urllib.request
import random
import time

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'primer_data.json')
ENV_FILE = os.path.join(BASE_DIR, '.env')
CONFIG_FILE = os.path.join(BASE_DIR, 'config.json')

def load_config():
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY') or ''

    # Check .env file if key not already in environment
    if not api_key and os.path.exists(ENV_FILE):
        try:
            with open(ENV_FILE, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        if k.strip() in ('GEMINI_API_KEY', 'GOOGLE_API_KEY', 'API_KEY'):
                            api_key = v.strip().strip('"\'')
                            break
        except Exception:
            pass

    # Check config.json
    if not api_key and os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                saved = json.load(f)
                if saved.get('gemini_api_key'):
                    api_key = saved.get('gemini_api_key')
        except Exception:
            pass

    return {"gemini_api_key": api_key, "model": "gemini-1.5-flash"}

def save_config(config):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2)
    except Exception as e:
        print(f"Error saving config: {e}", file=sys.stderr)

def call_gemini_api(prompt, system_instruction="", api_key=None):
    """
    Call Google Gemini REST API with Gemini 2.5 Flash
    """
    if not api_key:
        cfg = load_config()
        api_key = cfg.get('gemini_api_key')

    if not api_key:
        return None

    models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"]
    for model_name in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.75, "maxOutputTokens": 1000}
        }
        if system_instruction:
            payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                candidates = res_data.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        return parts[0].get('text', '')
        except Exception as e:
            # Try next model if 404
            continue

    return None

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "profile": {"name": "Nell", "age": 6, "theme": "dragons", "stars": 5, "level": 1},
        "mastery": {},
        "customStories": []
    }

def save_data(data):
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving data: {e}", file=sys.stderr)

class PrimerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Gemini-Key')
        self.end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def parse_body(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length > 0:
                raw = self.rfile.read(length).decode('utf-8')
                return json.loads(raw)
        except Exception:
            pass
        return {}

    def get_api_key(self, body):
        return body.get('apiKey') or self.headers.get('X-Gemini-Key') or load_config().get('gemini_api_key')

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/health':
            cfg = load_config()
            self.send_json({
                "status": "online",
                "service": "The Primer Real-Time Adaptive AI Engine",
                "version": "3.0",
                "hasGeminiKey": bool(cfg.get('gemini_api_key')),
                "timestamp": time.time()
            })
            return

        elif path == '/api/progress':
            self.send_json(load_data())
            return

        elif path == '/api/config':
            cfg = load_config()
            self.send_json({
                "hasKey": bool(cfg.get('gemini_api_key')),
                "maskedKey": ("..." + cfg.get('gemini_api_key')[-4:]) if cfg.get('gemini_api_key') else ""
            })
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.parse_body()
        api_key = self.get_api_key(body)

        # 0. Set/Update API Key
        if path == '/api/config':
            new_key = body.get('geminiApiKey', '').strip()
            save_config({"gemini_api_key": new_key, "model": "gemini-1.5-flash"})
            self.send_json({"success": True, "hasKey": bool(new_key)})
            return

        # =========================================================================
        # 1. CORE ADAPTIVE CHALLENGE GENERATOR (Generated dynamically from knowledge)
        # =========================================================================
        elif path == '/api/adaptive/next-challenge':
            realm = body.get('realm', 'reading') # 'reading' | 'writing' | 'math'
            child_name = body.get('name', 'Nell')
            age = body.get('age', 6)
            theme = body.get('theme', 'dragons')
            mastery_score = body.get('masteryScore', 50) # 0 - 100
            specific_skill = body.get('skillKey', 'phonics')

            # Use Gemini if available
            if api_key:
                system_prompt = (
                    "You are The Young Lady's Illustrated Primer AI engine. "
                    "You generate a personalized, adaptive learning challenge for a child based on their exact mastery level, age, and interest. "
                    "Output ONLY valid JSON format with no markdown wrappers."
                )

                if realm == 'reading':
                    prompt = (
                        f"Child: {child_name} (Age {age}), Theme: {theme}, Phonics Mastery: {mastery_score}%. "
                        "Generate an adaptive phonics word challenge tailored to this level. "
                        "If mastery < 60: Short CVC word. If 60-80: Consonant blends/digraphs. If > 80: Vowel teams or 2-syllable word. "
                        "Return JSON format:\n"
                        "{\n"
                        '  "word": "DRAGON",\n'
                        '  "phonemes": ["DR", "A", "G", "O", "N"],\n'
                        '  "emoji": "🐉",\n'
                        '  "hint": "A friendly winged beast that breathes rainbow fire",\n'
                        '  "metaphor": "Sound out each phoneme step by step to awaken the dragon!",\n'
                        '  "levelLabel": "Adaptive Phonics Blend"\n'
                        "}"
                    )
                elif realm == 'math':
                    prompt = (
                        f"Child: {child_name} (Age {age}), Theme: {theme}, Math Mastery: {mastery_score}%. "
                        "Generate an adaptive math puzzle (ten-frame, balance scale, or fraction) suited to their mastery score. "
                        "Return JSON format:\n"
                        "{\n"
                        '  "type": "tenframe" or "balance" or "fraction" or "numberline",\n'
                        '  "title": "Short title",\n'
                        '  "instruction": "Story math question featuring their theme and name",\n'
                        '  "initialCount": 4,\n'
                        '  "targetSum": 10,\n'
                        '  "leftWeights": [5, 3],\n'
                        '  "rightWeights": [4],\n'
                        '  "correctAnswer": 4,\n'
                        '  "options": [2, 4, 6, 8],\n'
                        '  "hintMetaphor": "Gentle conceptual clue using their theme"\n'
                        "}"
                    )
                else: # writing
                    prompt = (
                        f"Child: {child_name} (Age {age}), Theme: {theme}, Writing Mastery: {mastery_score}%. "
                        "Generate a personalized creative writing rune / story starter that stretches their imagination. "
                        "Return JSON format:\n"
                        "{\n"
                        '  "runeChar": "W",\n'
                        '  "hint": "Down, up, down, up like the wings of a starlight pegasus!",\n'
                        '  "storyStarter": "As the sun set over the glowing forest...",\n'
                        '  "storyQuestion": "What magical secret did you discover inside the tree?",\n'
                        '  "suggestedWords": ["crystal key", "sleeping dragon", "music box", "starlight compass"]\n'
                        "}"
                    )

                gemini_res = call_gemini_api(prompt, system_prompt, api_key)
                if gemini_res:
                    try:
                        clean = gemini_res.strip()
                        if clean.startswith('```json'): clean = clean[7:]
                        if clean.endswith('```'): clean = clean[:-3]
                        parsed_challenge = json.loads(clean.strip())
                        self.send_json({"success": True, "challenge": parsed_challenge, "source": "gemini-ai"})
                        return
                    except Exception as e:
                        print(f"Failed parsing Gemini adaptive challenge: {e}", file=sys.stderr)

            # Smart Procedural Dynamic Generator based on Kid's knowledge score
            if realm == 'reading':
                cvc_bank = [
                    {"word": "SUN", "phonemes": ["S", "U", "N"], "emoji": "☀️", "hint": "The bright warm star of the day", "metaphor": "Starts with /s/!"},
                    {"word": "CAT", "phonemes": ["C", "A", "T"], "emoji": "🐱", "hint": "A fluffy purring companion", "metaphor": "Rhymes with hat!"},
                    {"word": "FOX", "phonemes": ["F", "O", "X"], "emoji": "🦊", "hint": "A clever animal with a bushy tail", "metaphor": "Ends with the /ks/ sound!"},
                    {"word": "BUG", "phonemes": ["B", "U", "G"], "emoji": "🐞", "hint": "A spotted crawler on a leaf", "metaphor": "Middle vowel is short /u/!"},
                    {"word": "MAP", "phonemes": ["M", "A", "P"], "emoji": "🗺️", "hint": "Shows the secret mountain trails", "metaphor": "Begins with /m/!"},
                    {"word": "GEM", "phonemes": ["G", "E", "M"], "emoji": "💎", "hint": "A sparkling subterranean crystal", "metaphor": "Glows with short /e/!"}
                ]
                blend_bank = [
                    {"word": "STAR", "phonemes": ["ST", "A", "R"], "emoji": "⭐", "hint": "A diamond twinkling in space", "metaphor": "Blend /st/ at the start!"},
                    {"word": "SHIP", "phonemes": ["SH", "I", "P"], "emoji": "⛵", "hint": "Sails across rolling waves", "metaphor": "Digraph /sh/ makes a quiet sound!"},
                    {"word": "FROG", "phonemes": ["FR", "O", "G"], "emoji": "🐸", "hint": "Hops from lily pad to lily pad", "metaphor": "Blend /fr/ like fresh!"},
                    {"word": "DRUM", "phonemes": ["DR", "U", "M"], "emoji": "🥁", "hint": "Plays the royal heartbeat rhythm", "metaphor": "Blend /dr/ like dream!"},
                    {"word": "MOON", "phonemes": ["M", "OO", "N"], "emoji": "🌙", "hint": "The silver guardian of the night", "metaphor": "Double /oo/ sounds like hoot!"}
                ]
                advanced_bank = [
                    {"word": "DRAGON", "phonemes": ["DR", "A", "G", "O", "N"], "emoji": "🐉", "hint": "A majestic winged guardian", "metaphor": "2 syllables: DRA-GON!"},
                    {"word": "ROCKET", "phonemes": ["R", "O", "CK", "E", "T"], "emoji": "🚀", "hint": "Blasts off into the deep cosmos", "metaphor": "2 syllables: ROCK-ET!"},
                    {"word": "CASTLE", "phonemes": ["C", "A", "S", "T", "L", "E"], "emoji": "🏰", "hint": "A towering stone fortress of kings", "metaphor": "Silent t in castle!"}
                ]

                if mastery_score < 50:
                    chosen = random.choice(cvc_bank)
                    level_name = "Foundational CVC"
                elif mastery_score < 75:
                    chosen = random.choice(blend_bank)
                    level_name = "Elemental Blends & Digraphs"
                else:
                    chosen = random.choice(advanced_bank)
                    level_name = "Master Scribe Phonics"

                self.send_json({
                    "success": True,
                    "challenge": {
                        "word": chosen["word"],
                        "phonemes": chosen["phonemes"],
                        "emoji": chosen["emoji"],
                        "hint": chosen["hint"],
                        "metaphor": chosen["metaphor"],
                        "levelLabel": f"Adaptive {level_name} ({mastery_score}% Mastery)"
                    },
                    "source": "adaptive-procedural"
                })
                return

            elif realm == 'math':
                # Dynamic math generator tailored to score
                if mastery_score < 60:
                    target_sum = 10
                    initial_count = random.randint(3, 7)
                    missing = target_sum - initial_count
                    challenge = {
                        "type": "tenframe",
                        "title": f"Adaptive Ten-Frame (Making {target_sum})",
                        "instruction": f"{child_name} has {initial_count} crystals. How many more are needed to make {target_sum}?",
                        "initialCount": initial_count,
                        "targetSum": target_sum,
                        "correctAnswer": missing,
                        "hintMetaphor": f"Start from {initial_count} and count up to {target_sum}!"
                    }
                elif mastery_score < 80:
                    left_a = random.randint(4, 7)
                    left_b = random.randint(2, 5)
                    total_left = left_a + left_b
                    right_a = random.randint(2, total_left - 2)
                    missing = total_left - right_a
                    options = sorted(list(set([missing, missing - 1 if missing > 1 else missing + 2, missing + 2, missing + 3])))
                    challenge = {
                        "type": "balance",
                        "title": "Adaptive Balance Scale of Truth",
                        "instruction": f"Left side has {left_a} + {left_b} = {total_left}. Right side has {right_a}. What weight balances the beam?",
                        "leftWeights": [left_a, left_b],
                        "rightWeights": [right_a],
                        "correctAnswer": missing,
                        "options": options,
                        "hintMetaphor": f"{total_left} minus {right_a} gives the exact balance weight!"
                    }
                else:
                    slices_opts = [3, 4, 6]
                    total_slices = random.choice(slices_opts)
                    sel_slices = random.randint(1, total_slices - 1)
                    frac_name = f"{sel_slices}/{total_slices}"
                    opts = [frac_name, f"{total_slices - sel_slices}/{total_slices}", f"1/{total_slices}", "1/2"]
                    opts = list(set(opts))
                    challenge = {
                        "type": "fraction",
                        "title": f"Adaptive Cosmic Fraction Slicer ({frac_name})",
                        "instruction": f"The celestial mooncake is sliced into {total_slices} equal pieces. {sel_slices} pieces are golden. What fraction is that?",
                        "totalSlices": total_slices,
                        "selectedSlices": sel_slices,
                        "fractionName": frac_name,
                        "options": opts,
                        "correctIndex": opts.index(frac_name),
                        "hintMetaphor": f"{sel_slices} parts shaded out of {total_slices} total pieces!"
                    }

                self.send_json({"success": True, "challenge": challenge, "source": "adaptive-procedural"})
                return

            else: # writing
                runes_bank = [
                    {"char": "A", "hint": "Slide down left, slide down right, bridge the middle!", "points": [{"x":180,"y":40},{"x":70,"y":250},{"x":180,"y":40},{"x":290,"y":250},{"x":120,"y":160},{"x":240,"y":160}]},
                    {"char": "B", "hint": "Line straight down, round the top belly, round the bottom!", "points": [{"x":100,"y":40},{"x":100,"y":250},{"x":100,"y":40},{"x":220,"y":90},{"x":100,"y":140},{"x":230,"y":195},{"x":100,"y":250}]},
                    {"char": "S", "hint": "Curve like the moon, loop back, and sweep forward!", "points": [{"x":250,"y":70},{"x":180,"y":40},{"x":100,"y":90},{"x":180,"y":140},{"x":260,"y":200},{"x":180,"y":255},{"x":90,"y":220}]},
                    {"char": "8", "hint": "Make an S and do not wait, race back up to close the eight!", "points": [{"x":180,"y":40},{"x":110,"y":90},{"x":180,"y":140},{"x":250,"y":200},{"x":180,"y":260},{"x":110,"y":200},{"x":180,"y":140},{"x":250,"y":90},{"x":180,"y":40}]},
                    {"char": "⭐", "hint": "Draw the 5-point celestial star of wisdom!", "points": [{"x":180,"y":40},{"x":220,"y":250},{"x":80,"y":120},{"x":280,"y":120},{"x":140,"y":250},{"x":180,"y":40}]}
                ]
                chosen = random.choice(runes_bank)
                self.send_json({
                    "success": True,
                    "challenge": {
                        "runeChar": chosen["char"],
                        "hint": chosen["hint"],
                        "guidePoints": chosen["points"],
                        "storyStarter": f"Deep inside the {theme} realm, {child_name} discovered a glowing scroll...",
                        "storyQuestion": "What secret message did the ancient scroll reveal?",
                        "suggestedWords": ["dragon wings", "star map", "singing crystal", "golden crown"]
                    },
                    "source": "adaptive-procedural"
                })
                return

        # =========================================================================
        # 2. DYNAMIC SOCRATIC HINT GENERATOR (Based on exact mistake & theme)
        # =========================================================================
        elif path == '/api/adaptive/socratic-hint':
            child_name = body.get('name', 'Nell')
            theme = body.get('theme', 'dragons')
            challenge_context = body.get('context', '')
            mistake_attempt = body.get('attempt', '')

            if api_key:
                system_prompt = (
                    "You are Aether, the deeply patient, Socratic AI tutor from The Diamond Age. "
                    "A 6-year-old child made a mistake on a challenge. "
                    "DO NOT GIVE THE ANSWER. Provide a gentle 1-sentence growth-mindset clue using their favorite theme as a metaphor."
                )
                user_prompt = f"Child {child_name} (Theme: {theme}) attempted '{mistake_attempt}' for challenge '{challenge_context}'. Guide them warmly!"
                gemini_hint = call_gemini_api(user_prompt, system_prompt, api_key)
                if gemini_hint:
                    self.send_json({"success": True, "hint": gemini_hint.strip(), "source": "gemini-ai"})
                    return

            # Fallback gentle Socratic hints
            hints = [
                f"Look closely at the very first part, {child_name}. How does it connect to the next step?",
                f"What an interesting thought, {child_name}! What happens if we count one by one starting from the beginning?",
                f"Take a slow breath like a soaring dragon, {child_name}. Let's break this piece into two smaller friendly parts!"
            ]
            self.send_json({"success": True, "hint": random.choice(hints), "source": "procedural"})
            return

        # 3. AI Co-Author Story Weaving Endpoint
        elif path == '/api/story/generate':
            child_name = body.get('name', 'Nell')
            theme = body.get('theme', 'dragons')
            user_input = body.get('input', '')

            if api_key:
                system_prompt = (
                    "You are The Primer, an enchanting AI tutor for young children. "
                    "Write the next exciting 2-3 sentence chapter based on what the child wrote. "
                    "Make the child the hero, celebrate their vocabulary, and end with a gentle question."
                )
                user_prompt = f"Hero: {child_name}, Theme: {theme}. The child wrote: '{user_input}'. Continue the fable!"
                gemini_text = call_gemini_api(user_prompt, system_prompt, api_key)
                if gemini_text:
                    self.send_json({"success": True, "chapter": gemini_text.strip(), "source": "gemini-ai", "author": f"{child_name} & The Primer AI"})
                    return

            # Fallback procedural
            story_expansions = {
                'dragons': [
                    f"As {child_name} approached the {user_input}, the baby dragon Pip flapped his wings and sneezed a gentle puff of rainbow starlight! Behind the glowing moss, a hidden crystal chest began to hum with ancient music.",
                    f"Together with Pip, {child_name} discovered that the {user_input} was actually a secret key that unlocked the stone door of the Celestial Observatory!"
                ],
                'space': [
                    f"Rover Pip scanned the {user_input} with its golden sensor beam. Beep-boop! A hidden lunar geode opened, revealing sparkling moon-crystals that powered the rocket thruster!",
                    f"{child_name} and Rover Pip watched as the {user_input} activated the orbital star-beacon, sending a cheerful greeting across the galaxy."
                ],
                'ocean': [
                    f"Deep in the turquoise reef, the {user_input} glowed with seafoam luminescence. A friendly dolphin knight bowed softly and presented {child_name} with a pearl of wisdom.",
                    f"The underwater castle gates opened as {child_name} placed the {user_input} upon the coral altar, awakening the gentle song of the ancient whales."
                ]
            }
            expansions = story_expansions.get(theme, story_expansions['dragons'])
            self.send_json({"success": True, "chapter": random.choice(expansions), "source": "procedural", "author": f"{child_name} & The Primer AI"})
            return

        # 4. Multi-Page Story Loom
        elif path == '/api/story/summon-book':
            child_name = body.get('name', 'Nell')
            theme = body.get('theme', 'space')
            hero_concept = body.get('concept', 'searching for the lost star compass')

            if api_key:
                prompt = (
                    f"Create an interactive 2-page children's storybook for a 6-year-old child named {child_name}. "
                    f"Theme: {theme}. Plot: {hero_concept}. "
                    "Return ONLY valid JSON format:\n"
                    "{\n"
                    '  "title": "Title Here",\n'
                    '  "illustration": "🚀✨",\n'
                    '  "caption": "Short caption",\n'
                    '  "pages": [\n'
                    '    {"text": "Sentence 1. Sentence 2.", "focusWords": ["word1", "word2"], "question": "Question?", "options": ["Correct", "Wrong 1", "Wrong 2"], "correctIndex": 0},\n'
                    '    {"text": "Sentence 3. Sentence 4.", "focusWords": ["word3", "word4"], "question": "Question?", "options": ["Correct", "Wrong 1", "Wrong 2"], "correctIndex": 0}\n'
                    '  ]\n'
                    "}"
                )
                gemini_text = call_gemini_api(prompt, "You are a children's storybook author who outputs pure JSON.", api_key)
                if gemini_text:
                    try:
                        clean_json = gemini_text.strip()
                        if clean_json.startswith('```json'): clean_json = clean_json[7:]
                        if clean_json.endswith('```'): clean_json = clean_json[:-3]
                        story_data = json.loads(clean_json.strip())
                        story_data["id"] = f"ai_story_{int(time.time())}"
                        story_data["theme"] = theme
                        self.send_json({"success": True, "story": story_data, "source": "gemini-ai"})
                        return
                    except Exception as e:
                        print(f"Error parsing Gemini story: {e}", file=sys.stderr)

            # Procedural fallback
            emojis = {'dragons': '🐉✨', 'space': '🚀🌕', 'ocean': '🐬🌊', 'forest': '🦊🌲'}
            generated_story = {
                "id": f"procedural_{int(time.time())}",
                "title": f"{child_name} and the {theme.capitalize()} Quest",
                "theme": theme,
                "illustration": emojis.get(theme, '✨📖'),
                "caption": f"{child_name} embarking on a wondrous journey through the {theme} realm.",
                "pages": [
                    {
                        "text": f"One bright morning, {child_name} found a shimmering key beside the path and set out to explore the wonders of the realm.",
                        "focusWords": ["morning", "shimmering", "explore", "realm"],
                        "question": f"What did {child_name} find beside the path?",
                        "options": ["A shimmering key", "A wooden stick", "A tiny coin"],
                        "correctIndex": 0
                    },
                    {
                        "text": f"With a brave heart and gentle steps, {child_name} unlocked the crystal gate and brought joy and starlight to all friends in the valley.",
                        "focusWords": ["brave", "unlocked", "crystal", "starlight"],
                        "question": "What gate did the key unlock?",
                        "options": ["The crystal gate", "The iron barn", "The cellar door"],
                        "correctIndex": 0
                    }
                ]
            }
            self.send_json({"success": True, "story": generated_story, "source": "procedural-engine"})
            return

        # 5. Conversational AI Tutor ("Ask Aether Anything")
        elif path == '/api/tutor/chat':
            child_name = body.get('name', 'Nell')
            query = body.get('query', '')

            if api_key and query:
                system_prompt = (
                    "You are Aether, a loving, patient, and deeply encouraging AI companion from The Diamond Age. "
                    "Explain concepts to a 6-year-old child using simple language, vivid storytelling metaphors, wonder, and gentle curiosity. Keep your response under 3 sentences."
                )
                user_prompt = f"Child {child_name} asks: '{query}'"
                gemini_text = call_gemini_api(user_prompt, system_prompt, api_key)
                if gemini_text:
                    self.send_json({"success": True, "reply": gemini_text.strip(), "mood": "happy", "source": "gemini-ai"})
                    return

            q_lower = query.lower()
            if 'why' in q_lower or 'how' in q_lower:
                reply = f"That is such a profound question, {child_name}! Think of nature as a vast clockwork clock where every gear has a special purpose."
            elif 'math' in q_lower or 'number' in q_lower:
                reply = f"Numbers are like magical building blocks, {child_name}. When we join them together, they build castles of logic!"
            elif 'read' in q_lower or 'word' in q_lower:
                reply = f"Every word is a spell, {child_name}! When we sound them out, they paint living pictures in our minds."
            else:
                replies = [
                    f"I love the way your curious mind sparkles, {child_name}! What part of the journey shall we explore next?",
                    f"You are growing wiser with every single step, {child_name}. Take a gentle breath and let's discover together!",
                    f"Magnificent observation, {child_name}! The Primer shimmers with your creative questions."
                ]
                reply = random.choice(replies)

            self.send_json({"success": True, "reply": reply, "mood": "curious", "source": "heuristic"})
            return

        # 6. Bedtime Fable Weaver
        elif path == '/api/tutor/bedtime':
            child_name = body.get('name', 'Nell')
            theme = body.get('theme', 'dragons')
            stars = body.get('stars', 5)

            if api_key:
                system_prompt = (
                    "You are The Primer creating a soothing, magical bedtime story for a young child (age 6). "
                    "Celebrate their accomplishments in learning today, mention their earned stars, and guide them into peaceful, sleepy rest."
                )
                user_prompt = f"Write a soothing 1-paragraph bedtime story for {child_name} in the {theme} world, celebrating their {stars} stars."
                gemini_text = call_gemini_api(user_prompt, system_prompt, api_key)
                if gemini_text:
                    self.send_json({"success": True, "story": gemini_text.strip(), "source": "gemini-ai"})
                    return

            bedtime_story = (
                f"Tonight, beneath the twinkling blanket of the celestial sky, brave {child_name} "
                f"completed an extraordinary quest in the realm of {theme}. Having earned {stars} radiant stars "
                f"through patience and wisdom, {child_name} rested beside the gentle creatures of the realm. "
                f"The night breeze whispered a soothing lullaby, and the stars glowed softly above. Sleep peacefully, dear {child_name}."
            )
            self.send_json({"success": True, "story": bedtime_story, "source": "procedural-engine"})
            return

        # 7. Save Progress
        elif path == '/api/progress':
            data = load_data()
            if 'profile' in body:
                data['profile'].update(body['profile'])
            if 'mastery' in body:
                data['mastery'] = body['mastery']
            save_data(data)
            self.send_json({"success": True, "saved": data})
            return

        self.send_json({"error": "Endpoint not found"}, status=404)

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PrimerHandler) as httpd:
        print(f"================================================================")
        print(f"  THE PRIMER — REAL-TIME ADAPTIVE AI ENGINE STARTED")
        print(f"  URL: http://localhost:{PORT}")
        print(f"  API Health: http://localhost:{PORT}/api/health")
        print(f"================================================================")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
