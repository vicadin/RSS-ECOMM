import RegistrationPage from "./pages/registration";
import loginPage from "./components/login-page/login-page";
import NotFoundComponent from "./components/404components";
import { profilePage } from "./pages/profile";

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
    profile: () => {
      if (newContent) {
        newContent.innerHTML = "";
        newContent.appendChild(profilePage.getHtml());
      }
    },
    "": () => {
      if (newContent) {
        newContent.innerHTML = "";
        new NotFoundComponent().render();
      }
    },
  };

  if (localStorage.getItem("token") && hash === "login") {
    hash = "home";
    window.location.hash = hash;
  }
  if (hash === "logout") {
    hash = "home";
    window.location.hash = hash;
  }

  const routeHandler = routes[hash] || routes[""];
  routeHandler();
}

export function routerInit() {
  window.addEventListener("hashchange", handleHash);
  window.location.hash = "#home";
  handleHash();
}
