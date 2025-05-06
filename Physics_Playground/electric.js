function electricSimulator() {
    const canvas = document.getElementById('electricCanvas');
    const ctx = canvas.getContext('2d');
  
    const charges = [
      { x: 200, y: 200, q: 1 },
      { x: 400, y: 200, q: -1 }
    ];
  
    function drawField() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y += 20) {
        for (let x = 0; x < canvas.width; x += 20) {
          let fx = 0, fy = 0;
          charges.forEach(c => {
            const dx = c.x - x, dy = c.y - y, r2 = dx * dx + dy * dy;
            const f = c.q / r2;
            fx += f * dx;
            fy += f * dy;
          });
          const angle = Math.atan2(fy, fx);
          ctx.strokeStyle = '#fff';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 5 * Math.cos(angle), y + 5 * Math.sin(angle));
          ctx.stroke();
        }
      }
    }
    drawField();
  }
  