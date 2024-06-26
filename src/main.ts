import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/media.css";
import { routerInit } from "./router.ts";
import { headerEl } from "./components/header.ts";
import { fetchGetCategories } from "./interfaces/catalog-requests.ts";
import { categories, createAside, setCategoriesArray } from "./utils/catalog-utils.ts";
import { createElement } from "./utils/login-page-utils.ts";
import { lockBodyAndOpenAside, outsideEvtListener } from "./utils/header-utils.ts";

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
    h2.textContent = "Welcome";
    const promoCode = document.createElement("p");
    promoCode.classList.add("promocode");
    promoCode.innerHTML = `Use promo code <span>FINAL</span> to get a 20% discount`;
    section.appendChild(h2);
    section.appendChild(promoCode);
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
    const getRequests = [fetchGetCategories()];
    const mutateFunctions = [setCategoriesArray];
    Promise.all(getRequests).then((promiseResultAsArray) => {
      promiseResultAsArray.forEach((promiseResultItem, index) => {
        mutateFunctions[index](promiseResultItem);
      });
      const aside = createAside(categories);
      this.bodyOverlay.after(aside);
      headerEl.burger.getHtml().addEventListener("click", lockBodyAndOpenAside);
    });
  }
}

const app = new App("app");
app.start();
routerInit();
