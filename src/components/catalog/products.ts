import { createElement } from "../../utils/login-page-utils.ts";
import ProductCard from "./product-card.ts";
import { getLocale } from "../../utils/catalog-utils.ts";

export default class Products {
  productContainer: HTMLElement | HTMLUListElement;

  locale: string;

  constructor(productsObjectsArray: []) {
    this.productContainer = createElement("div", "product-container");
    this.locale = window.navigator.languages.includes("en-US")
      ? "en-US"
      : getLocale(productsObjectsArray[0]);
    this.renderCards(productsObjectsArray);
  }

  renderCards(productsObjectsArray) {
    productsObjectsArray.forEach((productItem) => {
      const product = new ProductCard(productItem, this.locale);
      this.productContainer.append(product.getHtml());
    });
  }

  getHtml() {
    return this.productContainer;
  }
}
