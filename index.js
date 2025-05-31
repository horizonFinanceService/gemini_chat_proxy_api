require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // allow frontend to call this API
app.use(express.json()); // parse JSON request bodies

const PORT = process.env.PORT || 3000;

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `You are a Kali Linux expert. Respond casually and concisely to the following message as if you're chatting with a fellow tech enthusiast: ${prompt}. Please answer with human sense`
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    res.json({ message: reply });
  } catch (err) {
    console.error('Error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Something went wrong',
      details: err?.response?.data || err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
