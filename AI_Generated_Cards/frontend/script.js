// Grab the dark mode button
const darkModeButton = document.getElementById('darkModeToggle');

// Check if dark mode is already active and apply it
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

// Function to toggle dark mode
darkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Store the dark mode preference in localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Function to generate the card (fake example for now)
document.getElementById('generateCardForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get user input
  const name = document.getElementById('nameInput').value;
  const backstory = document.getElementById('backstoryInput').value;

  // Replace with an actual API call to generate the card (placeholder for now)
  const cardName = name || 'Mystical Beast';
  const cardBackstory = backstory || 'A mysterious creature with untold power.';
  const cardImage = 'https://placeimg.com/400/300/animals';  // Placeholder image

  // Display the generated card
  document.getElementById('cardName').innerText = cardName;
  document.getElementById('cardBackstory').innerText = cardBackstory;
  document.getElementById('cardImage').src = cardImage;

  // Show the card container
  document.getElementById('cardContainer').style.display = 'block';
});