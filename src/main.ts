import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/media.css";
import { routerInit } from "./router.ts";
import { headerEl } from "./components/header.ts";
import { fetchGetCategories, fetchGetProducts } from "./interfaces/catalog-requests.ts";
import {
  categories,
  createAside,
  setCategoriesArray,
  setProductsArray,
} from "./utils/catalog-utils.ts";
import { createElement } from "./utils/login-page-utils.ts";
import { lockBody, outsideEvtListener } from "./utils/header-utils.ts";

class App {
  id: string;

  aside: HTMLElement | HTMLUListElement;

  bodyOverlay: HTMLElement | HTMLUListElement;

  constructor(id: string) {
    this.id = id;
    this.bodyOverlay = createElement("div", "body-overlay hidden");
  }

  start(): void {
    const wrapper = createElement("div", "wrapper");
    const main = document.createElement("main");
    const section = document.createElement("section");
    section.id = "content";
    const h2 = document.createElement("h2");
    h2.textContent = "Welcome to the Shop!";
    section.appendChild(h2);
    main.appendChild(section);
    main.id = this.id;
    const footer = document.createElement("footer");
    const p = document.createElement("p");
    p.textContent = "© Shop Footer";
    footer.appendChild(p);
    wrapper.append(headerEl.getHtml(), main, footer);
    document.body.append(this.bodyOverlay, wrapper);
    this.getData();
    this.addEvenListeners();
  }

  addEvenListeners() {
    this.bodyOverlay.addEventListener("click", outsideEvtListener);
  }

  getData() {
    const getRequests = [fetchGetCategories(), fetchGetProducts()];
    const mutateFunctions = [setCategoriesArray, setProductsArray];
    Promise.all(getRequests).then((promiseResultAsArray) => {
      promiseResultAsArray.forEach((promiseResultItem, index) => {
        mutateFunctions[index](promiseResultItem);
      });
      const aside = createAside(categories);
      this.bodyOverlay.after(aside);
      headerEl.burger.getHtml().addEventListener("click", () => {
        lockBody();
      });
    });
  }
}

const app = new App("app");
app.start();
routerInit();
