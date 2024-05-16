export function createInputElement(
  type: string,
  name: string,
  placeholder: string,
  required: boolean,
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.required = required;
  return input;
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
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    if (!dateRegex.test(dateString)) {
      return "Date of birth must be in the format DD.MM.YYYY.";
    }
  
    const [, day, month, year] = dateString.match(dateRegex)!;
  
    if (!day || !month || !year) {
      return "Invalid date of birth.";
    }
  
    const birthDate = new Date(`${year}-${month}-${day}`);
  
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
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
  if (form)
  form.insertAdjacentElement("afterbegin", errorElement);
}

export function formatDateString(input: string): string {
  // Убираем все символы, кроме цифр
  const digitsOnly = input.replace(/\D/g, '');
  
  // Форматируем дату, добавляя точки после каждых двух цифр
  const formatted = digitsOnly
    .replace(/^(\d{2})/, '$1.') // добавляем точку после первых двух цифр
    .replace(/^(\d{2}\.)(\d{2})/, '$1$2.') // добавляем точку после следующих двух цифр

  return formatted;
}