import "./attributes.css";
import { createButton, createElement } from "../../utils/login-page-utils.ts";
import {
  dropdownButtonAttributes,
  svgCheckActive,
  svgCheckInactive,
} from "../../interfaces/catalog-types.ts";
import AttributeList from "./atrribute-list.ts";

export default class AttributeBlock {
  container: HTMLElement | HTMLUListElement;

  attributeHeader: HTMLElement | HTMLUListElement;

  attributeHeading: HTMLElement | HTMLUListElement;

  attributeResetButton: HTMLButtonElement;

  attributesNavigationList: AttributeList;

  counter: HTMLElement | HTMLUListElement;

  arrayOfCurrentAttributes: string[];

  parent: HTMLElement | null;

  constructor(heading: string, arrayOfAttributes: string[] | []) {
    this.arrayOfCurrentAttributes = [];
    this.container = createElement("div", "attribute-block");
    this.attributeHeader = createElement("header", "attribute-block__header");
    this.attributeHeading = createElement("h3", "attribute-block__heading");
    this.attributeResetButton = createButton(
      "attribute-block__reset-button  hidden",
      dropdownButtonAttributes,
      "Clear all",
    );
    this.attributeHeading.textContent = heading;

    this.counter = createElement("div", "attribute-block__counter hidden");

    this.attributesNavigationList = new AttributeList(arrayOfAttributes);
    this.attributeHeader.append(this.attributeHeading, this.attributeResetButton, this.counter);
    this.container.append(this.attributeHeader, this.attributesNavigationList.getHtml());

    this.addEventListeners();
  }

  addEventListeners() {
    this.attributesNavigationList.getHtml().addEventListener("click", (ev) => {
      if ((ev.target as HTMLElement).closest(".attribute-item")) {
        const li = (ev.target as HTMLElement).closest(".attribute-item");
        const text = li.children[1].textContent;
        li.classList.toggle("attribute-item__active");
        if (li.classList.contains("attribute-item__active")) {
          li.firstElementChild.outerHTML = "";
          li.insertAdjacentHTML("afterbegin", svgCheckActive);
          this.arrayOfCurrentAttributes.push(li.children[1].textContent);
          console.log(this.arrayOfCurrentAttributes);
        } else {
          li.firstElementChild.outerHTML = "";
          li.insertAdjacentHTML("afterbegin", svgCheckInactive);
          if (li.children[1].textContent) {
            const thisElem = this.arrayOfCurrentAttributes.findIndex((item) => item === text);
            if (thisElem !== -1) {
              this.arrayOfCurrentAttributes.splice(thisElem, 1);
              console.log(this.arrayOfCurrentAttributes);
            }
          }
        }
        this.countClicks();
      }
    });
    this.attributeResetButton.addEventListener("click", () => {
      Array.from(this.attributesNavigationList.getHtml().children).forEach((children) => {
        const newChildren = children;
        newChildren.classList.remove("attribute-item__active");
        newChildren.firstElementChild.outerHTML = "";
        newChildren.insertAdjacentHTML("afterbegin", svgCheckInactive);
      });
      this.arrayOfCurrentAttributes.length = 0;
      this.counter.classList.add("hidden");
      this.attributeResetButton.classList.add("hidden");
      this.parent = this.container.parentElement;
      if (this.parent) {
        AttributeBlock.showHideResultButton(this.parent);
      }
    });
  }

  countClicks() {
    const clickArray = Array.from(this.attributesNavigationList.getHtml().children);
    const activeItems = clickArray.filter((child) =>
      child.classList.contains("attribute-item__active"),
    );

    if (activeItems.length) {
      const parent = this.container.parentElement;
      this.counter.classList.remove("hidden");
      this.counter.textContent = String(activeItems.length);
      this.attributeResetButton.classList.remove("hidden");
      parent?.lastElementChild?.classList.remove("hidden");
      if (parent?.parentElement?.lastElementChild?.classList.contains("hidden")) {
        parent?.parentElement?.lastElementChild?.classList.remove("hidden");
      }
    } else {
      this.counter.classList.add("hidden");
      this.attributeResetButton.classList.add("hidden");
      if (this.parent) {
        AttributeBlock.showHideResultButton(this.parent);
      }
    }
  }

  static showHideResultButton(parent: HTMLElement) {
    if (parent?.children) {
      const isEmptyAttributesContainer = Array.from(parent?.children).every((child) =>
        child.firstElementChild.lastElementChild.classList.contains("hidden"),
      );
      if (isEmptyAttributesContainer) {
        console.log(parent.parentElement.lastElementChild);
        parent.parentElement.lastElementChild.classList.add("hidden");
      }
    }
  }

  getHtml() {
    return this.container;
  }
}
