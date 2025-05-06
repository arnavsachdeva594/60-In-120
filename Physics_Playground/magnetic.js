window.onload = function() {
  const canvas = document.getElementById('magneticCanvas');
  const ctx = canvas.getContext('2d');
  let speed = 30, charge = 1;

  const controls = document.getElementById('magneticControls');
  controls.innerHTML = `
      <label>Speed: <input type="range" id="speed" min="10" max="100" value="${speed}"></label>
  `;

  document.getElementById('speed').oninput = (e) => { speed = +e.target.value; reset(); };

  function reset() {
      // optional: reset positions or other variables if needed
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const x = canvas.width / 2 + speed * Math.sin(Date.now() / 100);
      const y = canvas.height / 2 + speed * Math.cos(Date.now() / 100);

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'gold';
      ctx.fill();
  }

  function loop() {
      draw();
      requestAnimationFrame(loop);
  }

  loop();
};
