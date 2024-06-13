import "./form.css";
import * as RegistrationFormUtils from "../../../interfaces/registration/registartionFormUtils.ts";
import {
  registerUser,
  getAccessToken,
} from "../../../interfaces/registration/registrationRequests.ts";
import {
  fetchAuthenticateCustomer,
  fetchGetAccessTokenThroughPassword,
} from "../../../interfaces/login-page-requests.ts";
import { AccessTokenResponse, Customer } from "../../../interfaces/login-page-types.ts";
import { setType } from "../../../interfaces/registration/registartionFormUtils.ts";

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

    const errorMessage = RegistrationForm.validateField(fieldName, value);
    this.updateErrorMessage(fieldName, errorMessage);

    const hasErrors = Object.values(this.errorElements).some(
      (errorElement) => errorElement.textContent !== "",
    );

    const allFieldsFilled = (): boolean => {
      const inputElements = Array.from(this.formElement.elements).filter(
        (element) =>
          (element instanceof HTMLInputElement &&
            element.type !== "checkbox" &&
            element.type !== "date") ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement,
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
      return;
    }
    const responseGetAccessToken = getAccessToken();
    responseGetAccessToken.then((result) => {
      const accessToken = result.access_token;
      if (accessToken) {
        registerUser(
          accessToken,
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
            const responseFetchGetAccessTokenThroughPassword = fetchGetAccessTokenThroughPassword(
              email,
              password,
            );
            responseFetchGetAccessTokenThroughPassword.then(
              (resultFetchGetAccessTokenThroughPassword) => {
                let authToken: string;
                if (
                  (resultFetchGetAccessTokenThroughPassword as AccessTokenResponse).token_type ===
                  "Bearer"
                ) {
                  authToken = (resultFetchGetAccessTokenThroughPassword as AccessTokenResponse)
                    .access_token;
                  if (authToken) {
                    fetchAuthenticateCustomer(authToken, email, password).then(
                      (resfetchAuthenticateCustomer) => {
                        if (localStorage.getItem("anonymous-token")) {
                          localStorage.removeItem("anonymous-token");
                        }
                        const { id } = (resfetchAuthenticateCustomer as Customer).customer;
                        localStorage.setItem("id", id);
                        localStorage.setItem(
                          "currentCartVersion",
                          resfetchAuthenticateCustomer?.cart?.version,
                        );
                        localStorage.setItem("token", JSON.stringify({ token: authToken }));
                        window.location.hash = "#home";
                      },
                    );
                  }
                }
              },
            );
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
      { type: "text", name: "email", label: "Email", required: true },
      { type: "password", name: "password", label: "Password", required: true },
      { type: "text", name: "firstName", label: "First Name", required: true },
      { type: "text", name: "lastName", label: "Last Name", required: true },
      { type: "text", name: "dateOfBirth", label: "Date of Birth", required: true },
    ].forEach(({ type, name, label, required }) => {
      const { input, labelElement } = RegistrationFormUtils.createInputElement(
        type,
        name,
        label,
        required,
      );
      if (name === "dateOfBirth") {
        input.addEventListener("focus", setType);
      }
      const errorElement = RegistrationFormUtils.createErrorMessageElement(`${name}-error`);
      const inputContainer = document.createElement("div");
      inputContainer.classList.add("input-container");

      inputContainer.appendChild(labelElement);
      inputContainer.appendChild(input);
      inputContainer.appendChild(errorElement);
      this.formElement.appendChild(inputContainer);

      input.addEventListener("focusin", () => {
        labelElement.classList.add("label_moved");
      });
      input.addEventListener("focusout", () => {
        if (input.value === "") {
          labelElement.classList.remove("label_moved");
        }
      });
    });

    this.addressesSection.appendChild(
      RegistrationForm.createAddressSection("delivery", "Delivery Address"),
    );

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

    this.addressesSection.append(
      RegistrationForm.createAddressSection("billing", "Billing Address"),
    );

    const defaultBillingAddressElement = RegistrationFormUtils.createCheckboxElement(
      "defaultBillingAddress",
      "Make this my default billing address",
    );
    this.billingAddressCheckbox = defaultBillingAddressElement.checkbox;
    document
      .getElementsByClassName("address-item-billing")[0]
      .append(defaultBillingAddressElement.container);

    this.sameAddressCheckbox.addEventListener(
      "change",
      this.copyDeliveryAddressToBilling.bind(this),
    );
  }

  private static createAddressSection(prefix: string, title: string): HTMLElement {
    const sectionElement = document.createElement("section");
    sectionElement.classList.add(`address-item-${prefix}`);
    sectionElement.classList.add(`address-item`);

    const headerElement = document.createElement("h3");
    headerElement.textContent = title;
    sectionElement.appendChild(headerElement);

    [
      { type: "text", name: `${prefix}Street`, label: "Street", required: true },
      { type: "text", name: `${prefix}City`, label: "City", required: true },
      { type: "text", name: `${prefix}PostalCode`, label: "Postal Code", required: true },
    ].forEach(({ type, name, label, required }) => {
      const inputContainer = document.createElement("div");
      inputContainer.classList.add("input-container");

      const { input, labelElement } = RegistrationFormUtils.createInputElement(
        type,
        name,
        label,
        required,
      );
      const errorElement = RegistrationFormUtils.createErrorMessageElement(`${name}-error`);

      inputContainer.appendChild(labelElement);
      inputContainer.appendChild(input);
      inputContainer.appendChild(errorElement);
      sectionElement.appendChild(inputContainer);

      input.addEventListener("focusin", () => {
        labelElement.classList.add("label_moved");
      });
      input.addEventListener("focusout", () => {
        if (input.value === "") {
          labelElement.classList.remove("label_moved");
        }
      });
    });
    const select = RegistrationFormUtils.createSelectElement(`${prefix}Country`, true);
    sectionElement.appendChild(select);
    return sectionElement;
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

    const billingLabels = this.formElement.querySelectorAll<HTMLLabelElement>(
      ".address-item-billing .input-container label",
    )!;
    billingLabels.forEach((label) => {
      label.classList.add("label_moved");
    });
  }

  private static validateField(fieldName: string, value: string): string | null {
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
