export function createElement(tag: string, classNames: string, text?: string): HTMLElement {
  const newElem = document.createElement(tag);
  newElem.className = classNames;
  if (text) {
    newElem.textContent = text;
  }
  return newElem;
}

export function setAttributes(attributes: [string, string][], htmlElement: HTMLElement) {
  const that = htmlElement;
  attributes.forEach((attr) => {
    const [key, value] = attr;
    that.setAttribute(key, value);
  });
}

export function createInput(classNames: string, attributes: [string, string][]): HTMLInputElement {
  const newInput = document.createElement("input");
  newInput.className = classNames;
  setAttributes(attributes, newInput);
  return newInput;
}

export function createForm(classNames: string, attributes: [string, string][]): HTMLFormElement {
  const newForm = document.createElement("form");
  newForm.className = classNames;
  setAttributes(attributes, newForm);
  return newForm;
}

export function createButton(
  classNames: string,
  attributes: [string, string][],
  text: string,
): HTMLButtonElement {
  const newButton = document.createElement("button");
  newButton.className = classNames;
  newButton.textContent = text;
  setAttributes(attributes, newButton);
  return newButton;
}

export function showHidePassword(): boolean {
  const buttonText: string = this.showButton.textContent;
  this.showButton.textContent = buttonText === "Show" ? "Hide" : "Show";
  if (this.showButton.textContent === "Hide") {
    this.passwordInput.type = "text";
  } else {
    this.passwordInput.type = "password";
  }
  return true;
}

export function validatePassword(): void {
  const password: string = this.passwordInput.value;

  if (!this.passwordInput.validity.valid || password.trim().length !== password.length) {
    if (password.length === 0) {
      this.passwordError.textContent = "This field is required";
    } else if (password.trim().length !== password.length) {
      this.passwordError.textContent = "Password must not contain leading or trailing whitespace.";
    } else if (password.length > 3) {
      let messageText = password.length < 8 ? "Password must be at least 8 characters long." : "";
      switch (-1) {
        case password.search(/[0-9]/):
          messageText += "Password must contain at least one digit (0-9).";
          this.passwordError.textContent = messageText;
          break;
        case password.search(/[A-Z]/):
          messageText += "Password must contain at least one uppercase letter (A-Z).";
          this.passwordError.textContent = messageText;
          break;
        case password.search(/[a-z]/):
          messageText += "Password must contain at least one lowercase letter (a-z).";
          this.passwordError.textContent = messageText;
          break;
        default:
          this.passwordError.textContent = "Password must be at least 8 characters long.";
          break;
      }
    } else {
      this.passwordError.textContent =
        "The password must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter";
    }
  } else {
    this.passwordError.textContent = "";
  }
}

export function validateEmail(): void {
  if (!this.emailInput.validity.valid) {
    this.emailError.textContent = this.emailInput.value.length
      ? "Please enter an email address in the correct format, such as name@example.com"
      : "This field is required";
  } else {
    this.emailError.textContent = "";
  }
}
