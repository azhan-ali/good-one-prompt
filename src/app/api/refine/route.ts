import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const TONE_INSTRUCTIONS: Record<string, string> = {
  "ui-design": "The user wants a prompt focused on UI/UX Design. Emphasize visual design, color palettes, layout, animations, component styling, responsiveness, and user experience details.",
  "logic-building": "The user wants a prompt focused on Logic & Architecture. Emphasize algorithms, data structures, system design, state management, data flow, and technical implementation details.",
  "bug-fixing": "The user wants a prompt focused on Bug Fixing & Debugging. Emphasize problem description, expected vs actual behavior, error messages, reproduction steps, and what fixes to try.",
  "feature-building": "The user wants a prompt focused on Feature Building & Innovation. Emphasize creative feature ideas, unique approaches, competitive advantages, and detailed feature specifications.",
  "normal-talk": "The user wants a conversational, friendly prompt. Keep it natural and approachable while still being clear and specific.",
};

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  "short": "Output format: Keep the refined prompt SHORT and concise — maximum 3-5 sentences. No bullet points or sections.",
  "long": "Output format: Make the refined prompt DETAILED and comprehensive — use sections, bullet points, and cover all edge cases.",
  "json": `Output format: Return the refined prompt as a JSON object with this structure ONLY (no extra text):
{
  "goal": "main objective",
  "techStack": ["tech1", "tech2"],
  "features": ["feature1", "feature2"],
  "requirements": ["req1", "req2"],
  "prompt": "full refined prompt text"
}`,
  "technical": "Output format: Make the prompt highly TECHNICAL — use precise developer terminology, specify exact APIs, methods, patterns, and implementation details.",
};

function buildSystemPrompt(tone: string, format: string): string {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS["normal-talk"];
  const formatInstruction = FORMAT_INSTRUCTIONS[format] || FORMAT_INSTRUCTIONS["long"];

  return `You are "Prompt Refiner" — an expert at turning messy, broken, misspelled, Hinglish/Roman-script developer prompts into clean, professional English prompts for AI coding assistants like Windsurf, Cursor, or ChatGPT.

Core Rules:
1. Understand the user's INTENT even if text has heavy spelling mistakes, grammar issues, or is in Roman Hindi/Urdu.
2. Output ONLY the refined prompt — no meta-commentary.
3. Preserve ALL technical details the user mentioned.
4. If intent is vague, make reasonable developer assumptions.

Tone Instruction: ${toneInstruction}

${formatInstruction}`;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, tone = "normal-talk", format = "long" } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(tone, format);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const refinedPrompt =
      chatCompletion.choices[0]?.message?.content || "Could not refine the prompt.";

    return NextResponse.json({ refined: refinedPrompt });
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to refine prompt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
