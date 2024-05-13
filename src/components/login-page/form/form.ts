import "./form.css";

import {
  buttonAttr,
  EmailAttr,
  formAttributes,
  passwordAttr,
  showButtonAttributes,
} from "../../../interfaces/login-page-types.ts";
import {
  createButton,
  createElement,
  createForm,
  createInput,
  showHidePassword,
  validateEmail,
  validatePassword,
} from "../../../interfaces/login-page-utils.ts";
import {
  fetchAuthenticateCustomer,
  fetchGetAccessTokenThroughPassword,
} from "../../../interfaces/login-page-requests.ts";

export class Form {
  form: HTMLFormElement;

  emailWrapper: HTMLElement;

  emailInnerWrapper: HTMLElement;

  emailInput: HTMLInputElement;

  emailLabel: HTMLElement;

  emailError: HTMLSpanElement;

  passwordWrapper: HTMLElement;

  passwordBlockWrapper: HTMLElement;

  passwordInnerWrapper: HTMLElement;

  passwordInput: HTMLInputElement;

  passwordLabel: HTMLElement;

  passwordError: HTMLElement;

  submitButton: HTMLButtonElement;

  showButton: HTMLButtonElement;

  constructor() {
    this.form = createForm("form", formAttributes);

    this.emailWrapper = createElement("div", "email-wrapper");
    this.emailInnerWrapper = createElement("div", "inner-wrapper");
    this.emailInput = createInput("email-input", EmailAttr);
    this.emailLabel = createElement("label", "email-label", "Email address");
    this.emailInnerWrapper.append(this.emailInput, this.emailLabel);
    this.emailError = createElement("span", "email-error");
    this.emailWrapper.append(this.emailInnerWrapper, this.emailError);

    this.passwordBlockWrapper = createElement("div", "password-block-wrapper");
    this.passwordWrapper = createElement("div", "password-wrapper");
    this.passwordInnerWrapper = createElement("div", "inner-wrapper");

    this.passwordInput = createInput("password-input", passwordAttr);
    this.passwordLabel = createElement("label", "password-label", "Password");
    this.passwordError = createElement("span", "password-error");

    this.passwordInnerWrapper.append(this.passwordInput, this.passwordLabel);
    this.passwordWrapper.append(this.passwordInnerWrapper, this.passwordError);

    this.showButton = createButton("button-common show-button", showButtonAttributes, "Show");
    this.submitButton = createButton("button-common submit-button", buttonAttr, "Log in");
    this.passwordBlockWrapper.append(this.passwordWrapper, this.showButton);

    this.form.append(this.emailWrapper, this.passwordBlockWrapper, this.submitButton);

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

    this.passwordInput.addEventListener("focusin", () => {
      this.passwordLabel.classList.add("password-label_moved");
    });

    this.passwordInput.addEventListener("focusout", () => {
      if (this.passwordInput.value === "") {
        this.passwordLabel.classList.remove("password-label_moved");
      }
    });

    this.emailInput.addEventListener("input", validateEmail.bind(this));

    this.passwordInput.addEventListener("input", validatePassword.bind(this));

    this.showButton.addEventListener("click", showHidePassword.bind(this));

    this.form.addEventListener("submit", (ev) => {
      const email = this.emailInput.value;
      const password = this.passwordInput.value;
      ev.preventDefault();
      if (this.emailInput.validity.valid && this.passwordInput.validity.valid) {
        const response = fetchGetAccessTokenThroughPassword(email, password);

        response.then((result) => {
          const token = result.access_token;
          fetchAuthenticateCustomer(token, email, password);
        });
      } else if (this.emailInput.validity.valueMissing) {
        this.emailError.textContent = "This field is required";
      }
      if (this.passwordInput.validity.valueMissing) {
        this.passwordError.textContent = "This field is required";
      }
    });
  }
}

export const form = new Form();
