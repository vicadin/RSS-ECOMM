import "./registrationForm.css"

export class RegistrationForm {
  private formElement: HTMLFormElement
  private errorElements: { [key: string]: HTMLElement } = {}
  private submitButton: HTMLButtonElement
  private title: HTMLElement
  private registrationSection: HTMLElement

  constructor() {
    this.registrationSection = document.createElement("section")
    this.registrationSection.classList.add("registration-section")
    this.formElement = document.createElement("form")
    this.formElement.classList.add("form")
    this.submitButton = document.createElement("button")
    this.submitButton.type = "submit"
    this.submitButton.textContent = "Register"
    this.submitButton.disabled = true
    this.submitButton.classList.add("btn-black")

    this.formElement.appendChild(this.submitButton)

    this.formElement.addEventListener("input", this.handleInput.bind(this))
    this.formElement.addEventListener("submit", this.handleSubmit.bind(this))

    this.title = document.createElement("h1")
    this.title.innerText = "Create your account"
    this.title.classList.add("title")

    this.registrationSection.appendChild(this.title)
    this.registrationSection.appendChild(this.formElement)
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement
    if (!target || !target.name) return

    const value = target.value.trim()
    const fieldName = target.name
    const errorMessage = this.validateField(fieldName, value)
    this.updateErrorMessage(fieldName, errorMessage)

    const hasErrors = Object.values(this.errorElements).some(
      (errorElement) => errorElement.textContent !== "",
    )

    const allFieldsFilled = (): boolean => {
      const inputElements = Array.from(this.formElement.elements).filter(
        (element) => element instanceof HTMLInputElement,
      ) as HTMLInputElement[]
      return inputElements.every((input) => input.value.trim() !== "")
    }
    if (hasErrors && allFieldsFilled()) {
      this.submitButton.disabled = false
    } else {
      this.submitButton.disabled = true
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault()
  }

  private updateErrorMessage(fieldName: string, errorMessage: string | null): void {
    const errorElement = document.getElementById(`${fieldName}-error`)
    if (!errorElement) return

    if (errorMessage) {
      errorElement.textContent = errorMessage
      this.errorElements[fieldName] = errorElement
    } else {
      errorElement.textContent = ""
      delete this.errorElements[fieldName]
    }
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.registrationSection)

    ;[
      "email",
      "password",
      "firstName",
      "lastName",
      "dateOfBirth",
      "street",
      "city",
      "postalCode",
      "country",
    ].forEach((fieldName) => {
      const input = document.createElement("input")
      if (fieldName === "password") {
        input.type = "password"
      } else if (fieldName === "dateOfBirth") {
        input.addEventListener("focus", function () {
          this.type = "date"
        })
      } else {
        input.type = "text"
      }
      input.name = fieldName
      input.placeholder =
        fieldName.charAt(0).toUpperCase() +
        fieldName
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim()
      input.required = true

      const errorElement = document.createElement("span")
      errorElement.classList.add("error-message")
      errorElement.id = `${fieldName}-error`

      this.formElement.insertBefore(input, this.submitButton)
      this.formElement.insertBefore(errorElement, this.submitButton)
    })

    this.formElement.appendChild(this.submitButton)
  }

  private validateField(fieldName: string, value: string): string | null {
    switch (fieldName) {
      case "email":
        return this.validateEmail(value)
      case "password":
        return this.validatePassword(value)
      case "firstName":
      case "lastName":
      case "city":
        return this.validateName(value)
      case "dateOfBirth":
        return this.validateDateOfBirth(value)
      case "street":
        return this.validateStreet(value)
      case "street":
        return this.validateCity(value)
      case "postalCode":
        return this.validatePostalCode(value)
      case "country":
        // return this.validateCountry(value);
        return null
      default:
        return null
    }
  }

  private validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address."
    }
    return null
  }

  private validatePassword(password: string): string | null {
    const passwordRegex = /^(?=.*\d)(?=.*[a-zа-я])(?=.*[A-ZА-Я]).{8,}$/
    if (!passwordRegex.test(password)) {
      return "The password must contain a minimum of 8 characters, a minimum of 1 uppercase letter, 1 lowercase letter and 1 number."
    }
    return null
  }

  private validateName(name: string): string | null {
    const nameRegex = /^[a-zA-Z]+$/
    if (!nameRegex.test(name)) {
      return "Please enter a valid name (only letters allowed)."
    }
    return null
  }

  private validateDateOfBirth(dateString: string): string | null {
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    if (age < 13) {
      return "You must be at least 13 years old to register."
    }
    return null
  }

  private validateStreet(address: string): string | null {
    if (address.trim().length === 0) {
      return "Please enter a valid street name."
    }
    return null
  }

  private validateCity(city: string): string | null {
    const cityRegex = /^[a-zA-Z\s]*$/
    if (!cityRegex.test(city) || city.trim().length === 0) {
      return "Please enter a valid city name (only letters allowed)."
    }
    return null
  }

  private validatePostalCode(postalCode: string): string | null {
    const postalCodeRegex = /^\d+$/
    if (!postalCodeRegex.test(postalCode)) {
      return "Please enter a valid postal code (only numbers allowed)."
    }
    return null
  }
}
