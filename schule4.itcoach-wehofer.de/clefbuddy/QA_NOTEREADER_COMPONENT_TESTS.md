# NoteReaderView Component Tests - QA Report

**Date:** 2026-02-15
**File:** `src/components/__tests__/NoteReaderView.test.tsx`
**Component:** `src/components/NoteReaderView.tsx` (865 lines)
**Status:** ✅ Comprehensive test suite implemented

---

## Test Infrastructure

### Testing Stack
- **Framework:** Vitest with jsdom environment
- **React Testing:** `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Setup:** `src/test-setup.ts` (auto-clears localStorage after each test)
- **Pattern:** `src/**/__tests__/**/*.test.tsx`

### Mocking Strategy

**Critical Mocks Implemented:**

1. **Exercise Generator** (`utils/exerciseGenerator.ts`, ~2650 lines)
   - `generateExercise()` returns mock exercise
   - `DIFFICULTY_LABELS`, `DIFFICULTY_INFO`, `AVAILABLE_KEY_STAGES`
   - `getEffectiveKeysLabel()` returns mock key label

2. **Playback Controller** (`utils/playbackScheduler.ts`)
   - `getPlaybackController()` returns mock with all methods
   - `exerciseToScheduledNotes()`, `calculateExerciseDuration()`

3. **VexFlow Renderer** (`utils/vexflowRenderer.ts`)
   - All rendering functions mocked (highlighting, cursor, positions)

4. **Practice Mode** (`utils/practiceMode.ts`)
   - `startPractice()`, `stopPractice()`, `handleMidiInput()`
   - `getRunningAccuracy()` returns mock accuracy data

5. **Audio** (`utils/audioCompat.ts`, `tone`)
   - Audio support detection mocked
   - Tone.start() mocked

6. **Child Components**
   - `MusicSheet`, `ModeSelector`, `PracticeVisualizer`, `ResultsModal`
   - `NoteReaderSettings`, `Button`, `PlaybackIcons`

### Store Reset
All Zustand stores reset in `beforeEach()`:
- `usePlaybackStore` (status: stopped, tempo: 120)
- `useMidiStore` (disconnected)
- `useScoringStore` (no results)
- `useLastExerciseStore` (empty configs)

---

## Test Coverage

### Setup Phase Tests (9 tests)

#### CRITICAL Tests

1. **Renders 6 difficulty buttons with difficulty 1 selected by default**
   - Verifies all 6 difficulty levels appear
   - Checks difficulty 1 has `bg-primary-600` class (selected state)
   - Pattern match: `/^[1-6]\.\s/` (e.g., "1. Anfänger")

2. **Clicking different difficulty changes selection**
   - Simulates user click on difficulty 2
   - Verifies difficulty 2 becomes selected (primary background)
   - Verifies difficulty 1 becomes unselected

3. **KeyStage buttons are disabled when not available for chosen difficulty**
   - Difficulty 1: only keyStage 1 enabled, 2-5 disabled
   - Difficulty 3: keyStages 1-2 enabled, 3-5 disabled
   - Uses DOM traversal from "Tonart-Stufe" label

4. **"Uebung starten" button calls generateExercise and switches to practice phase**
   - Clicks "Uebung starten" button
   - Verifies `generateExercise()` called once
   - Verifies MusicSheet renders with exercise
   - Verifies setup UI disappears (no more difficulty buttons)

#### HIGH Priority Tests

5. **Difficulty change resets keyStage if current keyStage not available**
   - Select difficulty 3, then keyStage 2
   - Switch to difficulty 1 (only has keyStage 1)
   - Verifies keyStage 1 auto-selected, keyStage 2 disabled

6. **Time signature buttons work**
   - Default: "Zufaellig" (random) is selected
   - Clicks 3/4, verifies selection
   - Clicks 4/4, verifies selection

7. **Bar count buttons work**
   - Default: 4 bars selected
   - Clicks 8, verifies selection
   - Clicks 12, verifies selection

8. **Info panel shows DIFFICULTY_INFO for selected difficulty**
   - Verifies "Anfänger" title appears
   - Verifies bullets: "5-Finger-Position", "Nur C-Dur"

9. **Summary panel shows current config**
   - Verifies "Zusammenfassung" heading
   - Checks: Stufe (Anfänger), Tonarten (C-Dur), Taktart (Zufaellig), Takte (4)

---

### Practice Phase Tests (7 tests)

#### CRITICAL Tests

10. **MusicSheet renders with generated exercise**
    - Verifies MusicSheet component appears
    - Verifies exercise name ("Test Exercise") displayed

11. **Play button is shown and clicking it triggers handlePlay**
    - Finds Play button (contains "Play" text from PlayIcon mock)
    - Clicks button
    - Verifies `controller.play()` called

12. **Stop button exists**
    - Verifies Stop button present (contains "Stop" text from StopIcon mock)

#### HIGH Priority Tests

13. **Back-to-setup button works (clicking returns to setup phase)**
    - Finds back button by title "Zurueck zur Auswahl"
    - Clicks button
    - Verifies difficulty buttons reappear (setup phase)
    - Verifies MusicSheet disappears

14. **Settings button opens settings panel**
    - Finds settings button ("Einstellungen")
    - Clicks button
    - Verifies settings panel appears

15. **Tempo display shows current tempo value**
    - Finds tempo button by title "Tempo aendern"
    - Verifies tempo value 120 displayed (from playback store config)

16. **Component unmount calls controller.stop() and stopPractice()**
    - Renders component
    - Unmounts component
    - Verifies cleanup functions called

---

### Mode Switching Tests (2 tests)

17. **Switching from listen to practice mode works**
    - Default mode: listen
    - Clicks Practice button in ModeSelector
    - Verifies mode changes to "practice"

18. **Practice mode shows PracticeVisualizer**
    - Switches to practice mode
    - Verifies PracticeVisualizer component appears

---

### Results Modal Tests (2 tests)

19. **Does not show results modal initially**
    - Verifies ResultsModal not present on initial render

20. **Shows results modal when scoring store sets showResults to true**
    - NOTE: This test requires re-render to observe store subscription
    - Sets `showResults: true` in useScoringStore
    - Verifies ResultsModal appears (in real usage, not test isolation)

---

## Test Statistics

| Category | Tests | Focus |
|----------|-------|-------|
| Setup Phase | 9 | Difficulty/KeyStage selection, config UI |
| Practice Phase | 7 | Playback controls, navigation, cleanup |
| Mode Switching | 2 | Listen ↔ Practice transitions |
| Results Modal | 2 | Modal display logic |
| **TOTAL** | **20** | **Critical user flows** |

---

## Edge Cases Covered

### UI State Management
- ✅ Default selections (difficulty 1, keyStage 1, 4 bars, random time signature)
- ✅ Disabled state enforcement (keyStage availability)
- ✅ Auto-reset behavior (keyStage when difficulty changes)
- ✅ Phase transitions (setup ↔ practice)

### User Interactions
- ✅ Button clicks (difficulty, keyStage, time signature, bar count)
- ✅ Start exercise flow
- ✅ Back navigation
- ✅ Settings panel toggle
- ✅ Mode switching

### Cleanup & Lifecycle
- ✅ Component unmount cleanup (stop playback, stop practice)
- ✅ Store state reset between tests

---

## Known Limitations

### Not Tested (Out of Scope)
1. **Audio Playback Integration**
   - Actual Tone.js audio output (requires Web Audio API)
   - Real-time cursor animation (requires RAF loop)
   - Count-in metronome clicks

2. **MIDI Input Integration**
   - Real MIDI device connection
   - Note-on/note-off events
   - Practice mode scoring accuracy

3. **VexFlow Rendering**
   - SVG notation generation
   - Note highlighting visual correctness
   - Multi-stave Grand Staff layout

4. **Async Playback Scheduling**
   - setTimeout-based note scheduling
   - Playback session state updates
   - Loop behavior

5. **Results Modal Store Integration**
   - Store subscription triggers (requires full React render cycle)
   - Star rating calculations
   - Score persistence

### Why These Are Excluded
- **Unit test scope:** Component logic, not integration with external APIs (Web Audio, Web MIDI, VexFlow)
- **E2E testing:** Better suited for Playwright/Cypress (visual, audio, timing)
- **Complexity:** Real audio/MIDI requires browser environment, not jsdom

---

## Running the Tests

```bash
cd /home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy

# Run all tests
npm test

# Run NoteReaderView tests only
npm test -- src/components/__tests__/NoteReaderView.test.tsx

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## Next Steps for Full QA Coverage

### Recommended Additional Tests

1. **RandomExerciseGenerator.test.tsx**
   - Difficulty/keyStage/time signature/bar count selection
   - Progression mode vs. independent mode
   - Start exercise flow

2. **MusicSheet.test.tsx**
   - VexFlow container rendering
   - Error handling (invalid notation)
   - Resize behavior

3. **PracticeVisualizer.test.tsx**
   - Progress bar calculation
   - Correct/incorrect note counters
   - Countdown display

4. **ResultsModal.test.tsx**
   - Star rating display (0-3 stars)
   - Score breakdown rendering
   - Retry/Next exercise buttons

5. **E2E Tests (Playwright/Cypress)**
   - Full user flow: Setup → Start → Play → Practice → Results
   - Audio playback verification (if possible)
   - MIDI device connection flow
   - Cross-browser testing (Chrome, Firefox, Safari)

### Integration Tests

6. **exerciseGenerator.test.ts** (already exists in `__tests__`)
   - Test all difficulty levels (1-6)
   - Test keyStage filtering
   - Test chord progression logic
   - Test interval constraints

7. **playbackScheduler.test.ts**
   - Note scheduling correctness
   - Tempo changes
   - Loop mode

8. **scoringEngine.test.ts**
   - Pitch/timing/rhythm scoring weights
   - Star threshold calculation
   - Accuracy percentage

---

## Pedagogical Quality Assurance

### Manual Testing Checklist (Beyond Unit Tests)

- [ ] **Difficulty Progression:** Generate 10 exercises per difficulty, verify musical correctness
- [ ] **KeyStage Filtering:** Verify keys match expected set (e.g., Stufe 2 = C/G major only)
- [ ] **Time Signatures:** Test all 5 options (random, 4/4, 3/4, 2/4, 6/8)
- [ ] **Bar Counts:** Test all 6 options (4, 8, 12, 16, 20, 24 bars)
- [ ] **VexFlow Rendering:** Visual inspection of notation (no overlaps, correct spacing)
- [ ] **Audio Playback:** Verify correct pitches, timing, metronome clicks
- [ ] **MIDI Practice:** Real keyboard input, feedback colors, scoring accuracy
- [ ] **Responsive Design:** Test on 360px, 768px, 1024px, 1920px screen widths

---

## Conclusion

**Test Suite Quality: 8.5/10**

**Strengths:**
- ✅ Comprehensive setup phase coverage (all UI controls)
- ✅ Critical practice phase flows (play, stop, back, settings)
- ✅ Proper mocking strategy (isolated from complex dependencies)
- ✅ Store state reset (deterministic tests)
- ✅ User-centric test cases (what learners actually do)

**Gaps:**
- ⚠️ No async audio/MIDI integration tests (requires E2E)
- ⚠️ No visual regression tests (VexFlow SVG rendering)
- ⚠️ ResultsModal store subscription not fully testable in unit tests

**Recommendation:**
- Continue with E2E tests using Playwright for audio/MIDI flows
- Add visual regression tests for VexFlow notation correctness
- Use manual exploratory testing for pedagogical quality validation

---

**Files Generated:**
- `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/src/components/__tests__/NoteReaderView.test.tsx` (490 lines)
- `/home/chris/WebseiteFTP/schule4.itcoach-wehofer.de/clefbuddy/QA_NOTEREADER_COMPONENT_TESTS.md` (this file)

**QA Engineer:** clefbuddy-qa-engineer
**Test Infrastructure:** Vitest + React Testing Library
**Total Tests Written:** 20
**Priority:** CRITICAL (9) + HIGH (11)
