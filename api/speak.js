import OpenAI from "openai";

const MAX_TEXT_CHARS = 4000;
const FEMALE_VIBES = {
  warm: { voice: "nova", instructions: "Warm feminine conversational delivery. Natural, caring, relaxed, never robotic." },
  mature: { voice: "shimmer", instructions: "Mature feminine delivery with calm older-sister energy, grounded pacing and clear warmth." },
  playful: { voice: "coral", instructions: "Playful feminine delivery with natural smiles in the voice and light conversational energy." },
  confident: { voice: "nova", instructions: "Confident feminine delivery, composed and self-assured without sounding stiff." },
  flirty: { voice: "coral", instructions: "Warm feminine delivery with subtle playful chemistry. Keep it tasteful and conversational." },
  polished: { voice: "shimmer", instructions: "Polished feminine delivery that still sounds human, smooth and approachable." },
  slang: { voice: "nova", instructions: "Natural feminine conversational delivery. Read slang, contractions, casual phrasing and jokes like a real text conversation; preserve the user's wording, pauses and attitude without overacting or sounding like a narrator." }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI voice is not configured" });

  const text = typeof req.body?.text === "string" ? req.body.text.trim().slice(0, MAX_TEXT_CHARS) : "";
  if (!text) return res.status(400).json({ error: "Text is required" });
  const vibeName = typeof req.body?.vibe === "string" ? req.body.vibe.toLowerCase() : "warm";
  const vibe = FEMALE_VIBES[vibeName] || FEMALE_VIBES.warm;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const speech = await client.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: vibe.voice,
      input: text,
      instructions: vibe.instructions,
      response_format: "mp3"
    });
    const audio = Buffer.from(await speech.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).send(audio);
  } catch (error) {
    console.error("AI speech generation failed", error);
    return res.status(502).json({ error: "AI voice could not be generated" });
  }
}
