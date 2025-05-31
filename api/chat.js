import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a Kali Linux expert. Respond casually and concisely to the following message as if you're chatting with a fellow tech enthusiast: ${prompt}. Please answer with human sense`
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received.";

    res.status(200).json({ message: reply.replace(/\*/g, '') });
  } catch (error) {
    console.error("Gemini error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Something went wrong." });
  }
}
