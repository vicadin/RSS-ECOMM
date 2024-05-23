import countries from "./countriesList.ts";

export function createInputElement(
  type: string,
  name: string,
  label: string,
  required: boolean,
): { input: HTMLInputElement; labelElement: HTMLLabelElement } {
  const inputElement = document.createElement("input");
  inputElement.type = type;
  inputElement.name = name;
  inputElement.id = name;
  inputElement.required = required;

  const labelElement = document.createElement("label");
  labelElement.htmlFor = name;
  labelElement.textContent = label;

  return { input: inputElement, labelElement };
}

export function createErrorMessageElement(id: string): HTMLElement {
  const errorElement = document.createElement("span");
  errorElement.classList.add("error-message");
  errorElement.id = id;
  return errorElement;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  const passwordRegex = /^(?=.*\d)(?=.*[a-zа-я])(?=.*[A-ZА-Я]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return "The password must contain a minimum of 8 characters, a minimum of 1 uppercase letter, 1 lowercase letter and 1 number.";
  }
  return null;
}

export function validateName(name: string): string | null {
  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(name)) {
    return "Please enter a valid name (only letters allowed).";
  }
  return null;
}

export function validateDateOfBirth(dateString: string): string | null {
  const today = new Date();
  const birthDate = new Date(dateString);

  if (Number.isNaN(birthDate.getTime())) {
    return "Invalid date format. Please enter a valid date.";
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  if (age < 13) {
    return "You must be at least 13 years old to register.";
  }
  return null;
}

export function validateStreet(address: string): string | null {
  if (address.trim().length === 0) {
    return "Please enter a valid street name.";
  }
  return null;
}

export function validateCity(city: string): string | null {
  const cityRegex = /^[a-zA-Z\s]*$/;
  if (!cityRegex.test(city) || city.trim().length === 0) {
    return "Please enter a valid city name (only letters allowed).";
  }
  return null;
}

export function validatePostalCode(postalCode: string): string | null {
  const postalCodeRegex = /^\d+$/;
  if (!postalCodeRegex.test(postalCode)) {
    return "Please enter a valid postal code (only numbers allowed).";
  }
  return null;
}

export function displayError(errorMessage: string): void {
  const errorElement = document.createElement("div");
  errorElement.textContent = errorMessage;
  errorElement.classList.add("error-message");

  const form = document.querySelector("form");
  if (form) form.insertAdjacentElement("afterbegin", errorElement);
}

export function formatDateString(input: string): string {
  const digitsOnly = input.replace(/\D/g, "");

  const formatted = digitsOnly.replace(/^(\d{2})/, "$1.").replace(/^(\d{2}\.)(\d{2})/, "$1$2.");

  return formatted;
}

export function createCheckboxElement(name: string, label: string) {
  const container = document.createElement("div");
  container.classList.add("form-checkbox");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = name;
  checkbox.id = name;

  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  labelElement.setAttribute("for", name);

  container.appendChild(checkbox);
  container.appendChild(labelElement);

  return { checkbox, container };
}

export function createSelectElement(name: string, required: boolean): HTMLSelectElement {
  const select = document.createElement("select");
  select.name = name;
  select.required = required;

  Object.entries(countries).forEach(([code, country]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = country;
    select.appendChild(option);
  });

  return select;
}
