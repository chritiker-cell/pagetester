---
name: E. Morava Charakter-Profil
description: Noir-Detektiv AR-Figur für Station 1, Meshy-Prompt-Formel und visuelle Referenz
type: project
---

## Charakter: E. Morava — Privatdetektiv

**Rolle:** Protagonist und Namenspatron des verschwundenen Schülers. Erscheint in AR über dem gedruckten Foto auf der Visitenkarte (Station 1).

**Visueller Stil:** Film Noir / Stranger-Things dunkel. Breiter schwarzer Fedora, hochgezogener Mantelkragen, Gesicht fast komplett verdeckt, nur eisblau leuchtende Augen sichtbar. Stark atmosphärisch, kein Cartoon — eher stylized realistisch mit stark vereinfachter Geometrie.

**AR-Trigger:** Visitenkarte (Requisit-1, Seite 1) — Marker ist das Visitenkarten-Motiv.
**AR-Verhalten:** Figur erscheint von oben auf das Papier schauend, leichte Idle-Animation.

**Zielplattform:** MindAR.js + A-Frame, mobile Browser (iOS + Android).
**Polygon-Budget:** < 15.000 Polygone (mobil-optimiert).

## Getestete Meshy-Prompt-Formel (Station 1)

**Primär-Prompt:**
"A mysterious noir detective figure, stylized low-poly game character, wearing a wide-brim black fedora hat casting deep shadow over the face, only piercing ice-blue glowing eyes visible, dark trench coat with high collar turned up, standing pose looking downward, dark charcoal and black color palette with subtle blue accent glow on eyes, atmospheric and ominous, clean topology, game-ready character, front-facing T-pose or slight hero stance"

**Variante A (mehr Stil-Kontrolle):**
"Noir private detective, stylized 3D game character, black wide-brim fedora, glowing blue eyes in deep shadow, dark overcoat high collar, moody Stranger Things aesthetic, semi-realistic stylized art style, hero standing pose, dark color scheme charcoal and midnight black, subtle supernatural glow, medium poly count, clean mesh"

**Variante B (stärker low-poly):**
"Low-poly noir detective, wide black hat, shadowed face with glowing blue eyes only visible, dark trench coat, mysterious silhouette, standing upright looking down, stylized minimal geometry, dark atmospheric color palette, blue eye accent glow, game asset quality"

## Empfohlene Meshy-Einstellungen
- **Mode:** Text to 3D (nicht Image to 3D — zu viel Rauschen bei dunklen Referenzfotos)
- **Art Style:** Realistic (nicht Cartoon — sonst verliert man die noir Atmosphäre)
- **Topology:** Quad (bessere Deformation bei Animationen)
- **Target Poly Count:** Low (< 10k Polygone Ziel)
- **Texture:** PBR aktiviert, albedo + normal map

## Mixamo Idle-Animation
- **Empfehlung:** "Breathing Idle" (subtile Brust-Bewegung, wirkt lebendig ohne aufdringlich zu sein)
- **Alternative:** "Standing Idle" (minimale Gewichtsverlagerung)
- **Vermeiden:** "Talking" oder "Looking Around" — zu viel Bewegung, lenkt vom Rätsel ab
- **Export-Format:** FBX mit Skin, dann in GLB konvertieren (Blender oder Online-Konverter)

**Why:** Mobil-Performance-Budget ist eng (MindAR + A-Frame auf iOS). Wenig Bewegung = weniger GPU-Last.
**How to apply:** Für alle 5 Stationen-Figuren gilt dasselbe Animations-Budget-Prinzip.
