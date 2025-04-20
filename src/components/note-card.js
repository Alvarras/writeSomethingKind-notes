// Custom element for note card
class NoteCard extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // Create template
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="note-card">
          <div class="note-title"></div>
          <br>
          <div class="note-body"></div>
          <br>
          <div class="note-date"></div>
          <div class="note-actions">
            <button class="action-button archive-button" title="Archive/Unarchive Note">
              <span class="action-icon">📁</span>
            </button>
            <button class="action-button delete-button" title="Delete Note">
              <span class="action-icon">🗑️</span>
            </button>
            <button class="action-button view-button" title="View Note Details">
              <span class="action-icon">👁️</span>
            </button>
          </div>
        </div>
      `;

    // Create styles
    const style = document.createElement('style');
    style.textContent = `
        .note-card {
          font-family: 'Readex Pro', sans-serif;
          color: var(--text-color, rgb(249, 249, 249));
          border: 2px solid var(--border-color, #3a3a3a);
          background-color: var(--card-color, #1e1e1e);
          border-radius: 10px;
          width: 100%;
          height: fit-content;
          min-height: 105px;
          padding: 20px;
          box-sizing: border-box;
          box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s ease, box-shadow 0.3s ease, 
                      background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          position: relative;
          cursor: pointer;
        }
  
        .note-card:hover {
          transform: scale(1.01);
          box-shadow: var(--card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.5));
        }
  
        .note-title {    
          font-size: 1.5em;
          font-weight: 500;
        }
        
        .note-body {
          color: var(--darker-text-color, rgb(227, 227, 227));
          max-height: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        
        .note-date {
          font-size: 0.7em;
          color: var(--date-color, rgb(180, 180, 180));
        }
  
        .note-actions {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
  
        .note-card:hover .note-actions {
          opacity: 1;
        }
  
        .action-button {
          background: none;
          border: 1px solid var(--border-color, #3a3a3a);
          border-radius: 4px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
  
        .action-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
  
        .action-icon {
          font-size: 16px;
        }
  
        /* For light theme */
        :host-context(.light-theme) .note-card {
          background-color: var(--card-color, #ffffff);
          border-color: var(--border-color, #cccccc);
          color: var(--text-color, #333333);
        }
        
        :host-context(.light-theme) .note-body {
          color: var(--darker-text-color, #555555);
        }
        
        :host-context(.light-theme) .note-date {
          color: var(--date-color, rgb(120, 120, 120));
        }
  
        :host-context(.light-theme) .action-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `;

    // Add template and styles to shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(template.content.cloneNode(true));

    // Store references to elements
    this.noteCard = shadow.querySelector('.note-card');
    this.titleElement = shadow.querySelector('.note-title');
    this.bodyElement = shadow.querySelector('.note-body');
    this.dateElement = shadow.querySelector('.note-date');
    this.archiveButton = shadow.querySelector('.archive-button');
    this.deleteButton = shadow.querySelector('.delete-button');
    this.viewButton = shadow.querySelector('.view-button');

    // Bind event handlers
    this.handleArchiveClick = this.handleArchiveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleViewClick = this.handleViewClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  // When element is connected to DOM
  connectedCallback() {
    // Get attribute values
    this.noteId = this.getAttribute('id');
    const title = this.getAttribute('title') || 'No Title';
    const body = this.getAttribute('body') || 'No Content';
    const createdAt = this.getAttribute('created-at') || new Date().toISOString();
    const archived = this.getAttribute('archived') === 'true';

    // Format date
    const date = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Set content
    this.titleElement.textContent = title;
    this.bodyElement.innerHTML = body;
    this.dateElement.textContent = `Created on: ${date}`;

    // Update archive button based on archived status
    this.updateArchiveButton(archived);

    // Add event listeners
    this.archiveButton.addEventListener('click', this.handleArchiveClick);
    this.deleteButton.addEventListener('click', this.handleDeleteClick);
    this.viewButton.addEventListener('click', this.handleViewClick);
    this.noteCard.addEventListener('click', this.handleCardClick);

    // Add animation when the card is first added
    this.noteCard.style.animation = 'fadeIn 0.3s ease-out';
  }

  // When element is disconnected from DOM
  disconnectedCallback() {
    // Remove event listeners
    this.archiveButton.removeEventListener('click', this.handleArchiveClick);
    this.deleteButton.removeEventListener('click', this.handleDeleteClick);
    this.viewButton.removeEventListener('click', this.handleViewClick);
    this.noteCard.removeEventListener('click', this.handleCardClick);
  }

  // Update archive button based on archived status
  updateArchiveButton(archived) {
    const archiveIcon = this.archiveButton.querySelector('.action-icon');

    if (archived) {
      archiveIcon.textContent = '📂'; // Open folder icon for unarchive
      this.archiveButton.title = 'Unarchive Note';
    } else {
      archiveIcon.textContent = '📁'; // Closed folder icon for archive
      this.archiveButton.title = 'Archive Note';
    }
  }

  // Handle archive/unarchive button click
  async handleArchiveClick(event) {
    event.stopPropagation();

    try {
      const noteId = this.noteId;
      const isArchived = this.getAttribute('archived') === 'true';

      // Show loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'true');

      // Import API functions dynamically to avoid circular dependencies
      const { archiveNote, unarchiveNote, fetchNotes, fetchArchivedNotes } = await import(
        '../utils/api.js'
      );

      if (isArchived) {
        // Unarchive note
        await unarchiveNote(noteId);
        window.showErrorMessage('Note unarchived successfully!', 'success');
      } else {
        // Archive note
        await archiveNote(noteId);
        window.showErrorMessage('Note archived successfully!', 'success');
      }

      // Refresh notes data
      const activeNotes = await fetchNotes();
      window.notesData = activeNotes;

      const archivedNotes = await fetchArchivedNotes();
      window.archivedNotesData = archivedNotes;

      // Re-render notes
      window.renderNotes();
    } catch (error) {
      console.error('Error archiving/unarchiving note:', error);
      window.showErrorMessage('Failed to archive/unarchive note. Please try again.');
    } finally {
      // Hide loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'false');
    }
  }

  // Handle delete button click
  async handleDeleteClick(event) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const noteId = this.noteId;

      // Show loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'true');

      // Import API functions dynamically to avoid circular dependencies
      const { deleteNote, fetchNotes, fetchArchivedNotes } = await import('../utils/api.js');

      // Delete note
      await deleteNote(noteId);
      window.showErrorMessage('Note deleted successfully!', 'success');

      // Refresh notes data
      const activeNotes = await fetchNotes();
      window.notesData = activeNotes;

      const archivedNotes = await fetchArchivedNotes();
      window.archivedNotesData = archivedNotes;

      // Re-render notes
      window.renderNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      window.showErrorMessage('Failed to delete note. Please try again.');
    } finally {
      // Hide loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'false');
    }
  }

  // Handle view button click
  async handleViewClick(event) {
    event.stopPropagation();
    this.showNoteDetail();
  }

  // Handle card click
  handleCardClick(event) {
    this.showNoteDetail();
  }

  // Show note detail
  async showNoteDetail() {
    try {
      const noteId = this.noteId;

      // Show loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'true');

      // Import API function
      const { getNote } = await import('../utils/api.js');

      // Get note details
      const note = await getNote(noteId);

      // Create or update note detail modal
      window.showNoteDetailModal(note);
    } catch (error) {
      console.error('Error getting note details:', error);
      window.showErrorMessage('Failed to load note details. Please try again.');
    } finally {
      // Hide loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'false');
    }
  }
}

// Register custom element
customElements.define('note-card', NoteCard);
