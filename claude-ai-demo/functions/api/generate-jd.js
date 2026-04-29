/**
 * Cloudflare Pages Function — POST /api/generate-jd
 *
 * Uses Cloudflare Workers AI (FREE) — no API key needed!
 * Model: Llama 3.1 8B
 *
 * PROMPT ENGINEERING CONCEPTS DEMONSTRATED:
 *  1. System prompt with persona + constraints
 *  2. Context injection — multiple form fields injected into one prompt
 *  3. Structured output — JSON with sections React can render individually
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // ── 1. Read form data from React ───────────────────────────────────────────
  const { jobTitle, department, responsibilities, requirements, salaryRange, remote } =
    await request.json();

  if (!jobTitle) {
    return new Response(JSON.stringify({ error: "Job title is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 2. Build the prompt ────────────────────────────────────────────────────

  // SYSTEM PROMPT: persona + strict output format
  const systemPrompt = `You are a senior HR copywriter who writes clear, inclusive, and compelling job descriptions.
Always respond with valid JSON only — no markdown, no extra text, no code blocks.
Use this exact structure:
{
  "title": "job title",
  "tagline": "one punchy sentence to attract candidates",
  "about_role": "2-3 sentence overview of the role",
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3"],
  "requirements": ["requirement 1", "requirement 2", "requirement 3"],
  "nice_to_have": ["bonus skill 1", "bonus skill 2"],
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "closing": "one encouraging closing sentence"
}`;

  // CONTEXT INJECTION: inject all form fields into the message
  const userMessage = `Generate a job description using the following details:

Job Title: ${jobTitle}
Department: ${department || "Not specified"}
Key Responsibilities: ${responsibilities || "Not specified"}
Requirements: ${requirements || "Not specified"}
Salary Range: ${salaryRange || "Competitive"}
Remote Policy: ${remote || "Hybrid"}

Make it engaging and inclusive.`;

  // ── 3. Call Cloudflare Workers AI (FREE) ───────────────────────────────────
  const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userMessage  },
    ],
    max_tokens: 1500,
  });

  // ── 4. Parse structured output ─────────────────────────────────────────────
  let rawText = aiResponse.response.trim();

  // Strip markdown code blocks if present
  rawText = rawText.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");

  let jobDescription;
  try {
    jobDescription = JSON.parse(rawText);
  } catch {
    return new Response(
      JSON.stringify({ error: "AI did not return valid JSON", raw: rawText }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ jobDescription, rawPrompt: { systemPrompt, userMessage } }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}