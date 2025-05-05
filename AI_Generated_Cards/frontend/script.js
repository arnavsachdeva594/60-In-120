const generateCardButton = document.getElementById('generateCard');
const cardPrompt = document.getElementById('cardPrompt');
const generatedCard = document.getElementById('generatedCard');
const cardName = document.getElementById('cardName');
const cardBackstory = document.getElementById('cardBackstory');
const cardImage = document.getElementById('cardImage');

// Generate Card Function
generateCardButton.addEventListener('click', async () => {
  const prompt = cardPrompt.value || 'Generate a unique fantasy creature name and short backstory.';

  try {
    const response = await fetch('/generate-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.error) {
      alert('Failed to generate card');
    } else {
      cardName.textContent = data.nameAndBackstory.split('.')[0];
      cardBackstory.textContent = data.nameAndBackstory.split('.')[1] || 'No backstory provided.';
      cardImage.src = data.imageUrl;
      generatedCard.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
    alert('Failed to generate card');
  }
});
