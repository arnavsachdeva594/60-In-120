const BACKEND_URL = 'https://your-backend-app.onrender.com'; // <-- Your Render URL

const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');
const cardName = document.getElementById('card-name');
const cardDescription = document.getElementById('card-description');
const cardImage = document.getElementById('card-image');
const card = document.getElementById('card');
const gallery = document.getElementById('gallery');

async function generateAICard() {
  try {
    const res = await fetch(`${BACKEND_URL}/generate-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptInput.value })
    });

    const data = await res.json();
    const [nameLine, ...descLines] = data.nameAndBackstory.split('.');
    cardName.textContent = nameLine;
    cardDescription.textContent = descLines.join('.').trim();
    cardImage.src = data.imageUrl;

    saveToGallery({ name: nameLine, description: descLines.join('.').trim(), image: data.imageUrl });
    loadGallery();
  } catch (err) {
    console.error(err);
    alert('Failed to generate card. Please try again later.');
  }
}

function saveToGallery(cardObj) {
  const cards = JSON.parse(localStorage.getItem('gallery')) || [];
  cards.push(cardObj);
  localStorage.setItem('gallery', JSON.stringify(cards));
}

function loadGallery() {
  const cards = JSON.parse(localStorage.getItem('gallery')) || [];
  gallery.innerHTML = '';
  cards.forEach(c => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<img src="${c.image}" alt=""><h3>${c.name}</h3><p>${c.description}</p>`;
    gallery.appendChild(div);
  });
}

async function downloadCard() {
  const canvas = await html2canvas(card);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'ai_card.png';
  link.click();
}

generateBtn.addEventListener('click', generateAICard);
downloadBtn.addEventListener('click', downloadCard);
window.addEventListener('load', loadGallery);
