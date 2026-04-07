import Fuse from 'fuse.js';
import type { CommandAction } from './types';

let isOpen = false;
let selectedIndex = 0;
let currentActions: CommandAction[] = [];
let fuse: Fuse<CommandAction>;

// DOM element references (initialized after check)
let paletteElement: HTMLElement;
let inputElement: HTMLInputElement;
let resultsContainerElement: HTMLElement;

function showToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function executeAction(action: CommandAction, closePaletteFn: () => void): void {
  const handler = action.handler;
  
  if (handler === 'mailto' && action.value) {
    window.location.href = `mailto:${action.value}`;
    closePaletteFn();
    return;
  }
  
  if (handler === 'clipboard' && action.clipboard) {
    navigator.clipboard.writeText(action.clipboard);
    showToast('Copied to clipboard');
    closePaletteFn();
    return;
  }
  
  if (action.url) {
    window.open(action.url, '_blank');
    closePaletteFn();
    return;
  }
  
  if (action.clipboard) {
    navigator.clipboard.writeText(action.clipboard);
    showToast('Copied to clipboard');
    closePaletteFn();
    return;
  }
  
  console.warn('No valid action handler found for:', action);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function initCommandPalette(actions: CommandAction[]): void {
  currentActions = actions;
  fuse = new Fuse(actions, {
    keys: ['label'],
    threshold: 0.3,
  });
  
  const palette = document.getElementById('command-palette');
  const input = document.getElementById('command-input') as HTMLInputElement | null;
  const resultsContainer = document.getElementById('command-results');
  
  // Guard clauses - exit if any required element missing
  if (!palette || !input || !resultsContainer) {
    console.error('Command palette elements not found');
    return;
  }
  
  // Assign to module-level variables (non-null after guard)
  paletteElement = palette;
  inputElement = input;
  resultsContainerElement = resultsContainer;
  
  let closePalette: () => void;
  
  function renderResults(actionsList: CommandAction[]): void {
    resultsContainerElement.innerHTML = actionsList.map((action, idx) => `
      <div class="command-item ${idx === selectedIndex ? 'selected' : ''}" data-index="${idx}">
        <span class="command-label">${escapeHtml(action.label)}</span>
        ${action.shortcut ? `<span class="command-shortcut">${escapeHtml(action.shortcut)}</span>` : ''}
      </div>
    `).join('');
    
    // Add click handlers
    resultsContainerElement.querySelectorAll('.command-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        const action = actionsList[idx];
        if (action) {
          executeAction(action, closePalette);
        }
      });
    });
  }
  
  function updateSelection(): void {
    const items = resultsContainerElement.querySelectorAll('.command-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }
  
  function openPalette(): void {
    isOpen = true;
    paletteElement.setAttribute('aria-hidden', 'false');
    inputElement.value = '';
    selectedIndex = 0;
    renderResults(currentActions);
    inputElement.focus();
    
    setTimeout(() => {
      document.addEventListener('click', outsideClickHandler);
    }, 0);
  }
  
  closePalette = (): void => {
    isOpen = false;
    paletteElement.setAttribute('aria-hidden', 'true');
    document.removeEventListener('click', outsideClickHandler);
  };
  
  function togglePalette(): void {
    if (isOpen) {
      closePalette();
    } else {
      openPalette();
    }
  }
  
  function outsideClickHandler(e: MouseEvent): void {
    const container = document.querySelector('.command-container');
    if (container && !container.contains(e.target as Node)) {
      closePalette();
    }
  }
  
  // Keyboard shortcut: Cmd+K / Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette();
    }
    
    if (e.key === 'Escape' && isOpen) {
      closePalette();
    }
    
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, currentActions.length - 1);
      updateSelection();
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection();
    }
    
    if (e.key === 'Enter' && currentActions[selectedIndex]) {
      e.preventDefault();
      executeAction(currentActions[selectedIndex], closePalette);
    }
  });
  
  // Live search
  inputElement.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    let filteredActions: CommandAction[];
    
    if (!query.trim()) {
      filteredActions = currentActions;
    } else {
      filteredActions = fuse.search(query).map(r => r.item);
    }
    
    renderResults(filteredActions);
    selectedIndex = 0;
  });
}