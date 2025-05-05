app.post('/generate-card', async (req, res) => {
  try {
      const { prompt, backstory } = req.body; // Get both the prompt and backstory from the request
      const gptResponse = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `${prompt}\nBackstory: ${backstory}`, // Combine prompt and backstory
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