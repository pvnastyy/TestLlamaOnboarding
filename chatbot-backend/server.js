const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = "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";



app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botMessage = response.data.choices[0].message.content;

    
    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error.message);
    res.status(500).json({ reply: "Sorry, something went wrong!" });
  }
});


app.listen(PORT, () => {
  console.log(`Chatbot backend is running on http://localhost:${PORT}`);
});