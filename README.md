# SaeMackin101 — SHIN Intelligence V2

Premium mobile-first communication PWA with a secure OpenAI-powered SHIN Intelligence backend and an offline Sae fallback.

## V3 visual identity

- Custom metallic-gold Sae home-screen icon
- Twelve distinct approved persona portraits on the Studio cards
- Persona-specific card imagery preserved offline

## What changed

- Secure `/api/generate` Vercel serverless route
- OpenAI Responses API
- Structured JSON Schema output
- SHIN developer instructions covering all 12 personas
- AI-generated Room Read, primary reply, three temperatures, and composure check
- `store: false` on OpenAI requests
- API input validation and basic rate protection
- Local rules engine remains available if the API fails
- The API key is never placed in browser code or committed to GitHub

## GitHub upload

Upload the contents of this folder into the repository root. Keep the folder structure intact.

Never upload a real `.env` file or paste your key into `app.js`, `index.html`, or `api/generate.js`.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Framework Preset: `Other`.
3. Leave Build Command and Output Directory blank.
4. Open **Project → Settings → Environment Variables**.
5. Add:
   - `OPENAI_API_KEY` = your OpenAI project API key
   - `OPENAI_MODEL` = `gpt-5.2`
6. Apply the variables to Production, Preview, and Development as desired.
7. Redeploy after saving the variables.

## Local development

```bash
npm install
npx vercel dev
```

Copy `.env.example` to `.env.local` and insert your own key locally. `.env.local` is ignored by Git.

## Privacy

The server sends the submitted conversation and selected controls to the OpenAI API to generate the response. The OpenAI request is configured with `store: false`. Saved replies, ratings, persona usage, and Playbook data remain in browser local storage.

## Cost and control

API usage is billed through your OpenAI API project, separately from a ChatGPT subscription. Set project-level budget alerts and usage limits in the OpenAI Platform dashboard.


## V4 cache reset note

This version corrects the missing persona slugs and the Apple touch icon link.
After deploying:
1. Delete the old SaeMackin101 icon from the iPhone Home Screen.
2. In Safari Settings, clear website data for the deployed SaeMackin domain if the old version remains.
3. Open the live Vercel URL again in Safari.
4. Use Share → Add to Home Screen.
