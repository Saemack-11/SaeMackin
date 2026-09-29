# SHIN Keyboard — Native iOS Contract

This folder defines the native iPhone keyboard layer for SaeMackin101.

## V1 flow

1. User copies an incoming message or conversation.
2. User switches to **SHIN Keyboard** with the iOS globe key.
3. Keyboard reads the clipboard only after an explicit user action such as **Paste**.
4. User selects SHIN, Smooth, Sauce, Direct, Solid, or Funny.
5. Keyboard POSTs the pasted text to `/api/keyboard`.
6. SHIN returns one primary reply plus Smooth, Sauce, and Direct alternates.
7. Tapping a reply inserts it into the active text field through `textDocumentProxy.insertText(...)`.
8. The user remains responsible for pressing Send.

## API

`POST /api/keyboard`

Example request:

```json
{
  "message": "You been quiet today lol",
  "mode": "sauce",
  "direction": ""
}
```

Modes: `shin`, `smooth`, `sauce`, `direct`, `solid`, `funny`.

The optional `direction` field supports quick tweaks without exposing the OpenAI key to the keyboard.

## Native target

Use an iOS Keyboard Extension with `UIInputViewController`.

V1 controls:
- Next Keyboard / globe key
- Paste
- Mode selector
- Generate / Retry
- Three alternate chips
- Insert reply
- Open SaeMackin Studio

## Security boundary

- Never ship `OPENAI_API_KEY` in the iOS app or keyboard extension.
- The keyboard calls the existing SaeMackin Vercel deployment.
- The serverless endpoint calls OpenAI.
- Do not transmit clipboard contents until the user explicitly invokes Paste/Generate.
- Do not automatically send messages.
- Keep request logging free of conversation bodies.
- The existing server uses `store: false` for OpenAI generation.

## iOS note

Network access from a custom keyboard requires the keyboard extension's Open Access capability. V1 should explain this during onboarding and keep the permission scope clear: Open Access is used so SHIN Keyboard can reach the SaeMackin API.

The PWA remains the full Studio. The native keyboard is a fast input surface, not a replacement for Studio.
