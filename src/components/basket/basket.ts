import "./basket.css";
import {
  getUserBasket,
  updateLineItemQuantity,
  clearBasket,
  removeProduct,
  applyPromoCode,
  removePromoCode,
} from "../../interfaces/basket/basketRequests.ts";
import { Product } from "../../interfaces/basket/basketTypes.ts";
import { getAccessToken } from "../../interfaces/registration/registrationRequests.ts";
import { AccessToken } from "../../interfaces/catalog-types.ts";
import { fetchCreateAnonCart, fetchCreateMyCart } from "../../interfaces/cart-request.ts";

import { getActiveCartAndUpdateCounter } from "../../utils/cart-utils.ts";

export default class BasketPage {
  private title: HTMLElement;

  basketContainer: HTMLElement;

  private promoErrorLabel: HTMLElement;

  constructor() {
    this.title = document.createElement("h1");
    this.title.innerText = "Basket";
    this.title.classList.add("title");

    this.basketContainer = document.createElement("div");
    this.basketContainer.classList.add("basket-container");
  }

  public async render(container: HTMLElement): Promise<void> {
    container.appendChild(this.title);
    container.append(this.basketContainer);
    const basket = await getUserBasket();

    if (!basket || basket.lineItems.length === 0) {
      this.basketContainer.innerHTML = `<p class="empty-basket">Your basket is empty :(<br><br>Go to <a class="basket-link" href="#catalog">catalog</a></p>`;
      return;
    }
    const totalSum = basket.totalPrice;

    const productItems = basket.lineItems.map((product) => BasketPage.createProductItem(product));
    let originalTotalSum;
    if (basket.discountOnTotalPrice) {
      originalTotalSum = basket.discountOnTotalPrice.discountedAmount.centAmount / 100 + totalSum;
    }

    this.basketContainer.innerHTML = `
   <button class="clear-btn" id="clearAll">Clear all</button>
  <div class="products">${productItems.join("")}</div>
  <div class="basket-info">
    <button class="apply-promo-btn">Apply a promotional code <img src="../assets/icons/add.png" alt="" class="remove-icon"></button>
    ${BasketPage.createPromoModal()}
    <div class="total-container">
      <div class="total">Total: ${originalTotalSum > totalSum ? `<span class="original-total">$${originalTotalSum.toFixed(2)}</span>` : ""} $${totalSum.toFixed(2)}</div>
      
      ${basket.discountCodes.length > 0 ? `<div class="remove-promo-code" data-discount-code-id="${basket.discountCodes[0].discountCode.id}">remove promo code <img src="../assets/icons/delete.png" width=16 alt="remove promo code" ></div>` : ""}
    </div>
  </div>
    `;

    const removePromoCodeButton = this.basketContainer.querySelector(".remove-promo-code");
    if (removePromoCodeButton) {
      removePromoCodeButton.addEventListener("click", async (event) => {
        const discountCodeId = (event.target as HTMLElement).getAttribute("data-discount-code-id")!;
        const success = await removePromoCode(basket.id, basket.version, discountCodeId);
        if (success) {
          this.render(this.basketContainer.parentElement!);
        }
      });
    }
    this.addEventListeners();
  }

  static createProductItem(product: Product): string {
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

  static createPromoModal(): string {
    return `
        <div class="promo-modal hidden">
        
          <div class="promo-modal-content">
            <span class="close-promo-modal"><img src="../assets/icons/close.png" alt="" class="remove-icon"></span>
            <h2>Apply a promotional code</h2>
            <div class="input-container">
            <label for="promo-code" class="promo-code-label">Enter your code</label>
          <input type="text" id="promo-code" name="promoCode" class="field-input promo-code-input">
</div>
<span class="promo-error"></span>
            <button class="btn-black apply-promo-code">Apply</button>
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
        let quantity = parseInt(quantityValueElement.textContent!, 10);

        if (quantity > 1) {
          quantity -= 1;
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
        let quantity = parseInt(quantityValueElement.textContent!, 10);

        quantity += 1;
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
      applyPromoCodeButton.addEventListener("click", async () => {
        const promoCode = promoInput.value.trim().toLocaleUpperCase();
        if (promoCode) {
          try {
            const basket = await getUserBasket();
            if (basket) {
              const success = await applyPromoCode(basket.id, basket.version, promoCode);
              if (success) {
                this.render(this.basketContainer.parentElement!);
              } else {
                this.showPromoError("Invalid promo code. Please try again.");
              }
            }
          } catch (error) {
            this.showPromoError("Failed to apply promo code. Please try again later.");
          }
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
          const success = await clearBasket(basket.id, basket.version);
          if (success) {
            this.basketContainer.innerHTML = `<p class="empty-basket">Your basket is empty :(<br><br>Go to <a class="basket-link" href="#catalog">catalog</a></p>`;
            let tokenForNewCart;
            if (localStorage.getItem("token")) {
              tokenForNewCart = JSON.parse(localStorage.getItem("token")).token;
              await fetchCreateMyCart(tokenForNewCart).then((answer) =>
                getActiveCartAndUpdateCounter(answer, tokenForNewCart),
              );
            } else if (localStorage.getItem("anonymous-token")) {
              tokenForNewCart = localStorage.getItem("anonymous-token");
              await fetchCreateAnonCart(tokenForNewCart).then((answer) =>
                getActiveCartAndUpdateCounter(answer, tokenForNewCart),
              );
            } else {
              getAccessToken().then((res) => {
                if (typeof res !== "boolean") {
                  tokenForNewCart = (res as AccessToken).access_token;
                  fetchCreateAnonCart(tokenForNewCart).then((answer) =>
                    getActiveCartAndUpdateCounter(answer, tokenForNewCart),
                  );
                }
              });
            }
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
    const originalTotalElement = this.basketContainer.querySelector(".original-total");

    if (basket && totalElement) {
      totalElement.textContent = `Total: $${basket.totalPrice.toFixed(2)}`;
      if (originalTotalElement) {
        originalTotalElement.textContent = `Original Total: $${basket.originalTotalPrice}`;
      } else if (basket.originalTotalPrice > basket.totalPrice) {
        const originalTotalHTML = `<div class="original-total">Original Total: $${basket.originalTotalPrice.toFixed(2)}</div>`;
        totalElement.insertAdjacentHTML("afterend", originalTotalHTML);
      }
    }
  }

  async applyPromoCode() {
    const promoModal = this.basketContainer.querySelector(".promo-modal");
    promoModal?.classList.add("hidden");
    this.render();
  }

  showPromoError(message: string) {
    const promoModal = this.basketContainer.querySelector(".promo-modal-content");
    if (promoModal) {
      const errorLabel = promoModal.querySelector(".promo-error") as HTMLLabelElement;
      if (errorLabel) {
        errorLabel.textContent = message;
        errorLabel.style.display = "block";
        setTimeout(() => {
          errorLabel.style.display = "none";
        }, 5000);
      }
    }
  }
}
