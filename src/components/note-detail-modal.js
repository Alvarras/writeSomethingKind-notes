// Note detail modal custom element
class NoteDetailModal extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Create container
    const container = document.createElement('div');
    container.className = 'modal-container';
    container.setAttribute('role', 'dialog');
    container.setAttribute('aria-modal', 'true');

    // Create modal content
    container.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="close-button" aria-label="Close modal">×</button>
          <h2 class="note-title"></h2>
          <div class="note-meta">
            <span class="note-date"></span>
            <span class="note-status"></span>
          </div>
          <div class="note-body"></div>
        </div>
      `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .modal-container.active {
          opacity: 1;
          visibility: visible;
        }
        
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
        }
        
        .modal-content {
          position: relative;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          background-color: var(--card-color, #1e1e1e);
          color: var(--text-color, rgb(249, 249, 249));
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 1001;
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }
        
        .modal-container.active .modal-content {
          transform: translateY(0);
        }
        
        .close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-color, rgb(249, 249, 249));
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .close-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .note-title {
          font-size: 24px;
          margin-bottom: 10px;
          padding-right: 30px;
        }
        
        .note-meta {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--date-color, rgb(180, 180, 180));
          margin-bottom: 20px;
        }
        
        .note-status {
          padding: 2px 8px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .note-body {
          line-height: 1.6;
        }
        
        /* For light theme */
        :host-context(.light-theme) .modal-content {
          background-color: var(--card-color, #ffffff);
          color: var(--text-color, #333333);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        :host-context(.light-theme) .close-button {
          color: var(--text-color, #333333);
        }
        
        :host-context(.light-theme) .close-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        :host-context(.light-theme) .note-meta {
          color: var(--date-color, rgb(120, 120, 120));
        }
        
        :host-context(.light-theme) .note-status {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    // Store references
    this.container = container;
    this.overlay = container.querySelector('.modal-overlay');
    this.closeButton = container.querySelector('.close-button');
    this.titleElement = container.querySelector('.note-title');
    this.dateElement = container.querySelector('.note-date');
    this.statusElement = container.querySelector('.note-status');
    this.bodyElement = container.querySelector('.note-body');

    // Bind event handlers
    this.handleClose = this.handleClose.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  connectedCallback() {
    // Add event listeners
    this.closeButton.addEventListener('click', this.handleClose);
    this.overlay.addEventListener('click', this.handleClose);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    // Remove event listeners
    this.closeButton.removeEventListener('click', this.handleClose);
    this.overlay.removeEventListener('click', this.handleClose);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  // Show modal with note data
  showModal(note) {
    // Format date
    const date = new Date(note.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Set content
    this.titleElement.textContent = note.title;
    this.dateElement.textContent = `Created on: ${date}`;
    this.statusElement.textContent = note.archived ? 'Archived' : 'Active';
    this.bodyElement.innerHTML = note.body;

    // Show modal
    this.container.classList.add('active');

    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
  }

  // Hide modal
  hideModal() {
    this.container.classList.remove('active');

    // Restore body scrolling
    document.body.style.overflow = '';
  }

  // Handle close button click
  handleClose() {
    this.hideModal();
  }

  // Handle ESC key press
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.hideModal();
    }
  }
}

// Register custom element
customElements.define('note-detail-modal', NoteDetailModal);
