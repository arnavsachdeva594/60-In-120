window.onload = function() {
  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');
  let amplitude = 50, frequency = 1, phase = 0;

  const controls = document.getElementById('waveControls');
  controls.innerHTML = `
      <label>Amplitude: <input type="range" id="amplitude" min="10" max="200" value="${amplitude}"></label>
      <label>Frequency: <input type="range" id="frequency" min="0.1" max="2" step="0.1" value="${frequency}"></label>
  `;

  document.getElementById('amplitude').oninput = (e) => { amplitude = +e.target.value; reset(); };
  document.getElementById('frequency').oninput = (e) => { frequency = +e.target.value; reset(); };

  function reset() {
      phase = 0;
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + amplitude * Math.sin(frequency * x / 10 + phase);
          ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 2;
      ctx.stroke();
  }

  function update() {
      phase += 0.05;
  }

  function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
  }

  loop();
};
