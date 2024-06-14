import "./basket.css";
import {
  getUserBasket,
  updateLineItemQuantity,
  clearBasket,
  removeProduct,
} from "../../interfaces/basket/basketRequests";
import { Basket, Product } from "../../interfaces/basket/basketTypes";

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
          <img src="../assets/icons/close.png" alt="" data-product-id="${product.id}" class="remove-icon">  
         
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
        const productId = (event.target as HTMLElement).getAttribute("data-product-id")!;
        const productElement = this.basketContainer.querySelector(
          `.product-item[data-product-id="${productId}"]`,
        );
        const quantityValueElement = productElement!.querySelector(".quantity-value")!;
        let quantity = parseInt(quantityValueElement.textContent!);

        if (quantity > 1) {
          quantity--;
          const basket = await getUserBasket();
          if (basket) {
            const success = await updateLineItemQuantity(
              basket.id,
              basket.version,
              productId,
              quantity,
            );
            if (success) {
              quantityValueElement.textContent = quantity.toString();
              this.updateTotal();
            }
          }
        }
      });
    });

    increaseButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const productId = (event.target as HTMLElement).getAttribute("data-product-id")!;
        const productElement = this.basketContainer.querySelector(
          `.product-item[data-product-id="${productId}"]`,
        );
        const quantityValueElement = productElement!.querySelector(".quantity-value")!;
        let quantity = parseInt(quantityValueElement.textContent!);

        quantity++;
        const basket = await getUserBasket();
        if (basket) {
          const success = await updateLineItemQuantity(
            basket.id,
            basket.version,
            productId,
            quantity,
          );
          if (success) {
            quantityValueElement.textContent = quantity.toString();
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

          console.log(basket.version);
          const success = await clearBasket(basket.id, basket.version);
          if (success) {
            this.basketContainer.innerHTML = `<p class="empty-basket">Your basket is empty :(<br><br>Go to <a class="basket-link" href="#catalog">catalog</a></p>`;
          }
        }
      });
    }

    const removeIcons = this.basketContainer.querySelectorAll(".remove-icon");
    removeIcons.forEach((icon) => {
      icon.addEventListener("click", async (event) => {
        const productId = (event.target as HTMLElement).getAttribute("data-product-id")!;
        const basket = await getUserBasket();
        if (basket) {
          const product = basket.lineItems.find((item) => item.id === productId);
          if (product) {
            console.log(productId);
            const success = await removeProduct(basket.id, basket.version, productId);
            if (success) {
              this.render(this.basketContainer.parentElement!);
            }
          }
        }
      });
    });
  }

  async updateTotal() {
    const basket = await getUserBasket();
    const totalElement = this.basketContainer.querySelector(".total");
    if (basket && totalElement) {
      totalElement.textContent = `Total: ${basket.totalPrice}$`;
    }
  }
  async applyPromoCode(promoCode: string) {
    const promoModal = this.basketContainer.querySelector(".promo-modal");
    promoModal?.classList.add("hidden");

    this.render();
  }
}