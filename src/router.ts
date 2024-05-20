import RegistrationPage from "./pages/registration";
import loginPage from "./components/login-page/login-page";

type Routes = {
  [key: string]: () => void;
};

export function handleHash() {
  let hash: string = window.location.hash ? window.location.hash.slice(1) : "";
  const newContent: HTMLElement | null = document.getElementById("content");

  const routes: Routes = {
    home: () => {
      if (newContent) {
        newContent.innerHTML = "<h2>Welcome!</h2>";
      }
    },
    login: () => {
      if (newContent) {
        newContent.innerHTML = "";
        newContent.appendChild(new loginPage().getHtmlElem());
      }
    },
    register: () => {
      if (newContent) {
        newContent.innerHTML = "";
        RegistrationPage();
      }
    },
    "": () => {
      if (newContent) {
        newContent.innerHTML =
          "<h2>404 Page Not Found</h2><p>Sorry, the page you are looking for does not exist.</p>";
      }
    },
  };


  const NotFoundComponent = new (await import('./app/components/404components')).NotFoundComponent();
  const content: string = routes[path] || NotFoundComponent.render();
  if (localStorage.getItem("token") && hash === "login") {
    hash = "home";
    window.location.hash = hash;

  }

  const routeHandler = routes[hash] || routes[""];
  routeHandler();
}

export function routerInit() {
  window.addEventListener("hashchange", handleHash);
  handleHash();
}
