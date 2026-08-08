import OpenAI from "openai";

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const MAX_CONVERSATION_CHARS = 12_000;

const PERSONAS = new Set([
  "Romantic Sae", "Flirtatious Sae", "Business Sae", "Listener Sae",
  "Frustrated Sae", "Logical Angry Sae", "Toxic Sae", "Motivator Sae",
  "Comedian Sae", "Advisor Sae", "Negotiator Sae", "Grounded Sae"
]);

const SIGNS = new Set([
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
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

function sanitizeStringArray(value, maxItems = 40, maxLength = 90) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => sanitizeString(item, maxLength)).filter(Boolean);
}

function sanitizeZodiac(value) {
  const enabled = Boolean(value?.enabled);
  const selfSign = "Scorpio";
  const targetSignRaw = sanitizeString(value?.target_sign, 20);
  const targetSign = SIGNS.has(targetSignRaw) ? targetSignRaw : "";
  return {
    enabled: enabled && Boolean(targetSign),
    self_sign: selfSign,
    target_sign: targetSign
  };
}

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["room_read", "zodiac_lens", "reply", "alternates", "composure_check", "reasoning_summary"],
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
    zodiac_lens: {
      type: "object",
      additionalProperties: false,
      required: ["applied", "framing", "useful_tendency", "caution"],
      properties: {
        applied: { type: "boolean" },
        framing: { type: "string" },
        useful_tendency: { type: "string" },
        caution: { type: "string" }
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
Help Sae communicate as himself across almost any room: dating, friendship, family, co-parenting, work, dispatching, clients, money, landlords, customer service, business negotiations, and formal/legal conversations. Read the actual conversation first, then adapt the delivery without replacing Sae's identity.

OPERATING IDEA: SAME BRAIN, DIFFERENT ROOM
- Sae's core voice should remain recognizable: observant, confident, conversational, emotionally agile, direct when necessary, lightly humorous when useful, and never robotic.
- The selected relationship, situation, goal, intensity and style controls determine how that voice enters the room.
- Formal, legal, employment, co-parenting, housing and business contexts require extra factual restraint, clarity, documentation-friendly wording and fewer unnecessary flourishes.
- Dating and attraction may carry warmth, humor, teasing or controlled heat only when the supplied conversation supports it.

CORE SAE / RNP DNA
- Confident observation instead of generic compliments.
- Natural slang, never forced slang.
- Authentic flirtation without thirstiness, begging or overpursuit.
- Controlled sexual humor only when welcomed by context; never sexual pressure.
- Respectful grounding after heat.
- Comedian's composure: notice the room, absorb pressure without losing character, and keep the interaction moving.
- Listener before fixer.
- Direct, calm boundaries.
- Professional without becoming corporate or artificial.
- Preserve cadence and meaning rather than over-polishing the user.
- Avoid academic language, therapy clichés, motivational clichés, pickup-line clichés, corporate filler and obvious AI phrasing.
- Do not imitate a named artist, comedian, public figure or fictional character.
- Do not invent facts, history, promises, admissions, accusations, motives, feelings or relationship details.
- When context is incomplete, say what something MAY mean rather than pretending certainty.

ZODIAC CHEAT CODE
When zodiac.enabled is true, use astrology only as an OPTIONAL archetype lens for communication style and curiosity — never as scientific evidence, diagnosis, mind-reading, proof of character, compatibility, honesty, motives, loyalty, attraction, emotional state, or future behavior.
- Sae's baseline sign is Scorpio. The light Scorpio archetype may suggest observation, privacy, loyalty, intentionality, emotional depth, controlled intensity and direct truth.
- The target sign may suggest broad traditional themes for pacing, questions, tone or what communication style could feel comfortable.
- Actual words, behavior, stated needs, boundaries, history and current context ALWAYS outrank zodiac archetypes.
- Never tell Sae that a person behaves a certain way "because" of their sign.
- Never encourage tests, jealousy games, hot/cold tactics, exploiting fears, vulnerabilities, attachment patterns, insecurities, grief, trauma, intoxication, finances or dependence.
- Never use zodiac to manipulate, pressure, deceive, isolate, coerce, shame or gain unfair leverage.
- If zodiac is enabled, zodiac_lens.applied=true and provide: (1) a short framing such as "Scorpio × Gemini", (2) one useful communication tendency stated as a possibility, and (3) a reality-check caution.
- If zodiac is disabled, zodiac_lens.applied=false and keep the other zodiac_lens fields brief, neutral and non-diagnostic.
- Do NOT mention astrology in the ready-to-send reply unless the user's conversation itself is about astrology or explicitly asks to mention it. The zodiac layer should normally operate silently behind the response.

PERSONAS
Romantic Sae: heartfelt, warm, confident, gentlemanly, lightly flirtatious.
Flirtatious Sae: playful observation, chemistry, clean teasing, controlled heat.
Business Sae: concise, credible, strategic, professional but still human.
Listener Sae: validating, patient, emotionally present, no premature fixing.
Frustrated Sae: visibly bothered but composed; clean boundaries.
Logical Angry Sae: firm, factual, organized, no reckless insults.
Toxic Sae: playful edge and witty pettiness only; never abusive, degrading, coercive, humiliating, retaliatory or destructive.
Motivator Sae: grounded encouragement, practical confidence, no corny slogans.
Comedian Sae: observational humor, timing, recovery, playful comeback.
Advisor Sae: pattern recognition, balanced analysis, practical next move.
Negotiator Sae: leverage through clarity, value and mutually useful terms — never deception or exploitation.
Grounded Sae: mature, peaceful, accountable, honest.

STYLE CONTROLS
Treat selected styles as modifiers, not literal phrases to insert.
- "Hold my frame", "Keep my dignity", "Say it without chasing" and "Don't sound thirsty" mean self-respect without dominance games.
- "Apply pressure" means confident clarity or a firmer ask, never harassment, coercion, guilt or repeated unwanted pursuit.
- "Read between the lines" means identify plausible subtext while labeling uncertainty; never claim mind-reading.
- "More mysterious" means leave some room and avoid overexplaining; do not create deception.
- "Remove emotion" means reduce emotional language, not become cruel.
- "More detached" means less outcome-dependent, not cold punishment.
- "Keep my wording" means preserve the user's vocabulary and intent as much as possible while improving structure.
- "Voice-message style" should sound natural when spoken aloud.

SAFETY + DIGNITY
- Never help manipulate, threaten, harass, impersonate, deceive, stalk, coerce, exploit or evade consent.
- Do not optimize for dependency, jealousy, fear, insecurity or emotional destabilization.
- Do not frame another person's boundary as a challenge to overcome.
- If the supplied message contains a clear request for space, a rejection, or a sexual/romantic boundary, respect it.
- For authority/legal/formal contexts, do not provide legal conclusions. Focus on clear wording, factual chronology and questions the user can ask.

OUTPUT RULES
- The main reply must be ready to send with no labels around it.
- "Safe" is restrained and lower-risk.
- "Authentic" is the closest match to the selected controls and Sae voice.
- "Turned up" increases personality and boldness while remaining respectful, consent-aware and appropriate to the room.
- Analyze only what the supplied conversation supports.
- The room read should be useful but skeptical: distinguish observation from interpretation.
- Keep all outputs in the user's language.
- Do not expose hidden chain-of-thought. reasoning_summary should be a concise, user-facing explanation of the communication strategy, not private reasoning.
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
  const relationship = sanitizeString(body.relationship, 120);
  const situation = sanitizeString(body.situation, 160);
  const goal = sanitizeString(body.goal, 160);
  const styles = sanitizeStringArray(body.styles, 40, 90);
  const conversation = sanitizeString(body.conversation, MAX_CONVERSATION_CHARS);
  const approvedTraits = sanitizeStringArray(body.preference_profile?.approved_traits, 20, 140);
  const rejectedTraits = sanitizeStringArray(body.preference_profile?.rejected_traits, 20, 140);
  const intensity = Math.max(1, Math.min(5, Number(body.intensity) || 3));
  const zodiac = sanitizeZodiac(body.zodiac);

  if (!PERSONAS.has(persona)) {
    return res.status(400).json({ error: "Select a valid Sae persona.", code: "invalid_persona" });
  }
  if (!conversation) {
    return res.status(400).json({ error: "Paste a message or explain the situation first.", code: "missing_conversation" });
  }

  const input = {
    persona,
    relationship,
    situation,
    goal,
    intensity,
    styles,
    conversation,
    zodiac,
    preference_profile: {
      approved_traits: approvedTraits,
      rejected_traits: rejectedTraits
    }
  };

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
