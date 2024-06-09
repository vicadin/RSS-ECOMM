export default class NotFoundComponent {
  static render(): string {
    return `
        <h2>404 Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <a href="#home">Go to Home Page</a>
      `;
  }
}
