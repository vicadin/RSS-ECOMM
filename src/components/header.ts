import { createButton, createElement, createInput } from "../utils/login-page-utils.ts";
import {
  fillNavList,
  getListItems,
  insertFindIco,
  lockBody,
  searchObject,
  setLocationForSearching,
  unlockBodyAndCloseElem,
} from "../utils/header-utils.ts";
import {
  headerPropsForLeftNav,
  headerPropsForRightNav,
  searchButtonAttr,
  searchInputAttr,
  svgIco,
  svgIcoBig,
} from "../interfaces/header-types.ts";
import CreateNavigation from "../utils/navigation.ts";
import Burger from "./catalog/burger.ts";
import { sortObject } from "../interfaces/catalog-types.ts";
import { addProfileIco } from "../utils/catalog-utils.ts";

export class Header {
  headerNavList: HTMLElement | HTMLUListElement;

  header: HTMLElement;

  nav: HTMLElement;

  navList: HTMLUListElement;

  headerNavContainer: HTMLElement;

  headerNav: HTMLElement | HTMLUListElement;

  burger: Burger;

  findContainer: HTMLElement | HTMLUListElement;

  findElem: Element;

  findInputContainer: HTMLElement | HTMLUListElement;

  searchProductInput: HTMLInputElement;

  searchButton: HTMLButtonElement;

  searchIco: Element;

  constructor() {
    this.header = document.createElement("header");
    this.findContainer = createElement("div", "find-container invisible");
    this.findInputContainer = createElement("div", "find_input-container");
    this.searchProductInput = createInput("main-search", searchInputAttr);
    this.searchButton = createButton("search-button", searchButtonAttr, "");
    insertFindIco(this.searchButton, svgIcoBig);
    this.searchIco = this.searchButton.lastElementChild;
    this.findInputContainer.append(this.searchProductInput, this.searchButton);
    this.findContainer.append(this.findInputContainer);
    this.headerNavContainer = createElement("div", "header_nav-container");
    const leftNav = CreateNavigation(this, headerPropsForLeftNav);
    const rightNav = CreateNavigation(this, headerPropsForRightNav);
    addProfileIco(rightNav);
    this.burger = new Burger();
    leftNav.append(this.burger.getHtml());
    insertFindIco(leftNav, svgIco);
    this.findElem = leftNav.lastElementChild;
    this.headerNavContainer.append(leftNav, rightNav);
    this.header.append(this.findContainer, this.headerNavContainer);
    this.addEventListeners();
  }

  addEventListeners() {
    this.headerNavContainer.addEventListener("click", (ev) => {
      if ((ev.target as HTMLLinkElement).textContent === "Logout") {
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }
        window.location.reload();
      }

      this.findContainer.addEventListener("mousedown", (event) => {
        if ((event.target as HTMLElement).classList.contains("find-container")) {
          unlockBodyAndCloseElem(this.findContainer);
        }
      });
    });

    this.findElem.addEventListener("click", () => {
      this.findContainer.classList.remove("invisible");
      lockBody();
    });

    this.searchProductInput.addEventListener("keydown", (ev) => {
      if (ev.code === "Enter") {
        unlockBodyAndCloseElem(this.findContainer);
        this.setSearchParams();
      }
    });

    this.searchButton.addEventListener("click", () => {
      unlockBodyAndCloseElem(this.findContainer);
      this.setSearchParams();
    });
  }
    updateNav(item:string)
    {
      (this[item] as HTMLUListElement).innerHTML = "";
      fillNavList(this[item] as HTMLUListElement, getListItems());
    }

  getHtml() {
    return this.header;
  }

    setSearchParams() {
      let searchParam;
      const finalParamString = [];
      if (this.searchProductInput.value.trim()) {
        searchObject.search = this.searchProductInput.value.trim();
        searchParam = new URLSearchParams(`text.en-US=${searchObject.search}`);
        finalParamString.push("fuzzy=true&fuzzyLevel=2");
        if (finalParamString.length !== 0) {
          finalParamString.push(`&${searchParam}`);
        } else {
          finalParamString.push(`${searchParam}`);
        }

      if (sortObject.sorting) {
        sortObject.sorting = undefined;
      }

      setLocationForSearching(finalParamString.join(",").replace(",", ""));
    } else {
      searchObject.search = undefined;
    }
  }
}

export const headerEl = new Header();
