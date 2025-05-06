window.onload = function() {
  const canvas = document.getElementById('projectileCanvas');
  const ctx = canvas.getContext('2d');
  let vx = 50, vy = 50, x = 50, y = canvas.height - 50, g = 9.8;
  let t = 0;

  const controls = document.getElementById('projectileControls');
  controls.innerHTML = `
      <label>Vx: <input type="range" id="vx" min="10" max="100" value="${vx}"></label>
      <label>Vy: <input type="range" id="vy" min="10" max="100" value="${vy}"></label>
  `;

  document.getElementById('vx').oninput = (e) => { vx = +e.target.value; reset(); };
  document.getElementById('vy').oninput = (e) => { vy = +e.target.value; reset(); };

  function reset() {
      t = 0;
      x = 50;
      y = canvas.height - 50;
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'gold';
      ctx.fill();
  }

  function update() {
      t += 0.1;
      x = 50 + vx * t;
      y = canvas.height - (50 + vy * t - 0.5 * g * t * t);
      if (y > canvas.height - 10) reset();
  }

  function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
  }

  loop();
};
