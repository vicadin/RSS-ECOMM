import { createElement } from "../../utils/login-page-utils.ts";
import { svgCheckInactive } from "../../interfaces/catalog-types.ts";

export default class AttributeItem {
  attributeItem: HTMLLIElement;

  attributeItemCheck: HTMLElement | HTMLUListElement;

  constructor(attribute) {
    this.attributeItem = document.createElement("li");
    this.attributeItem.className = "attribute-item";
    this.attributeItemCheck = createElement("div", "attribute-item__check");
    this.attributeItemCheck.insertAdjacentHTML("afterbegin", svgCheckInactive);
    const attributeItemText = createElement("span", "attribute-item__text");
    if (attribute) {
      attributeItemText.textContent = attribute;
    }

    this.attributeItem.append(this.attributeItemCheck, attributeItemText);
  }

  getHtml() {
    return this.attributeItem;
  }
}
