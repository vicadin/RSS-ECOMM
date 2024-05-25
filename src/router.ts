import RegistrationPage from "./pages/registration.ts";
import LoginPage from "./components/login-page/login-page.ts";
import NotFoundComponent from "./components/404components.ts";
import { headerEl } from "./components/header.ts";
import CatalogPage from "./pages/catalog/catalog.ts";
import {
  fillCategoriesNames,
  setAsidePropsItems,
  setProductsArray,
} from "./utils/catalog-utils.ts";
import { fetchGetProducts } from "./pages/catalog/catalog-requests.ts";

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
        headerEl.updateNav("navList");
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
    catalog: () => {
      if (newContent) {
        newContent.innerHTML = "";

        const arr = [fillCategoriesNames(), fetchGetProducts()];
        const anotherArr = [setAsidePropsItems, setProductsArray];
        Promise.all(arr).then((values) => {
          values.forEach((value, index) => {
            anotherArr[index](value);
          });
          newContent.append(new CatalogPage().getHtml());
        });
      }
    },
  };
  // };

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
