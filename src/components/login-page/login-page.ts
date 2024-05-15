import "./login-page.css";
import { form } from "./form/form.ts";
import { createButton, createElement } from "../../interfaces/login-page-utils.ts";
import { createAccountButtonAttributes } from "../../interfaces/login-page-types.ts";

export default class LoginPage {
  loginPage: HTMLDivElement;

  constructor() {
    this.loginPage = document.createElement("div");
    this.loginPage.className = "login-page";
    const loginMainContainer = document.createElement("div");
    loginMainContainer.className = "login-main-container";
    const loginWrapper = document.createElement("div");

    const loginHeading = document.createElement("h1");
    loginHeading.className = "login-heading";
    loginHeading.textContent = "Log in to your account";

    const registrationHeading = createElement("h2", "login-registration-heading");
    registrationHeading.textContent = "New to our shop?";

    const paragraph = createElement("p", "login-registration-petition");
    paragraph.textContent =
      "With an account, you can save products to your cabinet, view your order history and swiftly checkout using saved details.";

    const createAccountButton = createButton(
      "create-account-button button-common ",
      createAccountButtonAttributes,
      "Create account",
    );

    loginWrapper.append(loginHeading);
    loginMainContainer.append(
      loginWrapper,
      form.getHtmlElem(),
      registrationHeading,
      paragraph,
      createAccountButton,
    );
    this.loginPage.append(loginMainContainer);
  }

  getHtmlElem() {
    return this.loginPage;
  }
}
