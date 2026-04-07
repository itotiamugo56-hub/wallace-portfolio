import './styles/global.css';
import './styles/scroll-driven.css';
import './styles/view-transitions.css';
import './styles/command-palette.css';
import './styles/responsive.css';

import { initViewTransitions } from './scripts/view-transitions/registry';
import { initCommandPalette } from './scripts/command-palette/renderer';
import { initCursorPhysics } from './scripts/micro-interactions/cursor-physics';
import { initReducedMotion } from './scripts/performance/reduced-motion';
import commandActions from './data/command-actions.json';
import config from './data/config.json';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  // View Transitions for internal anchor navigation
  initViewTransitions();
  
  // Command palette (Cmd+K)
  initCommandPalette(commandActions);
  
  // Cursor physics (desktop only, respects reduced motion)
  if (window.matchMedia('(pointer: fine)').matches) {
    initCursorPhysics();
  }
  
  // Reduced motion detection
  initReducedMotion();
  
  // Floating action button (FAB) - View CV page
  const fab = document.getElementById('resume-fab');
  if (fab) {
    fab.addEventListener('click', () => {
      window.open('/cv.html', '_blank');
    });
  }
  
  // Copy email button
  document.querySelectorAll('[data-action="copy-email"]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(config.contact.email);
      showToast('Email copied to clipboard');
    });
  });
  
  // Mailto email button (opens email client)
  document.querySelectorAll('[data-action="mailto-email"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = `mailto:${config.contact.email}`;
    });
  });

    // WhatsApp button
  document.querySelectorAll('[data-action="whatsapp"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open('https://wa.me/254703533346', '_blank');
    });
  });
  
  // View CV button (styled page)
  document.querySelectorAll('[data-action="view-cv"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open('/cv.html', '_blank');
    });
  });
  
  // Full work history (GitHub/long CV)
  document.querySelectorAll('[data-action="full-history"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(config.resume.longVersionUrl, '_blank');
    });
  });
});

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}