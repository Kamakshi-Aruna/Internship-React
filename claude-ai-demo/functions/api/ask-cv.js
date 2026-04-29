/**
 * Cloudflare Pages Function — POST /api/ask-cv
 *
 * 1. Reads the CV text stored in R2
 * 2. Injects it into the AI prompt (context injection)
 * 3. Returns the AI's answer
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const { key, question } = await request.json();

  if (!key || !question) {
    return new Response(
      JSON.stringify({ error: "key and question are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 1. Read CV text from R2 ────────────────────────────────────────────────
  const object = await env.CV_BUCKET.get(`${key}.txt`);

  if (!object) {
    return new Response(
      JSON.stringify({ error: "CV not found in storage. Please upload again." }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const cvText = await object.text();

  // ── 2. Build the prompt with context injection ─────────────────────────────
  const systemPrompt = `You are an expert HR assistant.
You have been given a candidate's CV. Answer questions about it clearly and concisely.
Base your answers only on the information in the CV.`;

  // The CV text is injected as context so the AI knows about this specific candidate
  const userMessage = `Here is the candidate's CV:
---
${cvText}
---

Question: ${question}`;

  // ── 3. Call Cloudflare Workers AI ─────────────────────────────────────────
  const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userMessage  },
    ],
    max_tokens: 512,
  });

  return new Response(
    JSON.stringify({
      answer: aiResponse.response,
      question,
    }),
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