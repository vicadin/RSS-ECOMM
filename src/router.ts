import RegistrationPage from "./pages/registration.ts";
import LoginPage from "./components/login-page/login-page.ts";
import NotFoundComponent from "./components/404components.ts";
import {ProductDetailsPage} from "./components/pdp/pdp";

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
        newContent.appendChild(new LoginPage().getHtmlElem());
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
        newContent.innerHTML = "";
        NotFoundComponent.render();
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
  if (hash.includes("product=")) {
    if(newContent) {
      newContent.innerHTML = "";
      newContent.appendChild(ProductDetailsPage());
      return
    }
  }
  const routeHandler = routes[hash] || routes[""];
  routeHandler();
}

export function routerInit() {
  window.addEventListener("hashchange", handleHash);
  // window.location.hash = "#home";
  // handleHash();
}
