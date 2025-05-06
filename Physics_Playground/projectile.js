function projectileSimulator() {
    const canvas = document.getElementById('projectileCanvas');
    const ctx = canvas.getContext('2d');
    let x = 0, y = canvas.height, vx = 5, vy = -15, g = 0.5;
  
    function animate() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
  
      x += vx;
      y += vy;
      vy += g;
  
      if (y > canvas.height) {
        x = 0; y = canvas.height; vy = -15;
      }
  
      requestAnimationFrame(animate);
    }
    animate();
  }
  