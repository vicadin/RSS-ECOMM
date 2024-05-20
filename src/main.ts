import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/media.css";
import { routerInit } from "./router";

class App {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  start(): void {
    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const navList = document.createElement("ul");
    navList.classList.add("nav_list");
    const navItems = ["Register", "Login", "Home"];

    navItems.forEach((itemText) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${itemText.toLowerCase()}`;
      link.textContent = itemText;
      listItem.appendChild(link);
      navList.appendChild(listItem);
      listItem.classList.add("nav_list_item");
    });

    nav.appendChild(navList);
    header.appendChild(nav);

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

    document.body.appendChild(header);
    document.body.appendChild(main);
    document.body.appendChild(footer);
  }
}

const app = new App("app");
app.start();
routerInit();
