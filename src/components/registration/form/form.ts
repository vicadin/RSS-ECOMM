import "./form.css";
import * as RegistrationFormUtils from "../../../interfaces/registration/registartionFormUtils";
import {
  registerUser,
  getAccessToken,
} from "../../../interfaces/registration/registrationRequests";

export default class RegistrationForm {
  private formElement: HTMLFormElement;
  private errorElements: { [key: string]: HTMLElement } = {};
  private submitButton: HTMLButtonElement;
  private registrationSection: HTMLElement;
  private logInText: HTMLAnchorElement;
  private successMessage: HTMLElement;
  private overlay: HTMLElement;

  constructor() {
    this.registrationSection = document.createElement("section");
    this.registrationSection.classList.add("registration-section");
    this.formElement = document.createElement("form");
    this.formElement.classList.add("form");
    this.submitButton = document.createElement("button");
    this.submitButton.type = "submit";
    this.submitButton.textContent = "Register";
    this.submitButton.disabled = true;
    this.submitButton.classList.add("btn-black");

    this.formElement.appendChild(this.submitButton);
    this.logInText = document.createElement("a");
    this.logInText.href = "#"; //add login page
    this.logInText.innerHTML = "Do you already have an account?";
    this.logInText.classList.add("form-link");
    this.formElement.appendChild(this.logInText);

    this.formElement.addEventListener("input", this.handleInput.bind(this));
    this.formElement.addEventListener("submit", this.handleSubmit.bind(this));

    this.registrationSection.appendChild(this.formElement);

    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    this.successMessage = document.createElement("div");
    this.successMessage.innerHTML = "registration was successful!";
    this.successMessage.classList.add("alert");
    this.registrationSection.appendChild(this.overlay);
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target || !target.name) return;

    const value = target.value.trim();
    const fieldName = target.name;
    const errorMessage = this.validateField(fieldName, value);
    this.updateErrorMessage(fieldName, errorMessage);

    const hasErrors = Object.values(this.errorElements).some(
      (errorElement) => errorElement.textContent !== "",
    );

    const allFieldsFilled = (): boolean => {
      const inputElements = Array.from(this.formElement.elements).filter(
        (element) => element instanceof HTMLInputElement,
      ) as HTMLInputElement[];
      return inputElements.every((input) => input.value.trim() !== "");
    };
    if (hasErrors && allFieldsFilled()) {
      this.submitButton.disabled = false;
    } else {
      this.submitButton.disabled = true;
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
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;
    const country = formData.get("country") as string;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !street ||
      !city ||
      !postalCode ||
      !country
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
          street,
          city,
          postalCode,
          country,
        ).then((res) => {
          if (res) {
            console.log(res);
            this.overlay.classList.add("show");
            this.registrationSection.appendChild(this.successMessage);
            setTimeout(() => {
              window.location.href = "/main";
            }, 500);
            // redirect to the main page
          }
        });

        console.log(result);
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
      { type: "text", name: "street", placeholder: "Street", required: true },
      { type: "text", name: "city", placeholder: "City", required: true },
      { type: "text", name: "postalCode", placeholder: "Postal Code", required: true },
      { type: "text", name: "country", placeholder: "Country", required: true },
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
      case "street":
        return RegistrationFormUtils.validateStreet(value);
      case "city":
        return RegistrationFormUtils.validateCity(value);
      case "postalCode":
        return RegistrationFormUtils.validatePostalCode(value);
      case "country":
        return null;
      default:
        return null;
    }
  }
}
