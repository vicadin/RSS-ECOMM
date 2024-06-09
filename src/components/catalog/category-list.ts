import "./category.css";
import { CatalogCategoryResult } from "../../interfaces/catalog-types.ts";
import { createElement } from "../../utils/login-page-utils.ts";
import CategoryListItem from "./category-list-item.ts";

export default class CategoryList {
  container: HTMLElement | HTMLUListElement;

  list: HTMLElement | HTMLUListElement;

  subcontainer: HTMLElement | HTMLUListElement;

  constructor(categoryList: CatalogCategoryResult[], isRoot: boolean, subCategoryId?: string) {
    this.container = createElement("nav", "category-container");
    this.subcontainer = createElement("div", "subcategory-container not-visible");
    this.list = createElement("ul", "category-list");

    categoryList.forEach((item) => {
      const liItem = new CategoryListItem(categoryList, item, isRoot, subCategoryId);
      this.list.append(liItem.getHtml());
    });
    this.container.append(this.list, this.subcontainer);
  }

  getHtml() {
    return this.container;
  }
}
