document.getElementById('darkModeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = '🌞';  // Switch to light mode icon
    } else {
        darkModeBtn.textContent = '🌙';  // Switch to dark mode icon
    }
});

document.getElementById('generateCardBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const backstory = document.getElementById('backstory').value;
    const resultContainer = document.getElementById('cardResult');

    if (!prompt || !backstory) {
        resultContainer.innerHTML = '<p>Please fill out both the prompt and backstory fields.</p>';
        return;
    }

    // Show loading text
    resultContainer.innerHTML = '<p>Generating card...</p>';

    try {
        const response = await fetch('/generate-card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, backstory }),
        });

        const data = await response.json();

        if (data.error) {
            resultContainer.innerHTML = `<p>${data.error}</p>`;
        } else {
            const cardHtml = `
                <h3>${data.nameAndBackstory.split('\n')[0]}</h3>
                <p>${data.nameAndBackstory.split('\n')[1]}</p>
                <img src="${data.imageUrl}" alt="Generated Creature Image">
            `;
            resultContainer.innerHTML = cardHtml;
        }
    } catch (error) {
        resultContainer.innerHTML = '<p>Failed to generate card. Please try again later.</p>';
        console.error(error);
    }
});