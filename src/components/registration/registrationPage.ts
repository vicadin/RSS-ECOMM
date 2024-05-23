import "./registrationPage.css";
import RegistrationForm from "./form/form.ts";

export default class RegistrationPage {
  private title: HTMLElement;

  private formContainer: HTMLElement;

  private registrationForm: RegistrationForm;

  constructor() {
    this.title = document.createElement("h1");
    this.title.innerText = "Registration Form";
    this.title.classList.add("title");

    this.formContainer = document.createElement("div");
    this.formContainer.classList.add("form-container");

    this.registrationForm = new RegistrationForm();
  }

  public render(container: HTMLElement): void {
    container.appendChild(this.title);
    container.appendChild(this.formContainer);
    this.registrationForm.render(this.formContainer);
  }
}
