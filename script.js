/* Grab the main elements from the page */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Show the first message when the page loads.
chatWindow.textContent = "👋 Hello! How can I help you today?";

const mohamedHasnaaURL = "https://mohamed-hasnaa.hmoham7.workers.dev/";

/* Run this code when the user clicks Send */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();

  // Stop early if the input is empty.
  if (!question) {
    chatWindow.textContent = "Please type a question first.";
    return;
  }

  // Show a loading message while waiting for the server.
  chatWindow.textContent = "Thinking...";

  try {
    // Send a plain text body (still JSON formatted) to avoid a CORS preflight.
    // The Worker can still parse this with request.json().
    const response = await fetch(mohamedHasnaaURL, {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      chatWindow.textContent = `Request failed (${response.status}).`;
      return;
    }

    const data = await response.json();

    // Read the OpenAI-style response returned by your Worker.
    chatWindow.textContent =
      data.choices?.[0]?.message?.content || "No response received.";
  } catch (error) {
    chatWindow.textContent =
      "Connection failed. Check your Cloudflare Worker URL and CORS settings.";
  }

  // Clear the input box for the next message.
  userInput.value = "";
});
