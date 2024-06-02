import "./detailed.css";
import { createElement } from "../../interfaces/login-page-utils";
import { setBeforeDiscountPrice, setFinalPrice } from "../../interfaces/utils/catalog-utils";
import { Product } from "../../interfaces/product";

export default class DetailedCard {
  id: string;
  detailedCardItem:  HTMLElement;
  detailedImage: HTMLElement;
  detailedCardContent: HTMLElement;
  detailedCardHeading: HTMLElement;
  detailedCardDescription: HTMLElement;
  detailedCardPrices: HTMLElement;
  finalPrice: HTMLElement;
  beforeDiscountPrice: HTMLElement;
  // modal: HTMLElement;
  // modalContent: HTMLElement;
  // closeBtn: HTMLElement;
  // currentSlideIndex: number;
  // slides: string[];

  constructor(props: Product, locale: string) {
    this.id = props.id;
    // this.currentSlideIndex = 0;
    // this.slides = props.masterData?.current.masterVariant.images.map((image) => image.url);
    this.renderCard(props, locale);
    // this.setupModal();
  }

  renderCard(props: Product, locale: string) {
    this.detailedCardItem = createElement("div", "detailed-card");
    this.detailedCardContent = createElement("div", "detailed-card_content");
    this.detailedCardHeading = createElement("h4", "detailed-card_heading");
    this.detailedCardDescription = createElement("p", "detailed-card_description");
    this.detailedCardPrices = createElement("div", "detailed-card_prices");
    this.finalPrice = createElement("span", "final-price");
    this.beforeDiscountPrice = createElement("span", "before-discount-price");
    this.detailedImage = createElement("div", "detailed-card_image");

    // this.setFieldsValues(props, locale);

    this.detailedCardPrices.append(this.finalPrice, this.beforeDiscountPrice);
    this.detailedCardContent.append(
      this.detailedCardHeading,
      this.detailedCardDescription,
      this.detailedCardPrices,
    );
    this.detailedCardItem.append(this.detailedImage, this.detailedCardContent);
  }

  // setFieldsValues(props: Product, locale: string) {
  //   try {
  //     const data = props.masterData.current;
  //     this.detailedCardHeading.textContent = data.name[locale];
  //     [this.detailedCardDescription.textContent] = data.description[locale].split(".");
  //     this.finalPrice.textContent = setFinalPrice(props, locale);
  //     this.beforeDiscountPrice.textContent = setBeforeDiscountPrice(props, locale);
  //     this.detailedImage.style.backgroundImage = `url("${this.slides[this.currentSlideIndex]}")`;
  //     this.detailedImage.onclick = () => this.openModal();
  //   } catch (err) {
  //     window.location.hash = "";
  //   }
  // }

  // setupModal() {
  //   this.modal = createElement("div", "modal");
  //   this.modalContent = createElement("div", "modal-content");
  //   this.closeBtn = createElement("span", "close");
  //   this.closeBtn.innerHTML = "&times;";
  //   this.closeBtn.onclick = () => this.closeModal();

  //   this.modalContent.append(this.closeBtn, this.createSlidesContainer());
  //   this.modal.append(this.modalContent);
  //   document.body.append(this.modal);
  // }

  // createSlidesContainer() {
  //   const container = createElement("div", "slides-container");
  //   this.slides.forEach((slideUrl, index) => {
  //     const slide = createElement("div", "slide");
  //     const img = document.createElement("img");
  //     img.src = slideUrl;
  //     slide.appendChild(img);
  //     if (index === this.currentSlideIndex) {
  //       slide.classList.add("active");
  //     }
  //     container.append(slide);
  //   });
  //   return container;
  // }

  // openModal() {
  //   this.modal.style.display = "block";
  //   document.onkeydown = (e) => {
  //     if (e.key === "ArrowRight") this.nextSlide();
  //     if (e.key === "ArrowLeft") this.prevSlide();
  //     if (e.key === "Escape") this.closeModal();
  //   };
  // }

  // closeModal() {
  //   this.modal.style.display = "none";
  //   document.onkeydown = null;
  // }

  // nextSlide() {
  //   this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  //   this.updateSlides();
  // }

  // prevSlide() {
  //   this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  //   this.updateSlides();
  // }

  // updateSlides() {
  //   const slides = this.modal.querySelectorAll(".slide");
  //   slides.forEach((slide, index) => {
  //     slide.classList.toggle("active", index === this.currentSlideIndex);
  //   });
  // }

  getHtml() {
    return this.detailedCardItem;
  }
}
