import "./category.css";
import { CatalogCategoryResult } from "../../interfaces/catalog-types.ts";
import { createElement } from "../../utils/login-page-utils.ts";
import CategoryLink from "./category-item.ts";

export default class CategoryList {
  container: HTMLElement | HTMLUListElement;

  list: HTMLElement | HTMLUListElement;

  subcontainer: HTMLElement | HTMLUListElement;

  constructor(categoryList: CatalogCategoryResult[], isRoot: boolean, subCategoryId?: string) {
    this.container = createElement("nav", "category-container");
    this.subcontainer = createElement("div", "subcategory-container not-visible");
    this.list = createElement("ul", "category-list");
    categoryList.forEach((item) => {
      const liItem = document.createElement("li");
      liItem.className = "category-list_item";
      const children: CatalogCategoryResult[] = categoryList.filter(
        (categoryListItem) => categoryListItem.parent?.id === item.id,
      );
      if (isRoot) {
        if (!item.parent) {
          liItem.append(new CategoryLink(item, children).getHtml());
        }
      } else if (subCategoryId === item.parent?.id) {
        liItem.append(new CategoryLink(item, children).getHtml());
      }
      this.list.append(liItem);
    });
    this.container.append(this.list, this.subcontainer);
  }

  getHtml() {
    return this.container;
  }
}
