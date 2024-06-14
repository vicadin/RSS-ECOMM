import "./basket.css";
import { getUserBasket, updateProductQuantity, clearBasket } from "../../interfaces/basket/basketRequests";
import { Basket, Product } from "../../interfaces/basket/basketTypes";
import { log } from "console";

export default class BasketPage {
  private title: HTMLElement;
  basketContainer: HTMLElement;
  // customerId: string;

  constructor() {
    this.title = document.createElement("h1");
    this.title.innerText = "Basket";
    this.title.classList.add("title");

    this.basketContainer = document.createElement("div");
    this.basketContainer.classList.add("basket-container");
    // this.customerId = localStorage.getItem("id");

    // this.render();
  }

  public async render(container: HTMLElement): void {
    container.appendChild(this.title);
    container.append(this.basketContainer);
    //container.innerHTML=this.createProductItem();
    const basket = await getUserBasket();

    if (!basket || basket.lineItems.length === 0) {
      this.basketContainer.innerHTML = `<p class="empty-basket">Your basket is empty :(<br><br>Go to <a class="basket-link" href="#catalog">catalog</a></p>`;
      return;
    }
console.log(basket)
    const totalSum = basket.totalPrice;

    const productItems = basket.lineItems.map((product) => this.createProductItem(product));

    this.basketContainer.innerHTML = `
    <button class="clear-btn" id="clearAll">Clear all</button>
      <div class="products">${productItems.join("")}</div>
      <div class="basket-info">
     
      <button class="apply-promo-btn">Apply a promotional code <img src="../assets/icons/add.png" alt="" class="remove-icon"></button>
      ${this.createPromoModal()}
       <div class="total">Total: $${totalSum.toFixed(2)}</div>
      </div>
    `;
    this.addEventListeners();
  }
  createProductItem(product: Product): string {
    return `
        <div class="product-item" data-product-id="${product.id}">
        <div class="product-details">
          <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
          
            <h3 class="product-name">${product.name}</h3>
             </div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-quantity">
              <button class="quantity-decrease" data-product-id="${product.id}">-</button>
              <span class="quantity-value">${product.quantity}</span>
              <button class="quantity-increase" data-product-id="${product.id}">+</button>
            </div>
          <img src="../assets/icons/close.png" alt="" class="remove-icon">  
         
        </div>
      `;
  }

  createPromoModal(): string {
    return `
        <div class="promo-modal hidden">
        
          <div class="promo-modal-content">
            <span class="close-promo-modal"><img src="../assets/icons/close.png" alt="" class="remove-icon"></span>
            <h2>Apply a promotional code</h2>
            <div class="input-container">
            <label for="promo-code" class="promo-code-label">Enter your code</label>
          <input type="text" id="promo-code" name="promoCode" class="field-input promo-code-input">
</div>
            <button class="btn-black">Apply</button>
          </div>
        </div>
      `;
  }

  addEventListeners() {
    const decreaseButtons = this.basketContainer.querySelectorAll(".quantity-decrease");
    const increaseButtons = this.basketContainer.querySelectorAll(".quantity-increase");

    const applyPromoButton = this.basketContainer.querySelector(".apply-promo-btn");
    const closePromoModalButton = this.basketContainer.querySelector(".close-promo-modal");
    const applyPromoCodeButton = this.basketContainer.querySelector(".apply-promo-code");
    const promoInput = this.basketContainer.querySelector(".promo-code-input") as HTMLInputElement;
    const promoLabel = this.basketContainer.querySelector(".promo-code-label") as HTMLInputElement;
    const clearAllButton = this.basketContainer.querySelector("#clearAll");


    decreaseButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const productId = Number((event.target as HTMLElement).getAttribute("data-product-id"));
        const productElement = this.basketContainer.querySelector(
          `.product-item[data-product-id="${productId}"]`,
        );
        if (productElement) {
          const quantityElement = productElement.querySelector(".quantity-value");
          const currentQuantity = Number(quantityElement?.textContent);
          if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            const success = await updateProductQuantity(this.customerId, productId, newQuantity);
            if (success) {
              quantityElement!.textContent = String(newQuantity);
              this.updateTotal();
            }
          }
        }
      });
    });

    increaseButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const productId = Number((event.target as HTMLElement).getAttribute("data-product-id"));
        const productElement = this.basketContainer.querySelector(
          `.product-item[data-product-id="${productId}"]`,
        );
        if (productElement) {
          const quantityElement = productElement.querySelector(".quantity-value");
          const currentQuantity = Number(quantityElement?.textContent);
          const newQuantity = currentQuantity + 1;
          const success = await updateProductQuantity(this.customerId, productId, newQuantity);
          if (success) {
            quantityElement!.textContent = String(newQuantity);
            this.updateTotal();
          }
        }
      });
    });
    if (applyPromoButton) {
      applyPromoButton.addEventListener("click", () => {
        const promoModal = this.basketContainer.querySelector(".promo-modal");
        promoModal?.classList.remove("hidden");
      });
    }

    if (closePromoModalButton) {
      closePromoModalButton.addEventListener("click", () => {
        const promoModal = this.basketContainer.querySelector(".promo-modal");
        promoModal?.classList.add("hidden");
      });
    }

    if (applyPromoCodeButton) {
      applyPromoCodeButton.addEventListener("click", () => {
        const promoCode = promoInput.value.trim();
        if (promoCode) {
          this.applyPromoCode(promoCode);
        }
      });
    }

    promoInput.addEventListener("focusin", () => {
      promoLabel.classList.add("password-label_moved");
    });

    promoInput.addEventListener("focusout", () => {
      if (promoInput.value === "") {
        promoLabel.classList.remove("password-label_moved");
      }
    });

    if (clearAllButton) {
      clearAllButton.addEventListener("click", async () => {
        const basket = await getUserBasket();
        
        if (basket && basket.id) {
          console.log(basket);
          
          console.log(basket.version)
          const success = await clearBasket(basket.id, basket.version);
          if (success) {
            this.basketContainer.innerHTML = `<p class="empty-basket">Your basket is empty :(<br><br>Go to <a class="basket-link" href="#catalog">catalog</a></p>`;
          }
        }
      });
    }
  }

  async updateTotal() {
    const basket = await getUserBasket(this.customerId);
    if (basket) {
      let totalSum = 0;
      basket.products.forEach((product) => {
        totalSum += product.price * product.quantity;
      });
      const totalElement = this.basketContainer.querySelector(".total");
      if (totalElement) {
        /*  totalElement.textContent = `Total: ${totalSum.toFixed(2)}$`; */
        totalElement.textContent = `Total: ${totalSum}$`;
      }
    }
  }
  async applyPromoCode(promoCode: string) {
    const promoModal = this.basketContainer.querySelector(".promo-modal");
    promoModal?.classList.add("hidden");

    this.render();
  }
}
