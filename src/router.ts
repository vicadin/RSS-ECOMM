import RegistrationPage from "./pages/registration";
import LoginPage from "./components/login-page/login-page";
import NotFoundComponent from "./components/404components";
import { ProductDetailsPage } from "./components/pdp/pdp";
import Product from "./interfaces/product";

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
    product: () => {
      if (newContent) {
        newContent.innerHTML = "";
        const prodItem = fetchGetProducts("9f4eb6b5-2d60-4046-aeba-be9c466b4b7e");
        prodItem.then((result) => {
          newContent.append(new ProductDetailsPage(result, "en-US").getHtml());
        });
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
    if (newContent) {
      newContent.innerHTML = "";
      newContent.appendChild(ProductDetailsPage());
      return;
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
