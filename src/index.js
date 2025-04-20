// Main entry point for webpack
import './css/style.css';
import './components/note-card';
import './components/note-input';
import './components/app-header';
import './components/app-footer';
import './components/loading-indicator';
import './components/note-detail-modal';
import { fetchNotes, fetchArchivedNotes } from './utils/api';

// Global state
window.notesData = [];
window.archivedNotesData = [];
window.currentView = 'active'; // 'active', 'archived', or 'add'

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing app...');

  // Set up theme
  initializeTheme();

  // Create note detail modal
  createNoteDetailModal();

  // Load initial notes
  await loadNotes();

  // Initialize view content
  updateViewContent();
});

// Initialize theme based on saved preference
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else {
    localStorage.setItem('theme', 'dark');
  }
  updateCSSVariables();
}

// Create note detail modal
function createNoteDetailModal() {
  const modal = document.createElement('note-detail-modal');
  document.body.appendChild(modal);

  // Expose function to show modal
  window.showNoteDetailModal = note => {
    modal.showModal(note);
  };
}

// Update CSS variables based on current theme
function updateCSSVariables() {
  const isLightTheme = document.documentElement.classList.contains('light-theme');

  if (isLightTheme) {
    document.documentElement.style.setProperty('--primary-color', '#f5f5f5');
    document.documentElement.style.setProperty('--card-color', '#ffffff');
    document.documentElement.style.setProperty('--border-color', '#cccccc');
    document.documentElement.style.setProperty('--text-color', '#333333');
    document.documentElement.style.setProperty('--darker-text-color', '#555555');
    document.documentElement.style.setProperty('--background-dot-color', '#dddddd');
    document.documentElement.style.setProperty('--placeholder-color', 'rgba(100, 100, 100, 0.7)');
    document.documentElement.style.setProperty('--date-color', 'rgb(120, 120, 120)');
    document.documentElement.style.setProperty('--card-shadow', '0 2px 8px rgba(0, 0, 0, 0.1)');
    document.documentElement.style.setProperty(
      '--card-hover-shadow',
      '0 4px 12px rgba(0, 0, 0, 0.15)'
    );
  } else {
    document.documentElement.style.setProperty('--primary-color', '#101010');
    document.documentElement.style.setProperty('--card-color', '#1e1e1e');
    document.documentElement.style.setProperty('--border-color', '#3a3a3a');
    document.documentElement.style.setProperty('--text-color', 'rgb(249, 249, 249)');
    document.documentElement.style.setProperty('--darker-text-color', 'rgb(227, 227, 227)');
    document.documentElement.style.setProperty('--background-dot-color', '#2c2c2c');
    document.documentElement.style.setProperty('--placeholder-color', 'rgba(227, 227, 227, 0.7)');
    document.documentElement.style.setProperty('--date-color', 'rgb(180, 180, 180)');
    document.documentElement.style.setProperty('--card-shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
    document.documentElement.style.setProperty(
      '--card-hover-shadow',
      '0 4px 12px rgba(0, 0, 0, 0.5)'
    );
  }
}

// Toggle theme function (exposed globally)
window.toggleTheme = () => {
  const isLightTheme = document.documentElement.classList.toggle('light-theme');
  const newTheme = isLightTheme ? 'light' : 'dark';

  // Save preference
  localStorage.setItem('theme', newTheme);

  // Update CSS variables
  updateCSSVariables();

  return newTheme;
};

// Update view content based on current view
const updateViewContent = () => {
  const notesContainer = document.getElementById('notes-container');
  const inputForm = document.querySelector('app-input');

  if (window.currentView === 'active') {
    notesContainer.style.display = 'grid';
    inputForm.style.display = 'none';
    renderNotes();
  } else if (window.currentView === 'archived') {
    notesContainer.style.display = 'grid';
    inputForm.style.display = 'none';
    renderNotes();
  } else if (window.currentView === 'add') {
    notesContainer.style.display = 'none';
    inputForm.style.display = 'block';
  }
};

// Load notes from API
async function loadNotes() {
  try {
    // Show loading indicator
    document.querySelector('loading-indicator').setAttribute('loading', 'true');

    // Fetch active notes
    const activeNotes = await fetchNotes();
    window.notesData = activeNotes;

    // Fetch archived notes
    const archivedNotes = await fetchArchivedNotes();
    window.archivedNotesData = archivedNotes;

    // Render notes based on current view
    renderNotes();
  } catch (error) {
    showErrorMessage('Failed to load notes. Please try again later.');
    console.error('Error loading notes:', error);
  } finally {
    // Hide loading indicator
    document.querySelector('loading-indicator').setAttribute('loading', 'false');
  }
}

// Render notes based on current view
const renderNotes = () => {
  const container = document.getElementById('notes-container');

  if (!container) {
    console.error('Notes container not found!');
    return;
  }

  container.innerHTML = '';

  const notesToRender =
    window.currentView === 'active' ? window.notesData : window.archivedNotesData;

  if (!notesToRender || notesToRender.length === 0) {
    container.innerHTML = `
      <p style="color: var(--text-color); text-align: center; grid-column: 1 / -1; margin-top: 40px;">
        No ${window.currentView === 'active' ? 'active' : 'archived'} notes available.
      </p>
    `;
    return;
  }

  notesToRender.forEach(note => {
    const noteCard = document.createElement('note-card');
    noteCard.setAttribute('id', note.id);
    noteCard.setAttribute('title', note.title);
    noteCard.setAttribute('body', note.body);
    noteCard.setAttribute('created-at', note.createdAt);
    noteCard.setAttribute('archived', note.archived.toString());
    container.appendChild(noteCard);
  });
};

// Show error message
const showErrorMessage = (message, type = 'error') => {
  const errorContainer = document.getElementById('error-container');

  if (!errorContainer) {
    // Create error container if it doesn't exist
    const newErrorContainer = document.createElement('div');
    newErrorContainer.id = 'error-container';
    document.body.appendChild(newErrorContainer);

    // Style the error container
    newErrorContainer.style.position = 'fixed';
    newErrorContainer.style.top = '20px';
    newErrorContainer.style.left = '50%';
    newErrorContainer.style.transform = 'translateX(-50%)';
    newErrorContainer.style.backgroundColor = type === 'success' ? '#52c41a' : '#ff4d4f';
    newErrorContainer.style.color = 'white';
    newErrorContainer.style.padding = '12px 20px';
    newErrorContainer.style.borderRadius = '8px';
    newErrorContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    newErrorContainer.style.zIndex = '1000';
    newErrorContainer.style.maxWidth = '80%';
    newErrorContainer.style.textAlign = 'center';
    newErrorContainer.style.animation = 'slideDown 0.3s ease-out';

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Show the error message
    newErrorContainer.textContent = message;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      newErrorContainer.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => {
        if (newErrorContainer.parentNode) {
          newErrorContainer.parentNode.removeChild(newErrorContainer);
        }
      }, 500);
    }, 5000);
  } else {
    // Update existing error container
    errorContainer.textContent = message;
    errorContainer.style.backgroundColor = type === 'success' ? '#52c41a' : '#ff4d4f';
    errorContainer.style.animation = 'none';
    void errorContainer.offsetWidth; // Trigger reflow
    errorContainer.style.animation = 'slideDown 0.3s ease-out';

    // Reset auto-hide timer
    clearTimeout(errorContainer.hideTimeout);
    errorContainer.hideTimeout = setTimeout(() => {
      errorContainer.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => {
        if (errorContainer.parentNode) {
          errorContainer.parentNode.removeChild(errorContainer);
        }
      }, 500);
    }, 5000);
  }
};

// Add these lines after the function definitions to expose them globally
window.showErrorMessage = showErrorMessage;
window.renderNotes = renderNotes;
window.updateViewContent = updateViewContent;
