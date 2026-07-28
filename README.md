# SaeMackin101 — Complete Standalone V1

Premium mobile-first PWA implementing the locked SaeMackin101 concept.

## Included
- Cinematic metallic-gold interface
- Twelve selectable Sae personas
- Relationship, goal, intensity and style controls
- Local room-read analysis
- Ready-to-send reply generator
- Safe / Authentic / Turned Up versions
- Copy, rating and Playbook actions
- Sae IQ statistics
- Offline support and Add to Home Screen
- Device-local privacy and persistence

## Architecture note
This build is fully functional as a standalone offline communication studio. Its response engine is local and rules-based. A live large-language-model backend requires server-side API credentials and is intentionally not embedded in frontend code.

## Deploy
Upload every file and the assets folder to the root of a GitHub repository. In Vercel, import the repository, use Framework Preset `Other`, and leave Build Command and Output Directory blank.
