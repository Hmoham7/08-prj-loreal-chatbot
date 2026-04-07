// Copy this code into your Cloudflare Worker script.
// It supports CORS and forwards chat requests to OpenAI.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // CORS preflight request.
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Optional: health check in browser.
  if (request.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", message: "Worker is running" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // In Cloudflare, API keys are added as secrets in the dashboard.
    const apiKey = OPENAI_API_KEY;

    const body = await request.json();
    const messages = body.messages || [];

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

    return new Response(JSON.stringify(data), {
      status: openAIResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Worker request failed",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}
