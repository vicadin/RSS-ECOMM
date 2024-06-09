import "../../pages/catalog/catalog-page.css";

import { createButton, createElement } from "../../utils/login-page-utils.ts";
import { closeButtonAttr } from "../../interfaces/header-types.ts";
import { closeFiltersHandler } from "../../utils/catalog-utils.ts";

export class CloseButton {
  closeButton: HTMLButtonElement;

  constructor() {
    this.closeButton = createButton("filter-container__close-button", closeButtonAttr, "");
    const line1 = createElement("div", "close-button__line1");
    const line2 = createElement("div", "close-button__line2");
    this.closeButton.append(line1, line2);
    this.addEventListeners();
  }

  addEventListeners() {
    this.closeButton.addEventListener("click", closeFiltersHandler);
  }

  getHtml() {
    return this.closeButton;
  }
}

export const filtersCloseButton = new CloseButton();
