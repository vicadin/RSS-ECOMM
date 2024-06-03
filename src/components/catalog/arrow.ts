import { createElement } from "../../utils/login-page-utils.ts";
import { CatalogCategoryResult } from "../../interfaces/catalog-types.ts";

export default class Arrow {
  arrow: HTMLElement | HTMLUListElement;

  constructor() {
    this.arrow = createElement("div", "arrow");
    this.arrow.textContent = ">";
  }

  getHtml() {
    return this.arrow;
  }
}

export function addArrow(children: CatalogCategoryResult[], element: HTMLLIElement) {
  if (children.length) {
    element.append(new Arrow().getHtml());
  }
}
