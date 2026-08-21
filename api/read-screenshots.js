import OpenAI from "openai";

const MAX_IMAGES = 4;
const MAX_DATA_URL_CHARS = 1_250_000;
const MAX_TOTAL_IMAGE_CHARS = 3_800_000;

function sanitizeString(value, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validImageDataUrl(value) {
  return typeof value === "string" && /^data:image\/(?:png|jpe?g|webp);base64,/i.test(value);
}

function sanitizeImages(value) {
  if (!Array.isArray(value)) return [];
  const images = [];
  let total = 0;
  for (const raw of value.slice(0, MAX_IMAGES)) {
    const image = sanitizeString(raw, MAX_DATA_URL_CHARS + 100);
    if (!validImageDataUrl(image) || image.length > MAX_DATA_URL_CHARS) continue;
    if (total + image.length > MAX_TOTAL_IMAGE_CHARS) break;
    total += image.length;
    images.push(image);
  }
  return images;
}

const screenshotSchema = {
  type: "object",
  additionalProperties: false,
  required: ["transcript", "confidence_note", "message_count", "participants"],
  properties: {
    transcript: { type: "string" },
    confidence_note: { type: "string" },
    message_count: { type: "integer" },
    participants: { type: "array", items: { type: "string" } }
  }
};

const INSTRUCTIONS = `
You are SHIN Screenshot Reader for SaeMackin101.

Your only job is to convert supplied conversation screenshots into careful, editable conversation evidence for the main SaeMackin communication engine.

RULES
- Read screenshots in the exact order supplied: Screenshot 1, Screenshot 2, etc.
- Preserve message order, wording, emojis, visible timestamps and names when legible.
- Never invent missing words, sender names, timestamps, messages, motives or context.
- If text is cut off or unreadable, write [unclear] instead of guessing.
- Avoid duplicating messages when screenshots overlap. If an overlap is obvious, include that message only once.
- Use sender labels based on the supplied side hint:
  - right = messages visually on the right are ME; left-side messages are THEM unless a visible name clearly identifies someone else.
  - left = messages visually on the left are ME; right-side messages are THEM unless a visible name clearly identifies someone else.
  - infer = use visible participant names if reliable; otherwise label by LEFT / RIGHT rather than pretending you know who is Sae.
- Do not analyze the relationship, give advice, draft a reply, or infer emotion. This route produces evidence only.
- A context note may clarify the platform or who is who, but it may not override clearly visible screenshot content.
- Keep the transcript concise and easy for a human to edit.
`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for this route." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "SHIN screenshot reading is not configured yet.", code: "missing_api_key" });
  }

  const body = req.body || {};
  const images = sanitizeImages(body.images);
  const sideRaw = sanitizeString(body.my_side, 10).toLowerCase();
  const mySide = ["left", "right", "infer"].includes(sideRaw) ? sideRaw : "infer";
  const note = sanitizeString(body.context_note, 700);

  if (!images.length) {
    return res.status(400).json({ error: "Attach at least one readable screenshot.", code: "missing_images" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const content = [
      {
        type: "input_text",
        text: `Read these screenshots into conversation evidence.\nMy side hint: ${mySide}.\nOptional context note: ${note || "None"}.\nThere are ${images.length} screenshot(s), supplied in conversation order.`
      },
      ...images.map((image, index) => ({
        type: "input_image",
        image_url: image,
        detail: "high"
      }))
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      store: false,
      instructions: INSTRUCTIONS,
      input: [{ role: "user", content }],
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "saemackin_screenshot_transcript",
          description: "Faithful transcript extracted from conversation screenshots.",
          strict: true,
          schema: screenshotSchema
        }
      }
    });

    const parsed = JSON.parse(response.output_text);
    return res.status(200).json({
      ...parsed,
      meta: {
        engine: "SHIN Screenshot Reader",
        screenshot_count: images.length,
        request_id: response._request_id || null
      }
    });
  } catch (error) {
    console.error("SHIN screenshot read error", {
      message: error?.message,
      status: error?.status,
      requestId: error?.request_id
    });
    const status = Number(error?.status) || 500;
    const publicMessage =
      status === 401 ? "The OpenAI API key was rejected." :
      status === 429 ? "SHIN screenshot reading is temporarily rate limited." :
      "SHIN could not read those screenshots. Try fewer or clearer images.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: publicMessage,
      code: "screenshot_read_error",
      request_id: error?.request_id || null
    });
  }
}
