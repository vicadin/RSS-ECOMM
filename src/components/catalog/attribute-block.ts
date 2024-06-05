import "./attributes.css";
import { createButton, createElement } from "../../utils/login-page-utils.ts";
import { dropdownButtonAttributes } from "../../interfaces/catalog-types.ts";
import AttributeList from "./atrribute-list.ts";

export default class AttributeBlock {
  container: HTMLElement | HTMLUListElement;

  attributeHeader: HTMLElement | HTMLUListElement;

  attributeHeading: HTMLElement | HTMLUListElement;

  attributeResetButton: HTMLButtonElement;

  attributesNavigationList: AttributeList;

  counter: HTMLElement | HTMLUListElement;

  constructor(heading: string, arrayOfAttributes: string[] | []) {
    this.container = createElement("div", "attribute-block");
    this.attributeHeader = createElement("header", "attribute-block__header");
    this.attributeHeading = createElement("h3", "attribute-block__heading");
    this.attributeResetButton = createButton(
      "attribute-block__reset-button  hidden",
      dropdownButtonAttributes,
      "Clear all",
    );
    this.attributeHeading.textContent = heading;

    this.counter = createElement("div", "attribute-block__counter");

    this.attributesNavigationList = new AttributeList(arrayOfAttributes);
    this.attributeHeader.append(this.attributeHeading, this.attributeResetButton);
    this.container.append(this.attributeHeader, this.attributesNavigationList.getHtml());
  }

  addEventListeners() {
    this.attributesNavigationList.getHtml().addEventListener("click", () => {});
  }

  getHtml() {
    return this.container;
  }
}
