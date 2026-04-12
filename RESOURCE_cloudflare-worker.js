// Copy this code into your Cloudflare Worker script (module syntax).
// It supports CORS and forwards beauty chat requests to OpenAI.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

const systemPrompt =
  "You are a L'Oréal beauty assistant. Keep every answer focused on makeup, skincare, haircare, fragrance, or beauty routines. If the user asks about something unrelated, gently steer them back to beauty topics. Use simple, beginner-friendly language. Do not use markdown headings, raw hashtag symbols, code blocks, or long lists unless they are truly helpful. Keep responses concise and practical.";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "GET") {
      return jsonResponse({ status: "ok", message: "Worker is running" });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    try {
      const apiKey = env.OPENAI_API_KEY;

      if (!apiKey) {
        return jsonResponse(
          { error: "Missing OPENAI_API_KEY secret in Cloudflare Worker" },
          500,
        );
      }

      const body = await request.json();
      const incomingMessages = Array.isArray(body.messages)
        ? body.messages
        : [];
      const messages = [
        { role: "system", content: systemPrompt },
        ...incomingMessages,
      ];

      const openAIResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages,
            max_completion_tokens: 300,
          }),
        },
      );

      const data = await openAIResponse.json();
      return jsonResponse(data, openAIResponse.status);
    } catch (error) {
      return jsonResponse(
        {
          error: "Worker request failed",
          details: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  },
};
