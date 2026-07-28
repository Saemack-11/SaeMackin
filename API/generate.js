import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const MAX_CONVERSATION_CHARS = 12_000;

const PERSONAS = new Set([
  "Romantic Sae", "Flirtatious Sae", "Business Sae", "Listener Sae",
  "Frustrated Sae", "Logical Angry Sae", "Toxic Sae", "Motivator Sae",
  "Comedian Sae", "Advisor Sae", "Negotiator Sae", "Grounded Sae"
]);

function getClientId(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return Array.isArray(forwarded)
    ? forwarded[0]
    : String(forwarded || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

function rateLimited(id) {
  const now = Date.now();
  const record = buckets.get(id) || { startedAt: now, count: 0 };
  if (now - record.startedAt > WINDOW_MS) {
    record.startedAt = now;
    record.count = 0;
  }
  record.count += 1;
  buckets.set(id, record);
  return record.count > MAX_REQUESTS;
}

function sanitizeString(value, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sanitizeStringArray(value, maxItems = 12, maxLength = 80) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => sanitizeString(item, maxLength)).filter(Boolean);
}

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["room_read", "reply", "alternates", "composure_check", "reasoning_summary"],
  properties: {
    room_read: {
      type: "object",
      additionalProperties: false,
      required: ["their_energy", "what_it_may_mean", "best_move", "risk"],
      properties: {
        their_energy: { type: "string" },
        what_it_may_mean: { type: "string" },
        best_move: { type: "string" },
        risk: { type: "string" }
      }
    },
    reply: { type: "string" },
    alternates: {
      type: "object",
      additionalProperties: false,
      required: ["safe", "authentic", "turned_up"],
      properties: {
        safe: { type: "string" },
        authentic: { type: "string" },
        turned_up: { type: "string" }
      }
    },
    composure_check: {
      type: "object",
      additionalProperties: false,
      required: ["thirsty", "too_professional", "too_long", "too_aggressive", "notes"],
      properties: {
        thirsty: { type: "boolean" },
        too_professional: { type: "boolean" },
        too_long: { type: "boolean" },
        too_aggressive: { type: "boolean" },
        notes: { type: "string" }
      }
    },
    reasoning_summary: { type: "string" }
  }
};

const SHIN_INSTRUCTIONS = `
You are SHIN Intelligence, the private communication reasoning engine underneath SaeMackin101.

MISSION
Help Sae create responses that sound authentically like him while reading the room, matching the other person's investment, protecting dignity, and selecting the right temperature for the moment.

CORE SAE STYLE
- Confident observation instead of generic compliments.
- Natural slang, never forced slang.
- Authentic flirtation without thirstiness or begging for validation.
- Controlled sexual humor only when the conversation supports it.
- Respectful grounding immediately after heat.
- Comedian's composure: read the room, handle tension without losing character, and keep the interaction moving.
- Listener before fixer.
- Direct, calm boundaries.
- Professional without becoming robotic.
- Honest uncertainty: never invent facts, motives, feelings, history, or relationship details.
- Do not imitate named artists, comedians, or public figures.
- Do not use pickup-line clichés, therapy clichés, corporate filler, or "lyrical miracle" language.
- Do not overexplain.
- Never pressure someone sexually or emotionally.
- Never help manipulate, threaten, harass, impersonate, deceive, stalk, coerce, or evade consent.
- For authority, legal, employment, co-parenting, or business contexts, prioritize clarity and documentation over charm.
- Preserve the user's meaning. Do not add commitments, admissions, accusations, or factual claims they did not provide.

PERSONAS
Romantic Sae: heartfelt, warm, confident, gentlemanly, lightly flirtatious.
Flirtatious Sae: playful observation, chemistry, clean teasing, controlled heat.
Business Sae: concise, credible, strategic, professional but still human.
Listener Sae: validating, patient, emotionally present, no premature fixing.
Frustrated Sae: visibly bothered but composed; clean boundaries.
Logical Angry Sae: firm, factual, organized, no reckless insults.
Toxic Sae: playful edge and witty pettiness only; never abusive, degrading, coercive, or destructive.
Motivator Sae: grounded encouragement, practical confidence, no corny slogans.
Comedian Sae: observational humor, timing, recovery, playful comeback.
Advisor Sae: pattern recognition, balanced analysis, practical next move.
Negotiator Sae: leverage, value, clarity, mutually useful terms.
Grounded Sae: mature, peaceful, accountable, honest.

OUTPUT RULES
- The main reply must be ready to send with no labels around it.
- "Safe" is lower risk and restrained.
- "Authentic" is the closest match to the selected settings.
- "Turned up" increases personality and boldness but must remain respectful and consent-aware.
- Analyze only what the supplied conversation supports.
- If context is missing, phrase interpretations as possibilities, not facts.
- Keep all outputs in the user's language.
- Return only the required structured data.
`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for this route." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "SHIN Intelligence is not configured yet.",
      code: "missing_api_key"
    });
  }

  const clientId = getClientId(req);
  if (rateLimited(clientId)) {
    return res.status(429).json({
      error: "SHIN is receiving too many requests. Wait a moment and try again.",
      code: "rate_limited"
    });
  }

  const body = req.body || {};
  const persona = sanitizeString(body.persona, 80);
  const relationship = sanitizeString(body.relationship, 100);
  const goal = sanitizeString(body.goal, 120);
  const styles = sanitizeStringArray(body.styles);
  const conversation = sanitizeString(body.conversation, MAX_CONVERSATION_CHARS);
  const approvedTraits = sanitizeStringArray(body.preference_profile?.approved_traits, 20, 120);
  const rejectedTraits = sanitizeStringArray(body.preference_profile?.rejected_traits, 20, 120);
  const intensity = Math.max(1, Math.min(5, Number(body.intensity) || 3));

  if (!PERSONAS.has(persona)) {
    return res.status(400).json({ error: "Select a valid Sae persona.", code: "invalid_persona" });
  }
  if (!conversation) {
    return res.status(400).json({ error: "Paste a message or explain the situation first.", code: "missing_conversation" });
  }

  const input = {
    persona,
    relationship,
    goal,
    intensity,
    styles,
    conversation,
    preference_profile: {
      approved_traits: approvedTraits,
      rejected_traits: rejectedTraits
    }
  };

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      store: false,
      instructions: SHIN_INSTRUCTIONS,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Create the SaeMackin101 response from this JSON:\n${JSON.stringify(input)}`
            }
          ]
        }
      ],
      text: {
        verbosity: "medium",
        format: {
          type: "json_schema",
          name: "saemackin_response",
          description: "Structured SHIN Intelligence communication response.",
          strict: true,
          schema: responseSchema
        }
      }
    });

    const parsed = JSON.parse(response.output_text);
    return res.status(200).json({
      ...parsed,
      meta: {
        engine: "SHIN Intelligence",
        model: process.env.OPENAI_MODEL || "gpt-5.2",
        request_id: response._request_id || null
      }
    });
  } catch (error) {
    console.error("SHIN generation error", {
      message: error?.message,
      status: error?.status,
      requestId: error?.request_id
    });

    const status = Number(error?.status) || 500;
    const publicMessage =
      status === 401 ? "The OpenAI API key was rejected. Check the Vercel environment variable." :
      status === 429 ? "The OpenAI account is temporarily rate limited or needs available credits." :
      "SHIN Intelligence could not finish this response. The local Sae engine is still available.";

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: publicMessage,
      code: "openai_error",
      request_id: error?.request_id || null
    });
  }
}
