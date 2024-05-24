import { createElement } from "../utils/login-page-utils.ts";
import { CreateNavigation, fillNavList, getListItems } from "../utils/header-utils.ts";
import { headerPropsForLeftNav, headerPropsForRightNav } from "../interfaces/header-types.ts";

export class Header {
  headerNavList: HTMLElement | HTMLUListElement;

  header: HTMLElement;

  nav: HTMLElement;

  navList: HTMLUListElement;

  headerNavContainer: HTMLElement;

  headerNav: HTMLElement | HTMLUListElement;

  constructor() {
    this.header = document.createElement("header");
    this.headerNavContainer = createElement("div", "header_nav-container");
    const leftNav = CreateNavigation(this, headerPropsForLeftNav);
    const rightNav = CreateNavigation(this, headerPropsForRightNav);
    this.headerNavContainer.append(leftNav, rightNav);
    this.header.appendChild(this.headerNavContainer);
    this.addEventListeners();
  }

  addEventListeners() {
    this.navList.addEventListener("click", (ev) => {
      if ((ev.target as HTMLLinkElement).textContent === "Logout") {
        localStorage.clear();
        this.updateNav("navList");
      }
    });
  }

  updateNav(item: string) {
    (this[item] as HTMLUListElement).innerHTML = "";
    fillNavList(this[item] as HTMLUListElement, getListItems());
  }

  getHtml() {
    return this.header;
  }
}

export const headerEl = new Header();
