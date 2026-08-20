import OpenAI from "openai";

const MAX_INPUT = 9000;
const safe = (v, max = 1000) => typeof v === "string" ? v.trim().slice(0, max) : "";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["title","freestyle_angle","hook_seed","bar_seeds","caption","recording_focus","truth_check","avoid"],
  properties: {
    title: { type: "string" },
    freestyle_angle: { type: "string" },
    hook_seed: { type: "string" },
    bar_seeds: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
    caption: { type: "string" },
    recording_focus: { type: "string" },
    truth_check: { type: "string" },
    avoid: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } }
  }
};

const INSTRUCTIONS = `
You are the RNP room inside SHIN: Real Ninja Poetics.

MISSION
Turn lived experience into original rap-writing seeds without making the artist sound generic, imitative, corny, or artificially polished.

RNP DNA
- Rugged, grown, reflective, spiritual when it naturally fits, and emotionally honest.
- Family, fatherhood, loyalty, rebuilding, ambition, isolation, pressure, survival, accountability, money stress, growth and purpose can all be material when the user gives them.
- Preserve tension and contradiction. A strong line can admit fear and still sound composed.
- Prefer concrete images, real scenes, small details and memorable phrasing over generic motivational bars.
- Never claim a life event happened unless the user supplied it.
- Never imitate or write "in the style of" a named artist. If influences are mentioned, extract only high-level qualities such as conversational cadence, melodic space, punchline density, restraint, or emotional directness.
- Use the word "ninja" instead of racial slurs.
- No fake street history, fake wealth, fake violence, fake criminal activity, fake trauma, or fake flexing.
- Do not romanticize reckless retaliation or self-destruction.
- Keep the writing usable as seeds, not a finished ghostwritten identity.

OUTPUT
- freestyle_angle: a 30–60 second angle with a beginning, turn, and landing point.
- hook_seed: memorable but unfinished enough for the artist to own it.
- bar_seeds: exactly four original lines/ideas. They may rhyme loosely but should not become a full verse.
- caption: short social caption in the same emotional lane.
- recording_focus: one practical BandLab/vocal focus.
- truth_check: one sentence explaining what makes the idea authentic to the supplied material.
- avoid: 2–4 traps that would make this specific idea sound generic, fake, overdone, or emotionally dishonest.
Return only the structured JSON.
`;

export default async function handler(req, res){
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") return res.status(405).json({ error:"Use POST." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error:"RNP engine is not configured." });

  const body = req.body || {};
  const raw = safe(body.raw, MAX_INPUT);
  if (!raw) return res.status(400).json({ error:"Give RNP something real to build from." });

  const input = {
    raw,
    mood: safe(body.mood, 80) || "grounded pressure",
    energy: safe(body.energy, 80) || "grown and rugged",
    goal: safe(body.goal, 120) || "turn the real moment into authentic rap seeds"
  };

  try{
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      store: false,
      instructions: INSTRUCTIONS,
      input: [{ role:"user", content:[{ type:"input_text", text:`Build an RNP creative packet from this JSON:\n${JSON.stringify(input)}` }] }],
      text: { verbosity:"medium", format:{ type:"json_schema", name:"rnp_packet", strict:true, schema } }
    });
    return res.status(200).json({ ...JSON.parse(response.output_text), meta:{ engine:"RNP / SHIN", model:process.env.OPENAI_MODEL || "gpt-5.2" } });
  }catch(error){
    console.error("RNP generation error", { message:error?.message, status:error?.status, requestId:error?.request_id });
    return res.status(500).json({ error:"RNP could not finish this packet. Try again in a moment." });
  }
}
