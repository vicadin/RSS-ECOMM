import "./form.css";

export class Form {
  form: HTMLFormElement;

  emailWrapper: HTMLDivElement;

  emailInput: HTMLInputElement;

  emailInnerWrapper: HTMLDivElement;

  emailLabel: HTMLLabelElement;

  emailError: HTMLSpanElement;

  constructor() {
    this.form = document.createElement("form");
    this.form.setAttribute("novalidate", "novalidate");
    this.form.className = "form";
    this.emailWrapper = document.createElement("div");
    this.emailWrapper.className = "email-wrapper";
    this.emailInnerWrapper = document.createElement("div");
    this.emailInput = document.createElement("input");
    this.emailInput.className = "email-input";
    this.emailInput.setAttribute("type", "email");
    this.emailInput.setAttribute("required", "required");
    this.emailInput.setAttribute("autocomplete", "off");
    this.emailInput.setAttribute("pattern", "[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$");
    this.emailLabel = document.createElement("label");
    this.emailLabel.className = "email-label";
    this.emailLabel.textContent = "Email address";
    this.emailInnerWrapper.append(this.emailInput, this.emailLabel);
    this.emailInnerWrapper.className = "email-inner-wrapper";
    this.emailError = document.createElement("span");
    this.emailError.className = "email-error";
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
        this.emailError.textContent =
          "Please enter an email address in the correct format, such as name@example.com";
      } else {
        this.emailError.textContent = "";
      }
    });
  }
}

export const form = new Form();
