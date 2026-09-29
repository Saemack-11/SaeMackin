import OpenAI from "openai";

const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 18;
const MAX_MESSAGE_CHARS = 8_000;

const MODES = {
  auto: {
    label: "Auto",
    persona: "Adaptive Sae",
    instruction: "Read the room and automatically choose the most appropriate energy: smooth, sauce, direct, solid, funny, or neutral SHIN. Do not force flirting or humor. Match the relationship and stakes visible in the supplied message."
  },
  shin: {
    label: "SHIN",
    persona: "Grounded Sae",
    instruction: "Give the strongest natural all-purpose Sae reply for the room."
  },
  smooth: {
    label: "Smooth",
    persona: "Grounded Sae",
    instruction: "Keep it smooth, composed, conversational and easy to send."
  },
  sauce: {
    label: "Sauce",
    persona: "Flirtatious Sae",
    instruction: "Add confident Sae swagger, natural slang, wit and personality without sounding thirsty."
  },
  direct: {
    label: "Direct",
    persona: "Business Sae",
    instruction: "Be concise, clear and direct while staying human and respectful."
  },
  solid: {
    label: "Solid",
    persona: "Listener Sae",
    instruction: "Sound mature, supportive and emotionally aware without overexplaining."
  },
  funny: {
    label: "Funny",
    persona: "Comedian Sae",
    instruction: "Use observational humor and a playful comeback only where the message supports it."
  }
};

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "alternates", "room_read", "selected_mode"],
  properties: {
    reply: { type: "string" },
    alternates: {
      type: "object",
      additionalProperties: false,
      required: ["smooth", "sauce", "direct"],
      properties: {
        smooth: { type: "string" },
        sauce: { type: "string" },
        direct: { type: "string" }
      }
    },
    room_read: { type: "string" },
    selected_mode: { type: "string", enum: ["shin", "smooth", "sauce", "direct", "solid", "funny"] }
  }
};

const KEYBOARD_INSTRUCTIONS = `
You are SHIN Keyboard, the fast-reply surface for SaeMackin101.

Your job is to turn a pasted incoming message or short conversation into a reply Sae can tap into any text field.

VOICE
- Keep Sae recognizable: confident, observant, conversational, emotionally agile, direct when needed, lightly humorous when useful.
- Natural slang is welcome; forced slang, pickup-line clichés, therapy clichés, corporate filler and obvious AI wording are not.
- Never invent facts, history, promises, accusations, motives or feelings.
- Preserve dignity. No begging, overpursuit, manipulation, coercion, jealousy games, threats, degradation or harassment.
- Respect rejection, requests for space and romantic/sexual boundaries.
- In work, money, housing, co-parenting, legal or formal contexts, prioritize factual restraint and documentation-friendly wording.
- Flirting must be supported by the supplied message and remain mutual/context-aware.
- Do not claim to know what another person secretly thinks. room_read should label interpretation as uncertain.
- Return ready-to-send text, not advice wrapped around the reply.
- Keep the primary reply compact enough for a keyboard workflow unless the incoming message clearly requires detail.
- In Auto mode, selected_mode must report the response energy you actually chose. In explicit modes, selected_mode should match that requested energy where applicable.\n- Return only the required structured data.
`;

function clean(value, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function clientId(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || req.socket?.remoteAddress || "unknown"))
    .split(",")[0].trim();
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

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for this route." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "SHIN Intelligence is not configured yet.", code: "missing_api_key" });
  }
  if (rateLimited(clientId(req))) {
    return res.status(429).json({ error: "SHIN is receiving too many requests. Wait a moment and try again.", code: "rate_limited" });
  }

  const message = clean(req.body?.message, MAX_MESSAGE_CHARS);
  const modeKey = clean(req.body?.mode, 20).toLowerCase() || "auto";
  const mode = MODES[modeKey] || MODES.auto;
  const customDirection = clean(req.body?.direction, 240);

  if (!message) {
    return res.status(400).json({ error: "Paste a message first.", code: "missing_message" });
  }

  const input = {
    surface: "ios_keyboard",
    mode: mode.label,
    persona_hint: mode.persona,
    direction: [mode.instruction, customDirection].filter(Boolean).join(" "),
    message
  };

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      store: false,
      instructions: KEYBOARD_INSTRUCTIONS,
      input: [{ role: "user", content: [{ type: "input_text", text: `Create a SHIN Keyboard reply from this JSON:\n${JSON.stringify(input)}` }] }],
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "shin_keyboard_response",
          strict: true,
          schema: responseSchema
        }
      }
    });

    const parsed = JSON.parse(response.output_text);
    return res.status(200).json({
      ...parsed,
      meta: {
        engine: "SHIN Keyboard",
        mode: modeKey,
        model: process.env.OPENAI_MODEL || "gpt-5.2",
        request_id: response._request_id || null
      }
    });
  } catch (error) {
    console.error("SHIN keyboard generation error", {
      message: error?.message,
      status: error?.status,
      requestId: error?.request_id
    });
    const status = Number(error?.status) || 500;
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: status === 429
        ? "SHIN is temporarily rate limited or needs available API credits."
        : "SHIN Keyboard could not finish this reply.",
      code: "keyboard_generation_error",
      request_id: error?.request_id || null
    });
  }
}
