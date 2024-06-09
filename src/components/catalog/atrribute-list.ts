import { createElement } from "../../utils/login-page-utils.ts";
import "./attributes.css";
import AttributeItem from "./attribute-item.ts";

export default class AttributeList {
  attributeList: HTMLElement | HTMLUListElement;

  constructor(arrayOfAttributes: string[] | []) {
    this.attributeList = createElement("ul", "attribute-list");
    arrayOfAttributes.forEach((attribute) => {
      const li = new AttributeItem(attribute);
      this.attributeList.append(li.getHtml());
    });
  }

  getHtml() {
    return this.attributeList;
  }
}
