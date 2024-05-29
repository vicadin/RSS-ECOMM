import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/media.css";
import { routerInit } from "./router.ts";
import { headerEl } from "./components/header.ts";

class App {
  id: string;

  aside: HTMLElement | HTMLUListElement;

  constructor(id: string) {
    this.id = id;
  }

  start(): void {
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

    document.body.appendChild(headerEl.getHtml());
    document.body.appendChild(main);
    document.body.appendChild(footer);
  }
}

const app = new App("app");
app.start();
routerInit();
