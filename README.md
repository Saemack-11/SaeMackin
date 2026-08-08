# SaeMackin101 — SHIN Intelligence V4

Mobile-first communication PWA built around one rule: **same Sae brain, different room**. V4 broadens Studio from a mostly dating-oriented responder into a universal communication system while preserving the Sae/RNP voice.

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

Never upload a real `.env` file or paste an API key into `app.js`, `index.html`, or `api/generate.js`.

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

The server sends the submitted conversation and selected controls to the OpenAI API for generation. Saved replies, ratings, persona usage, style settings and Zodiac usage remain in browser local storage.

Room Read and Zodiac output are explicitly written as interpretations or possibilities rather than facts. SaeMackin101 should never fabricate another person's motives or claim astrology can diagnose them.
