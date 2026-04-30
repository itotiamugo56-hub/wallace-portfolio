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
  
  // Command palette (Cmd+K) with repair shop action
  const enhancedCommandActions = [
    ...commandActions,
    {
      id: 'repair-shop-project',
      label: 'View Repair Shop Project Details',
      description: 'Offline-first ticketing with thermal printing and WhatsApp',
      action: 'open-repair-shop',
      shortcut: 'R'
    },
    {
      id: 'repair-shop-github',
      label: 'GitHub - Repair Shop Platform',
      description: 'View source code (if public) or request access',
      action: 'open-repair-shop-repo',
      shortcut: 'G R'
    },
    {
      id: 'logistics-coordinator-project',
      label: 'logistics-coordinator Offline-First Platform',
      description: 'CRDT sync, WebAuthn, H3 geospatial',
      action: 'open-logistics-coordinator',
      shortcut: 'L'
    },
    {
      id: 'observability-demo',
      label: 'Observability Demo API',
      description: 'Live /health, /trace, /docs endpoints',
      action: 'open-observability-demo',
      shortcut: 'O'
    },
    {
      id: 'analytics-platform',
      label: 'Educational Analytics Platform',
      description: 'Multi-tenant M0-M3 analytics + alert engine (FastAPI, asyncpg, JWT)',
      action: 'open-analytics-platform',
      shortcut: 'A'
    }
  ];
  
  initCommandPalette(enhancedCommandActions);
  
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
  
  // Custom action handlers for command palette
  window.addEventListener('command-palette-action', ((event: CustomEvent) => {
    const action = event.detail?.action;
    switch (action) {
      case 'open-repair-shop':
        // Scroll to repair shop project section
        const repairShopSection = document.getElementById('repair-shop-project');
        if (repairShopSection) {
          repairShopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast('📱 Repair Shop Platform — offline-first, ESC/POS thermal printing, Twilio WhatsApp');
        } else {
          // Fallback: open external project page (if hosted)
          window.open('/#repair-shop-project', '_self');
        }
        break;
      case 'open-repair-shop-repo':
        // Replace with actual GitHub repo URL if public
        showToast('🔒 Source code available upon request — proprietary client project');
        // Optional: window.open('https://github.com/yourusername/repair-shop-platform', '_blank');
        break;
      case 'open-logistics-coordinator':
        const logisticsSection = document.getElementById('featured-project');
        if (logisticsSection) {
          logisticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast('🗺️ logistics-coordinator Offline-First Platform — hierarchical delegation, CRDT sync, H3 geospatial');
        }
        break;
      case 'open-observability-demo':
        window.open('https://wallace-observability-demo.onrender.com', '_blank');
        break;
      case 'open-analytics-platform':
        window.open('https://github.com/itotiamugo56-hub/educational-analytics-platform', '_blank');
        showToast('📊 Educational Analytics Platform — M0-M3 analytics, multi-tenant, 45ms alerts');
        break;
    }
  }) as EventListener);
});

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}