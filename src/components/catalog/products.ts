import { createElement } from "../../utils/login-page-utils.ts";
import ProductCard from "./product-card.ts";

export default class Products {
  productContainer: HTMLElement | HTMLUListElement;

  constructor(productsObjectsArray: []) {
    this.productContainer = createElement("div", "product-container");
    this.renderCards(productsObjectsArray);
  }

  renderCards(productsObjectsArray) {
    productsObjectsArray.forEach((productItem) => {
      const product = new ProductCard(productItem, "en-US");
      this.productContainer.append(product.getHtml());
    });
  }

  getHtml() {
    return this.productContainer;
  }
}
