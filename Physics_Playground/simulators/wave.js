function waveSimulator() {
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
  
    function animate() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.strokeStyle = '#fff';
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 50 * Math.sin(0.02 * x + t) + 50 * Math.sin(0.04 * x + t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
  
      t += 0.05;
      requestAnimationFrame(animate);
    }
    animate();
  }
  