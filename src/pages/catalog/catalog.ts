import "./catalog-page.css";
import { createElement } from "../../utils/login-page-utils.ts";
import CreateNavigation from "../../utils/navigation.ts";
import { asideProps, products } from "../../utils/catalog-utils.ts";
import Products from "../../components/catalog/products.ts";

export default class CatalogPage {
  aside: HTMLElement;

  asideNav: HTMLElement | HTMLUListElement;

  asideNavList: HTMLElement | HTMLUListElement;

  pageContainer: HTMLElement | HTMLUListElement;

  catalogMain: HTMLElement | HTMLUListElement;

  constructor() {
    this.pageContainer = createElement("div", "catalog-container");
    this.aside = createElement("aside", "aside");
    const asideNav = CreateNavigation(this, asideProps);
    this.aside.append(asideNav);
    this.catalogMain = createElement("section", "catalog-main");
    this.catalogMain.append(new Products(products.array).getHtml());

    this.pageContainer.append(this.aside, this.catalogMain);
  }

  getHtml() {
    return this.pageContainer;
  }
}
