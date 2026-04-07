/* Grab the main elements from the page */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Show the first message when the page loads.
chatWindow.textContent = "👋 Hello! How can I help you today?";

const wonderwoman9URL = "https://wonderwoman9.hmoham7.workers.dev/";

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
    // Send the user's question to your Worker URL.
    const response = await fetch(wonderwoman9URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: question }),
    });

    const data = await response.json();

    // Show whichever text field is returned by the API.
    chatWindow.textContent =
      data.reply || data.response || data.message || "No response received.";
  } catch (error) {
    chatWindow.textContent = "Something went wrong. Please try again.";
  }

  // Clear the input box for the next message.
  userInput.value = "";
});
