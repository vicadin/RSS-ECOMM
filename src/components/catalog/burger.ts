import { createElement } from "../../utils/login-page-utils.ts";

export default class Burger {
  burgerElement: HTMLElement | HTMLUListElement;

  constructor() {
    this.burgerElement = createElement("div", "burger");
    const lineMiddle = createElement("div", "line line_top");
    const lineBottom = createElement("div", "line line_bottom");
    this.burgerElement.append(lineMiddle, lineBottom);
  }

  getHtml() {
    return this.burgerElement;
  }
}
