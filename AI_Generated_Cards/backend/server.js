const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 💥 Rate limiter: max 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again after a minute',
});
app.use(limiter);

const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo';

async function generateImage(prompt) {
  try {
    const response = await axios.post(
      HF_MODEL_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        },
        responseType: 'arraybuffer',
      }
    );

    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${imageBase64}`;
  } catch (error) {
    console.error('Hugging Face API error:', error.response?.data || error.message);
    throw new Error('Failed to generate image from Hugging Face');
  }
}

app.post('/generate-card', async (req, res) => {
  try {
    const userPrompt = req.body.prompt || 'Generate a unique fantasy creature name and short backstory.';
    
    // Use GPT fallback text (or mock for now)
    const nameAndBackstory = `Mystic Drake. A legendary dragon that guards the ancient forests.`;

    const dallePrompt = `fantasy creature, ${nameAndBackstory.split('.')[0]}`;
    const imageUrl = await generateImage(dallePrompt);

    res.json({
      nameAndBackstory,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
