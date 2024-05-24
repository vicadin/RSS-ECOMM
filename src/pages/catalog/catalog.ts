import "./catalog-page.css";
import { createElement } from "../../utils/login-page-utils.ts";
import CreateNavigation from "../../utils/navigation.ts";
import { asideProps } from "../../utils/catalog-utils.ts";

export default class CatalogPage {
  aside: HTMLElement;

  pageContainer: HTMLElement | HTMLUListElement;

  catalogMain: HTMLElement | HTMLUListElement;

  constructor() {
    this.pageContainer = createElement("div", "catalog-container");
    this.aside = createElement("aside", "aside");
    const asideNav = CreateNavigation(this, asideProps);
    this.aside.append(asideNav);
    this.catalogMain = createElement("section", "catalog-main");
    this.pageContainer.append(this.aside, this.catalogMain);
  }

  getHtml() {
    return this.pageContainer;
  }
}
