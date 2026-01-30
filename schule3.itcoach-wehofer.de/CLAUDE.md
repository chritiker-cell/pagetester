# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sight Reading Trainer - A web app for practicing piano sight-reading. Generates random music pieces (8-12 measures) with Grand Staff notation, playback, and fingering suggestions.

## Deployment

Part of the parent WebseiteFTP repository. Deploy by committing and pushing to main:
```bash
git add .
git commit -m "Description"
git push
```
GitHub Actions automatically syncs to `public_html/` on the FTP server.

## Local Development

Open `index.html` with VS Code Live Server extension.

## Architecture

**Module Dependencies (load order matters):**
```
config.js → generator.js → notation.js → playback.js → app.js
```

**Core Modules:**

| Module | Global Object | Purpose |
|--------|---------------|---------|
| `config.js` | `CONFIG` + helper functions | Key signatures, difficulty levels, note durations, display settings |
| `generator.js` | `PieceGenerator` | Creates random pieces based on settings; generates notes per measure, adds fingerings |
| `notation.js` | `NotationRenderer` | VexFlow wrapper; renders Grand Staff, handles note highlighting during playback |
| `playback.js` | `Playback` | Tone.js wrapper; schedules notes, manages transport (play/pause/stop/loop) |
| `app.js` | `App` | Main controller; manages views, UI events, coordinates other modules |

**Data Flow:**
1. User selects settings (level, key difficulty, time signature, measures)
2. `PieceGenerator.generate(settings)` creates piece object with `trebleNotes[]` and `bassNotes[]`
3. `NotationRenderer.render(piece, settings)` draws to SVG via VexFlow
4. `Playback.loadPiece(piece)` schedules Tone.js events
5. Playback callbacks trigger `NotationRenderer.highlightNote()` for visual sync

**Piece Object Structure:**
```javascript
{
  key: { name: 'C-Dur', vexKey: 'C' },
  timeSignature: '4/4',
  measureCount: 8,
  trebleNotes: [[{pitch, duration, fingering, startTime}], ...],
  bassNotes: [[{pitch, duration, fingering, startTime, isRest}], ...],
  tempo: 80
}
```

## External Libraries (via CDN)

- **VexFlow 4.2.3** - Music notation rendering
- **Tone.js 14.7.77** - Web audio synthesis and scheduling

## Difficulty Levels

- **beginner**: Single hand at a time, no chords, simple note values (whole/half/quarter)
- **intermediate**: Both hands, simple accompaniment patterns, includes eighth notes
- **expert**: Independent hands, chords up to 4 notes, includes sixteenth notes
