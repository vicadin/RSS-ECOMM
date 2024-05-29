import "./catalog-page.css";
import { createElement } from "../../utils/login-page-utils.ts";
import { products } from "../../utils/catalog-utils.ts";
import Products from "../../components/catalog/products.ts";
import CategoryList from "../../components/catalog/category-list.ts";

export default class CatalogPage {
  aside: HTMLElement;

  asideNav: CategoryList;

  asideNavList: HTMLElement | HTMLUListElement;

  pageContainer: HTMLElement | HTMLUListElement;

  catalogMain: HTMLElement | HTMLUListElement;

  constructor() {
    this.pageContainer = createElement("div", "catalog-container");

    // const aside = createElement("aside", "aside");
    // this.asideNav = new CategoryList(categories.array, true);
    // this.aside.append(this.asideNav.getHtml());

    this.catalogMain = createElement("section", "catalog-main");
    this.catalogMain.append(new Products(products.array).getHtml());
    this.pageContainer.append(this.catalogMain);
  }

  getHtml() {
    return this.pageContainer;
  }
}
