# A Little Universe for Moni ✦

A single-page website built as a friendship gift for **Simla** — "Moni" to me, "Monu" to her. It is a small, personal corner of the internet: part story, part photo album, part mixtape, part letter. No frameworks, no build step, no dependencies — just HTML, CSS and JavaScript.

> **Note:** this is a platonic friendship project, not a romantic one. If you reuse the template, replace the personal text and photos with your own.

> **Language:** the interface and all copy are written in **Bangla (বাংলা)**. Section headings, the playlist (song titles, artist, side labels), the letter's "Dear Moni," / "Always in your corner, Monu" lines, and the names Moni/Monu stay in English by design.

---

## ✨ What's inside

- **Lock screen** — the page opens behind a soft passcode gate.
  - Codes: `monu` and `moni` (both accepted, case-insensitive).
  - Hint shown on the lock screen: _"psst — it's the name you gave me"_.
  - Wrong code shakes the card; Enter submits.

- **Hero** — "Hey, Moni." above a slowly orbiting little solar system (two planets labelled with the nicknames, one heart-shaped sun).

- **Our story** — four short chapters describing the friendship, in plain, non-romantic language.

- **Friendship counter** - a live days / hours / minutes / seconds ticker that starts at `22 October 2025, 17:41`.

- **Photo memories** — a responsive slider with previous/next buttons, dot pagination, keyboard arrow support, and touch swipe on phones.

- **The note jar** — click the jar to pull a random handwritten-style note. Notes don't repeat until the jar is empty, and a small badge counts how many have been opened.

- **The Moni & Monu tapes** — a custom four-track player (no Spotify embed):
  - Play/pause, previous/next, seek bar, volume, and a clickable tracklist.
  - Track metadata, durations, and a subtle "now playing" animation.
  - **The playlist and the background track never play over each other.** Starting a song pauses `music1.mp3`; resuming the background music pauses the song.
  - The floating ♪ button in the bottom-right corner controls the background track.

- **A letter** — a longer, more personal note signed "Monu".

- **Final surprise** — "one more thing" at the bottom of the page.

- **Ambient details** — starfield, drifting particles, scroll progress bar, scroll-reveal animations, active-section nav highlighting, and `prefers-reduced-motion` support.

---

## 📂 Project structure

```text
A-universe-main/
│
├── index.html          # All page markup
├── styles.css          # All styling, animations and responsive rules
├── app.js              # Lock, slider, counter, jar, player, particles
├── music1.mp3          # Background track (plays after unlock)
├── photo1.jpg          # Gallery slide 1
├── photo2.jpg          # Gallery slide 2
├── photo3.jpg          # Gallery slide 3
├── photo4.jpg          # Gallery slide 4
├── songs/
│   ├── song1.mp3
│   ├── song2.mp3
│   ├── song3.mp3
│   └── song4.mp3
└── README.md
```

---

## 🚀 Running it

Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

For the most reliable audio and autoplay behaviour, serve the folder with a minimal static server instead of double-clicking the file:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Then visit `http://localhost:8000/` and enter the passcode.

> Browsers block audio until the first user interaction, so the background music starts **after** the page is unlocked — that click is the gesture the browser is waiting for.

---

## ⚙️ Customising it

Everything personal lives in **`app.js`** (top of the file) and **`index.html`**.

### 1. Passcode

```js
const CONFIG = {
    lockCodes: ["monu", "moni"],
    friendshipStart: new Date("2025-10-22T17:41:00"),
    backgroundVolume: 0.32
};
```

- Add or remove entries in `lockCodes` to change the accepted codes.
- The input is trimmed and lowercased before comparison.

### 2. Friendship counter

Change `friendshipStart` to any date your browser can parse. The counter updates every second and reads "22 October 2025" style text in the section head.

### 3. Playlist

Tracks are defined in the `tracks` array in `app.js`:

```js
const tracks = [
    { title: "31 December 2025", artist: "monu", length: "3:45", src: "songs/song1.mp3" },
    ...
];
```

Titles come from the ID3 tags of the four files in `songs/`; the artist is displayed as **monu** for every track. Update the titles/authors here if you prefer different labels.

### 4. Notes in the jar

Edit the `loveNotes` array in `app.js`:

```js
const loveNotes = [
    "Your note text here...",
    "Another note...",
];
```

The jar reshuffles itself automatically once every note has been read.

### 5. Photos

Replace `photo1.jpg` … `photo4.jpg` in the project root (keep the filenames). Portrait images around **3:4 / 4:5** look best.

> ⚠️ The bundled `photo1.jpg`–`photo4.jpg` are placeholder romantic couple illustrations. Before sending this to Simla, swap them for actual photos of the two of you (or friendship-appropriate images). If an image is missing, the slider shows a graceful fallback card instead of breaking.

---

## 🎧 Player behaviour in detail

| Action | Result |
| --- | --- |
| Click ▶ on a track / the big play button | Background music pauses, the song plays |
| Click ⏸ | Song pauses; background music stays paused until you resume it |
| Click the floating ♪ button | Background music toggles; a playing song is paused when the background track starts |
| Click a track in the list | Loads and plays that track |
| Drag the seek bar or volume slider | Updates playback position / volume immediately |
| Track ends | Automatically advances to the next song, looping after the last one |

Media Session metadata (title/artist) is wired up so lock-screen and OS media controls show the current track on supported browsers.

---

## ♿ Accessibility & responsiveness

- Semantic landmarks, labelled buttons, `aria-pressed` on the background-music toggle, `role="alert"` on the error message.
- Slider is focusable and responds to arrow keys; the jar is reachable and operable with the keyboard.
- Visible focus outlines, descriptive `aria-label`s for icon-only controls.
- Layout collapses to a single column on tablets and phones; the character/orbit graphic scales down.
- Animations are reduced or disabled under `prefers-reduced-motion: reduce`.

---

## 📱 Browser support

- Chrome / Edge (desktop and Android)
- Safari (macOS and iOS)
- Firefox

---

## 📄 License

Personal, private use. The music belongs to its respective creators.
