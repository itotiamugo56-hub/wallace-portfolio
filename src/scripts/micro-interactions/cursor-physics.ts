export function initCursorPhysics(): void {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-physics';
  cursor.style.cssText = `
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid #2563eb;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
    transition: transform 0.1s ease;
    will-change: transform;
  `;
  document.body.appendChild(cursor);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function spring(): void {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
    
    requestAnimationFrame(spring);
  }
  
  spring();
  
  // Scale on hover over interactive elements
  const interactive = document.querySelectorAll('button, a, .command-item, .contact-btn');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px) scale(1.5)`;
      cursor.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px) scale(1)`;
      cursor.style.opacity = '0.4';
    });
  });
}