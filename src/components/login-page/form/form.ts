import "./form.css";

import EmailAttr, { formAttributes } from "../../../interfaces/login-page-types.ts";
import { createElement, createForm, createInput } from "../../../interfaces/login-page-utils.ts";

export class Form {
  form: HTMLFormElement;

  emailWrapper: HTMLElement;

  emailInnerWrapper: HTMLElement;

  emailInput: HTMLInputElement;

  emailLabel: HTMLElement;

  emailError: HTMLSpanElement;

  constructor() {
    this.form = createForm("form", formAttributes);
    this.emailWrapper = createElement("div", "email-wrapper");
    this.emailInnerWrapper = createElement("div", "email-inner-wrapper");
    this.emailInput = createInput("email-input", EmailAttr);
    this.emailLabel = createElement("label", "email-label", "Email address");
    this.emailInnerWrapper.append(this.emailInput, this.emailLabel);
    this.emailError = createElement("span", "email-error");
    this.emailWrapper.append(this.emailInnerWrapper, this.emailError);
    this.form.append(this.emailWrapper);
    this.addEventListeners();
  }

  getHtmlElem() {
    return this.form;
  }

  addEventListeners() {
    this.emailInput.addEventListener("focusin", () => {
      this.emailLabel.classList.add("email-label_moved");
    });

    this.emailInput.addEventListener("focusout", () => {
      if (this.emailInput.value === "") {
        this.emailLabel.classList.remove("email-label_moved");
      }
    });

    this.form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (this.emailInput.validity.valid) {
        // запрос после проверки
      } else {
        if (this.emailInput.validity.valueMissing) {
          this.emailError.textContent = "This field is required";
        }
        this.emailError.classList.add("email-error_active");
      }
    });

    this.emailInput.addEventListener("input", () => {
      if (!this.emailInput.validity.valid) {
        this.emailError.classList.add("email-error_active");
        this.emailError.textContent = this.emailInput.value.length
          ? "Please enter an email address in the correct format, such as name@example.com"
          : "This field is required";
      } else {
        this.emailError.textContent = "";
      }
    });
  }
}

export const form = new Form();
