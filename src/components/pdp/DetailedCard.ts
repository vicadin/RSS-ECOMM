import "./detailed.css";
import "../../pages/catalog/catalog-page.css";
import { createElement } from "../../utils/login-page-utils.ts";
import { setBeforeDiscountPrice, setFinalPrice } from "../../utils/catalog-utils.ts";
import { Product } from "../../interfaces/product.ts";
import { addItemToCart, removeItemFromCart, checkItemInCart } from "../../interfaces/utils/cart-utils";

export default class DetailedCard {
  id: string;

  detailedCardItem: HTMLElement;

  detailedImage: HTMLElement | undefined;

  detailedCardContent: HTMLElement | undefined;

  detailedCardHeading: HTMLElement | undefined;

  detailedCardDescription: HTMLElement | undefined;

  detailedCardPrices: HTMLElement | undefined;

  finalPrice: HTMLElement | undefined;

  beforeDiscountPrice: HTMLElement | undefined;

  image: HTMLImageElement;

  modal: HTMLElement | undefined;

  modalContent: HTMLElement | undefined;

  closeBtn: HTMLElement | undefined;

  prevArrow: HTMLElement | undefined;

  nextArrow: HTMLElement | undefined;

  currentSlideIndex: number;

  slides: string[];

  addToCartButton: HTMLElement | undefined;

  removeFromCartButton: HTMLElement | undefined;

  constructor(props: Product, locale: string) {
    this.detailedCardItem = createElement("div", "detailed-card");
    this.slides = props.masterData?.current.masterVariant.images.map((image) => image.url) || [];
    this.image = new Image();
    this.currentSlideIndex = 0;
    this.setupModal();
    this.id = props.id;
    this.renderCard(props, locale);
    this.checkCartStatus(props);
  }

  renderCard = (props: Product, locale: string) => {
    this.detailedCardContent = createElement("div", "detailed-card_content");
    this.detailedCardHeading = createElement("h4", "detailed-card_heading");
    this.detailedCardHeading.textContent = props.masterData.current.name["en-US"];
    this.detailedCardDescription = createElement("p", "detailed-card_description");
    this.detailedCardDescription.textContent = props.masterData.current.description["en-US"];
    this.detailedCardPrices = createElement("div", "detailed-card_prices");
    this.beforeDiscountPrice = createElement("span", "before-discount-price");
    this.beforeDiscountPrice.textContent = setBeforeDiscountPrice(props, locale);
    this.finalPrice = createElement("span", "final-price");
    this.finalPrice.textContent = setFinalPrice(props, locale);
    this.detailedImage = createElement("div", "detailed-card_image");
    this.image.src = props.masterData.current.masterVariant.images[0].url;
    this.image.onclick = this.openModal;

    this.setFieldsValues(props, locale);

    this.detailedCardPrices.append(this.finalPrice, this.beforeDiscountPrice);
    this.detailedCardContent.append(
      this.detailedCardHeading,
      this.detailedCardDescription,
      this.detailedCardPrices,
    );
    this.detailedCardItem.append(this.detailedImage, this.detailedCardContent);
    this.detailedImage.append(this.image);
    //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//
    this.addToCartButton = createElement("button", "add-to-cart-button");
    this.removeFromCartButton = createElement("button", "remove-from-cart-button");

    this.addToCartButton.textContent = "Add to cart";
    this.removeFromCartButton.textContent = "Delete from cart";

    this.addToCartButton.onclick = this.handleAddToCart;
    this.removeFromCartButton.onclick = this.handleRemoveFromCart;
    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa//
  };

  setFieldsValues(props: Product) {
    try {
      if (!this.detailedCardHeading) return;
      this.detailedCardHeading.textContent = props.masterData.current.name["en-US"];
      if (!this.detailedCardDescription) return;
      this.detailedCardDescription.textContent = props.masterData.current.description["en-US"];
      this.image.style.backgroundImage = `url("${this.slides[this.currentSlideIndex]}")`;
    } catch (err) {
      window.location.hash = "";
    }
  }

  setupModal = () => {
    this.modal = createElement("div", "modal-window");
    this.modalContent = createElement("div", "modal--window-content");
    this.closeBtn = createElement("span", "close");
    this.closeBtn.innerHTML = "&times;";
    this.closeBtn.onclick = this.closeModal;

    this.prevArrow = createElement("span", "prev-arrow");
    this.prevArrow.innerHTML = "&#10094;";
    this.prevArrow.onclick = this.prevSlide;

    this.nextArrow = createElement("span", "next-arrow");
    this.nextArrow.innerHTML = "&#10095;";
    this.nextArrow.onclick = this.nextSlide;

    this.modalContent.append(
      this.closeBtn,
      this.prevArrow,
      this.nextArrow,
      this.createSlidesContainer(),
    );
    this.modal.append(this.modalContent);
    document.body.append(this.modal);
  };

  createSlidesContainer = () => {
    const container = createElement("div", "slides-container");

    [...this.slides, ...this.slides].forEach((slideUrl, index) => {
      const slide = createElement("div", "slide");
      const img = new Image();
      img.src = slideUrl;
      slide.appendChild(img);
      if (index === this.currentSlideIndex) {
        slide.classList.add("active");
      }
      container.append(slide);
    });
    return container;
  };

  openModal = () => {
    if (!this.modal) return;
    this.modal.style.display = "block";
    document.onkeydown = (e) => {
      if (e.key === "ArrowRight") this.nextSlide();
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "Escape") this.closeModal();
    };
  };

  closeModal = () => {
    if (!this.modal) return;
    this.modal.style.display = "none";
    document.onkeydown = null;
  };

  nextSlide = () => {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    this.updateSlides();
  };

  prevSlide = () => {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  };

  updateSlides = () => {
    if (!this.modal) return;
    const slides = this.modal.querySelectorAll(".slide");
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlideIndex);
    });
  };
  //------------------------------------------------------------//
  handleAddToCart = async () => {
    try {
      await addItemToCart(this.id, this.currentSlideIndex);
      alert("product added to cart");
      this.toggleCartButtons(true);
    } catch (error) {
      console.error("Error: product not added to cart", error);
    }
  };

  handleRemoveFromCart = async () => {
    try {
      await removeItemFromCart(this.id);
      alert("product has been removed from cart");
      this.toggleCartButtons(false);
    } catch (error) {
      console.error("Error when removing an product from the cart:", error);
    }
  };

  checkCartStatus = async (props: Product) => {
    const isInCart = await checkItemInCart(this.id);
    this.toggleCartButtons(isInCart);
  };

  toggleCartButtons = (isInCart: boolean) => {
    if (!this.addToCartButton || !this.removeFromCartButton) return;
    this.addToCartButton.style.display = isInCart ? "none" : "block";
    this.removeFromCartButton.style.display = isInCart ? "block" : "none";
  };

  //------------------------------------------------------------//

  getHtml() {
    return this.detailedCardItem;
  }
}
