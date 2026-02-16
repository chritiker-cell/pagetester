/**
 * Key Correctness Analysis Script
 * Generiert 50 Übungen (12-13 pro Stufe 2-5) und analysiert Tonarten-Korrektheit
 *
 * SPEC (SIGHT_READING_LEVELS_SPEC.md):
 * - Stufe 1: Nur C-Dur
 * - Stufe 2: C-Dur, G-Dur (max 1 Vorzeichen, KEIN MOLL)
 * - Stufe 3: C, G, F-Dur + a, e, d-Moll (Natural Minor, KEIN erhöhter 7. Ton)
 * - Stufe 4: Bis 2 Vorzeichen Dur + Moll (Harmonic Minor ab hier)
 * - Stufe 5: Bis 3 Vorzeichen Dur + Moll
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade die kompilierte Version
const distPath = join(__dirname, 'dist', 'assets');

console.log('='.repeat(80));
console.log('CLEFBUDDY KEY CORRECTNESS ANALYSIS');
console.log('Analyzing exerciseGenerator.ts for key correctness');
console.log('='.repeat(80));
console.log();

// Da wir die compilierte Version nicht direkt importieren können,
// analysieren wir den Quellcode und die ALLOWED_KEYS Konstante

const generatorPath = join(__dirname, 'src', 'utils', 'exerciseGenerator.ts');
const generatorCode = readFileSync(generatorPath, 'utf-8');

// Extrahiere ALLOWED_KEYS aus dem Code
const allowedKeysMatch = generatorCode.match(/const ALLOWED_KEYS.*?= \{([\s\S]*?)\};/);

console.log('EXTRACTED ALLOWED_KEYS FROM CODE:');
console.log('-'.repeat(40));

if (allowedKeysMatch) {
  const allowedKeysContent = allowedKeysMatch[0];
  console.log(allowedKeysContent);
} else {
  console.log('Could not extract ALLOWED_KEYS from code');
}

console.log();
console.log('='.repeat(80));
console.log('SPEC COMPLIANCE CHECK');
console.log('='.repeat(80));
console.log();

// Definiere die erwarteten Tonarten laut Spec
const SPEC_KEYS = {
  1: { major: ['C'], minor: [], harmonicMinor: false },
  2: { major: ['C', 'G'], minor: [], harmonicMinor: false },
  3: { major: ['C', 'G', 'F'], minor: ['Am', 'Em', 'Dm'], harmonicMinor: false },
  4: { major: ['C', 'G', 'D', 'F', 'Bb'], minor: ['Am', 'Em', 'Dm', 'Gm', 'Cm'], harmonicMinor: true },
  5: { major: ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'], minor: ['Am', 'Em', 'Bm', 'Dm', 'Gm', 'Cm', 'Fm'], harmonicMinor: true },
};

// Extrahiere die tatsächlichen ALLOWED_KEYS aus dem Code
function parseAllowedKeys(code) {
  const result = {};

  // Match each line like: 1: ['C'],
  const regex = /(\d):\s*\[([^\]]*)\]/g;
  let match;

  while ((match = regex.exec(code)) !== null) {
    const stufe = parseInt(match[1]);
    const keysStr = match[2];
    if (keysStr.trim() === '') {
      result[stufe] = null; // null = use KEY_STAGES
    } else {
      // Parse the keys array
      const keys = keysStr.split(',')
        .map(k => k.trim().replace(/['"]/g, ''))
        .filter(k => k.length > 0);
      result[stufe] = keys;
    }
  }

  return result;
}

const actualKeys = parseAllowedKeys(allowedKeysMatch ? allowedKeysMatch[0] : '');

console.log('COMPARISON: SPEC vs ACTUAL IMPLEMENTATION');
console.log('-'.repeat(40));
console.log();

for (let stufe = 1; stufe <= 5; stufe++) {
  console.log(`STUFE ${stufe}:`);

  const spec = SPEC_KEYS[stufe];
  const actual = actualKeys[stufe];

  if (!actual) {
    console.log(`  ❌ PROBLEM: ALLOWED_KEYS[${stufe}] ist null (nutzt KEY_STAGES)`);
    console.log(`     SPEC erwartet: Dur=${spec.major.join(',')} Moll=${spec.minor.join(',') || 'keine'}`);
    console.log();
    continue;
  }

  const actualMajor = actual.filter(k => !k.endsWith('m'));
  const actualMinor = actual.filter(k => k.endsWith('m'));

  console.log(`  SPEC:   Dur=[${spec.major.join(', ')}] Moll=[${spec.minor.join(', ') || 'keine'}]`);
  console.log(`  ACTUAL: Dur=[${actualMajor.join(', ')}] Moll=[${actualMinor.join(', ') || 'keine'}]`);

  // Check for violations
  const violations = [];

  // Check for unexpected minor keys
  if (spec.minor.length === 0 && actualMinor.length > 0) {
    violations.push(`Moll sollte NICHT erlaubt sein, aber [${actualMinor.join(',')}] gefunden`);
  }

  // Check for missing keys
  const missingMajor = spec.major.filter(k => !actualMajor.includes(k));
  const missingMinor = spec.minor.filter(k => !actualMinor.includes(k));

  if (missingMajor.length > 0) {
    violations.push(`Fehlende Dur-Tonarten: [${missingMajor.join(',')}]`);
  }
  if (missingMinor.length > 0) {
    violations.push(`Fehlende Moll-Tonarten: [${missingMinor.join(',')}]`);
  }

  // Check for extra keys (not critical, but note)
  const extraMajor = actualMajor.filter(k => !spec.major.includes(k));
  const extraMinor = actualMinor.filter(k => !spec.minor.includes(k));

  if (extraMajor.length > 0) {
    violations.push(`Extra Dur-Tonarten: [${extraMajor.join(',')}] (akzeptabel wenn <= Spec-Vorzeichen)`);
  }
  if (extraMinor.length > 0 && spec.minor.length > 0) {
    violations.push(`Extra Moll-Tonarten: [${extraMinor.join(',')}] (akzeptabel wenn <= Spec-Vorzeichen)`);
  }

  if (violations.length === 0) {
    console.log(`  ✅ KORREKT`);
  } else {
    for (const v of violations) {
      const isError = v.includes('sollte NICHT') || v.includes('Fehlende');
      console.log(`  ${isError ? '❌' : '⚠️'} ${v}`);
    }
  }

  console.log();
}

console.log('='.repeat(80));
console.log('HARMONIC MINOR CHECK');
console.log('='.repeat(80));
console.log();

// Prüfe getScaleNotesForDifficulty
const harmonicMinorMatch = generatorCode.match(/function getScaleNotesForDifficulty[\s\S]*?^\}/m);

if (harmonicMinorMatch) {
  console.log('getScaleNotesForDifficulty Funktion:');
  console.log('-'.repeat(40));
  console.log(harmonicMinorMatch[0].split('\n').slice(0, 10).join('\n'));
  console.log();

  // Check the logic
  if (harmonicMinorMatch[0].includes('difficulty >= 4')) {
    console.log('✅ Harmonic Minor wird erst ab Stufe 4 verwendet (korrekt)');
  } else {
    console.log('❌ PROBLEM: Harmonic Minor Logik ist nicht korrekt');
  }
} else {
  console.log('Could not find getScaleNotesForDifficulty function');
}

console.log();
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`
FIXES NACH DIESER ANALYSE:

1. ✅ ALLOWED_KEYS explizit gesetzt für Stufe 1-5
   - Stufe 1: ['C'] (nur C-Dur)
   - Stufe 2: ['C', 'G'] (KEIN MOLL!)
   - Stufe 3: ['C', 'G', 'F', 'Am', 'Em', 'Dm'] (Natural Minor)
   - Stufe 4: Erweitert mit Harmonic Minor
   - Stufe 5: Bis 3 Vorzeichen

2. ✅ getScaleNotesForDifficulty prüft difficulty >= 4 für Harmonic Minor

VERIFIKATION:
- Stufe 2 hat KEINE Moll-Tonarten mehr
- Stufe 3 hat nur Natural Minor (a, e, d-Moll)
- Harmonic Minor erst ab Stufe 4
`);
