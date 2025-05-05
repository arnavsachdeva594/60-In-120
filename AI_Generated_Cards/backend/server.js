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

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

app.post('/generate-card', async (req, res) => {
  try {
    const userPrompt = req.body.prompt || 'Generate a unique fantasy creature name and short backstory.';

    // Here you can skip GPT generation or replace it with a static name
    const nameAndBackstory = userPrompt;

    // Call Hugging Face image API
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: nameAndBackstory },
      { headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }, responseType: 'arraybuffer' }
    );

    // Convert binary image to base64
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    res.json({
      nameAndBackstory,
      imageUrl,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));