import OpenAI from "openai";

const MAX_TEXT_CHARS = 4000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI voice is not configured" });

  const text = typeof req.body?.text === "string" ? req.body.text.trim().slice(0, MAX_TEXT_CHARS) : "";
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const speech = await client.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.OPENAI_TTS_VOICE || "alloy",
      input: text,
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
