function magneticSimulator() {
    const canvas = document.getElementById('magneticCanvas');
    const ctx = canvas.getContext('2d');
    let angle = 0;
  
    function animate() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.strokeStyle = '#fff';
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 20 + i * 15, 0, Math.PI * 2);
        ctx.stroke();
      }
  
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.strokeStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(0, -100);
      ctx.lineTo(0, 100);
      ctx.stroke();
      ctx.restore();
  
      angle += 0.01;
      requestAnimationFrame(animate);
    }
    animate();
  }
  