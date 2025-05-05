const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { OpenAI } = require('openai'); // Updated import based on the latest OpenAI Node.js SDK
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 💥 Rate limiter: max 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after a minute',
});
app.use(limiter);

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-card', async (req, res) => {
  try {
    // Extract user prompt or use default prompt
    const userPrompt = req.body.prompt || 'Generate a unique fantasy creature name and short backstory.';
    
    // Generate a backstory using GPT-3.5 or GPT-4 model (text-davinci-003 is old; newer models are recommended)
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' depending on your access
      messages: [{ role: 'user', content: userPrompt }],
    });

    const nameAndBackstory = gptResponse.choices[0].message.content.trim();
    
    // Create a DALL·E prompt for generating an image based on the generated backstory
    const dallePrompt = `digital art, fantasy creature, ${nameAndBackstory.split('.')[0]}`;
    const dalleResponse = await openai.images.create({
      prompt: dallePrompt,
      n: 1,
      size: '512x512', // You can also choose different sizes like '1024x1024'
    });

    // Send back the generated name, backstory, and image URL
    res.json({
      nameAndBackstory,
      imageUrl: dalleResponse.data[0].url,
    });
  } catch (error) {
    console.error(error.response || error);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
