// Header custom element
class AppHeader extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    container.className = 'header-container';

    const profileIcon = document.createElement('div');
    profileIcon.className = 'profile-icon';

    const iconImage = this.getAttribute('icon-image');
    if (iconImage) {
      profileIcon.style.backgroundImage = `url('${iconImage}')`;
      profileIcon.style.backgroundSize = 'cover';
    }

    const title = document.createElement('span');
    title.className = 'header-title';
    title.textContent = 'Notes App';

    // View toggle buttons
    const viewToggle = document.createElement('div');
    viewToggle.className = 'view-toggle';
    viewToggle.innerHTML = `
      <button id="active-view-btn" class="view-btn active">Active Notes</button>
      <button id="archived-view-btn" class="view-btn">Archived Notes</button>
      <button id="add-view-btn" class="view-btn">Add Notes</button>
    `;

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.id = 'theme-toggle-btn';

    const currentTheme = localStorage.getItem('theme') || 'dark';
    console.log('Header initializing with theme:', currentTheme);

    if (currentTheme === 'light') {
      themeToggle.innerHTML = '☀️'; // Light mode icon
      themeToggle.setAttribute('data-theme', 'light');
    } else {
      themeToggle.innerHTML = '🌙'; // Dark mode icon
      themeToggle.setAttribute('data-theme', 'dark');
    }

    themeToggle.setAttribute('aria-label', 'Toggle light/dark theme');
    themeToggle.title = 'Toggle light/dark theme';

    // Add event listener to toggle theme
    themeToggle.addEventListener('click', () => {
      console.log('Theme toggle button clicked');

      // Get current theme before toggle
      const currentTheme = document.documentElement.classList.contains('light-theme')
        ? 'light'
        : 'dark';
      console.log('Current theme before toggle:', currentTheme);

      // Toggle theme using the global function
      const newTheme = window.toggleTheme();
      console.log('New theme after toggle:', newTheme);

      // Update button icon based on new theme
      if (newTheme === 'light') {
        themeToggle.innerHTML = '☀️';
        themeToggle.setAttribute('data-theme', 'light');
      } else {
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('data-theme', 'dark');
      }
    });

    container.appendChild(profileIcon);
    container.appendChild(title);
    container.appendChild(viewToggle);
    container.appendChild(themeToggle);

    // Styling to shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .header-container {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        background-color: var(--primary-color, #101010);
        border-bottom: 1px solid var(--border-color, #3a3a3a);
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 25px;
        transition: background-color 0.3s ease, border-color 0.3s ease;
      }
      
      .profile-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
        background-color: rgb(88, 88, 88); /* Default color if no image */
        background-size: cover;
        border: 2px solid var(--border-color, #3a3a3a);
      }
      
      .header-title {
        font-size: 20px;
        font-family: 'Readex Pro', sans-serif;
        font-weight: 500;
        color: var(--text-color, rgb(249, 249, 249));
        flex-grow: 1;
        transition: color 0.3s ease;
      }
      
      .view-toggle {
        display: flex;
        margin-right: 15px;
      }
      
      .view-btn {
        background: none;
        border: 1px solid var(--border-color, #3a3a3a);
        color: var(--text-color, rgb(249, 249, 249));
        padding: 8px 12px;
        cursor: pointer;
        font-family: 'Readex Pro', sans-serif;
        font-size: 14px;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      .view-btn:first-child {
        border-radius: 4px 0 0 4px;
      }
      
      .view-btn:last-child {
        border-radius: 0 4px 4px 0;
      }
      
      .view-btn:not(:first-child):not(:last-child) {
        border-left: none;
        border-right: none;
      }
      
      .view-btn.active {
        background-color: rgba(255, 255, 255, 0.1);
        font-weight: 500;
      }
      
      .view-btn:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      .theme-toggle {
        background: none;
        border: 1px solid var(--border-color, #3a3a3a);
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        transition: background-color 0.3s ease, border-color 0.3s ease;
      }
      
      .theme-toggle:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      /* For light theme */
      :host-context(.light-theme) .header-container {
        background-color: var(--primary-color, #f5f5f5);
        border-bottom: 1px solid var(--border-color, #cccccc);
      }
      
      :host-context(.light-theme) .header-title {
        color: var(--text-color, #333333);
      }
      
      :host-context(.light-theme) .view-btn {
        color: var(--text-color, #333333);
        border-color: var(--border-color, #cccccc);
      }
      
      :host-context(.light-theme) .view-btn.active {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      :host-context(.light-theme) .view-btn:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      
      :host-context(.light-theme) .theme-toggle:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .header-container {
          flex-wrap: wrap;
        }
        
        .view-toggle {
          order: 3;
          width: 100%;
          margin-top: 10px;
          margin-right: 0;
        }
        
        .view-btn {
          flex: 1;
        }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    // Add event listeners for view toggle buttons
    this.shadowRoot.querySelector('#active-view-btn').addEventListener('click', () => {
      if (window.currentView !== 'active') {
        window.currentView = 'active';
        this.updateViewButtons();
        window.updateViewContent();
      }
    });

    this.shadowRoot.querySelector('#archived-view-btn').addEventListener('click', () => {
      if (window.currentView !== 'archived') {
        window.currentView = 'archived';
        this.updateViewButtons();
        window.updateViewContent();
      }
    });

    this.shadowRoot.querySelector('#add-view-btn').addEventListener('click', () => {
      if (window.currentView !== 'add') {
        window.currentView = 'add';
        this.updateViewButtons();
        window.updateViewContent();
      }
    });
  }

  // Update view buttons based on current view
  updateViewButtons() {
    const activeViewBtn = this.shadowRoot.querySelector('#active-view-btn');
    const archivedViewBtn = this.shadowRoot.querySelector('#archived-view-btn');
    const addViewBtn = this.shadowRoot.querySelector('#add-view-btn');

    // Reset all buttons
    activeViewBtn.classList.remove('active');
    archivedViewBtn.classList.remove('active');
    addViewBtn.classList.remove('active');

    // Set active button based on current view
    if (window.currentView === 'active') {
      activeViewBtn.classList.add('active');
    } else if (window.currentView === 'archived') {
      archivedViewBtn.classList.add('active');
    } else if (window.currentView === 'add') {
      addViewBtn.classList.add('active');
    }
  }

  connectedCallback() {
    // Initialize view buttons based on current view
    this.updateViewButtons();
  }

  static get observedAttributes() {
    return ['icon-image'];
  }

  // Control changing
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'icon-image' && oldValue !== newValue) {
      const profileIcon = this.shadowRoot.querySelector('.profile-icon');
      if (newValue) {
        profileIcon.style.backgroundImage = `url('${newValue}')`;
        profileIcon.style.backgroundSize = 'cover';
      } else {
        profileIcon.style.backgroundImage = '';
        profileIcon.style.backgroundColor = '#007bff';
      }
    }
  }
}

customElements.define('app-header', AppHeader);
