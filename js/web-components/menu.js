class NavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ul {
          display: flex;
          gap: var(--spacing);
          justify-content: center;
          flex-wrap: wrap;
          list-style: none;
          font-family: var(--font-primary);
          text-align: center;
          letter-spacing: 1px;
        }

        a {
          display: block;
          padding: var(--spacing);
          text-transform: uppercase;
          text-decoration: none;
          color: var(--color-dark);
        }

        a:focus,
        a:hover {
          color: var(--color-light);
          background-color: var(--color-dark);
          text-decoration: underline;
        }
      </style>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/programmes/workshops">Live Workshops</a></li>
        <li><a href="/programmes/online-courses">Online Course</a></li>
        <li><a href="/programmes/schools">Schools</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
    `;
  }
}

customElements.define("diy-nav", NavBar);

export { NavBar };
