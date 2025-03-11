const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are MedBot, a helpful AI medical assistant that answers basic medical queries in simple terms. Avoid giving diagnosis or prescriptions. Always suggest seeing a doctor for serious issues.'
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.5
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI.' });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
