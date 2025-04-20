// Footer custom element
class AppFooter extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Create container
    const container = document.createElement('footer');
    container.className = 'footer-container';

    // Set content
    container.innerHTML = `
        <div class="footer-content">
          <p class="copyright">© ${new Date().getFullYear()} Muhammad Rivqi Al Varras. All rights reserved.</p>
          <div class="social-links">
            <a href="https://www.linkedin.com/in/al-varras" target="_blank" rel="noopener noreferrer" class="social-link" title="LinkedIn">
              <span class="social-icon">🔗</span>
              <span class="social-text">LinkedIn</span>
            </a>
            <a href="https://github.com/alvarras" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">
              <span class="social-icon">💻</span>
              <span class="social-text">GitHub</span>
            </a>
          </div>
        </div>
      `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .footer-container {
          background-color: var(--primary-color, #101010);
          border-top: 1px solid var(--border-color, #3a3a3a);
          padding: 20px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
          width: 100%;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .copyright {
          color: var(--text-color, rgb(249, 249, 249));
          font-size: 14px;
          text-align: center;
          margin: 0;
        }
        
        .social-links {
          display: flex;
          gap: 15px;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-color, rgb(249, 249, 249));
          text-decoration: none;
          font-size: 14px;
          transition: opacity 0.2s ease;
        }
        
        .social-link:hover {
          opacity: 0.8;
        }
        
        .social-icon {
          font-size: 16px;
        }
        
        /* For light theme */
        :host-context(.light-theme) .footer-container {
          background-color: var(--primary-color, #f5f5f5);
          border-top: 1px solid var(--border-color, #cccccc);
        }
        
        :host-context(.light-theme) .copyright,
        :host-context(.light-theme) .social-link {
          color: var(--text-color, #333333);
        }
        
        /* Responsive styles */
        @media (min-width: 768px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `;

    shadow.appendChild(style);
    shadow.appendChild(container);
  }
}

// Register custom element
customElements.define('app-footer', AppFooter);
