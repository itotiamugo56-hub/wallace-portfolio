export function initReducedMotion(): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReduced.matches) {
    // Disable cursor physics
    const cursor = document.querySelector('.cursor-physics');
    cursor?.remove();
    
    // Disable scroll-driven animations via CSS
    const style = document.createElement('style');
    style.textContent = `
      .section {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .metric-badge {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  prefersReduced.addEventListener('change', (e) => {
    if (e.matches) {
      window.location.reload();
    }
  });
}