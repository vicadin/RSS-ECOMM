import "./detailed.css";
import { createElement } from "../../utils/login-page-utils";
import { setBeforeDiscountPrice, setFinalPrice } from "../../../src/utils/catalog-utils";
import { Product } from "../../interfaces/product";

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

  constructor(props: Product, locale: string) {
    this.detailedCardItem = createElement("div", "detailed-card");
    this.slides = props.masterData?.current.masterVariant.images.map((image) => image.url)  || [];
    this.image = new Image();
    this.currentSlideIndex = 0;
    this.setupModal();
    this.id = props.id;
    this.renderCard(props, locale);
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
  }

  setFieldsValues(props: Product, locale: string)  {
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
    this.modal = createElement("div", "modal");
    this.modalContent = createElement("div", "modal-content");
    this.closeBtn = createElement("span", "close");
    this.closeBtn.innerHTML = "&times;";
    this.closeBtn.onclick = this.closeModal;

    this.prevArrow = createElement("span", "prev-arrow");
    this.prevArrow.innerHTML = "&#10094;";
    this.prevArrow.onclick = this.prevSlide;

    this.nextArrow = createElement("span", "next-arrow");
    this.nextArrow.innerHTML = "&#10095;";
    this.nextArrow.onclick = this.nextSlide;

    this.modalContent.append(this.closeBtn, this.prevArrow, this.nextArrow, this.createSlidesContainer());
    this.modal.append(this.modalContent);
    document.body.append(this.modal);
  }

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
  }

  openModal = () => {
    if (!this.modal) return;
    this.modal.style.display = "block";
    document.onkeydown = (e) => {
      if (e.key === "ArrowRight") this.nextSlide();
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "Escape") this.closeModal();
    };
  }

  closeModal = () => {
    if (!this.modal) return;
    this.modal.style.display = "none";
    document.onkeydown = null;
  }

  nextSlide = () => {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    this.updateSlides();
  }

  prevSlide = () => {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  }

  updateSlides= () => {
    if (!this.modal) return;
    const slides = this.modal.querySelectorAll(".slide");
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlideIndex);
    });
  }

  getHtml() {
    return this.detailedCardItem;
  }
}
