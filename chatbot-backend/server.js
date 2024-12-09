const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy Chatbot Logic
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;

  // Example responses
  const responses = {
    hello: "Hi there! How can I assist you today?",
    help: "Sure, I'm here to help! What do you need assistance with?",
    bye: "Goodbye! Have a great day!",
  };

  // Match user input to a response
  const botReply = responses[userMessage.toLowerCase()] || "I'm sorry, I didn't understand that.";

  res.json({ reply: botReply });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Chatbot backend is running on http://localhost:${PORT}`);
});