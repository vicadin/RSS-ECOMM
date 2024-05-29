import { createElement } from "../utils/login-page-utils.ts";
import { fillNavList, getListItems } from "../utils/header-utils.ts";
import { headerPropsForLeftNav, headerPropsForRightNav } from "../interfaces/header-types.ts";
import CreateNavigation from "../utils/navigation.ts";
import Burger from "./catalog/burger.ts";

export class Header {
  headerNavList: HTMLElement | HTMLUListElement;

  header: HTMLElement;

  nav: HTMLElement;

  navList: HTMLUListElement;

  headerNavContainer: HTMLElement;

  headerNav: HTMLElement | HTMLUListElement;

  burger: Burger;

  constructor() {
    this.header = document.createElement("header");
    this.headerNavContainer = createElement("div", "header_nav-container");
    const leftNav = CreateNavigation(this, headerPropsForLeftNav);
    const rightNav = CreateNavigation(this, headerPropsForRightNav);
    this.burger = new Burger();
    leftNav.append(this.burger.getHtml());

    this.headerNavContainer.append(leftNav, rightNav);
    this.header.appendChild(this.headerNavContainer);
    this.addEventListeners();
  }

  addEventListeners() {
    this.headerNavContainer.addEventListener("click", (ev) => {
      if ((ev.target as HTMLLinkElement).textContent === "Logout") {
        localStorage.clear();
        this.updateNav("navList");
      }
      if ((ev.target as HTMLLinkElement).textContent === "Catalog") {
        // console.log("отрисовка страницы Catalog");
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
