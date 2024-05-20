import "./form.css";
import * as RegistrationFormUtils from "../../../interfaces/registration/registartionFormUtils";
import {
  registerUser,
  getAccessToken,
} from "../../../interfaces/registration/registrationRequests";
import {
  fetchAuthenticateCustomer,
  fetchGetAccessTokenThroughPassword,
} from "../../../interfaces/login-page-requests";
import { AccessTokenResponse, Customer } from "../../../interfaces/login-page-types";

export default class RegistrationForm {
  private formElement: HTMLFormElement;

  private errorElements: { [key: string]: HTMLElement } = {};

  private submitButton: HTMLButtonElement;

  private registrationSection: HTMLElement;

  private logInText: HTMLAnchorElement;

  private successMessage: HTMLElement;

  private overlay: HTMLElement;

  private deliveryAddressCheckbox: HTMLInputElement;

  private billingAddressCheckbox: HTMLInputElement;

  private sameAddressCheckbox: HTMLInputElement;

  private addressesSection: HTMLElement;

  constructor() {
    this.registrationSection = document.createElement("section");
    this.registrationSection.classList.add("registration-section");
    this.formElement = document.createElement("form");
    this.formElement.classList.add("form-registration");
    this.submitButton = document.createElement("button");
    this.submitButton.type = "submit";
    this.submitButton.textContent = "Register";
    this.submitButton.disabled = true;
    this.submitButton.classList.add("btn-black");

    this.logInText = document.createElement("a");
    this.logInText.href = "#login";
    this.logInText.innerHTML = "Do you already have an account?";
    this.logInText.classList.add("form-link");

    this.formElement.addEventListener("input", this.handleInput.bind(this));
    this.formElement.addEventListener("submit", this.handleSubmit.bind(this));

    this.addressesSection = document.createElement("section");
    this.addressesSection.classList.add("addresses-section");

    this.registrationSection.appendChild(this.formElement);

    this.formElement.appendChild(this.addressesSection);
    this.formElement.appendChild(this.submitButton);
    this.formElement.appendChild(this.logInText);

    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    this.successMessage = document.createElement("div");
    this.successMessage.innerHTML = "Registration was successful!";
    this.successMessage.classList.add("alert");
    this.registrationSection.appendChild(this.overlay);
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!target || !target.name) return;
  
    const value = target.value.trim();
    const fieldName = target.name;
  
    const errorMessage = this.validateField(fieldName, value);
    this.updateErrorMessage(fieldName, errorMessage);
  
    const hasErrors = Object.values(this.errorElements).some(
      (errorElement) => errorElement.textContent !== ""
    );
  
    const allFieldsFilled = (): boolean => {
      const inputElements = Array.from(this.formElement.elements).filter(
        (element) =>
          (element instanceof HTMLInputElement &&
            element.type !== "checkbox" &&
            element.type !== "date") ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
      ) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
      return inputElements.every((input) => input.value.trim() !== "");
    };
  
    const updateSubmitButtonState = () => {
      if (!hasErrors && allFieldsFilled()) {
        this.submitButton.disabled = false;
      } else {
        this.submitButton.disabled = true;
      }
    };
  
    updateSubmitButtonState();
  
    if (this.sameAddressCheckbox.checked) {
      this.copyDeliveryAddressToBilling();
  
      updateSubmitButtonState();
    }
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formData = new FormData(this.formElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

    const deliveryStreet = formData.get("deliveryStreet") as string;
    const deliveryCity = formData.get("deliveryCity") as string;
    const deliveryPostalCode = formData.get("deliveryPostalCode") as string;
    const deliveryCountry = formData.get("deliveryCountry") as string;
    const billingStreet = formData.get("billingStreet") as string;
    const billingCity = formData.get("billingCity") as string;
    const billingPostalCode = formData.get("billingPostalCode") as string;
    const billingCountry = formData.get("billingCountry") as string;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !deliveryStreet ||
      !deliveryCity ||
      !deliveryPostalCode ||
      !deliveryCountry ||
      !billingStreet ||
      !billingCity ||
      !billingPostalCode ||
      !billingCountry
    ) {
      console.error("All fields are required");
      return;
    }

    const response = getAccessToken();
    response.then((result) => {
      const token = result.access_token;
      if (token) {
        registerUser(
          token,
          email,
          password,
          firstName,
          lastName,
          dateOfBirth,
          deliveryStreet,
          deliveryCity,
          deliveryPostalCode,
          deliveryCountry,
          billingStreet,
          billingCity,
          billingPostalCode,
          billingCountry,
          this.deliveryAddressCheckbox.checked,
          this.billingAddressCheckbox.checked,
        ).then((res) => {
          if (res) {
            this.overlay.classList.add("show");
            this.registrationSection.appendChild(this.successMessage);
            const response = fetchGetAccessTokenThroughPassword(email, password);
            response.then((result) => {
              let token: string;
              if ((result as AccessTokenResponse).token_type === "Bearer") {
                token = (result as AccessTokenResponse).access_token;
              }
              if (token) {
                fetchAuthenticateCustomer(token, email, password).then((res) => {
                  const { id } = (res as Customer).customer;
                  localStorage.setItem("id", id);
                  localStorage.setItem("token", JSON.stringify({ token }));
                  window.location.hash = "#home";
                });
              }
            });
            setTimeout(() => {
              window.location.href = "/#home";
            }, 500);
          }
        });
      }
    });
  }

  private updateErrorMessage(fieldName: string, errorMessage: string | null): void {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (!errorElement) return;

    if (errorMessage) {
      errorElement.textContent = errorMessage;
      this.errorElements[fieldName] = errorElement;
    } else {
      errorElement.textContent = "";
      delete this.errorElements[fieldName];
    }
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.registrationSection);

    [
      { type: "text", name: "email", placeholder: "Email", required: true },
      { type: "password", name: "password", placeholder: "Password", required: true },
      { type: "text", name: "firstName", placeholder: "First Name", required: true },
      { type: "text", name: "lastName", placeholder: "Last Name", required: true },
      { type: "text", name: "dateOfBirth", placeholder: "Date of Birth", required: true },
    ].forEach(({ type, name, placeholder, required }) => {
      const input = RegistrationFormUtils.createInputElement(type, name, placeholder, required);
      if (name === "dateOfBirth") {
        input.addEventListener("focus", function () {
          this.type = "date";
        });
      }
      const errorElement = RegistrationFormUtils.createErrorMessageElement(`${name}-error`);
      this.formElement.insertBefore(input, this.submitButton);
      this.formElement.insertBefore(errorElement, this.submitButton);
    });

    this.addressesSection.appendChild(this.createAddressSection("delivery", "Delivery Address"));

    const defaultDeliveryAddressElement = RegistrationFormUtils.createCheckboxElement(
      "defaultDeliveryAddress",
      "Make this my default delivery address",
    );
    this.deliveryAddressCheckbox = defaultDeliveryAddressElement.checkbox;
    document
      .getElementsByClassName("address-item-delivery")[0]
      .append(defaultDeliveryAddressElement.container);

    const sameAddressElement = RegistrationFormUtils.createCheckboxElement(
      "sameAddress",
      "Use the same delivery and billing address",
    );
    this.sameAddressCheckbox = sameAddressElement.checkbox;
    document
      .getElementsByClassName("address-item-delivery")[0]
      .append(sameAddressElement.container);

    this.addressesSection.append(this.createAddressSection("billing", "Billing Address"));

    const defaultBillingAddressElement = RegistrationFormUtils.createCheckboxElement(
      "defaultBillingAddress",
      "Make this my default billing address",
    );
    this.billingAddressCheckbox = defaultBillingAddressElement.checkbox;
    document
      .getElementsByClassName("address-item-billing")[0]
      .append(defaultBillingAddressElement.container);
  }

  private createAddressSection(prefix: string, title: string): HTMLElement {
    const section = document.createElement("div");
    section.classList.add("address-item");
    section.classList.add(`address-item-${prefix}`);

    const header = document.createElement("h3");
    header.textContent = title;
    section.appendChild(header);

    [
      { type: "text", name: `${prefix}Street`, placeholder: "Street", required: true },
      { type: "text", name: `${prefix}City`, placeholder: "City", required: true },
      { type: "text", name: `${prefix}PostalCode`, placeholder: "Postal Code", required: true },
    ].forEach(({ type, name, placeholder, required }) => {
      const input = RegistrationFormUtils.createInputElement(type, name, placeholder, required);
      const errorElement = RegistrationFormUtils.createErrorMessageElement(`${name}-error`);

      section.appendChild(input);
      section.appendChild(errorElement);
    });

    const select = RegistrationFormUtils.createSelectElement(`${prefix}Country`, true);
    const errorElement = RegistrationFormUtils.createErrorMessageElement(`${prefix}Country-error`);
    section.appendChild(select);
    section.appendChild(errorElement);

    return section;
  }

  private copyDeliveryAddressToBilling(): void {
    const deliveryStreet = this.formElement.querySelector<HTMLInputElement>(
      'input[name="deliveryStreet"]',
    )!;
    const deliveryCity = this.formElement.querySelector<HTMLInputElement>(
      'input[name="deliveryCity"]',
    )!;
    const deliveryPostalCode = this.formElement.querySelector<HTMLInputElement>(
      'input[name="deliveryPostalCode"]',
    )!;
    const deliveryCountry = this.formElement.querySelector<HTMLSelectElement>(
      'select[name="deliveryCountry"]',
    )!;

    const billingStreet = this.formElement.querySelector<HTMLInputElement>(
      'input[name="billingStreet"]',
    )!;
    const billingCity = this.formElement.querySelector<HTMLInputElement>(
      'input[name="billingCity"]',
    )!;
    const billingPostalCode = this.formElement.querySelector<HTMLInputElement>(
      'input[name="billingPostalCode"]',
    )!;
    const billingCountry = this.formElement.querySelector<HTMLSelectElement>(
      'select[name="billingCountry"]',
    )!;

    billingStreet.value = deliveryStreet.value;
    billingCity.value = deliveryCity.value;
    billingPostalCode.value = deliveryPostalCode.value;
    billingCountry.value = deliveryCountry.value;
  }

  private validateField(fieldName: string, value: string): string | null {
    switch (fieldName) {
      case "email":
        return RegistrationFormUtils.validateEmail(value);
      case "password":
        return RegistrationFormUtils.validatePassword(value);
      case "firstName":
      case "lastName":
        return RegistrationFormUtils.validateName(value);
      case "dateOfBirth":
        return RegistrationFormUtils.validateDateOfBirth(value);
      case "deliveryStreet":
      case "billingStreet":
        return RegistrationFormUtils.validateStreet(value);
      case "deliveryCity":
      case "billingCity":
        return RegistrationFormUtils.validateCity(value);
      case "deliveryPostalCode":
      case "billingPostalCode":
        return RegistrationFormUtils.validatePostalCode(value);
      default:
        return null;
    }
  }
}
