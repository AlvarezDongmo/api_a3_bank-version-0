window.onload = function() {
  setTimeout(() => {
    const topbar = document.querySelector('.swagger-ui .topbar-wrapper');
    if (topbar) {
      const btn = document.createElement('a');
      btn.href = '/cahier';
      btn.target = '_blank';
      btn.className = 'cahier-btn';
      btn.innerHTML = '📄 Cahier des charges';
      topbar.appendChild(btn);
    }
  }, 500);
};