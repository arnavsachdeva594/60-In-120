function pendulumSimulator() {
    const canvas = document.getElementById('pendulumCanvas');
    const ctx = canvas.getContext('2d');
    const origin = { x: canvas.width / 2, y: 50 };
    let angle = Math.PI / 4, angleV = 0, angleA = 0, g = 0.4, length = 150;
  
    function animate() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      angleA = (-1 * g / length) * Math.sin(angle);
      angleV += angleA;
      angle += angleV;
      angleV *= 0.99;
  
      const bobX = origin.x + length * Math.sin(angle);
      const bobY = origin.y + length * Math.cos(angle);
  
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
  
      ctx.beginPath();
      ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
  
      requestAnimationFrame(animate);
    }
    animate();
  }
  