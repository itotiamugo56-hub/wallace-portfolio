export function initViewTransitions(): void {
  // Intercept all internal anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', async (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Use View Transitions API if supported
      if (document.startViewTransition) {
        await document.startViewTransition(() => {
          targetElement.scrollIntoView({ behavior: 'instant' });
        }).ready;
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Update active chapter marker based on scroll position
  const sections = document.querySelectorAll('.section');
  const markers = document.querySelectorAll('.marker');
  
  const updateActiveMarker = () => {
    const scrollPosition = window.scrollY + 200;
    let activeIndex = 0;
    
    sections.forEach((section, idx) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      if (scrollPosition >= sectionTop) {
        activeIndex = idx;
      }
    });
    
    markers.forEach((marker, idx) => {
      if (idx === activeIndex) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });
  };
  
  window.addEventListener('scroll', updateActiveMarker);
  updateActiveMarker();
}