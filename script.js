/* Grab the main elements from the page */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const mohamedHasnaaURL = "https://mohamed-hasnaa.hmoham7.workers.dev/";
const systemPrompt =
  "You are a L'Oréal beauty assistant. Keep every answer focused on makeup, skincare, haircare, fragrance, or beauty routines. If the user asks about something unrelated, gently steer them back to beauty topics. Use simple, beginner-friendly language. Do not use markdown headings, raw hashtag symbols, code blocks, or long lists unless they are truly helpful. Keep responses concise and practical.";

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `msg ${type}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function cleanReply(text) {
  return text
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Show the first message when the page loads.
addMessage("👋 Hello! How can I help you today?", "ai");

/* Run this code when the user clicks Send */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();

  // Stop early if the input is empty.
  if (!question) {
    addMessage("Please type a question first.", "ai");
    return;
  }

  // Show the user's message and a loading message while waiting for the server.
  addMessage(question, "user");
  addMessage("Thinking...", "ai");

  try {
    // Send a plain text body (still JSON formatted) to avoid a CORS preflight.
    // The Worker can still parse this with request.json().
    const response = await fetch(mohamedHasnaaURL, {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      chatWindow.lastElementChild.remove();
      addMessage(`Request failed (${response.status}).`, "ai");
      return;
    }

    const reply = cleanReply(
      data.choices?.[0]?.message?.content || "No response received.",
    );

    // Replace the loading message with the assistant reply.
    chatWindow.lastElementChild.remove();
    addMessage(reply, "ai");
  } catch (error) {
    chatWindow.lastElementChild.remove();
    addMessage(
      "Connection failed. Check your Cloudflare Worker URL and CORS settings.",
      "ai",
    );
  }

  // Clear the input box for the next message.
  userInput.value = "";
});
