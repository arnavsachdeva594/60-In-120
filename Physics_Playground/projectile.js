window.onload = function() {
  const canvas = document.getElementById('projectileCanvas');
  const ctx = canvas.getContext('2d');
  
  // Initial values
  let vx = 50, vy = 50, x = 50, y = canvas.height - 50, g = 9.8;
  let t = 0;

  // Create controls for sliders
  const controls = document.getElementById('projectileControls');
  controls.innerHTML = `
      <label>Vx: <input type="range" id="vx" min="10" max="100" value="${vx}"></label>
      <label>Vy: <input type="range" id="vy" min="10" max="100" value="${vy}"></label>
  `;

  // Event listeners for sliders
  document.getElementById('vx').oninput = (e) => { vx = +e.target.value; reset(); };
  document.getElementById('vy').oninput = (e) => { vy = +e.target.value; reset(); };

  // Reset projectile to initial position
  function reset() {
      t = 0;
      x = 50;
      y = canvas.height - 50;
  }

  // Draw the projectile on the canvas
  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);  // Draw a circle for the projectile
      ctx.fillStyle = 'gold';
      ctx.fill();
  }

  // Update the position of the projectile based on time and physics
  function update() {
      t += 0.1;
      x = 50 + vx * t;  // Horizontal position based on velocity and time
      y = canvas.height - (50 + vy * t - 0.5 * g * t * t);  // Vertical motion with gravity

      // Reset if projectile hits the ground
      if (y > canvas.height - 10) {
          reset();
      }
  }

  // Main animation loop
  function loop() {
      update();
      draw();
      requestAnimationFrame(loop);  // Request the next frame
  }

  loop();  // Start the loop
};
