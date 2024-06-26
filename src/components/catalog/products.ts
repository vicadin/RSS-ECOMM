import { createElement } from "../../utils/login-page-utils.ts";
import ProductCard from "./product-card.ts";
import infiniteObserver from "../../utils/observer.ts";

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
    const lastProduct = this.productContainer.lastElementChild;

    if (lastProduct) {
      infiniteObserver.observe(lastProduct);
    }
  }

  getHtml() {
    return this.productContainer;
  }
}
