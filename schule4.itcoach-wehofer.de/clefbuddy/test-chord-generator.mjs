/**
 * Test script for chord generator analysis
 * Music-Specialist Agent — Comprehensive testing of all 8 modes
 */

import { generateChordExercise } from './src/utils/chordGenerator.ts';
import { ALL_MODES, MODE_CONFIGS, KEY_GROUPS } from './src/data/chordData.ts';

const MODES = ALL_MODES;

console.log('='.repeat(80));
console.log('MUSIC-SPECIALIST CHORD GENERATOR ANALYSIS');
console.log('='.repeat(80));
console.log();

// Test Configuration Matrix
const TEST_CONFIGS = {
  'block-chords': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: 'random', barCount: 8 },
    { keyGroup: 3, timeSignature: '4/4', barCount: 16 },
    { keyGroup: 4, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '4/4', barCount: 8 },
  ],
  'inversions': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 8 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 16 },
  ],
  'broken-chords': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '4/4', barCount: 16 },
  ],
  'waltz': [
    { keyGroup: 1, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '6/8', barCount: 8 },
    { keyGroup: 2, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '6/8', barCount: 4 },
    { keyGroup: 4, timeSignature: '3/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: '6/8', barCount: 8 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '6/8', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 16 },
  ],
  'arpeggio': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '6/8', barCount: 8 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '6/8', barCount: 4 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: '6/8', barCount: 8 },
    { keyGroup: 3, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '6/8', barCount: 4 },
    { keyGroup: 1, timeSignature: '4/4', barCount: 16 },
  ],
  'alberti': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '4/4', barCount: 16 },
  ],
  'seventh-chords': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 4, timeSignature: '3/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '4/4', barCount: 16 },
  ],
  'mixed-patterns': [
    { keyGroup: 1, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 8 },
    { keyGroup: 2, timeSignature: '6/8', barCount: 8 },
    { keyGroup: 3, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 4, timeSignature: '3/4', barCount: 12 },
    { keyGroup: 1, timeSignature: 'random', barCount: 4 },
    { keyGroup: 2, timeSignature: '4/4', barCount: 8 },
    { keyGroup: 3, timeSignature: '6/8', barCount: 8 },
    { keyGroup: 4, timeSignature: '4/4', barCount: 4 },
    { keyGroup: 1, timeSignature: '3/4', barCount: 16 },
  ],
};

// Analysis helper functions
function analyzeChordInterval(note1, note2) {
  const midi1 = noteToMidi(note1);
  const midi2 = noteToMidi(note2);
  return Math.abs(midi2 - midi1);
}

function noteToMidi(vexflowNote) {
  const match = vexflowNote.match(/^([a-g])(#|b)?\/(\d+)$/);
  if (!match) return 0;
  const [, note, accidental, octave] = match;
  const baseMap = { 'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11 };
  let midi = baseMap[note] + (parseInt(octave) + 1) * 12;
  if (accidental === '#') midi += 1;
  if (accidental === 'b') midi -= 1;
  return midi;
}

function validateChordQuality(pitches, expectedQuality) {
  if (pitches.length < 3) return { valid: false, reason: 'Too few notes' };
  const midi = pitches.map(noteToMidi);
  const int1 = midi[1] - midi[0]; // Root to third
  const int2 = midi[2] - midi[1]; // Third to fifth

  // Normalize intervals to pitch classes (mod 12)
  const pc1 = ((int1 % 12) + 12) % 12;
  const pc2 = ((int2 % 12) + 12) % 12;

  // Major triad: 4 semitones + 3 semitones (or inversions)
  // Minor triad: 3 semitones + 4 semitones
  // Check all permutations due to potential octave displacement

  const isMajor = (pc1 === 4 && pc2 === 3) || (pc1 === 3 && pc2 === 5) || (pc1 === 5 && pc2 === 4);
  const isMinor = (pc1 === 3 && pc2 === 4) || (pc1 === 4 && pc2 === 5) || (pc1 === 5 && pc2 === 3);

  if (expectedQuality === 'major' && !isMajor) {
    return { valid: false, reason: `Expected major, got intervals ${pc1}, ${pc2}` };
  }
  if (expectedQuality === 'minor' && !isMinor) {
    return { valid: false, reason: `Expected minor, got intervals ${pc1}, ${pc2}` };
  }

  return { valid: true };
}

function analyzeTreblePattern(notes, mode) {
  const totalNotes = notes.length;
  const blockChords = notes.filter(n => n.keys.length > 1).length;
  const singleNotes = notes.filter(n => n.keys.length === 1).length;

  return {
    totalNotes,
    blockChords,
    singleNotes,
    blockRatio: totalNotes > 0 ? (blockChords / totalNotes * 100).toFixed(1) : 0,
  };
}

function analyzeBassPattern(notes, mode) {
  const durations = notes.map(n => n.duration);
  const uniqueDurations = [...new Set(durations)];
  return {
    totalNotes: notes.length,
    durations: uniqueDurations.join(', '),
  };
}

// Main test loop
for (const mode of MODES) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`MODE: ${mode.toUpperCase()}`);
  console.log(`Description: ${MODE_CONFIGS[mode].description}`);
  console.log(`Difficulty: ${MODE_CONFIGS[mode].difficulty}`);
  console.log(`${'='.repeat(80)}\n`);

  const configs = TEST_CONFIGS[mode];
  let testIndex = 1;

  for (const testCfg of configs) {
    console.log(`\nTest ${testIndex}/10: KeyGroup ${testCfg.keyGroup}, ${testCfg.timeSignature}, ${testCfg.barCount} bars`);
    console.log('-'.repeat(60));

    try {
      const exercise = generateChordExercise({
        mode,
        keyGroup: testCfg.keyGroup,
        timeSignature: testCfg.timeSignature,
        barCount: testCfg.barCount,
        showFingering: true,
        showChordNames: false,
      });

      console.log(`  ✓ Generated: ${exercise.name}`);
      console.log(`    Key Signature: ${exercise.keySignature} (Original: ${exercise.originalKey || exercise.keySignature})`);
      console.log(`    Time Signature: ${exercise.timeSignature}`);
      console.log(`    Grand Staff: ${exercise.grandStaff ? 'Yes' : 'No'}`);
      console.log(`    Bars: ${exercise.bars.length}`);

      // Analyze first bar in detail
      const firstBar = exercise.bars[0];
      console.log(`\n    First Bar Analysis:`);
      console.log(`      Chord Degree: ${firstBar.chordDegree}`);
      console.log(`      Treble Notes: ${firstBar.notes.length}`);
      if (firstBar.notes.length > 0) {
        const firstNote = firstBar.notes[0];
        console.log(`        First Note: ${firstNote.keys.join(' ')}, Duration: ${firstNote.duration}, Fingering: ${firstNote.fingering || 'none'}`);

        // Treble pattern analysis
        const trebleAnalysis = analyzeTreblePattern(firstBar.notes, mode);
        console.log(`        Pattern: ${trebleAnalysis.blockChords} block, ${trebleAnalysis.singleNotes} single (${trebleAnalysis.blockRatio}% block)`);
      }

      if (firstBar.bassNotes && firstBar.bassNotes.length > 0) {
        console.log(`      Bass Notes: ${firstBar.bassNotes.length}`);
        const firstBass = firstBar.bassNotes[0];
        console.log(`        First Bass: ${firstBass.keys.join(' ')}, Duration: ${firstBass.duration}, Fingering: ${firstBass.fingering || 'none'}`);

        const bassAnalysis = analyzeBassPattern(firstBar.bassNotes, mode);
        console.log(`        Durations: ${bassAnalysis.durations}`);
      }

      // Check progression correctness
      const progression = exercise.bars.map(b => b.chordDegree);
      console.log(`\n    Progression: ${progression.join(' - ')}`);

      // Validate chord quality (first bar only for brevity)
      if (firstBar.notes.length > 0 && firstBar.notes[0].keys.length >= 3) {
        const quality = exercise.originalKey?.endsWith('m') ? 'minor' : 'major';
        const validation = validateChordQuality(firstBar.notes[0].keys, quality);
        if (!validation.valid) {
          console.log(`      ⚠️  Chord Quality Issue: ${validation.reason}`);
        }
      }

    } catch (error) {
      console.log(`  ✗ ERROR: ${error.message}`);
      console.error(error.stack);
    }

    testIndex++;
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log('ANALYSIS COMPLETE');
console.log(`${'='.repeat(80)}\n`);
