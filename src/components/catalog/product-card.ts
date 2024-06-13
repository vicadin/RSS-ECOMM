import "./products.css";
import { createButton, createElement } from "../../utils/login-page-utils.ts";
import { setBeforeDiscountPrice, setFinalPrice } from "../../utils/catalog-utils.ts";
import { productButtonAttributes } from "../../interfaces/catalog-types.ts";
import { addLineItem, getMyActiveCart } from "../../interfaces/cart-request.ts";

export default class ProductCard {
  id: string;

  productCardItem: HTMLElement | HTMLUListElement;

  productImage: HTMLElement | HTMLUListElement;

  productCardContent: HTMLElement | HTMLUListElement;

  productCardHeading: HTMLElement | HTMLUListElement;

  productCardDescription: HTMLElement | HTMLUListElement;

  productCardPrices: HTMLElement | HTMLUListElement;

  finalPrice: HTMLElement | HTMLUListElement;

  beforeDiscountPrice: HTMLElement | HTMLUListElement;

  productCardSize: HTMLElement | HTMLUListElement;

  productCardIngredient: HTMLElement | HTMLUListElement;

  productCardButton: HTMLButtonElement;

  productButtonContainer: HTMLElement | HTMLUListElement;

  spinner: HTMLElement | HTMLUListElement;

  constructor(props, locale: string) {
    this.id = props.id;
    this.renderCard(props, locale);
    this.addEventListeners();
  }

  renderCard(props, locale) {
    this.productCardItem = createElement("div", "product-card");
    this.productCardContent = createElement("div", "product-card_content");
    this.productCardHeading = createElement("h4", "product-card_heading");
    this.productCardDescription = createElement("p", "product-card_description");
    this.productCardSize = createElement("p", "product-card_size");
    this.productCardIngredient = createElement("div", "ingredient");
    this.productCardPrices = createElement("div", "product-card_prices");
    this.finalPrice = createElement("span", "final-price");
    this.beforeDiscountPrice = createElement("span", "before-discount-price ");
    this.productImage = createElement("div", "product-card_image");
    this.productButtonContainer = createElement("div", "product-card__button-container");
    this.spinner = createElement("div", "button-spinner");

    this.productCardButton = createButton(
      "product-card__button button-common",
      productButtonAttributes,
      "Add to cart",
    );

    this.productButtonContainer.append(this.productCardButton, this.spinner);
    this.setFieldsValues(props, locale);
    this.productCardPrices.append(this.finalPrice, this.beforeDiscountPrice);
    this.productCardContent.append(
      this.productCardHeading,
      this.productCardDescription,
      this.productCardSize,
      this.productCardIngredient,
      this.productCardPrices,
      this.productButtonContainer,
    );
    this.productCardItem.append(this.productImage, this.productCardContent);
  }

  getHtml() {
    return this.productCardItem;
  }

  setFieldsValues(props, locale) {
    try {
      const data = props.masterData?.current ? props.masterData.current : props;
      this.productCardHeading.textContent = data.name[locale];
      [this.productCardDescription.textContent] = data.description[locale].split(".");
      data.masterVariant.attributes.forEach((attr) => {
        if (attr.name === "size") {
          this.productCardSize.textContent = attr.value["en-US"];
        }
        if (attr.name === "key-ingredients") {
          this.productCardIngredient.textContent = attr.value;
        }
      });

      this.finalPrice.textContent = setFinalPrice(props, locale);
      this.beforeDiscountPrice.textContent = setBeforeDiscountPrice(props, locale);
      this.productImage.style.backgroundImage = `url("${data.masterVariant.images[0].url}")`;
    } catch (err) {
      window.location.hash = "";
    }
  }

  addEventListeners() {
    this.productCardItem.addEventListener("click", (ev) => {
      if ((ev.target as HTMLElement).closest(".product-card__button-container")) {
        this.productCardItem.classList.add("product-card_spin");
        //  Add product with this id to the cart + update cart products-amount - need to be added updating function;
        const token = localStorage.getItem("token")
          ? JSON.parse(localStorage.getItem("token")).token
          : localStorage.getItem("anonymous-token");
        getMyActiveCart(token).then(async (cart) => {
          this.productCardButton.textContent = "Added to your cart";
          this.productCardButton.setAttribute("disabled", "disabled");
          const { version, id } = cart;
          await addLineItem(version, id, this.id, token);
          setTimeout(() => {
            this.productCardItem.classList.remove("product-card_spin");
            this.productCardButton.classList.add("product-card_added");
          }, 300);
        });
      } else {
        const pathname = `${this.id}`;
        window.location.href = `#${pathname}product`;
      }
    });
  }
}
