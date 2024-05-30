import "./catalog-page.css";
import { createElement } from "../../utils/login-page-utils.ts";
import { products } from "../../utils/catalog-utils.ts";
import Products from "../../components/catalog/products.ts";
import Breadcrumbs from "../../components/catalog/breadcrumbs.ts";

export default class CatalogPage {
  aside: HTMLElement;

  pageContainer: HTMLElement | HTMLUListElement;

  catalogMain: HTMLElement | HTMLUListElement;

  catalogBreadcrumbs: HTMLElement | HTMLUListElement;

  catalogTitle: HTMLElement | HTMLUListElement;

  catalogFilterBlock: HTMLElement | HTMLUListElement;

  constructor() {
    this.pageContainer = createElement("div", "catalog-container");

    this.catalogBreadcrumbs = createElement("div", "catalog_breadcrumbs");
    this.catalogTitle = createElement("div", "catalog_title");
    if (
      localStorage.getItem("categoryListAncestors") &&
      localStorage.getItem("currentCategoryName")
    ) {
      const currentBreadcrumbs = new Breadcrumbs(
        JSON.parse(localStorage.getItem("categoryListAncestors")),
        localStorage.getItem("currentCategoryName"),
      );
      this.catalogTitle.textContent = localStorage.getItem("currentCategoryName");
      this.catalogBreadcrumbs.append(currentBreadcrumbs.getHtml());
    }

    this.catalogFilterBlock = createElement("div", "catalog_filters-block");

    this.catalogMain = createElement("section", "catalog-main");
    this.catalogMain.append(new Products(products.array).getHtml());
    this.pageContainer.append(
      this.catalogBreadcrumbs,
      this.catalogTitle,
      this.catalogFilterBlock,
      this.catalogMain,
    );
  }

  getHtml() {
    return this.pageContainer;
  }
}
