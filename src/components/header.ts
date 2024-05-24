import createNavLink from "../utils/header-utils.ts";
import { createElement } from "../utils/login-page-utils.ts";

export class Header {
  header: HTMLElement;

  nav: HTMLElement;

  navList: HTMLUListElement;

  headerNavContainer: HTMLElement;

  headerNav: HTMLElement;

  headerNavList: HTMLElement;

  constructor() {
    this.header = document.createElement("header");
    this.headerNavContainer = createElement("div", "header_nav-container");
    this.headerNav = createElement("nav", "primary-nav");
    this.headerNavList = createElement("ul", "primary-nav_list");

    this.nav = createElement("nav", "additional-nav");
    this.navList = document.createElement("ul");
    this.navList.classList.add("nav_list");
    Header.fillNavList(
      this.navList,
      localStorage.getItem("token")
        ? ["Register", "Logout", "Home"]
        : ["Register", "Login", "Home"],
    );
    this.nav.appendChild(this.navList);
    this.headerNavContainer.append(this.nav);
    this.header.appendChild(this.headerNavContainer);
    this.addEventListeners();
  }

  static fillNavList(parentUl: HTMLUListElement, items: string[]): void {
    items.forEach((itemText) => {
      parentUl.appendChild(createNavLink(itemText));
    });
  }

  addEventListeners() {
    this.navList.addEventListener("click", (ev) => {
      if ((ev.target as HTMLLinkElement).textContent === "Logout") {
        localStorage.clear();
        this.updateNav();
      }
    });
  }

  updateNav() {
    this.nav.innerHTML = "";
    this.navList.innerHTML = "";

    Header.fillNavList(
      this.navList,
      localStorage.getItem("token")
        ? ["Register", "Logout", "Home"]
        : ["Register", "Login", "Home"],
    );

    this.nav.append(this.navList);
  }

  getHtml() {
    return this.header;
  }
}

export const headerEl = new Header();
