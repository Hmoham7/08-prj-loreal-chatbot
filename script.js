/* Grab the main elements from the page */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Show the first message when the page loads.
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Run this code when the user clicks Send */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Beginner note:
  // Later, replace this with a real API request.
  // Send a `messages` array and read: data.choices[0].message.content

  // Temporary output so students can test the UI first.
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";

  // Clear the input box for the next message.
  userInput.value = "";
});
