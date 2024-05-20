type Routes = {
  [key: string]: string;
};

export function handleRouting(): void {
  const path: string = window.location.hash.slice(1);

  const routes: Routes = {
    home: "<h2>Home Page</h2><p>Welcome to the Home Page</p>",
    login: "<h2>Login Page</h2><p>Please login to continue</p>",
    register: "<h2>Register Page</h2><p>Create an account</p>",
    "": "<h2>404 Page Not Found</h2><p>Sorry, the page you are looking for does not exist.</p>",
  };

  const NotFoundComponent = new (await import('./app/components/404components')).NotFoundComponent();
  const content: string = routes[path] || NotFoundComponent.render();
  const contentElement: HTMLElement | null = document.getElementById("content");

  if (contentElement) {
    contentElement.innerHTML = content;
  } else {
    console.error('Element with id "content" not found.');
  }
}
export function routerInit() {
    addEventListener('hashchange',handleRouting);
    handleRouting();
}
