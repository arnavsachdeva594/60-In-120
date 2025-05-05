import { Configuration, OpenAIApi } from 'openai';  // Correct ES Module import
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/generate-card', async (req, res) => {
  try {
    const { prompt, backstory } = req.body;  // Extract prompt and backstory from the request body
    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}\nBackstory: ${backstory}`,  // Combine prompt and backstory
      max_tokens: 150,
    });

    const nameAndBackstory = gptResponse.data.choices[0].text.trim();
    const dallePrompt = `digital art, fantasy creature, ${nameAndBackstory.split('.')[0]}`;
    const dalleResponse = await openai.createImage({
      prompt: dallePrompt,
      n: 1,
      size: '512x512',
    });

    res.json({
      nameAndBackstory,
      imageUrl: dalleResponse.data.data[0].url,
    });
  } catch (error) {
    console.error(error.response || error);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
