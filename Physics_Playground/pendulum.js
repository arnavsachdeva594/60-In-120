window.onload = function() {
  const canvas = document.getElementById('pendulumCanvas');
  const ctx = canvas.getContext('2d');
  const length = 150, g = 9.8, mass = 10;
  let angle = Math.PI / 4, angularVelocity = 0, angularAcceleration = 0;
  let damping = 0.995, t = 0;

  const controls = document.getElementById('pendulumControls');
  controls.innerHTML = `
      <label>Length: <input type="range" id="length" min="50" max="300" value="${length}"></label>
      <label>Gravity: <input type="range" id="gravity" min="5" max="20" value="${g}"></label>
  `;

  document.getElementById('length').oninput = (e) => { length = +e.target.value; reset(); };
  document.getElementById('gravity').oninput = (e) => { g = +e.target.value; reset(); };

  function reset() {
      angularVelocity = 0;
      angle = Math.PI / 4;
      t = 0;
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const x = canvas.width / 2 + length * Math.sin(angle);
      const y = length * Math.cos(angle);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'gold';
      ctx.fill();
  }

  function update() {
      angularAcceleration = (-g / length) * Math.sin(angle);
      angularVelocity += angularAcceleration;
      angularVelocity *= damping;
      angle += angularVelocity;
  }

  function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
  }

  loop();
};
