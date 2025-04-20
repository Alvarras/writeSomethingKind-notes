// Custom element for note input
class NoteInput extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.className = 'input-container';

    const form = document.createElement('form');
    form.innerHTML = `
      <h2 class="input-title">Add New Note</h2>
      <input type="text" placeholder="Title" id="note-title" class="input-field" required>
      <textarea placeholder="Your Notes." id="note-body" class="input-field" required></textarea>
      <button type="submit" id="add-button" class="add-button">Add Note</button>
    `;

    // Add form to container
    container.appendChild(form);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .input-title {
        font-size: 1.5em;
        margin-bottom: 15px;
        color: var(--text-color, rgb(249, 249, 249));
      }

      textarea {
        min-height: fit-content;
        resize: none;
        min-width: 90%;
        overflow-wrap: break-word;
      }

      .input-container {
        border: 2px solid var(--border-color, #3a3a3a);
        background-color: var(--card-color, #1e1e1e);
        border-radius: 10px;
        margin: auto;
        width: 85%;
        max-width: 1000px;
        height: 300px;
        padding: 20px;
        transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.3));
        margin-bottom: 30px;
      }
      
      .input-container:focus-within {
        transform: translateY(-2px);
        box-shadow: var(--card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.5));
      }
      
      .input-field {
        border: none;
        background-color: var(--card-color, #1e1e1e);
        color: var(--text-color, rgb(249, 249, 249));
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        transition: background-color 0.3s ease, color 0.3s ease;
        border-radius: 5px;
      }

      .input-field:focus {
        outline: 1px solid var(--border-color, #3a3a3a);
        background-color: rgba(255, 255, 255, 0.05);
      }

      #note-title {
        height: 25px;
        font-size: 1.2em;
      }

      #note-body {
        height: 150px;
      }

      #note-title::placeholder, #note-body::placeholder {
        color: var(--placeholder-color, rgba(227, 227, 227, 0.7));
      }

      .add-button {
        background: radial-gradient(141.42% 141.42% at 100% 0%, #fff6, #fff0), radial-gradient(140.35% 140.35% at 100% 94.74%, #bd34fe, #bd34fe00), radial-gradient(89.94% 89.94% at 18.42% 15.79%, #41d1ff, #41d1ff00);
        box-shadow: 0 1px #ffffffbf inset;
        padding: 10px 20px;
        border-radius: 7px;
        border: none;
        font-family: 'Readex Pro', sans-serif;
        font-weight: 500;
        color: var(--text-color, rgb(249, 249, 249));
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .add-button:hover {
        transform: scale(1.01);
        background: radial-gradient(141.42% 141.42% at 100% 0%,#ffffff80,#fff0),radial-gradient(140.35% 140.35% at 100% 94.74%,#bd34fe,#bd34fe00),radial-gradient(89.94% 89.94% at 18.42% 15.79%,#41d1ff,#41d1ff00);
        box-shadow: 0 1.5px #fffc inset;
      }

      /* For light theme */
      :host-context(.light-theme) .input-container {
        background-color: var(--card-color, #ffffff);
        border-color: var(--border-color, #cccccc);
      }
      
      :host-context(.light-theme) .input-field {
        background-color: var(--card-color, #ffffff);
        color: var(--text-color, #333333);
      }
      
      :host-context(.light-theme) .input-field:focus {
        background-color: rgba(0, 0, 0, 0.02);
      }
      
      :host-context(.light-theme) .input-title {
        color: var(--text-color, #333333);
      }
      
      :host-context(.light-theme) #note-title::placeholder, 
      :host-context(.light-theme) #note-body::placeholder {
        color: var(--placeholder-color, rgba(100, 100, 100, 0.7));
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    this.form = form;
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const titleInput = this.shadowRoot.querySelector('#note-title');
    const bodyInput = this.shadowRoot.querySelector('#note-body');

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
      window.showErrorMessage('Please fill in both title and body fields.');
      return;
    }

    // Format body text with line breaks
    const formattedBody = body.replace(/\n/g, '<br>');

    try {
      // Show loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'true');

      // Import API functions dynamically to avoid circular dependencies
      const { createNote, fetchNotes } = await import('../utils/api.js');

      // Create new note
      const newNote = await createNote(title, formattedBody);

      // Reset form
      this.form.reset();

      // Show success message
      window.showErrorMessage('Note created successfully!', 'success');

      // Refresh notes data
      const activeNotes = await fetchNotes();
      window.notesData = activeNotes;

      // Re-render notes
      window.renderNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      window.showErrorMessage('Failed to create note. Please try again.');
    } finally {
      // Hide loading indicator
      document.querySelector('loading-indicator').setAttribute('loading', 'false');
    }
  }
}

// Register custom element
customElements.define('app-input', NoteInput);
