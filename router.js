export function handleRouting() {
  const path = window.location.hash.slice(1);

  const routes = {
    home: "<h2>Home Page</h2><p>Welcome to the Home Page</p>",
    login: "<h2>Login Page</h2><p>Please login to continue</p>",
    register: "<h2>Register Page</h2><p>Create an account</p>",
    "": "<h2>404 Page Not Found</h2><p>Sorry, the page you are looking for does not exist.</p>",
  };

  const content = routes[path] || routes[""];
  document.getElementById("content").innerHTML = content;
}
