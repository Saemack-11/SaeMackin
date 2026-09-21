# SaeMackin101 — SHIN Intelligence V4.3

Mobile-first communication PWA built around one rule: **same Sae brain, different room**. V4 broadens Studio from a mostly dating-oriented responder into a universal communication system while preserving the Sae/RNP voice.

## V4.3 — Connection Intelligence + Authentic Optionality

V4.3 adds a relationship-intent layer without turning Studio into a cockpit:
- Connection Intent: Open / No Expectations, Friendship First, Exploring Chemistry, Romantic Intent, Established Love, Rebuilding / Reconnecting.
- Optional Authentic Optionality philosophy: pure intentions, mutual independence, no hidden motives, no forced labels, and only sustainable commitments. Core line: **“Having options ain’t treating people optional.”**
- New Soulful Sae, Vulnerable Sae and Magnetic Sae modes layered onto the existing Sae brain.
- SHIN explicitly distinguishes depth/chemistry from automatic romantic escalation and protects clear boundaries or requests for exclusivity.
- Connection settings stay local in browser storage and are sent with generation context only when generating a response.

## V4.2 — Read Aloud + Instant Tweak

Every generated ready-to-send response now includes:
- **Read aloud / Stop** using the device's built-in speech voice.
- **Instant retry** for a genuinely fresh take without rebuilding the setup.
- One-tap tone refinements for **More sauce**, **More toxic**, **More flirting**, **Less emotion**, and **Shorter**.
- A custom tweak field for directions such as “keep my wording but make it smoother.”
- Revision-aware generation that uses the original conversation as the source of truth and the current response as the draft being improved.

“More toxic” remains inside the app's established Toxic Sae boundary: playful edge and witty pettiness, never abuse, manipulation, coercion or degradation.

## RNP — Real Ninja Poetics

The repository now includes a dedicated mobile creative room at **`/rnp.html`** backed by **`/api/rnp`**.

RNP is built around **pressure → poetry** rather than generic rapper templates:
- Start from a real event, emotion, scene, pressure point, responsibility, win, loss, conflict, ambition, or reflection.
- Generate one 30–60 second freestyle angle, one hook seed, four bar seeds, a social caption, and one BandLab recording focus.
- Keep the output as creative seeds so the artist still owns the actual performance and final writing.
- Favor concrete details and contradictions over motivational clichés and fake flexing.
- Never invent street history, money, violence, criminal activity, trauma, or accomplishments.
- Never imitate a named rapper or public figure. High-level musical qualities can influence pacing, density, restraint, melody space, or emotional directness without copying an artist's style.
- Use **“ninja”** instead of racial slurs.

## V4 — Universal Context + Zodiac Cheat Code

### Studio intelligence flow
1. **Who is this?** — personal, family, co-parenting, work, money, housing, client and formal relationships.
2. **What happened?** — opening, connection, distance, conflict, logistics, payment, scheduling and formal situations.
3. **What do you want?** — attraction, support, clarity, repair, boundaries, plans, negotiation and professional goals.
4. **Energy** — Soft → Calm Sae → Confident Sae → Bold → Unfiltered Sae.
5. **Style controls** — quick controls plus an expandable advanced style drawer.
6. **Conversation evidence** — the actual pasted thread remains the primary source of truth.
7. **SHIN response** — ready-to-send reply, Room Read, alternates, composure check and optional Zodiac lens.

### Expanded universal controls
- Personal: new interest, dating, partner, spouse, ex, friend, family, child, co-parent, acquaintance, stranger.
- Work + money: coworker, employer/manager, dispatcher, client/customer, business partner, contractor, recruiter, landlord/property manager and customer service.
- Formal: authority/legal professional.
- New context layer: **What happened?**
- Expanded goal library for chemistry, support, repair, boundaries, planning, pay/payment and business communication.
- Advanced Sae controls such as **Hold my frame**, **Don't sound thirsty**, **Don't over-explain**, **Match their energy**, **Keep my dignity**, **Play it cool**, **Read between the lines** and **Keep my wording**.

## Zodiac Cheat Code ♏

The optional Zodiac Cheat Code starts from Sae's Scorpio baseline and lets you choose any of the 12 signs for the other person.

It is deliberately implemented as a **light archetype lens**, not mind-reading:
- It may influence pacing, questions, warmth, directness or how much room a response leaves.
- It does **not** treat a sign as proof of personality, motives, compatibility, honesty, attraction or future behavior.
- The actual conversation, stated boundaries and observed behavior always outrank astrology.
- It may not be used for jealousy games, pressure, deception, coercion or exploiting vulnerabilities.
- By default the generated text does not mention astrology; the lens works silently behind the response unless astrology itself is part of the conversation.

The Playbook also includes a 12-sign quick-read panel with a built-in reality check for every sign.

## Sae Filter feedback

After a generation you can rate the response with:
- 🔥 Nailed it
- That ain't me 😂
- Too thirsty
- Too soft
- Too aggressive
- Too long
- Too professional
- Too robotic

Those signals stay in browser local storage and are converted into preference hints for later SHIN generations.

## V3 foundation preserved

- Twelve visual Sae personas.
- Metallic-gold SaeMackin visual identity.
- Secure `/api/generate` Vercel serverless route.
- OpenAI Responses API with strict structured JSON output.
- `store: false` on OpenAI generation requests.
- Local fallback engine if the API is unavailable.
- PWA install/offline shell.
- API keys remain server-side only.
- V4 also repairs persona image wiring by giving every persona a stable asset slug.

## GitHub upload

Upload the **contents of this folder** to the repository root and keep the folder structure intact.

Never upload a real `.env` file or paste an API key into `app.js`, `index.html`, `api/generate.js`, or `api/rnp.js`.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Framework Preset: `Other`.
3. Leave Build Command and Output Directory blank.
4. Open **Project → Settings → Environment Variables**.
5. Add `OPENAI_API_KEY` with your OpenAI project key.
6. Optional: set `OPENAI_MODEL`. This package currently falls back to `gpt-5.2` when the variable is absent.
7. Redeploy after saving environment variables.

## Local development

```bash
npm install
npx vercel dev
```

Copy `.env.example` to `.env.local` for local development and place the private key there. `.env.local` is ignored by Git.

## Privacy + truth boundary

The server sends the submitted conversation or RNP prompt and selected controls to the OpenAI API for generation. Saved replies, ratings, persona usage, style settings and Zodiac usage remain in browser local storage.

Room Read and Zodiac output are explicitly written as interpretations or possibilities rather than facts. SaeMackin101 should never fabricate another person's motives or claim astrology can diagnose them. RNP likewise must not fabricate the user's biography in order to make a bar sound tougher.
