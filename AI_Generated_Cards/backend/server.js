import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

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

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/generate-card', async (req, res) => {
  try {
    const userPrompt = req.body.prompt || 'Generate a unique fantasy creature name and short backstory.';
    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: userPrompt,
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
