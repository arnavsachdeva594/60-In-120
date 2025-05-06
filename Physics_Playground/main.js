document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'projectile') projectileSimulator();
    if (page === 'pendulum') pendulumSimulator();
    if (page === 'wave') waveSimulator();
    if (page === 'electric') electricSimulator();
    if (page === 'magnetic') magneticSimulator();
  });
  