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

// Hugging Face API URL for Stable Diffusion model
const HF_MODEL_URL = 'https://hf.space/api/predict/';  // Correct endpoint

// Make sure to use your Hugging Face API token
const HF_API_TOKEN = process.env.HF_API_TOKEN;

async function generateImage(prompt) {
  try {
    const response = await axios.post(
      HF_MODEL_URL,
      {
        // Correct structure based on Hugging Face Space's required format
        data: [prompt],  
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
      }
    );

    // Extract the image URL from the response (adjust if needed)
    const imageUrl = response.data.data[0]; // Response may vary, check Hugging Face response
    return imageUrl;
  } catch (error) {
    console.error('Hugging Face API error:', error.response?.data || error.message);
    throw new Error('Failed to generate image from Hugging Face');
  }
}

app.post('/generate-card', async (req, res) => {
  try {
    const userPrompt = req.body.prompt || 'Generate a unique fantasy creature name and short backstory.';
    
    // Using a fallback name and backstory for now
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
