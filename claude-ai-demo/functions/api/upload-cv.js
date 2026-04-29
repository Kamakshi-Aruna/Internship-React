/**
 * Cloudflare Pages Function — POST /api/upload-cv
 *
 * Receives a CV file + extracted text from the frontend.
 * Stores both in Cloudflare R2 (object storage).
 *
 * Why store both?
 *  - Original file → so you can download it later
 *  - Extracted text → so the AI can read it (AI can't read binary PDF)
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const formData = await request.formData();
  const file = formData.get("file");         // the actual PDF/TXT file
  const extractedText = formData.get("text"); // text extracted on the frontend

  if (!file || !extractedText) {
    return new Response(
      JSON.stringify({ error: "Both file and extracted text are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Create a unique key for this CV using timestamp + filename
  const key = `${Date.now()}-${file.name}`;

  // Store the original file in R2
  await env.CV_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  // Store the extracted text alongside it (same key with .txt extension)
  await env.CV_BUCKET.put(`${key}.txt`, extractedText, {
    httpMetadata: { contentType: "text/plain" },
  });

  return new Response(
    JSON.stringify({
      key,               // we send this back to the frontend
      filename: file.name,
      message: "CV uploaded successfully to R2",
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