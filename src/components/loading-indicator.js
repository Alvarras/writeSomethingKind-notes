// Loading indicator custom element
class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Create container
    const container = document.createElement('div');
    container.className = 'loading-container';

    // Create spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    // Add spinner to container
    container.appendChild(spinner);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          z-index: 9999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .loading-container[data-loading="true"] {
          opacity: 1;
        }
        
        .loading-spinner {
          height: 100%;
          width: 100%;
          background: linear-gradient(to right, #bd34fe, #41d1ff);
          animation: loading 1.5s infinite ease-in-out;
          transform-origin: 0% 50%;
        }
        
        @keyframes loading {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0);
            transform-origin: 100% 50%;
          }
        }
      `;

    shadow.appendChild(style);
    shadow.appendChild(container);

    this.container = container;
  }

  static get observedAttributes() {
    return ['loading'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'loading') {
      this.container.setAttribute('data-loading', newValue === 'true');
    }
  }

  connectedCallback() {
    // Set default state
    if (!this.hasAttribute('loading')) {
      this.setAttribute('loading', 'false');
    }
  }
}

customElements.define('loading-indicator', LoadingIndicator);
