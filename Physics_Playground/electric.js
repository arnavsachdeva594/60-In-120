window.onload = function() {
  const canvas = document.getElementById('electricCanvas');
  const ctx = canvas.getContext('2d');
  let charge1 = 1, charge2 = -1, k = 9e9;
  let x1 = 200, y1 = 200, x2 = 400, y2 = 200;

  const controls = document.getElementById('electricControls');
  controls.innerHTML = `
      <label>Charge 1: <input type="range" id="charge1" min="-5" max="5" value="${charge1}"></label>
      <label>Charge 2: <input type="range" id="charge2" min="-5" max="5" value="${charge2}"></label>
  `;

  document.getElementById('charge1').oninput = (e) => { charge1 = +e.target.value; reset(); };
  document.getElementById('charge2').oninput = (e) => { charge2 = +e.target.value; reset(); };

  function reset() {
      // optional: reset positions or other variables if needed
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const r = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const force = k * (charge1 * charge2) / (r * r);

      ctx.beginPath();
      ctx.arc(x1, y1, 10, 0, Math.PI * 2);
      ctx.fillStyle = charge1 > 0 ? 'red' : 'blue';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x2, y2, 10, 0, Math.PI * 2);
      ctx.fillStyle = charge2 > 0 ? 'red' : 'blue';
      ctx.fill();
      
      // Force vector
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'gold';
      ctx.stroke();
  }

  function loop() {
      draw();
      requestAnimationFrame(loop);
  }

  loop();
};
